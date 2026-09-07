import { useMemo, useState } from 'react'

const publishedDate = '2020-05-08'

const knowledgeData = {
  开业择吉: [
    { title: '新店开业择日先看什么', summary: '先看启动节奏与负责人安排。', date: publishedDate },
    { title: '商场开张流程如何规划', summary: '时间与开门流程需提前协同。', date: publishedDate },
  ],
  工程奠基: [
    { title: '奠基仪式常见准备清单', summary: '提前确认人员、物料和现场流程。', date: publishedDate },
    { title: '工程动工前的时间协调', summary: '开工时段与施工进场安排同样重要。', date: publishedDate },
  ],
  装修动工: [
    { title: '办公室装修何时适合启动', summary: '装修节点要兼顾物业与团队安排。', date: publishedDate },
    { title: '厂房装修开工如何避冲突', summary: '施工方、负责人和场地都要提前对齐。', date: publishedDate },
  ],
  企业乔迁: [
    { title: '企业乔迁搬迁如何做节奏安排', summary: '搬迁不只是选时间，还要看执行顺序。', date: publishedDate },
    { title: '乔迁启动日的注意事项', summary: '进场、拜访、启用流程要统一规划。', date: publishedDate },
  ],
  传统仪式: [
    { title: '开工仪式中的基础流程结构', summary: '流程简而不乱，比堆砌环节更重要。', date: publishedDate },
    { title: '供品与流程如何保持专业表达', summary: '保留传统氛围，也要符合商业场景。', date: publishedDate },
  ],
  常见问题: [
    { title: '只看黄历能不能决定开工', summary: '商业项目还要看现场和人员安排。', date: publishedDate },
    { title: '为什么要提前做开工规划', summary: '越重要的节点越需要前置准备。', date: publishedDate },
  ],
}

const categories = Object.keys(knowledgeData)

function KnowledgeSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const articles = useMemo(() => knowledgeData[activeCategory] ?? [], [activeCategory])

  return (
    <section className="home-section-shell bg-transparent py-14 sm:py-18">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto home-subtle-rule" />
          <h2 className="home-section-title mt-6 text-3xl font-bold sm:text-4xl">
            开工知识库
          </h2>
          <p className="home-section-copy mt-3 text-sm leading-7 sm:text-base">
            把常见问题、流程认知和重点场景整理成更方便搜索、引用和复用的知识库。
          </p>
          <a
            href="/min-su-yan-jiu/"
            className="mt-5 inline-flex items-center rounded-full border border-[#c3915f]/40 bg-white/40 px-4 py-2 text-sm font-semibold text-[#7b4933] transition hover:-translate-y-0.5 hover:border-[#c3915f]/70 hover:bg-white/70"
          >
            进入知识库首页
            <span className="ml-2" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-3 lg:mt-10">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition sm:text-sm ${
                activeCategory === category
                  ? 'bg-[linear-gradient(145deg,#8f2a36_0%,#612028_45%,#bc7b46_100%)] text-[#f8edde] shadow-md shadow-black/12'
                  : 'home-soft-pill hover:border-[#c3915f]/25 hover:bg-white/34 hover:text-[#7b4933]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="home-panel mt-7 rounded-[30px] p-6 lg:mt-8">
          <ul className="divide-y divide-[#d8c2ac]/42">
            {articles.map((article) => (
              <li key={`${activeCategory}-${article.title}`}>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/min-su-yan-jiu/'
                  }}
                  className="flex w-full items-start gap-4 px-1 py-5 text-left transition hover:translate-x-1"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#8f2a36]" />
                  <span className="flex-1">
                    <span className="home-card-title block text-base font-semibold">{article.title}</span>
                    <span className="home-card-copy mt-2 block text-sm leading-6">{article.summary}</span>
                    <span className="home-meta-copy mt-3 inline-flex rounded-full border border-[#d6c1ac]/48 bg-white/55 px-3 py-1 text-xs font-medium">
                      发布日期：{article.date}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default KnowledgeSection
