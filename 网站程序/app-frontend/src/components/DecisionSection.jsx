const decisionReasons = [
  {
    title: "好日子不是随便挑选，而是结合自身情况选择",
    paragraphs: ["商业择吉，不只是翻一本黄历。", "需要结合："],
    points: [
      "行业属性",
      "项目类型",
      "店铺或工程情况",
      "负责人信息",
      "实际施工和经营安排",
    ],
    closing: "在符合现实条件的基础上，选择更适合启动的时间。",
  },
  {
    title: "避免临近开业，才手忙脚乱地准备",
    paragraphs: ["很多企业到了最后阶段才开始考虑日期："],
    points: ["装修已经排期", "员工已经到位", "宣传已经开始", "嘉宾已经邀请"],
    closing:
      "如果日期选择仓促，后续调整成本会越来越高。提前规划，可以让重要节点安排更加从容。",
  },
  {
    title: "给您一个明确、可执行的启动方案",
    paragraphs: ["您需要的不只是一句："],
    quote: "“这个日子不错。”",
    points: [
      "推荐日期",
      "推荐时辰",
      "注意事项",
      "仪式流程建议",
      "现场执行提醒",
    ],
    closing: "让后面的经营更加从容不迫。",
  },
  {
    title: "让重要的事情，有一个好的开始",
    paragraphs: [
      "开业，是一家企业第一次面对市场；",
      "开工，是商业走向成功的正式启动；",
      "奠基，是未来版图扩展的标志性基础。",
    ],
    closing: "每一件大事都需要仪式感，一个好的开始就是成功的一半。",
  },
];

function DecisionSection() {
  return (
    <section className="home-section-shell bg-transparent py-14 sm:py-18">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-panel relative rounded-[32px] p-6 sm:p-8">
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-start">
            <div>
              <div className="home-subtle-rule" />
              <h2 className="home-panel-title mt-6 text-3xl font-bold sm:text-4xl">
                为什么企业和门店，会选择知远择吉？
              </h2>
            </div>
            <div className="lg:pt-1">
              <p className="home-panel-copy text-base leading-8">
                开一家店、建一个厂、启动一个项目，投入的不只是资金，更关系到未来经营的开始。
              </p>
              <div className="mt-5 rounded-[28px] border border-[#c99966]/16 bg-white/42 px-5 py-5 text-left shadow-sm">
                <p className="home-card-copy text-sm leading-7 sm:text-base">
                  相信很多老板都会关注：什么时候开门营业？什么时候正式动工？什么时候举行奠基？
                </p>
                <p className="home-card-copy mt-3 text-sm leading-7 sm:text-base">
                  因为好的开始就是成功的一半，好日子定下来后，人员、宣传、邀请、营业都会围绕这个时间展开。
                </p>
                <p className="home-card-label mt-3 text-sm font-medium leading-7 sm:text-base">
                  专业择吉服务的价值，不只是帮您找一个日期，而是在重大启动之前，把时间选择和现场安排提前规划好，把未来道路上的荆棘全面清除。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-2 lg:gap-6">
          {decisionReasons.map((item, index) => (
            <article
              key={item.title}
              className="home-card relative rounded-[30px] p-6"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 ${
                  index % 2 === 0
                    ? "bg-gradient-to-r from-[#8b522e] via-[#bf7f47] to-[#e1b57d]"
                    : "bg-gradient-to-r from-[#e1b57d] via-[#8a3541] to-[#522028]"
                }`}
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#8f2a36_0%,#612028_45%,#bc7b46_100%)] text-sm font-semibold text-[#f7ebde] shadow-md shadow-black/10">
                  0{index + 1}
                </div>
                <h3 className="home-card-title text-xl font-semibold leading-8">
                  {item.title}
                </h3>
              </div>

              <div className="home-card-copy relative mt-4 space-y-3 text-sm leading-7 sm:text-base">
                {item.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {item.quote ? (
                <div className="relative mt-5 rounded-2xl border border-[#c99966]/22 bg-[linear-gradient(145deg,rgba(255,251,246,0.96),rgba(247,236,220,0.92))] px-5 py-4">
                  <p className="home-card-title text-lg font-semibold">
                    {item.quote}
                  </p>
                </div>
              ) : null}

              {item.points?.length ? (
                <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
                  {item.points.map((point) => (
                    <div
                      key={point}
                      className="home-card-copy rounded-2xl border border-[#d7b186]/20 bg-white/55 px-4 py-3 text-sm font-medium leading-6"
                    >
                      {item.quote ? `✓ ${point}` : point}
                    </div>
                  ))}
                </div>
              ) : null}

              {item.closing ? (
                <div className="home-quiet-callout relative mt-5 px-4 py-3">
                  <p className="home-card-copy-strong text-sm leading-7 sm:text-base">
                    {item.closing}
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DecisionSection;
