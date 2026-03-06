/**
 * 域名监控与告警系统
 * 轻量级、无数据库、基于内存和文件系统
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');

// ========== 配置 ==========
const CONFIG = {
  // Telegram Bot 配置
  telegram: {
    botToken: '8005042122:AAExvHlkQ3R4tH4IEt1BvKgiUJqXA9wfjg0',
    chatId: '-4943598430'
  },
  
  // 异常阈值
  thresholds: {
    responseTime: 1000, // 响应时间超过1000ms判定为异常
    crossRegionFailures: 3 // 跨区域累计3次异常进入冷却
  },
  
  // 冷却配置
  cooldown: {
    duration: 3600000, // 冷却期1小时
    checkInterval: 300000, // 每5分钟检查一次
    repairAttempts: 5 // 最多尝试修复5次
  },
  
  // 缓存配置
  cache: {
    duration: 45000 // 45秒缓存
  },
  
  // 数据文件路径
  dataPath: '/var/www/boyuvhat.top/boyuvhat.top/api/data'
};

// ========== 内存存储 ==========
const memoryStore = {
  // 域名异常记录 { domain: [{ region, timestamp, reason }] }
  domainFailures: new Map(),
  
  // 冷却域名 { domain: { timestamp, attempts, lastCheck } }
  cooledDomains: new Map(),
  
  // 请求缓存 { key: { data, timestamp } }
  requestCache: new Map()
};

// ========== Telegram 告警 ==========
async function sendTelegramAlert(message) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: CONFIG.telegram.chatId,
      text: message,
      parse_mode: 'HTML'
    });
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${CONFIG.telegram.botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`Telegram API error: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 单次异常告警
async function alertSingleFailure(region, domain, reason) {
  const message = `⚠️ <b>单次异常（真实用户）</b>
区域：${region}
域名：${domain}
原因：${reason}
时间：${new Date().toLocaleString('zh-CN')}`;
  
  try {
    await sendTelegramAlert(message);
    console.log(`✅ 单次异常告警已发送: ${domain}`);
  } catch (error) {
    console.error('❌ Telegram告警失败:', error);
  }
}

// 冷却告警
async function alertCooldown(domain, failureCount) {
  const message = `🧊 <b>域名进入冷却状态</b>
域名：${domain}
异常次数：${failureCount}次（跨区域）
状态：不再推荐，自动修复中
时间：${new Date().toLocaleString('zh-CN')}`;
  
  try {
    await sendTelegramAlert(message);
    console.log(`✅ 冷却告警已发送: ${domain}`);
  } catch (error) {
    console.error('❌ Telegram告警失败:', error);
  }
}

// 修复成功告警
async function alertRepairSuccess(domain) {
  const message = `✅ <b>域名自动修复成功</b>
域名：${domain}
状态：已恢复推荐资格
时间：${new Date().toLocaleString('zh-CN')}`;
  
  try {
    await sendTelegramAlert(message);
    console.log(`✅ 修复成功告警已发送: ${domain}`);
  } catch (error) {
    console.error('❌ Telegram告警失败:', error);
  }
}

// 修复失败告警（需人工介入）
async function alertManualIntervention(domain, attempts) {
  const message = `🆘 <b>域名无法自动修复</b>
域名：${domain}
尝试次数：${attempts}次
状态：持续冷却
说明：需要人工介入
时间：${new Date().toLocaleString('zh-CN')}`;
  
  try {
    await sendTelegramAlert(message);
    console.log(`✅ 人工介入告警已发送: ${domain}`);
  } catch (error) {
    console.error('❌ Telegram告警失败:', error);
  }
}

// ========== 域名检测 ==========
async function checkDomain(domain) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const options = {
      hostname: domain,
      path: '/health',
      method: 'HEAD',
      timeout: 5000
    };
    
    const req = https.request(options, (res) => {
      const responseTime = Date.now() - startTime;
      resolve({
        success: res.statusCode === 200,
        responseTime,
        statusCode: res.statusCode
      });
    });
    
    req.on('error', () => {
      resolve({
        success: false,
        responseTime: 9999,
        error: 'Connection failed'
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        responseTime: 9999,
        error: 'Timeout'
      });
    });
    
    req.end();
  });
}

// ========== 异常处理 ==========
async function handleDomainReport(report) {
  const { domain, responseTime, status, region, error } = report;
  
  // 判断是否异常
  const isAbnormal = status === 'error' || responseTime > CONFIG.thresholds.responseTime;
  
  if (!isAbnormal) {
    return { handled: false, reason: 'normal' };
  }
  
  // 确定异常原因
  let reason = '';
  if (status === 'error') {
    reason = error || '连接失败';
  } else if (responseTime > CONFIG.thresholds.responseTime) {
    reason = `响应时间过长 (${responseTime}ms)`;
  }
  
  // 1. 单次异常立即告警（不冷却、不降权）
  await alertSingleFailure(region, domain, reason);
  
  // 2. 记录异常
  if (!memoryStore.domainFailures.has(domain)) {
    memoryStore.domainFailures.set(domain, []);
  }
  
  const failures = memoryStore.domainFailures.get(domain);
  failures.push({
    region,
    timestamp: Date.now(),
    reason
  });
  
  // 3. 检查是否跨区域累计达到3次
  const uniqueRegions = new Set(failures.map(f => f.region));
  
  if (uniqueRegions.size >= CONFIG.thresholds.crossRegionFailures) {
    // 进入冷却状态
    if (!memoryStore.cooledDomains.has(domain)) {
      memoryStore.cooledDomains.set(domain, {
        timestamp: Date.now(),
        attempts: 0,
        lastCheck: Date.now()
      });
      
      await alertCooldown(domain, failures.length);
      
      // 开始自动修复流程
      startAutoRepair(domain);
    }
  }
  
  // 持久化到文件
  await saveDataToFile();
  
  return { handled: true, reason, cooled: memoryStore.cooledDomains.has(domain) };
}

// ========== 自动修复 ==========
async function startAutoRepair(domain) {
  console.log(`🔧 开始自动修复: ${domain}`);
  
  const repairInterval = setInterval(async () => {
    const cooldownInfo = memoryStore.cooledDomains.get(domain);
    
    if (!cooldownInfo) {
      clearInterval(repairInterval);
      return;
    }
    
    // 检查域名状态
    const checkResult = await checkDomain(domain);
    cooldownInfo.attempts++;
    cooldownInfo.lastCheck = Date.now();
    
    if (checkResult.success && checkResult.responseTime < CONFIG.thresholds.responseTime) {
      // 修复成功
      memoryStore.cooledDomains.delete(domain);
      memoryStore.domainFailures.delete(domain);
      clearInterval(repairInterval);
      
      await alertRepairSuccess(domain);
      await saveDataToFile();
      
      console.log(`✅ 自动修复成功: ${domain}`);
    } else if (cooldownInfo.attempts >= CONFIG.cooldown.repairAttempts) {
      // 修复失败，需要人工介入
      clearInterval(repairInterval);
      
      await alertManualIntervention(domain, cooldownInfo.attempts);
      
      console.log(`❌ 自动修复失败，需人工介入: ${domain}`);
    } else {
      console.log(`🔄 修复尝试 ${cooldownInfo.attempts}/${CONFIG.cooldown.repairAttempts}: ${domain}`);
    }
    
    await saveDataToFile();
  }, CONFIG.cooldown.checkInterval);
}

// ========== 数据持久化 ==========
async function saveDataToFile() {
  try {
    await fs.mkdir(CONFIG.dataPath, { recursive: true });
    
    const data = {
      failures: Array.from(memoryStore.domainFailures.entries()),
      cooled: Array.from(memoryStore.cooledDomains.entries()),
      timestamp: Date.now()
    };
    
    await fs.writeFile(
      path.join(CONFIG.dataPath, 'monitor-data.json'),
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    console.error('❌ 数据保存失败:', error);
  }
}

async function loadDataFromFile() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'monitor-data.json');
    const fileData = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileData);
    
    memoryStore.domainFailures = new Map(data.failures || []);
    memoryStore.cooledDomains = new Map(data.cooled || []);
    
    // 恢复修复流程
    for (const [domain] of memoryStore.cooledDomains) {
      startAutoRepair(domain);
    }
    
    console.log('✅ 数据加载成功');
  } catch (error) {
    console.log('ℹ️ 无历史数据或加载失败，使用空数据');
  }
}

// ========== HTTP 处理 ==========
async function handleRequest(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      const report = JSON.parse(body);
      const result = await handleDomainReport(report);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
}

// ========== 启动服务 ==========
async function startServer() {
  await loadDataFromFile();
  
  const server = require('http').createServer(handleRequest);
  const port = 3999;
  
  server.listen(port, () => {
    console.log(`✅ 域名监控服务启动成功`);
    console.log(`📍 监听端口: ${port}`);
    console.log(`📊 数据路径: ${CONFIG.dataPath}`);
  });
}

// 导出（如果作为模块使用）
if (require.main === module) {
  startServer();
}

module.exports = {
  handleDomainReport,
  sendTelegramAlert,
  checkDomain
};
