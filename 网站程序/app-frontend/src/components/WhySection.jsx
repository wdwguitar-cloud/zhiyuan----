import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

const whyItems = [
  {
    title: "时间规划",
    description: "选择更适合的启动时间，让开业与开工安排更加有序。",
    detail: "先把时间确定，后面的宣传、人员和仪式安排才更从容。",
    Icon: ClockIcon,
  },
  {
    title: "仪式规划",
    description: "梳理开工、奠基、开业等重要动作的流程安排与现场执行步骤。",
    detail:
      "做到符合自身命格的因人而异，塑造强烈的仪式感、庄重感和观礼人的认可感",
    Icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "未雨绸缪",
    description:
      "提前发现、避开商业经营中可能存在的隐性问题和不安全因素，让好运常伴",
    detail: "提前规避冲突，比临场补救更省成本，也更显专业。",
    Icon: ShieldExclamationIcon,
  },
];

function WhySection() {
  return (
    <section className="home-section-shell bg-transparent py-14 sm:py-18">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-10 lg:px-8">
        <div className="lg:pr-4">
          <div className="home-subtle-rule" />
          <h2 className="home-section-title mt-6 max-w-[10em] text-3xl font-bold sm:text-4xl">
            为什么企业需要专业择吉？
          </h2>
          <p className="home-section-copy mt-4 max-w-2xl text-sm leading-7 sm:text-base">
            真正重要的，不只是“选一个日子”，而是把启动时间、仪式流程、现场协同和未来规划一起布置。
          </p>

          <div className="home-panel mt-7 rounded-[28px] p-5 sm:p-6">
            <p className="home-accent-label text-sm font-semibold tracking-[0.08em]">
              未雨绸缪，方得始终。
            </p>
            <p className="home-card-copy mt-3 text-sm leading-7 sm:text-base">
              对企业来说，越重要的节点，越不能只看黄历。真正有价值的，是提前把顺利与否得所有因素考虑清晰，并结合自身特点，选择最佳路径。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {whyItems.map(({ title, description, detail, Icon }, index) => (
            <article
              key={title}
              className="home-card relative overflow-hidden rounded-[30px] px-5 py-5 sm:px-6 sm:py-6"
            >
              <div className="relative flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(145deg,#8f2a36_0%,#612028_42%,#b97a44_100%)] text-[#f8edde] shadow-lg shadow-black/15">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2">
                    <h3 className="home-card-title text-xl font-semibold leading-tight">
                      {title}
                    </h3>
                  </div>
                  <p className="home-card-copy mt-3 text-base leading-7">
                    {description}
                  </p>
                  <div className="home-quiet-callout mt-4 px-4 py-3">
                    <p className="home-card-copy-strong text-sm leading-6">
                      {detail}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySection;
