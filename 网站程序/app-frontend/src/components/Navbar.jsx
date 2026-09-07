import {
  BookOpenIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { desktopNavLinks, mobileNavLinks } from '../constants/navigation'

const mobileIcons = {
  home: HomeIcon,
  encyclopedia: BookOpenIcon,
  guide: Cog6ToothIcon,
  cases: BriefcaseIcon,
  services: Cog6ToothIcon,
  profile: UserCircleIcon,
}

function Navbar({ onNavigate }) {
  const handleNavigate = (key, label) => {
    onNavigate?.(key, label)
  }

  return (
    <>
      <header className="home-nav-shell sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 md:hidden">
            <p className="home-metal-title text-left text-lg font-semibold tracking-[0.04em]">
              知远择吉
            </p>
          </div>

          <div className="hidden items-center gap-10 md:flex">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#deb47a]/35 bg-[linear-gradient(145deg,#f1d59c_0%,#c58e55_45%,#844a2d_100%)] text-sm font-semibold text-[#2b0d10] shadow-lg shadow-black/25">
                吉
              </div>
              <div>
                <p className="home-metal-title text-sm font-semibold tracking-tight">
                  知远择吉
                </p>
                <p className="home-text-muted-on-dark text-xs">商业开工顾问服务</p>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              {desktopNavLinks.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavigate(item.key, item.label)}
                  className="home-text-on-dark text-sm font-medium transition hover:text-[#e1b47a]"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => handleNavigate('receive-guide', '咨询&领取')}
              className="home-button-primary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition"
            >
              咨询&领取
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('consult', '立即咨询')}
              className="home-button-secondary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition"
            >
              立即咨询
            </button>
          </div>
        </div>
      </header>

      <nav className="home-mobile-nav-shell fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto max-w-md">
          <div className="home-mobile-nav-frame grid grid-cols-5 gap-1.5 p-1.5">
            {mobileNavLinks.map((item) => {
              const Icon = mobileIcons[item.key]
              const isPrimaryEntry = item.key === 'guide'

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavigate(item.key, item.label)}
                  className={`home-mobile-nav-button home-text-on-dark flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[18px] px-1 py-2 transition ${
                    isPrimaryEntry
                      ? 'home-mobile-nav-button-active'
                      : 'hover:bg-white/8 hover:text-[#e0b37a]'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="home-mobile-nav-label text-[10px] font-medium leading-tight whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
