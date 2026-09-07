import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useContentHub } from "../hooks/useContentHub";
import { navigateSite, syncHashNavigation } from "../lib/siteNavigation";

const fitItems = [
  {
    title: "全年有多个关键变化节点",
    description:
      "一年内涉及开业、乔迁、动工、签约、发布等多类变动时，更适合统一计划统筹，不再临时仓促判断。",
  },
  {
    title: "负责人把控力更强",
    description:
      "不是只看某一次顺利与否，而是把全年重点事项的先后关系和运势风险提前梳理清晰。",
  },
  {
    title: "业务繁杂或关系反复",
    description:
      "当参与方多、流程冗长、变化频繁时，年度顾问更适合作为长期陪跑与决策建议。",
  },
];

const valueItems = [
  {
    title: "减少临时决策压力",
    description:
      "把重要节点前置思考，避免每临近一个时间点就重新开始判断和协调。",
  },
  {
    title: "让节点更好执行",
    description:
      "不仅给建议，也兼顾负责人安排、流程顺序和现场能否真正配合落地。",
  },
  {
    title: "形成稳定主线",
    description:
      "从零散咨询转向私人定制，让经营节奏更有方向感，也更适合长期项目。",
  },
];

const serviceItems = [
  "年度关键节点排序与优先级建议",
  "开业、开工、乔迁、启用等场景的全年统筹",
  "重大事项前的时间与决策判断",
  "围绕执行落地的流程提醒与顾问沟通",
];

const deliveryItems = [
  {
    title: "前期梳理",
    description:
      "会确认企业阶段、年度目标、关键节点与负责人安排，明确接下来的一条经营主线。",
  },
  {
    title: "阶段建议",
    description:
      "围绕不同阶段给出更适合的决策建议、事项排序与注意重点，而不是只回答单个问题。",
  },
  {
    title: "节点跟进",
    description:
      "在重要节点临近时继续对接，帮助把前面的判断真正落到当下的执行动作中。",
  },
];

const annualStats = [
  { value: "长期陪跑", label: "不是单次处理思路" },
  { value: "全年统筹", label: "围绕经营节奏展开" },
  { value: "统一咨询入口", label: "最后都进入填写资料咨询" },
];

const consultPrepItems = [
  "年度计划里最重要的 3 到 5 个节点",
  "项目负责人、关键协同人和时间限制",
  "目前最担心的执行冲突或判断难点",
];

const supportPromiseItems = [
  "更重视建议是否真正可执行，而不是只停留在概念表达。",
  "围绕全年主线持续跟进，不把复杂问题拆成一堆零散回答。",
  "结合你的项目节奏、执行压力和实际限制给出建议。",
];

function AnnualConsultingPage() {
  const { content, loading, error } = useContentHub();
  const handleNavigate = (key) => navigateSite(key, "annual");
  const showDevPanel =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("dev") === "1";

  useEffect(() => {
    syncHashNavigation("annual");
  }, []);

  return (
    <div
      id="annual-top"
      className="annual-page home-page-shell pb-28 text-slate-950 md:pb-0"
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
            <div className="annual-hero-grid grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="home-panel rounded-[32px] p-6 sm:p-8">
                <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">
                  年度顾问
                </p>
                <h1 className="home-panel-title mt-4 max-w-[12em] text-3xl font-bold leading-tight sm:text-5xl">
                  面向企业负责人的
                  <br />
                  全年统筹型顾问服务
                </h1>
                <p className="home-panel-copy mt-4 max-w-2xl text-base leading-8 sm:text-lg">
                  更适合希望把全年重要事项提前梳理清楚、减少临时判断压力、让关键节点更稳推进的企业负责人和团队。
                </p>

                <div className="annual-stat-grid mt-6 grid gap-3 sm:grid-cols-3">
                  {annualStats.map((item) => (
                    <div
                      key={item.label}
                      className="home-card rounded-[22px] px-4 py-4"
                    >
                      <p className="home-card-title text-base font-semibold">
                        {item.value}
                      </p>
                      <p className="home-card-copy mt-1 text-sm leading-6">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="annual-summary-grid mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="home-card rounded-[24px] px-4 py-4">
                    <p className="home-card-title text-sm font-semibold">
                      适合对象
                    </p>
                    <p className="home-card-copy mt-2 text-sm leading-6">
                      企业负责人、长期经营团队、复杂项目主导人
                    </p>
                  </div>
                  <div className="home-card rounded-[24px] px-4 py-4">
                    <p className="home-card-title text-sm font-semibold">
                      重点价值
                    </p>
                    <p className="home-card-copy mt-2 text-sm leading-6">
                      全年统筹、节奏判断、执行可行性与关键节点提醒
                    </p>
                  </div>
                  <div className="home-card rounded-[24px] px-4 py-4">
                    <p className="home-card-title text-sm font-semibold">
                      服务方式
                    </p>
                    <p className="home-card-copy mt-2 text-sm leading-6">
                      长期顾问沟通，不再依赖一次次零散决策
                    </p>
                  </div>
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

              <div className="annual-side-stack space-y-5">
                <div className="home-panel rounded-[32px] p-5 sm:p-6">
                  <div className="home-subtle-rule" />
                  <p className="home-panel-title mt-4 text-lg font-semibold">
                    顾问老师介绍
                  </p>
                  <div className="mt-5 overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#f7eee5,#f0e2d5)] p-4">
                    {content.teacherImageUrl ? (
                      <img
                        src={content.teacherImageUrl}
                        alt={content.teacherName}
                        className="h-72 w-full rounded-[22px] bg-white object-contain"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center rounded-[22px] bg-white text-center text-sm text-[#7a675f]">
                        年度顾问海报展示位已预留
                      </div>
                    )}
                  </div>
                  <p className="home-card-title mt-4 text-base font-semibold">
                    {content.teacherName}
                  </p>
                  <p className="home-card-copy mt-2 text-sm leading-7">
                    {content.teacherSummary}
                  </p>
                  <div className="home-quiet-callout mt-4 px-4 py-4">
                    <p className="home-card-copy text-sm leading-7">
                      {content.teacherServiceNote}
                    </p>
                  </div>
                </div>

                <div className="home-card rounded-[30px] p-5">
                  <div className="home-subtle-rule" />
                  <h2 className="home-card-title mt-4 text-lg font-semibold">
                    这类服务更适合什么情况
                  </h2>
                  <div className="mt-5 grid gap-3">
                    {fitItems.map((item) => (
                      <article
                        key={item.title}
                        className="rounded-[22px] border border-[rgba(186,144,95,0.14)] bg-white/55 px-4 py-4"
                      >
                        <h3 className="home-card-title text-sm font-semibold">
                          {item.title}
                        </h3>
                        <p className="home-card-copy mt-2 text-sm leading-6">
                          {item.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {valueItems.map((item) => (
                <article
                  key={item.title}
                  className="home-card rounded-[30px] p-5"
                >
                  <div className="home-subtle-rule" />
                  <h2 className="home-card-title mt-4 text-lg font-semibold">
                    {item.title}
                  </h2>
                  <p className="home-card-copy mt-3 text-sm leading-7">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="home-panel rounded-[30px] p-6">
                <div className="home-subtle-rule" />
                <h2 className="home-panel-title mt-4 text-2xl font-bold">
                  这项服务会重点覆盖什么
                </h2>
                <p className="home-panel-copy mt-3 max-w-3xl text-sm leading-7 sm:text-base">
                  内容重点不是罗列概念，而是围绕全年经营中的关键节点，给出更适合安排、判断和执行的顾问支持。
                </p>
                <div className="mt-6 grid gap-3">
                  {serviceItems.map((item) => (
                    <div
                      key={item}
                      className="home-card rounded-[22px] px-4 py-4"
                    >
                      <p className="home-card-copy-strong text-sm font-medium leading-7">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="home-dark-card mt-6 rounded-[26px] px-5 py-5">
                  <p className="text-sm font-semibold text-[#f5ecde]">
                    一句话理解年度顾问
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#d5c3b9]">
                    不是帮你临时决定某一天，而是围绕全年主线，持续帮助你判断什么时候做、怎么排、如何更稳地推进。
                  </p>
                </div>
              </div>

              <div className="home-panel rounded-[30px] p-6">
                <div className="home-subtle-rule" />
                <h2 className="home-panel-title mt-4 text-2xl font-bold">
                  你会如何收到顾问支持
                </h2>
                <p className="home-panel-copy mt-3 text-sm leading-7 sm:text-base">
                  年度顾问更像长期陪跑的判断参照，既看时间，也看项目节奏、负责人安排和现实执行条件。
                </p>
                <div className="mt-6 grid gap-4">
                  {deliveryItems.map((item) => (
                    <article
                      key={item.title}
                      className="home-card rounded-[26px] p-5"
                    >
                      <p className="home-card-title text-base font-semibold">
                        {item.title}
                      </p>
                      <p className="home-card-copy mt-3 text-sm leading-7">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <section
              id="annual-contact"
              className="home-dark-card mt-8 scroll-mt-24 rounded-[32px] p-6 sm:p-7"
            >
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">
                    正式咨询入口
                  </p>
                  <h2 className="home-section-title mt-4 text-2xl font-bold sm:text-3xl">
                    年度顾问咨询，
                    <br />
                    从填写基础资料开始
                  </h2>
                  <p className="home-section-copy mt-4 text-sm leading-7 sm:text-base">
                    适合已经意识到全年安排不能只靠临时决定，希望先把重点事项、顺序节奏与执行限制理清楚的负责人。
                  </p>

                  <div className="home-lead-note mt-5 rounded-[24px] border border-white/10 bg-white/7 p-5">
                    <div className="space-y-2 text-sm leading-7 text-[#e8d9c8]">
                      <p>{content.contactLine}</p>
                      {content.wechatId ? (
                        <p>微信号：{content.wechatId}</p>
                      ) : null}
                      {content.phone ? <p>手机号：{content.phone}</p> : null}
                      {content.note ? <p>{content.note}</p> : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[26px] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm font-semibold text-[#f5ecde]">
                      咨询前建议先准备
                    </p>
                    <div className="mt-4 grid gap-3">
                      {consultPrepItems.map((item) => (
                        <div
                          key={item}
                          className="rounded-[18px] border border-white/8 bg-black/10 px-4 py-3 text-sm leading-6 text-[#d5c3b9]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm font-semibold text-[#f5ecde]">
                      顾问支持方式
                    </p>
                    <div className="mt-4 grid gap-3">
                      {supportPromiseItems.map((item) => (
                        <div
                          key={item}
                          className="rounded-[18px] border border-white/8 bg-black/10 px-4 py-3 text-sm leading-7 text-[#d5c3b9]"
                        >
                          {item}
                        </div>
                      ))}
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
            </section>

            {showDevPanel ? (
              <div className="home-panel mt-8 rounded-[28px] p-5">
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
                    PDF 资料：{content.assetCounts.pdfs} 份
                  </div>
                  <div className="home-card rounded-[20px] px-4 py-4 text-sm">
                    顾问素材：{content.assetCounts.teacher} 份
                  </div>
                  <div className="home-card rounded-[20px] px-4 py-4 text-sm">
                    案例素材：{content.assetCounts.cases} 份
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
        </section>
      </main>

      <Footer content={content} onNavigate={handleNavigate} />
    </div>
  );
}

export default AnnualConsultingPage;
