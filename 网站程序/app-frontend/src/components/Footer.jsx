const footerLinks = [
  { label: '首页', key: 'home' },
  { label: '知识库', key: 'encyclopedia' },
  { label: '关于我们', key: 'advisor' },
  { label: '联系方式', key: 'consult' },
  { label: '服务说明', key: 'services' },
]

function Footer({ content, onNavigate }) {
  return (
    <footer className="home-footer-shell">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-9 text-center sm:px-6 md:flex-row md:items-end md:justify-between md:text-left lg:px-8">
        <div className="space-y-3">
          <div className="home-subtle-rule mx-auto md:mx-0" />
          <p className="home-metal-title text-sm font-medium">© 知远择吉 版权所有</p>
          <p className="home-text-muted-on-dark max-w-md text-sm leading-6">
            {content.contactLine}
          </p>
        </div>
        <div className="home-text-on-dark flex flex-col gap-3 text-sm md:flex-row md:items-center md:gap-6">
          {footerLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => onNavigate?.(link.key, link.label)}
              className="transition hover:text-[#e0b37a]"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
