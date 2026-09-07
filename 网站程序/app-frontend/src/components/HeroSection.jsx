import brandSeal from '../assets/logo/brand-seal.png'

function HeroSection({ content, loading, onPrimaryAction, onSecondaryAction, onKnowledgeAction }) {
  const heroContent = content.homepageHero
  const isPosterMode = heroContent.imageMode === 'poster'
  const serviceHighlights = ['开工日期参考', '现场流程安排', '一对一顾问答疑']
  const contactItems = [
    content.contactLine,
    content.wechatId ? `微信：${content.wechatId}` : '',
    content.phone ? `电话：${content.phone}` : '',
  ].filter(Boolean)
  const hasTextBlock = Boolean(heroContent.title || heroContent.subtitle || heroContent.detail)
  const hasButtons = Boolean(heroContent.primaryButton || heroContent.secondaryButton || onKnowledgeAction)

  return (
    <section className="home-hero-shell relative overflow-x-hidden bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,31,46,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(182,122,67,0.18),transparent_28%)]" />
      <div
        className={`relative mx-auto flex w-full items-center ${
          isPosterMode
            ? 'min-h-[calc(100svh-64px)] max-w-none px-0 py-0 sm:min-h-[740px] sm:max-w-7xl sm:px-6 sm:py-10 lg:px-8'
            : 'min-h-[calc(100svh-72px)] max-w-7xl px-4 py-8 sm:min-h-[720px] sm:px-6 sm:py-12 lg:px-8'
        }`}
      >
        <div
          className={`grid w-full items-center ${
            isPosterMode ? 'gap-0 sm:gap-10' : 'gap-8 lg:gap-10'
          } ${isPosterMode ? '' : 'md:grid-cols-2'}`}
        >
          <div
            className={
              isPosterMode
                ? 'flex w-full flex-col items-center text-center'
                : 'home-hero-copy-column flex flex-col items-center text-center md:items-start md:text-left'
            }
          >
            {isPosterMode ? (
              <div className="home-poster-frame home-hero-poster h-[72svh] min-h-[420px] w-full sm:h-[68vh] sm:max-h-[760px] sm:max-w-5xl sm:rounded-[36px]">
                <img
                  src={heroContent.image}
                  alt="首页主视觉海报"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            ) : null}

            {hasTextBlock ? (
              <div
                className={
                  isPosterMode
                    ? 'home-hero-copy-block mx-auto -mt-8 flex max-w-3xl flex-col items-center px-4 text-center sm:-mt-4 sm:px-0'
                    : ''
                }
              >
                <div className="flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/90 shadow-lg shadow-black/25 sm:h-[72px] sm:w-[72px]">
                  <img
                    src={brandSeal}
                    alt="知远择吉印章标识"
                    className="h-full w-full object-cover"
                  />
                </div>
                {heroContent.title ? (
                  <h1 className="home-metal-title mt-4 max-w-[8.5em] text-[2.08rem] font-bold tracking-tight leading-[1.08] sm:mt-5 sm:text-[2.7rem] md:text-6xl">
                    {heroContent.title}
                  </h1>
                ) : null}
                {heroContent.subtitle ? (
                  <p className="home-text-on-dark mt-3 max-w-[30rem] text-[0.95rem] leading-7 sm:mt-4 sm:text-lg sm:leading-8 md:text-xl">
                    {heroContent.subtitle}
                  </p>
                ) : null}
                {heroContent.detail ? (
                  <p className="home-text-muted-on-dark mt-3 text-[11px] tracking-[0.06em] sm:mt-3 sm:text-sm">
                    {heroContent.detail}
                  </p>
                ) : null}
              </div>
            ) : null}

            {hasButtons ? (
              <div
                className={`home-hero-actions mt-5 flex w-full flex-col gap-3 sm:mt-7 sm:w-auto sm:flex-row sm:gap-4 ${
                  isPosterMode ? 'justify-center px-4 sm:px-0' : ''
                }`}
              >
                {onKnowledgeAction ? (
                  <button
                    type="button"
                    onClick={onKnowledgeAction}
                    className="home-button-primary inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                  >
                    进入风物知识库
                  </button>
                ) : null}
                {heroContent.primaryButton ? (
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="home-button-secondary inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition"
                  >
                    {heroContent.primaryButton}
                  </button>
                ) : null}
                {heroContent.secondaryButton ? (
                  <button
                    type="button"
                    onClick={onSecondaryAction}
                    className="home-soft-pill inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-semibold transition hover:border-[#b97a44]/35 hover:bg-[#f8efe5]"
                  >
                    {heroContent.secondaryButton}
                  </button>
                ) : null}
              </div>
            ) : null}

            <div
              className={`home-panel home-hero-intro mt-4 w-full rounded-[30px] p-4 text-left backdrop-blur sm:mt-6 sm:p-6 ${
                isPosterMode ? 'max-w-3xl' : 'max-w-xl'
              }`}
            >
              <div className="relative space-y-3">
                <div className="home-subtle-rule" />
                <p className="home-card-title text-[15px] font-semibold leading-7 sm:text-base">
                  {content.teacherHeroTitle}
                </p>
                <p className="home-card-copy text-sm leading-6 sm:text-[15px]">{content.teacherHeroIntro}</p>
                <div className="flex flex-wrap gap-2">
                  {serviceHighlights.map((item, index) => (
                    <span
                      key={item}
                      className={`home-chip rounded-full px-3 py-1 text-xs font-semibold ${index === 2 ? 'hidden sm:inline-flex' : ''}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                {contactItems.length ? (
                  <div className="home-contact-copy grid gap-1.5 border-t border-[#d9c3aa]/45 pt-3 text-sm leading-6 sm:grid-cols-2">
                    {contactItems.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                ) : null}
                {loading ? <p className="home-meta-copy text-xs">页面内容同步中，请稍后刷新查看。</p> : null}
              </div>
            </div>
          </div>

          {!isPosterMode ? (
            <div className="home-poster-frame relative hidden min-h-[540px] rounded-[32px] md:block">
              <img
                src={heroContent.image}
                alt="现代办公楼场景"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#120608]/26 via-transparent to-black/20" />
              <div className="home-panel absolute bottom-5 right-5 w-72 rounded-3xl p-4 backdrop-blur">
                <p className="home-card-title text-sm font-semibold">{content.teacherHeroTitle}</p>
                <p className="home-card-copy mt-2 text-sm leading-6">{content.teacherHeroIntro}</p>
                <a
                  href={content.links.legacyAbout}
                  target="_blank"
                  rel="noreferrer"
                  className="home-link-accent mt-4 inline-flex text-sm font-semibold"
                >
                  查看现有顾问介绍页
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
