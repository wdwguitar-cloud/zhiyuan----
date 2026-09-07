const featureEntries = [
  {
    key: 'advisor',
    badge: '顾问入口',
    title: '顾问介绍',
    description: '集中展示老师介绍、服务边界、联系方式与信任内容，适合初次了解顾问的人先看。',
    cta: '查看顾问介绍',
  },
  {
    key: 'encyclopedia',
    badge: '知识轨',
    title: '开工知识库',
    description: '整理常见问题、流程认知和可被搜索的知识内容，适合作为长期内容资产入口。',
    cta: '进入知识库',
  },
  {
    key: 'annual',
    badge: '专题服务',
    title: '年度顾问',
    description: '面向需要全年节点统筹、长期节奏规划与阶段跟进的企业服务入口。',
    cta: '查看年度顾问',
  },
]

function FeatureEntrySection({ onNavigate }) {
  return (
    <section className="home-section-shell bg-transparent py-14 sm:py-18">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto home-subtle-rule" />
          <h2 className="home-section-title mt-6 text-3xl font-bold sm:text-4xl">
            继续了解服务、知识库与长期顾问
          </h2>
          <p className="home-section-copy mt-3 text-sm leading-7 sm:text-base">
            如果已经看完首页，可以从这里进入更完整的顾问介绍、知识库内容和长期顾问入口。
          </p>
        </div>

        <div className="home-feature-entry-grid mx-auto mt-8 grid max-w-4xl gap-5 lg:mt-10">
          <div className="home-feature-entry-list grid gap-5">
            {featureEntries.map((item, index) => (
              <article key={item.key} className="home-card relative rounded-[30px] p-6">
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${
                    index === 0
                      ? 'bg-gradient-to-r from-[#8b522e] via-[#bf7f47] to-[#e1b57d]'
                      : 'bg-gradient-to-r from-[#e1b57d] via-[#8a3541] to-[#522028]'
                  }`}
                />
                <div className="relative flex flex-col gap-3">
                  <div>
                    <span className="home-accent-label inline-flex text-xs font-semibold tracking-[0.08em]">
                      {item.badge}
                    </span>
                    <h3 className="home-card-title mt-3 text-2xl font-semibold">{item.title}</h3>
                  </div>
                </div>
                <p className="home-card-copy mt-4 text-sm leading-7">{item.description}</p>
                <button
                  type="button"
                  onClick={() => onNavigate?.(item.key)}
                  className="home-soft-pill mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition hover:border-[#b97a44]/35 hover:bg-[#f8efe5]"
                >
                  {item.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureEntrySection
