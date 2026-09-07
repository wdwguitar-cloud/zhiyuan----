const cases = [
  {
    slotKey: 'factory',
    name: '某厂房建设开工择吉方案',
    type: '工业厂房',
    summary: '适合厂房建设、生产启动、负责人现场统筹较多的开工场景。',
    service: '开工日期建议、流程设计、现场安排提示',
    result: '开工节点更清晰，现场配合更顺，启动仪式顺利完成。',
  },
  {
    slotKey: 'store',
    name: '某餐饮门店开业择吉方案',
    type: '餐饮门店',
    summary: '适合门店首开、门头亮相、现场氛围需要兼顾的开业项目。',
    service: '日期规划、开业流程建议、现场启用提醒',
    result: '门店开业流程顺畅落地，现场欢庆十足，开启生意兴隆的第一天。',
  },
  {
    slotKey: 'office',
    name: '某企业乔迁启用统筹方案',
    type: '企业办公室',
    summary: '适合企业新址启用、办公室搬迁后集中入驻的正式启动场景。',
    service: '乔迁节奏安排、启用建议、负责人协同',
    result: '新址启用更正式，现场衔接更自然，团队归属感和向心力更强。',
  },
]

const trustPoints = ['真实实拍案例持续补充', '按业务场景分类查看', '按场景快速判断是否适合']

function CasesSection({ content }) {
  return (
    <section className="home-section-shell relative overflow-hidden bg-transparent py-14 sm:py-18">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.08),transparent_28%)]" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-panel relative rounded-[32px] p-6 backdrop-blur sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-end">
            <div>
              <div className="home-subtle-rule" />
              <h2 className="home-panel-title mt-6 max-w-[9em] text-3xl font-bold sm:text-4xl">
                真实案例中心
              </h2>
            </div>

            <div className="space-y-4 lg:pl-6">
              <p className="home-panel-copy text-sm leading-7 sm:text-base">
                用真实项目场景去解释服务边界、流程安排和落地结果，比抽象描述更容易判断是否适合自己的业务。
              </p>
              <div className="home-card-copy flex flex-wrap gap-x-4 gap-y-2 text-sm leading-6">
                {trustPoints.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#9a5833]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:mt-10 xl:grid-cols-3 xl:gap-6">
          {cases.map((item) => {
            const slot = content.caseImages.find((image) => image.key === item.slotKey)
            const hasImage = Boolean(slot?.imageUrl)

            return (
              <article
                key={item.name}
                className="home-card group relative rounded-[30px] p-6 transition duration-200 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 ${
                    item.slotKey === 'office'
                      ? 'bg-gradient-to-r from-[#e1b57d] via-[#8a3541] to-[#522028]'
                      : 'bg-gradient-to-r from-[#8b522e] via-[#bf7f47] to-[#e1b57d]'
                  }`}
                />
                <div className="relative mb-5 flex items-center justify-between">
                  <span className="home-accent-label text-xs font-semibold tracking-[0.12em]">
                    {item.type}
                  </span>
                </div>
                <div className="relative mb-5 flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-[#d7c2ad]/65 bg-[#f4ece4]">
                  {hasImage ? (
                    <img src={slot.imageUrl} alt={slot.label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="home-placeholder-copy flex h-full items-center justify-center px-6 text-center text-sm leading-6">
                      {slot?.label ?? '案例图片位'}
                      <br />
                      案例素材整理中，稍后补充真实实拍内容。
                    </div>
                  )}
                </div>
                <h3 className="home-card-title relative text-xl font-semibold leading-8">{item.name}</h3>
                <p className="home-surface-copy relative mt-2 text-sm leading-6">{item.summary}</p>
                <dl className="home-card-copy relative mt-5 space-y-3 text-sm leading-6">
                  <div>
                    <dt className="home-card-label font-semibold">服务内容：</dt>
                    <dd>{item.service}</dd>
                  </div>
                  <div>
                    <dt className="home-card-label font-semibold">结果：</dt>
                    <dd className="home-quiet-callout mt-2 px-4 py-3 home-card-copy-strong">{item.result}</dd>
                  </div>
                </dl>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default CasesSection
