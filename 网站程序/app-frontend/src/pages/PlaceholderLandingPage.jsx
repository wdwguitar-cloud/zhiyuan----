import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useContentHub } from '../hooks/useContentHub'
import { navigateSite, syncHashNavigation } from '../lib/siteNavigation'

function PlaceholderLandingPage({ config }) {
  const { content, error } = useContentHub()
  const handleNavigate = (key) => navigateSite(key, config.pageKey)

  useEffect(() => {
    syncHashNavigation(config.pageKey)
  }, [config.pageKey])

  return (
    <div
      id={`${config.pageKey}-top`}
      className="placeholder-page home-page-shell pb-28 text-slate-950 md:pb-0"
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
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="home-panel rounded-[32px] p-6 sm:p-8">
                <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">
                  {config.badge}
                </p>
                <h1 className="home-panel-title mt-4 max-w-[12em] text-3xl font-bold leading-tight sm:text-5xl">
                  {config.heroTitle}
                </h1>
                <p className="home-panel-copy mt-4 max-w-2xl text-base leading-8 sm:text-lg">
                  {config.heroSubtitle}
                </p>
                <p className="home-panel-copy mt-4 max-w-2xl text-sm leading-7 opacity-85 sm:text-base">
                  {config.intro}
                </p>

                <div className="placeholder-note mt-6 rounded-[24px] px-5 py-5">
                  <p className="placeholder-note-label text-xs font-semibold tracking-[0.08em]">
                    当前服务说明
                  </p>
                  <p className="placeholder-note-copy mt-3 text-sm leading-7 sm:text-base">
                    如需了解{config.pageTitle}相关服务，可先通过资料咨询入口提交需求，我们会根据当前项目情况安排后续沟通与服务建议。
                  </p>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleNavigate('home')}
                    className="home-button-secondary inline-flex min-h-[50px] items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                  >
                    返回首页
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigate('consult')}
                    className="home-button-primary inline-flex min-h-[50px] items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                  >
                    立即咨询
                  </button>
                </div>
              </div>

              <div className="home-dark-card rounded-[32px] p-6 sm:p-7">
                <p className="home-metal-title text-sm font-semibold tracking-[0.08em]">
                  当前咨询入口
                </p>
                <div className="placeholder-contact-shell mt-5 rounded-[24px] p-5">
                  <p className="text-sm font-semibold text-[#f5ecde]">联系方式</p>
                  <div className="mt-3 space-y-2 text-sm leading-7 text-[#d5c3b9]">
                    <p>{content.contactLine}</p>
                    {content.wechatId ? <p>微信号：{content.wechatId}</p> : null}
                    {content.phone ? <p>手机号：{content.phone}</p> : null}
                    {content.note ? <p>{content.note}</p> : null}
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => handleNavigate('consult')}
                      className="home-button-primary inline-flex min-h-[48px] w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition"
                    >
                      进入填写资料咨询
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="home-panel rounded-[32px] p-6 sm:p-7">
                <div className="home-subtle-rule" />
                <h2 className="home-panel-title mt-4 text-2xl font-bold sm:text-[2rem]">
                  {config.pageTitle}相关服务，可先这样开始
                </h2>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <div className="home-card rounded-[24px] px-5 py-5">
                    <p className="home-card-title text-base font-semibold">先提交需求</p>
                    <p className="home-card-copy mt-3 text-sm leading-7">
                      把当前想了解的问题、身份信息与联系方式先说明清楚，有助于后续更快判断。
                    </p>
                  </div>

                  <div className="home-card rounded-[24px] px-5 py-5">
                    <p className="home-card-title text-base font-semibold">再安排沟通</p>
                    <p className="home-card-copy mt-3 text-sm leading-7">
                      根据你的项目阶段和当前重点，统一安排后续咨询方式与服务建议。
                    </p>
                  </div>

                  <div className="home-card rounded-[24px] px-5 py-5">
                    <p className="home-card-title text-base font-semibold">保持入口统一</p>
                    <p className="home-card-copy mt-3 text-sm leading-7">
                      目前正式咨询仍以资料填写入口为主，避免信息分散，也更便于持续跟进。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer content={content} onNavigate={handleNavigate} />
    </div>
  )
}

export default PlaceholderLandingPage
