import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContentHub } from "../hooks/useContentHub";
import { navigateSite, syncHashNavigation } from "../lib/siteNavigation";

const trustPoints = [
  {
    title: "易学世家",
    description:
      "自幼受家庭熏陶，熟读《协纪辨方书》、《开元占经》、《子平真诠》等经典古籍，早年即跟随父辈游历两广地区，耳濡目染民间传统文化，并立志于传承家业。",
  },
  {
    title: "虔诚皈依",
    description:
      "机缘巧合下，拜入全真教龙门派，皈依后，被师父收为崇字辈弟子，并受师傅点拨，研习诸多易学精要，勤勉修行，不敢怠慢。",
  },
  {
    title: "授业解惑",
    description:
      "修行愈四十载，终有小成，便遵从师父嘱托，行走江湖，收徒授课，以师傅传授和家业传承为根，以悬壶济世为心，愈二十年来，广受两广地区民间好评。",
  },
  {
    title: "立身之器",
    description:
      "擅长术数推演及枫水勘验，尤其以紫薇斗数、四柱八字、八宅枫水等最为应手，福主多以择日择吉、前程推演、运势分析、起名改名、图观枫水、婚丧嫁娶等事务登门合作。终能解除疑惑，乘兴而归。",
  },
];

const workflowItems = [
  {
    title: "先看项目背景",
    description:
      "先看项目类型、城市、负责人安排、执行时间和现场条件，避免脱离现实场景给建议。",
  },
  {
    title: "再做择日择吉建议",
    description: "不是只看黄历哪天好，而是结合福主自身命格去量身挑选。",
  },
  {
    title: "最后落到执行环节",
    description:
      "把人员、流程、物料和现场注意事项梳理清楚，建议才真正有可执行性。",
  },
];

const serviceScopes = [
  "门店开业择吉与现场启动建议",
  "企业开工、项目动工、奠基等最佳时间提醒",
  "办公室乔迁、新址启用的仪式准备提醒",
  "大型商业活动前的时间与执行要点咨询",
  "个人运势分析和重大决策建议咨询",
];

const quickStats = [
  { value: "一对一沟通", label: "信息保密，耐心服务" },
  { value: "丰富的从业经验", label: "更多商业场景和细节服务" },
  {
    value: "提供更多长期服务",
    label: "提供未来运势解析，解疑答惑，重大抉择等服务",
  },
];

function AdvisorPage() {
  const { content, loading, error } = useContentHub();
  const handleNavigate = (key) => navigateSite(key, "advisor");
  const showDevPanel =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("dev") === "1";

  useEffect(() => {
    syncHashNavigation("advisor");
  }, []);

  return (
    <div
      id="advisor-top"
      className="advisor-page home-page-shell pb-28 text-slate-950 md:pb-0"
    >
      <Navbar onNavigate={handleNavigate} />

      {error ? (
        <div className="border-b border-amber-300/20 bg-amber-100/10 px-4 py-3 text-sm text-amber-100">
          内容库暂时未连接成功：{error}
        </div>
      ) : null}

      <main>
        <section className="home-section-shell relative overflow-hidden pt-6 sm:pt-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,40,54,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(182,122,67,0.12),transparent_22%)]" />
          <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="space-y-5">
                <div className="home-poster-frame rounded-[32px] p-4 sm:p-5">
                  <div className="overflow-hidden rounded-[26px] bg-[rgba(251,246,240,0.96)]">
                    {content.teacherImageUrl ? (
                      <img
                        src={content.teacherImageUrl}
                        alt={content.teacherName}
                        className="h-[28rem] w-full object-contain bg-[linear-gradient(180deg,#f8efe6,#f2e6d9)] sm:h-[38rem]"
                      />
                    ) : (
                      <div className="flex h-[28rem] items-center justify-center px-8 text-center text-sm leading-7 text-[#d5c3b9] sm:h-[38rem]">
                        顾问海报素材位已预留
                      </div>
                    )}
                  </div>
                </div>

                <div className="home-panel advisor-bio-shell rounded-[30px] p-5 sm:p-6">
                  <div className="home-subtle-rule" />
                  <p className="home-panel-title advisor-nameplate mt-4 text-lg font-semibold">
                    王知远
                  </p>
                  <div className="advisor-bio-grid mt-5 grid gap-4 sm:grid-cols-2">
                    {trustPoints.map((item) => (
                      <article
                        key={item.title}
                        className="home-card advisor-bio-card rounded-[24px] p-5"
                      >
                        <div className="advisor-bio-head">
                          <span
                            className="advisor-bio-emblem"
                            aria-hidden="true"
                          />
                          <h2 className="home-card-title advisor-bio-title">
                            {item.title}
                          </h2>
                        </div>
                        <p className="home-card-copy advisor-bio-copy mt-4 text-sm leading-6">
                          {item.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="home-panel advisor-story-shell rounded-[32px] p-6 sm:p-8">
                  <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">
                    服务介绍
                  </p>

                  <div className="advisor-story-card mt-6 rounded-[26px] px-5 py-5 text-white">
                    <div className="advisor-story-line" aria-hidden="true" />
                    <p className="advisor-story-name text-lg font-semibold text-[#f5ecde]">
                      {content.teacherName}
                    </p>
                    <p className="advisor-story-summary mt-3 text-sm leading-7 text-[#d5c3b9]">
                      {content.teacherSummary}
                    </p>
                    <div className="advisor-story-note mt-4 rounded-[20px] px-4 py-4">
                      <p className="text-sm leading-7 text-[#efe1ce]">
                        {content.teacherServiceNote}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {quickStats.map((item) => (
                      <div
                        key={item.label}
                        className="home-card advisor-stat-card rounded-[22px] px-4 py-4"
                      >
                        <p className="home-card-title advisor-stat-value text-base font-semibold">
                          {item.value}
                        </p>
                        <p className="home-card-copy advisor-stat-label mt-1 text-sm leading-6">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleNavigate("consult")}
                      className="home-button-primary inline-flex min-h-[50px] items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                    >
                      立即填写资料咨询
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate("home")}
                      className="home-button-secondary inline-flex min-h-[50px] items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                    >
                      返回首页继续查看
                    </button>
                  </div>
                </div>

                <div className="advisor-support-grid grid gap-4 lg:grid-cols-3">
                  {workflowItems.map((item) => (
                    <article
                      key={item.title}
                      className="home-card advisor-support-card rounded-[28px] p-5"
                    >
                      <div className="advisor-support-mark" aria-hidden="true" />
                      <h2 className="home-card-title advisor-support-title mt-4 text-lg font-semibold">
                        {item.title}
                      </h2>
                      <p className="home-card-copy advisor-support-copy mt-3 text-sm leading-7">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="home-panel advisor-scope-shell rounded-[30px] p-6">
                  <div className="home-subtle-rule" />
                  <h2 className="home-panel-title advisor-cluster-title mt-4 text-2xl font-bold">
                    适合承接哪些咨询
                  </h2>
                  <p className="home-panel-copy advisor-cluster-copy mt-3 max-w-3xl text-sm leading-7 sm:text-base">
                    顾问页更适合作为信任建立页，不直接堆砌产品功能，而是让客户先理解顾问能帮助处理哪些常见商业场景。
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {serviceScopes.map((item) => (
                      <div
                        key={item}
                        className="home-card advisor-scope-card rounded-[22px] px-4 py-4"
                      >
                        <p className="home-card-copy-strong advisor-scope-copy text-sm font-medium leading-7">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  id="advisor-contact"
                  className="home-dark-card advisor-contact-shell scroll-mt-24 rounded-[32px] p-6 sm:p-7"
                >
                  <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <div>
                      <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">
                        正式咨询入口
                      </p>
                      <h2 className="home-section-title advisor-contact-title mt-4 text-2xl font-bold sm:text-3xl">
                        看完顾问介绍后，
                        <br />
                        可以直接从这里进入填写资料咨询
                      </h2>
                      <div className="home-lead-note advisor-contact-note mt-5 rounded-[24px] p-5">
                        <div className="space-y-2 text-sm leading-7 text-[#e8d9c8]">
                          <p>{content.contactLine}</p>
                          {content.wechatId ? (
                            <p>微信号：{content.wechatId}</p>
                          ) : null}
                          {content.phone ? (
                            <p>手机号：{content.phone}</p>
                          ) : null}
                          {content.note ? <p>{content.note}</p> : null}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="advisor-contact-list rounded-[26px] p-5">
                        <p className="advisor-contact-list-title text-sm font-semibold text-[#f5ecde]">
                          适合先准备的信息
                        </p>
                        <div className="mt-4 grid gap-3">
                          <div className="rounded-[18px] border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-[#d5c3b9]">
                            项目类型、所在城市、预计时间范围
                          </div>
                          <div className="rounded-[18px] border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-[#d5c3b9]">
                            负责人安排、关键节点与现场限制
                          </div>
                          <div className="rounded-[18px] border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-[#d5c3b9]">
                            你当前最想优先确认的问题
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleNavigate("consult")}
                        className="home-button-primary inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                      >
                        进入填写资料页面
                      </button>
                    </div>
                  </div>
                </div>

                {showDevPanel ? (
                  <div className="home-panel rounded-[28px] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="home-panel-title text-base font-semibold">
                        开发查看口
                      </p>
                      <span className="home-chip rounded-full px-3 py-1 text-xs font-semibold">
                        {loading ? "读取中" : "已接入内容库"}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="home-card rounded-[20px] px-4 py-4 text-sm">
                        海报素材：{content.assetCounts.teacher} 份
                      </div>
                      <div className="home-card rounded-[20px] px-4 py-4 text-sm">
                        二维码素材：{content.assetCounts.qr} 份
                      </div>
                      <div className="home-card rounded-[20px] px-4 py-4 text-sm">
                        PDF 资料：{content.assetCounts.pdfs} 份
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href={content.links.contentCenter}
                        target="_blank"
                        rel="noreferrer"
                        className="home-button-primary inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-semibold transition"
                      >
                        打开内容中心
                      </a>
                      <a
                        href={content.links.admin}
                        target="_blank"
                        rel="noreferrer"
                        className="home-button-secondary inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-sm font-semibold transition"
                      >
                        打开后台
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} onNavigate={handleNavigate} />
    </div>
  );
}

export default AdvisorPage;
