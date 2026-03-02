import { useState, useEffect } from "react";
import {
  UserPlus,
  LogIn,
  Download,
  Phone,
  Headphones,
  Briefcase,
  ChevronRight,
  Globe,
  Smartphone,
  CheckCircle,
  Loader2,
  Gift,
  Zap,
  Trophy,
  Star,
  Shield,
  Clock,
  Volume2,
  X,
  Flame,
  Crown,
  Sparkles,
  Megaphone,
  ArrowUp,
  MessageCircle,
} from "lucide-react";

/* ───────── 接口配置（自动匹配） ───────── */
const CONFIG = {
  domains: [
    "go.81v5.com",
    "vip.81v5.com",
    "ok.81v5.com",
    "top.81v5.com",
    "web.81v5.com",
    "win.81v5.com",
    "pay.81v5.com",
    "app.81v5.com",
    "aa.81v5.com",
  ],
  customerServiceUrl: "https://www.8y998.com",
  androidDownloadUrl: "https://app.b1yx.com/app/xLYK/JfailWgq3.apk",
  iosDownloadUrl:
    "https://shrds.xmcgcu6c55c8.top/s/upwr?key=646256376F6V4654313S7372323243343439137O34",
  testTimeout: 3000,
};

/* ───────── 设备检测 ───────── */
function isMobileDevice(): boolean {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768
  );
}

/* ───────── 域名测试工具 ───────── */
function testDomain(
  domain: string
): Promise<{ domain: string; success: boolean; responseTime: number }> {
  const startTime = Date.now();
  return new Promise((resolve) => {
    const img = new Image();
    const timeoutId = setTimeout(() => {
      img.src = "";
      resolve({ domain, success: false, responseTime: CONFIG.testTimeout });
    }, CONFIG.testTimeout);

    const finish = (success: boolean) => {
      clearTimeout(timeoutId);
      resolve({ domain, success, responseTime: Date.now() - startTime });
    };

    img.onload = () => finish(true);
    img.onerror = () => finish(true); // 404 also means server responded
    img.src = `https://${domain}/favicon.ico?t=${Date.now()}`;
  });
}

/* ───────── 广播滚动数据 ───────── */
const broadcastMessages = [
  "🎉 恭喜会员 A**8 成功提款 ¥128,000！",
  "🔥 新会员首存即送68%，最高 ¥8888！",
  "🏆 会员 L**3 真人百家乐赢得 ¥56,800！",
  "📢 博鱼游戏全新改版上线，体验更流畅！",
  "💰 恭喜会员 W**6 成功提款 ¥320,000！",
  "🎁 每日签到领取彩金，最高 ¥888！",
  "⚽ 欧冠决赛竞猜活动火热进行中！",
  "🎰 会员 K**2 老虎机中奖 ¥88,888！",
  "🌟 VIP专属福利全面升级！",
  "💎 会员 R**9 晋升至尊VIP！",
];

/* ───────── 活动推广数据 ───────── */
const promotions = [
  {
    id: 1,
    tag: "热门",
    tagColor: "from-red-500 to-orange-500",
    title: "新会员首存礼金",
    subtitle: "首存即送68%，最高领取¥8,888",
    desc: "新注册会员首次存款即可获得超值礼金，流水仅需1倍即可提款。",
    icon: Gift,
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    id: 2,
    tag: "限时",
    tagColor: "from-purple-500 to-blue-500",
    title: "每日签到彩金",
    subtitle: "连续签到7天最高领¥888",
    desc: "每日登录即可签到领取彩金，连续签到奖励递增。",
    icon: Clock,
    gradient: "from-blue-500 via-purple-500 to-indigo-500",
  },
  {
    id: 3,
    tag: "爆款",
    tagColor: "from-yellow-500 to-amber-500",
    title: "体育周末加码",
    subtitle: "体育投注额外返水2.5%",
    desc: "每周五至周日体育赛事投注享受额外返水加码。",
    icon: Trophy,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    id: 4,
    tag: "VIP",
    tagColor: "from-amber-400 to-yellow-300",
    title: "VIP专属礼遇",
    subtitle: "专属客服+生日礼金+极速提款",
    desc: "VIP会员尊享1对1专属客服、生日礼金及优先极速提款。",
    icon: Crown,
    gradient: "from-amber-500 via-yellow-500 to-orange-400",
  },
  {
    id: 5,
    tag: "全新",
    tagColor: "from-green-500 to-emerald-500",
    title: "好友推荐奖励",
    subtitle: "每推荐1人奖励¥188",
    desc: "推荐好友注册并存款，即可获得推荐奖金。",
    icon: Sparkles,
    gradient: "from-pink-500 via-rose-500 to-red-500",
  },
  {
    id: 6,
    tag: "独家",
    tagColor: "from-cyan-500 to-blue-400",
    title: "亏损救援金",
    subtitle: "周亏损超5000返还8%",
    desc: "每周结算亏损，超额度即可申请亏损救援金。",
    icon: Shield,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
  },
];

/* ───────── 广播滚动组件 ───────── */
function BroadcastBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % broadcastMessages.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border-b border-yellow-500/20">
      <div className="flex items-center px-3 py-2 gap-2">
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="relative">
            <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
          </div>
          <span className="text-yellow-400 text-[10px] font-bold">播报</span>
        </div>
        <div className="h-3 w-px bg-yellow-500/30" />
        <div className="overflow-hidden flex-1 h-4">
          <p
            className={`text-xs text-gray-300 whitespace-nowrap truncate transition-all duration-400 ${
              isAnimating
                ? "opacity-0 -translate-y-3"
                : "opacity-100 translate-y-0"
            }`}
          >
            {broadcastMessages[currentIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────── 线路检测弹窗（接口自动匹配） ───────── */
function LineDetectionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [detecting, setDetecting] = useState(true);
  const [lines, setLines] = useState<
    { id: number; name: string; speed: number; status: string; domain: string }[]
  >([]);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    setDetecting(true);
    setLines([]);

    // 自动测试所有域名，选出前3个可用线路
    Promise.all(CONFIG.domains.map((d) => testDomain(d))).then((results) => {
      const sorted = results
        .filter((r) => r.success)
        .sort((a, b) => a.responseTime - b.responseTime)
        .slice(0, 3);

      const lineNames = ["亚太线路 ①", "国际线路 ②", "备用线路 ③"];
      const lineStatuses = ["畅通", "良好", "可用"];

      setLines(
        sorted.map((r, i) => ({
          id: i + 1,
          name: lineNames[i] ?? `线路 ${i + 1}`,
          speed: r.responseTime,
          status: lineStatuses[i] ?? "可用",
          domain: r.domain,
        }))
      );
      setDetecting(false);
    });
  }, [open, retryKey]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1c1f2e] rounded-2xl w-full max-w-[420px] shadow-2xl border border-gray-700/50 overflow-hidden">
        {/* header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-white" />
            <span className="text-white font-bold text-sm">智能线路检测</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          {detecting ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-gray-300 text-xs">正在检测最优线路...</p>
              <div className="w-40 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <p className="text-red-400 text-xs text-center">
                暂时未检测到可用线路，请稍后重试
              </p>
              <button
                onClick={() => setRetryKey((k) => k + 1)}
                className="text-cyan-400 text-xs underline"
              >
                重新检测
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-gray-400 text-xs mb-3">
                检测完成，为您推荐以下线路：
              </p>
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="bg-[#252836] rounded-xl p-3 flex items-center justify-between border border-gray-700/40 hover:border-cyan-500/40 transition"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        line.speed < 50
                          ? "bg-green-400 shadow-sm shadow-green-400/50"
                          : line.speed < 100
                          ? "bg-yellow-400 shadow-sm shadow-yellow-400/50"
                          : "bg-orange-400 shadow-sm shadow-orange-400/50"
                      }`}
                    />
                    <div>
                      <p className="text-white font-medium text-xs">
                        {line.name}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        延迟 {line.speed}ms · {line.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() =>
                        window.open(`https://${line.domain}`, "_blank")
                      }
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 hover:shadow-lg hover:shadow-cyan-500/25 transition active:scale-95"
                    >
                      <Globe className="w-3 h-3" /> 访问
                    </button>
                    <button
                      onClick={() =>
                        window.open(
                          `https://${line.domain}/mobile/v3rn/dist/home`,
                          "_blank"
                        )
                      }
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 hover:shadow-lg hover:shadow-purple-500/25 transition active:scale-95"
                    >
                      <Smartphone className="w-3 h-3" /> APP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── 主组件 ───────── */
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (!isInstalled) {
      setShowInstallGuide(true);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-screen bg-[#0f1020] text-white font-sans relative shadow-2xl shadow-black/50">
      {/* ═══════ 顶部导航栏 ═══════ */}
      <header className="bg-gradient-to-r from-[#0d0d1a] via-[#141428] to-[#0d0d1a] border-b border-gray-800/80 sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 py-2.5">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-white font-black text-base">博</span>
            </div>
            <span className="text-xs font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              博鱼游戏官方推广站
            </span>
          </div>
          {/* Nav quick actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleInstall}
              disabled={isInstalled}
              className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black text-xs font-bold px-3.5 py-1.5 rounded-lg hover:shadow-lg hover:shadow-amber-500/30 transition flex items-center gap-1 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" /> {isInstalled ? "已添加" : "添加到桌面"}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ 广播滚动区 ═══════ */}
      <BroadcastBar />

      {/* ═══════ Hero Banner ═══════ */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1020] via-[#141432] to-[#0f1020]" />
        <div className="absolute top-10 left-5 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-5 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-4">
            <Flame className="w-3 h-3 text-amber-400" />
            <span className="text-amber-400 text-[10px] font-medium">
              亚洲最受信赖的体育娱乐平台
            </span>
          </div>
          <h2 className="text-3xl font-black mb-2 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              亚洲顶级
            </span>
            <br />
            <span className="text-white text-2xl">体育娱乐平台</span>
          </h2>
          <p className="text-gray-400 text-xs max-w-xs mx-auto mb-6 leading-relaxed">
            安全稳定 · 极速存取 · 24小时服务 · 百万会员的共同选择
          </p>

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-2 mx-auto mb-2">
            {[
              { label: "注册会员", value: "500万+" },
              { label: "日活跃用户", value: "80万+" },
              { label: "累计派彩", value: "¥200亿+" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center bg-[#181b2e]/60 rounded-xl py-3 px-2 border border-gray-800/40"
              >
                <p className="text-lg font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-[10px] mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 功能区 ═══════ */}
      <section className="px-3 pb-6 -mt-1">
        <div className="grid grid-cols-2 gap-2">
          {/* 一键登录 */}
          <button
            onClick={() => setModalOpen(true)}
            className="group bg-gradient-to-br from-[#1a1d30] to-[#1e2040] rounded-xl p-3 border border-gray-700/40 hover:border-cyan-500/50 transition-all duration-300 text-left active:scale-[0.98] shadow-inner shadow-cyan-900/10"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm mb-0.5">一键登录</h3>
            <p className="text-gray-500 text-[10px] leading-snug">
              智能检测线路
              <br />
              网页版 & APP版
            </p>
            <div className="mt-1.5 flex items-center text-cyan-400 text-[10px] font-medium gap-0.5">
              开始检测
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </div>
          </button>

          {/* 立即注册 */}
          <div className="relative group">
            <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-xl opacity-60 blur-[2px] group-hover:opacity-100 transition animate-glow-pulse" />
            <button
              onClick={() => {
                const domain = CONFIG.domains[0];
                const url = isMobileDevice()
                  ? `https://${domain}/mobile/v3rn/dist/home`
                  : `https://${domain}/register.do`;
                window.open(url, "_blank");
              }}
              className="relative bg-gradient-to-br from-[#1a1d30] to-[#1e2040] rounded-xl p-3 border border-amber-500/50 w-full text-left h-full active:scale-[0.98] shadow-inner shadow-amber-900/10"
            >
              <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                限时优惠
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-2 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-sm mb-0.5">立即注册</h3>
              <p className="text-gray-500 text-[10px] leading-snug">
                注册送58元体验金
                <br />
                首存再送68%
              </p>
              <div className="mt-1.5 flex items-center text-amber-400 text-[10px] font-bold gap-0.5">
                免费注册
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </div>
            </button>
          </div>

          {/* APP 下载 */}
          <div className="group bg-gradient-to-br from-[#1a1d30] to-[#1e2040] rounded-xl p-3 border border-gray-700/40 hover:border-purple-500/50 transition-all duration-300 text-left shadow-inner shadow-purple-900/10">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-2 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition">
              <Download className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm mb-0.5">APP下载</h3>
            <p className="text-gray-500 text-[10px] leading-snug mb-2">
              全平台流畅体验
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => window.open(CONFIG.iosDownloadUrl, "_blank")}
                className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 text-[9px] px-2 py-0.5 rounded border border-gray-600/60 hover:border-purple-400/60 active:scale-95 transition"
              >
                iOS
              </button>
              <button
                onClick={() => window.open(CONFIG.androidDownloadUrl, "_blank")}
                className="bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 text-[9px] px-2 py-0.5 rounded border border-gray-600/60 hover:border-purple-400/60 active:scale-95 transition"
              >
                Android
              </button>
            </div>
          </div>

          {/* 咨询方式 */}
          <div
            onClick={() =>
              window.open(CONFIG.customerServiceUrl, "_blank")
            }
            className="bg-gradient-to-br from-[#1a1d30] to-[#1e2040] rounded-xl p-3 border border-gray-700/40 hover:border-green-500/50 transition-all duration-300 cursor-pointer shadow-inner shadow-green-900/10"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-2 shadow-lg shadow-green-500/30">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-bold text-sm mb-1.5">咨询方式</h3>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3 h-3 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-[9px]">招商合作</p>
                  <p className="text-white text-[11px] font-medium">
                    QQ: 8888888
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-[9px]">官方客服</p>
                  <p className="text-white text-[11px] font-medium">
                    24/7 在线
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 活动推广区 ═══════ */}
      <section className="px-3 pb-8">
        {/* 标题 */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">
              活动推广
            </span>
            <Megaphone className="w-3.5 h-3.5 text-amber-400 -scale-x-100" />
          </div>
          <h2 className="text-xl font-black text-white mb-1">
            精彩活动{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              火热进行中
            </span>
          </h2>
          <p className="text-gray-500 text-[10px]">
            丰富优惠活动，让每一次参与都充满惊喜
          </p>
        </div>

        {/* 活动卡片 - 2列 */}
        <div className="grid grid-cols-2 gap-2.5">
          {promotions.map((promo) => {
            const Icon = promo.icon;
            const isRegisterPromo = promo.id === 1 || promo.id === 5;
            const handleApply = () => {
              if (isRegisterPromo) {
                const domain = CONFIG.domains[0];
                const url = isMobileDevice()
                  ? `https://${domain}/mobile/v3rn/dist/home`
                  : `https://${domain}/register.do`;
                window.open(url, "_blank");
              } else {
                window.open(CONFIG.customerServiceUrl, "_blank");
              }
            };
            return (
              <div
                key={promo.id}
                className="group bg-[#181b2e] rounded-xl overflow-hidden border border-gray-800/60 hover:border-gray-600/60 transition-all duration-300 active:scale-[0.99] flex flex-col"
              >
                <div className="p-3 flex flex-col flex-1">
                  {/* 图标 + tag */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-9 h-9 bg-gradient-to-br ${promo.gradient} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span
                      className={`bg-gradient-to-r ${promo.tagColor} text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full`}
                    >
                      {promo.tag}
                    </span>
                  </div>

                  {/* 内容 */}
                  <h3 className="text-white font-bold text-xs mb-0.5">
                    {promo.title}
                  </h3>
                  <p
                    className={`bg-gradient-to-r ${promo.gradient} bg-clip-text text-transparent font-bold text-[10px] mb-1`}
                  >
                    {promo.subtitle}
                  </p>
                  <p className="text-gray-500 text-[9px] leading-snug line-clamp-2 flex-1">
                    {promo.desc}
                  </p>

                  {/* 立即申请按钮 */}
                  <button
                    onClick={handleApply}
                    className={`mt-2 w-full bg-gradient-to-r ${promo.gradient} text-white text-[10px] font-bold py-1 rounded-lg hover:opacity-90 active:scale-95 transition`}
                  >
                    立即申请
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ 平台优势 ═══════ */}
      <section className="px-3 pb-8">
        <h2 className="text-center text-lg font-black text-white mb-4">
          为什么选择{" "}
          <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
            博鱼游戏
          </span>
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              icon: Shield,
              title: "安全保障",
              desc: "国际认证 SSL加密",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Zap,
              title: "极速存取",
              desc: "最快60秒到账",
              color: "from-amber-500 to-orange-500",
            },
            {
              icon: Star,
              title: "品牌信赖",
              desc: "10年运营口碑",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: Headphones,
              title: "全天客服",
              desc: "24/7专业服务",
              color: "from-green-500 to-emerald-500",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-[#181b2e] rounded-xl p-2.5 border border-gray-800/60 text-center hover:border-gray-600/60 transition group"
              >
                <div
                  className={`w-8 h-8 mx-auto bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-white font-bold text-xs mb-0.5">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-[10px]">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ Footer ═══════ */}
      <footer className="bg-[#0a0b14] border-t border-gray-800/60 py-6 px-4">
        <div className="text-center">
          <p className="text-gray-600 text-[10px] mb-3 leading-relaxed px-2">
            博鱼游戏拥有欧洲马耳他MGA及菲律宾PAGCOR双重国际认证，确保所有游戏公平、公正、公开。
          </p>
          <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
            {["MGA认证", "PAGCOR认证", "SSL加密", "公平游戏"].map((t, i) => (
              <span
                key={i}
                className="flex items-center gap-0.5 text-gray-600 text-[9px]"
              >
                <CheckCircle className="w-2.5 h-2.5 text-green-600" /> {t}
              </span>
            ))}
          </div>
          <p className="text-gray-700 text-[9px]">
            © 2024 博鱼游戏 版权所有 · 18+
          </p>
        </div>
      </footer>

      {/* ═══════ 回到顶部 ═══════ */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30 hover:scale-110 transition z-50 active:scale-95"
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </button>
      )}

      {/* ═══════ 浮动客服按钮 ═══════ */}
      <div className="fixed bottom-6 left-4 z-50">
        <button
          onClick={() => window.open(CONFIG.customerServiceUrl, "_blank")}
          className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 hover:scale-110 transition active:scale-95 relative"
        >
          <MessageCircle className="w-4 h-4 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0f1020] animate-pulse" />
        </button>
      </div>

      {/* ═══════ 浮动在线客服 ═══════ */}
      <div className="fixed bottom-6 right-4 z-50">
        <button
          onClick={() => window.open(CONFIG.customerServiceUrl, "_blank")}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 hover:scale-110 transition active:scale-95"
        >
          <Headphones className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* ═══════ 线路检测弹窗 ═══════ */}
      <LineDetectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* ═══════ PWA 安装引导弹窗 ═══════ */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
          <div className="w-full max-w-lg bg-[#181b2e] rounded-t-2xl p-5 border-t border-gray-700/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-sm">如何添加到桌面</h3>
              <button onClick={() => setShowInstallGuide(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="bg-[#0f1020] rounded-xl p-3">
                <p className="text-white font-semibold mb-1">📱 iOS Safari</p>
                <p>点击底部分享按钮 → 选择「添加到主屏幕」→ 点击「添加」</p>
              </div>
              <div className="bg-[#0f1020] rounded-xl p-3">
                <p className="text-white font-semibold mb-1">🤖 Android Chrome</p>
                <p>点击右上角菜单（⋮）→ 选择「添加到主屏幕」→ 点击「添加」</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
