const services = [
  {
    title: '商业开业方案',
    scenarios: ['店铺开业', '商场开张', '企业成立'],
  },
  {
    title: '工程奠基方案',
    scenarios: ['工地动工', '厂房建设', '项目启动'],
  },
  {
    title: '企业年度顾问',
    scenarios: ['企业长期规划', '重大节点安排'],
  },
  {
    title: '定制咨询',
    scenarios: ['复杂项目', '多方协调场景'],
  },
]

function ServiceSection({ content, onConsult }) {
  return (
    <section className="home-section-shell bg-transparent py-14 sm:py-18">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto home-subtle-rule" />
          <h2 className="home-section-title mt-6 text-3xl font-bold sm:text-4xl">
            服务体系
          </h2>
          <p className="home-section-copy mt-3 text-sm leading-7 sm:text-base">
            从单次择吉到长期顾问，按不同经营阶段和项目复杂度提供对应服务。
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service, index) => (
              <article key={service.title} className="home-card relative flex h-full flex-col rounded-[30px] p-6">
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 ${
                    index % 2 === 0
                      ? 'bg-gradient-to-r from-[#8c522d] via-[#bf7d45] to-[#ddb47a]'
                      : 'bg-gradient-to-r from-[#deb47b] via-[#8c3844] to-[#532028]'
                  }`}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <h3 className="home-card-title text-xl font-semibold">{service.title}</h3>
                </div>
                <ul className="home-card-copy relative mt-5 flex flex-1 flex-col gap-3 text-sm leading-6">
                  {service.scenarios.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#9a5833]" />
                      <span>适合：{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => onConsult?.(service.title)}
                  className="home-soft-pill relative mt-6 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition hover:border-[#b97a44]/45 hover:bg-[#f8efe5]"
                >
                  了解详情
                </button>
              </article>
            ))}
          </div>

          <aside className="home-panel rounded-[30px] p-5 sm:p-6">
            <p className="home-accent-label text-sm font-semibold tracking-[0.08em]">服务说明</p>
            <h3 className="home-card-title mt-3 text-2xl font-semibold leading-tight">
              择日择吉是为成功找到最顺利的途径，而不只是一个好的日子！
            </h3>
            <p className="home-card-copy mt-4 text-sm leading-7 sm:text-base">
              我们具体的服务是：
              <br />
              帮助您找到最佳时间
              <br />
              帮助您找到潜在的机会
              <br />
              帮助您找到最有利于您的位置
              <br />
              帮助您发现自己的天赋和命运
            </p>
            <div className="home-quiet-callout mt-4 px-4 py-3">
              <p className="home-card-copy text-sm leading-6">{content.teacherHeroIntro}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div
                className="home-soft-pill inline-flex rounded-full px-3 py-1 text-xs font-semibold"
              >
                企业顾问式沟通
              </div>
              <div
                className="home-soft-pill inline-flex rounded-full px-3 py-1 text-xs font-semibold"
              >
                节点规划优先
              </div>
              <div
                className="home-soft-pill inline-flex rounded-full px-3 py-1 text-xs font-semibold"
              >
                兼顾现场执行
              </div>
            </div>

            <button
              type="button"
              onClick={() => onConsult?.('服务说明')}
              className="home-button-primary mt-6 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition"
            >
              预约顾问沟通
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default ServiceSection
