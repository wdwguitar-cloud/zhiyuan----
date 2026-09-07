const guideItems = [
  '开工、开业前必做的准备事项',
  '开工当天的详细流程',
  '庆典仪式规范',
  '常见误区及禁忌事项',
]

const defaultWechatId = 'TJLS188'
const defaultQrCaption = '长按识别二维码添加微信'

function LeadCaptureSection({ content }) {
  const wechatId = content.wechatId || defaultWechatId

  const handleReceive = () => {
    window.location.href = '/guide-form#lead-form'
  }

  const handleCopyWechat = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(wechatId)
      } else {
        const input = document.createElement('textarea')
        input.value = wechatId
        input.setAttribute('readonly', '')
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        input.remove()
      }

      window.alert('微信号已复制，请打开微信，点击右上角“+”选择“添加朋友”进行粘贴。')

      if (window.confirm('是否尝试直接打开微信？')) {
        window.location.href = 'weixin://'
      }
    } catch {
      window.alert(`复制失败，请手动添加微信号：${wechatId}`)
    }
  }

  return (
    <section className="home-section-shell bg-transparent py-14 sm:py-18">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto home-subtle-rule" />
          <h2 className="home-section-title mt-6 text-3xl font-bold sm:text-4xl">
            免费领取
          </h2>
          <p className="home-section-copy mt-3 text-sm leading-7 sm:text-base">
            把准备事项、流程环节和常见误区整理成一份完整可照着做的资料。
          </p>
        </div>

        <div className="home-dark-card home-lead-shell mx-auto mt-8 max-w-5xl rounded-[32px] px-5 py-8 text-center text-white sm:mt-10 sm:px-10 sm:py-10">
          <div className="home-text-on-dark relative inline-flex rounded-full border border-[#deb47a]/25 bg-white/8 px-4 py-1 text-xs font-semibold tracking-[0.18em]">
            《商业开工开业流程总指引》
          </div>

          <div className="home-card-copy relative mx-auto mt-6 max-w-md rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(252,247,241,0.98),rgba(245,233,220,0.94))] px-5 py-6 text-left shadow-xl shadow-black/15 sm:mt-7">
            <ul className="space-y-3">
              {guideItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium sm:text-base">
                  <span className="text-[#8c5b2e]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-6 grid gap-4 md:mt-7 md:grid-cols-[1fr_auto] md:items-center md:gap-5">
            <div className="home-lead-note rounded-[28px] border border-white/10 bg-white/7 p-5 text-left">
              <p className="home-text-on-dark text-sm font-semibold">领取前说明</p>
              <p className="home-text-muted-on-dark mt-2 text-sm leading-6">
                点击领取后会先进入资料填写表单。按要求填写姓名和 11 位手机号提交完成后，再进入后续领取流程。
              </p>
            </div>

            <button
              type="button"
              onClick={handleReceive}
              className="home-button-primary inline-flex min-h-[52px] items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold transition"
            >
              立即领取
            </button>
          </div>

          <div className="home-lead-contact relative mt-6 grid gap-5 rounded-[28px] border border-white/10 bg-white/6 p-5 text-left md:mt-7 md:grid-cols-[136px_1fr] md:items-center">
            <div className="mx-auto w-full max-w-[136px] md:mx-0">
              <div className="mx-auto h-[120px] w-[120px] overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-black/20">
                {content.qrImageUrl ? (
                  <img
                    src={content.qrImageUrl}
                    alt="微信二维码"
                    className="h-full w-full rounded-xl object-contain"
                  />
                ) : (
                  <div className="home-placeholder-copy flex h-full items-center justify-center rounded-xl bg-[#f4ece4] text-xs">
                    二维码素材位
                  </div>
                )}
              </div>
              <p className="home-text-muted-on-dark mt-3 text-center text-[11px] font-medium leading-5">
                长按识别二维码，或复制微信号添加
              </p>
              <button
                type="button"
                onClick={handleCopyWechat}
                className="home-button-primary mt-3 w-full rounded-xl px-3 py-2 text-xs font-semibold transition"
              >
                复制微信号添加好友
              </button>
            </div>

            <div className="home-lead-copy min-w-0">
              <p className="home-text-on-dark text-base font-semibold leading-7">{defaultQrCaption}</p>
              <div className="home-text-muted-on-dark mt-3 space-y-2 text-sm leading-6">
                <p>{content.contactLine}</p>
                <p>微信号：{wechatId}</p>
                {content.phone ? <p>手机号：{content.phone}</p> : null}
                {content.note ? <p>{content.note}</p> : null}
                {!content.phone && !content.note ? (
                  <p>复制后可直接去微信粘贴搜索，也可以先长按识别上方二维码。</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LeadCaptureSection
