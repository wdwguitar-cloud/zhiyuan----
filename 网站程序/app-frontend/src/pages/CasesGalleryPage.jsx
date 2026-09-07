import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useContentHub } from '../hooks/useContentHub'
import { navigateSite, syncHashNavigation } from '../lib/siteNavigation'
import { resolveContentAssetUrl } from '../lib/contentHub'

const caseCategories = [
  {
    key: 'store',
    label: '门店开业',
    headline: '门店开业择吉案例',
    description:
      '适合餐饮、零售、生活服务等门店开业场景，重点呈现开业时间、门头启用节奏与现场流程落地效果。',
    audience: '适合对象：餐饮门店、零售门店、社区门店、品牌首店',
    shortAudience: '适合准备开业的门店老板',
    focus: ['开业日期建议', '门头启用节奏', '现场流程提醒'],
    items: [
      {
        title: '火锅门店开业现场',
        type: '餐饮门店',
        tag: '餐饮首开',
        background: '适合新店首开、门头亮相、开门营业前后的现场安排参考。',
        service: '日期规划、开业流程建议、专属财位提醒',
        result: '开业氛围热烈，现场节奏顺畅，门店开业更有秩序感。',
        image: '/content-media/case-images/gallery-store-hotpot.png',
      },
      {
        title: '服装门店开业案例',
        type: '服装零售',
        tag: '零售首店',
        background: '适合品牌新店、街铺首开、商业街门店等开业场景。',
        service: '开业时间建议、流程安排、专属财位提醒',
        result: '门店亮相更完整，开业节奏自然衔接，现场呈现更显正式。',
        image: '/content-media/case-images/gallery-store-fashion.png',
      },
      {
        title: '精品咖啡门店启用',
        type: '精品门店',
        tag: '空间启用',
        background: '适合精品零售、小而美门店、注重体验的品牌空间正式启用。',
        service: '开业择吉、门店流程建议、专属财位提示',
        result: '整体视觉更完整，现场体验更舒展，开业氛围更自然。',
        image: '/content-media/case-images/gallery-store-coffee.png',
      },
    ],
  },
  {
    key: 'factory',
    label: '厂房开工',
    headline: '厂房开工与项目启动案例',
    description:
      '适合厂房建设、生产线开工、施工动工等场景，重点看开工节点安排、负责人协同和现场执行秩序。',
    audience: '适合对象：厂房建设、工业搬迁、生产启动、工程项目',
    shortAudience: '适合准备动工的项目负责人',
    focus: ['开工日期统筹', '动工流程安排', '负责人现场协同'],
    items: [
      {
        title: '电子厂开工启动案例',
        type: '电子制造',
        tag: '生产启动',
        background: '适合厂房开工、生产线启动、负责人到场配合较多的开工节点。',
        service: '开工日期建议、流程设计、现场安排提示',
        result: '现场启动简洁有序，负责人协同更顺，团队配合更流畅。',
        image: '/content-media/case-images/gallery-factory-electronics.png',
      },
      {
        title: '厂区搬迁后重新开工',
        type: '工业厂房',
        tag: '搬迁开工',
        background: '适合厂区搬迁后重新开工、设备进场后启动节点安排等场景。',
        service: '搬迁节奏建议、流程安排、负责人协同',
        result: '搬迁后的启动节点更清晰，执行衔接更自然，现场节奏更稳。',
        image: '/content-media/case-images/gallery-factory-move.png',
      },
      {
        title: '项目现场勘察准备',
        type: '工程准备',
        tag: '动工前期',
        background: '适合正式动工前的现场查看、节点判断与执行条件预判。',
        service: '前期现场查看、节点判断、执行条件梳理',
        result: '项目前期准备更扎实，后续开工安排更有依据，执行更有把握。',
        image: '/content-media/case-images/gallery-site-survey.png',
      },
    ],
  },
  {
    key: 'office',
    label: '企业乔迁',
    headline: '企业乔迁与新址开工案例',
    description:
      '适合办公室搬迁、新公司开业、企业新址启用等场景，重点体现搬迁后的开工衔接与团队参与感。',
    audience: '适合对象：公司乔迁、办公室搬迁、新址启用、总部升级',
    shortAudience: '适合准备乔迁的新址团队',
    focus: ['搬迁节点协调', '开工时段建议', '现场仪式衔接'],
    items: [
      {
        title: '公司乔迁开业案例',
        type: '企业办公室',
        tag: '新址开业',
        background: '适合企业新址开业、总部迁移、办公空间升级后的正式开业。',
        service: '乔迁节奏安排、开业建议、负责人协同',
        result: '新址开业流程更完整，团队参与感更强，现场氛围更正式。',
        image: '/content-media/case-images/gallery-office-relocation-company.png',
      },
      {
        title: '办公室搬迁启用案例',
        type: '办公空间',
        tag: '办公换址',
        background: '适合办公楼层搬迁、办公室换址、团队集中入驻的新场所。',
        service: '搬迁时间建议、开工流程安排、现场提示',
        result: '搬迁与开工衔接更自然，团队配合更清晰，整体节奏更稳妥。',
        image: '/content-media/case-images/gallery-office-relocation-office.png',
      },
    ],
  },
  {
    key: 'mall',
    label: '商业综合体',
    headline: '商业综合体与大型商业启动案例',
    description:
      '适合商场开业、招商发布、商业楼宇启动等大型场景，重点呈现多方协同下的启动秩序与现场表现。',
    audience: '适合对象：商场开业、招商启动、商业楼宇、综合商业活动',
    shortAudience: '适合大型商业项目操盘团队',
    focus: ['多方流程统筹', '重要节点安排', '活动现场呈现'],
    items: [
      {
        title: '商业综合体开业案例',
        type: '商场开业',
        tag: '综合体开业',
        background: '适合商业综合体、商场项目、多方参与的大型开业场景。',
        service: '日期规划、流程设计、现场建议',
        result: '现场氛围更浓厚，来客感受更统一，开业声量表现更强。',
        image: '/content-media/case-images/gallery-mall-wuyi.png',
      },
      {
        title: '商务中心招商启动案例',
        type: '商务中心',
        tag: '招商发布',
        background: '适合招商发布、商务中心启动、品牌集中亮相等商务型场景。',
        service: '启动时间建议、流程安排、现场协同提示',
        result: '招商启动节奏更完整，现场协同更清楚，来客体验更统一。',
        image: '/content-media/case-images/gallery-mall-opening-2.png',
      },
      {
        title: '商业楼宇开业场景',
        type: '商业楼宇',
        tag: '楼宇开业',
        background: '适合商业楼宇、办公配套楼、复合型物业项目的正式开动。',
        service: '开业择吉、流程设计、仪式建议',
        result: '开业场景更正式，整体呈现更稳重，启动表达更符合商务气质。',
        image: '/content-media/case-images/gallery-mall-opening-1.png',
      },
    ],
  },
]

const trustPoints = [
  {
    title: '都是真实场景',
    text: '不是抽象概念图，而是开业、开工、乔迁和大型商业启动的现场呈现。',
  },
  {
    title: '看得见执行方式',
    text: '从时间安排到流程呈现，尽量让客户看到“怎么落地”，而不是只看漂亮图片。',
  },
  {
    title: '先看案例再咨询',
    text: '看完和自己项目接近的案例后，再进入填写资料咨询，判断会更准确。',
  },
]

function CasesGalleryPage() {
  const { content, error } = useContentHub()
  const [activeCategory, setActiveCategory] = useState(caseCategories[0].key)
  const handleNavigate = (key) => navigateSite(key, 'cases-page')

  useEffect(() => {
    syncHashNavigation('cases-page')
  }, [])

  const activeGroup = useMemo(
    () => caseCategories.find((item) => item.key === activeCategory) ?? caseCategories[0],
    [activeCategory],
  )

  const contactLine = content.contactLine || '老师一对一咨询｜微信预约'

  return (
    <div id="cases-top" className="cases-page home-page-shell pb-28 text-slate-950 md:pb-0">
      <style>{`
        @keyframes casesConsultPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 16px 30px rgba(9, 2, 3, 0.26), inset 0 1px 0 rgba(255, 247, 223, 0.5);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 20px 38px rgba(9, 2, 3, 0.32), inset 0 1px 0 rgba(255, 247, 223, 0.62);
          }
        }

        .cases-contact-pulse {
          animation: casesConsultPulse 2.6s ease-in-out infinite;
        }
      `}</style>

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
            <div className="home-panel rounded-[32px] p-6 sm:p-8">
              <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">真实案例中心</p>
              <h1 className="home-panel-title mt-4 max-w-[12em] text-3xl font-bold leading-tight sm:text-5xl">
                从真实项目现场，
                <br />
                看懂服务怎么落地
              </h1>
              <p className="home-panel-copy mt-4 max-w-3xl text-base leading-8 sm:text-lg">
                展示真实开业、开工、乔迁与商业启动场景，帮助客户更直观看到现场氛围、执行方式与最终落地效果。
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="home-card rounded-[22px] px-4 py-4">
                  <p className="home-card-title text-2xl font-bold">{caseCategories.length}</p>
                  <p className="home-card-copy mt-1 text-sm leading-6">大类场景覆盖</p>
                </div>
                <div className="home-card rounded-[22px] px-4 py-4">
                  <p className="home-card-title text-2xl font-bold">200+</p>
                  <p className="home-card-copy mt-1 text-sm leading-6">当前实拍案例展示</p>
                </div>
                <div className="home-card rounded-[22px] px-4 py-4">
                  <p className="home-card-title text-2xl font-bold">5 类</p>
                  <p className="home-card-copy mt-1 text-sm leading-6">适用咨询方向</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.06fr_0.94fr]">
              <div className="home-panel rounded-[30px] p-5">
                <div className="home-subtle-rule" />
                <h2 className="home-panel-title mt-4 text-xl font-semibold">
                  每一个真实案例，都是信任的开始
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {trustPoints.map((point) => (
                    <article key={point.title} className="home-card rounded-[24px] p-4">
                      <p className="home-card-title text-sm font-semibold">{point.title}</p>
                      <p className="home-card-copy mt-2 text-sm leading-6">{point.text}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="home-dark-card rounded-[30px] p-5">
                <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">浏览建议</p>
                <div className="mt-4 grid gap-3 text-sm leading-7 text-[#d5c3b9]">
                  <div className="rounded-[20px] border border-white/8 bg-white/6 px-4 py-3">
                    1. 先选和自己最接近的项目类型
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-white/6 px-4 py-3">
                    2. 再看现场图和流程是否贴近你的业务场景
                  </div>
                  <div className="rounded-[20px] border border-white/8 bg-white/6 px-4 py-3">
                    3. 最后重点看服务内容与结果呈现，再进入咨询
                  </div>
                </div>
              </div>
            </div>

            <div className="cases-category-panel home-panel mt-8 rounded-[30px] p-5">
              <div className="cases-category-shell -mx-5 overflow-x-auto px-5">
                <div className="cases-category-row flex min-w-max gap-3">
                  {caseCategories.map((category) => (
                    <button
                      key={category.key}
                      type="button"
                      onClick={() => setActiveCategory(category.key)}
                      className={`cases-category-button rounded-[20px] border px-4 py-3 text-left text-sm font-medium transition ${
                        activeCategory === category.key
                          ? 'bg-[linear-gradient(135deg,#6b1f28_0%,#8b4d39_60%,#c69a68_100%)] text-white shadow-[0_14px_28px_rgba(23,7,9,0.16)]'
                          : 'border-[rgba(186,144,95,0.16)] bg-[rgba(255,255,255,0.58)] text-[#5e4a44] hover:bg-white'
                      }`}
                    >
                      <div className="whitespace-nowrap">{category.label}</div>
                      <div
                        className={`mt-1 text-xs ${
                          activeCategory === category.key ? 'text-white/78' : 'text-[#7a675f]'
                        }`}
                      >
                        {category.shortAudience}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <h2 className="home-panel-title text-2xl font-semibold">{activeGroup.headline}</h2>
                  <p className="home-panel-copy mt-3 max-w-3xl text-sm leading-7 sm:text-base">
                    {activeGroup.description}
                  </p>
                  <p className="home-card-copy-strong mt-3 text-sm font-medium">{activeGroup.audience}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeGroup.focus.map((tag) => (
                    <span key={tag} className="home-chip rounded-full px-3 py-1 text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="cases-gallery-grid mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activeGroup.items.map((item) => (
                <article key={item.title} className="cases-gallery-card home-panel rounded-[30px] p-5">
                  <div className="overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#f7eee5,#f0e2d5)]">
                    <img
                      src={resolveContentAssetUrl(item.image)}
                      alt={item.title}
                      className="h-60 w-full object-cover"
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="home-chip rounded-full px-3 py-1 text-xs font-semibold">
                      {item.tag}
                    </span>
                    <span className="home-soft-pill rounded-full px-3 py-1 text-xs font-semibold">
                      {item.type}
                    </span>
                  </div>

                  <h2 className="home-panel-title mt-4 text-xl font-semibold">{item.title}</h2>
                  <p className="home-panel-copy mt-3 text-sm leading-7">{item.background}</p>

                  <div className="mt-5 space-y-3">
                    <div className="home-card rounded-[20px] px-4 py-4">
                      <p className="home-card-title text-sm font-semibold">服务内容</p>
                      <p className="home-card-copy mt-2 text-sm leading-6">{item.service}</p>
                    </div>
                    <div className="home-dark-card rounded-[20px] px-4 py-4">
                      <p className="text-sm font-semibold text-[#f5ecde]">结果呈现</p>
                      <p className="mt-2 text-sm leading-6 text-[#d5c3b9]">{item.result}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <section
              id="cases-contact"
              className="home-dark-card mt-8 scroll-mt-24 rounded-[32px] p-6 sm:p-7"
            >
              <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
                <div className="lg:pt-2">
                  <span className="cases-consult-shimmer inline-flex rounded-full px-4 py-1 text-sm font-semibold tracking-[0.08em]">
                    详情请咨询：
                  </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="rounded-[24px] border border-white/10 bg-white/8 p-5">
                    <div className="space-y-2 text-sm leading-7 text-[#e8d9c8]">
                      <p>{contactLine}</p>
                      {content.wechatId ? <p>微信号：{content.wechatId}</p> : null}
                      {content.phone ? <p>手机号：{content.phone}</p> : null}
                      {content.note ? <p>{content.note}</p> : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleNavigate('consult')}
                    className="home-button-primary cases-contact-pulse inline-flex min-h-[52px] items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                  >
                    立即咨询
                  </button>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer content={content} onNavigate={handleNavigate} />
    </div>
  )
}

export default CasesGalleryPage
