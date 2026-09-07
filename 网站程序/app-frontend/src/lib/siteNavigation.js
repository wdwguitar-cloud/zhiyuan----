const homePagePath = '/'
const casesPagePath = '/cases.html'
const advisorPagePath = '/advisor.html'
const annualPagePath = '/annual.html'
const partnerPagePath = '/partner.html'
const profilePagePath = '/profile.html'
const guideFormPath = '/guide-form#lead-form'
const knowledgePagePath = '/min-su-yan-jiu/'

const sectionTargets = {
  home: 'page-top',
  guide: 'guide',
  'receive-guide': 'guide',
  encyclopedia: 'encyclopedia',
  cases: 'cases',
  services: 'services',
  consult: 'contact',
}

const advisorSectionTargets = {
  consult: 'advisor-contact',
  advisor: 'advisor-top',
}

const placeholderPageTargets = {
  annual: {
    path: annualPagePath,
    homeSection: 'annual',
    pageKey: 'annual',
  },
  partner: {
    path: partnerPagePath,
    homeSection: 'partner',
    pageKey: 'partner',
  },
  profile: {
    path: profilePagePath,
    homeSection: 'profile',
    pageKey: 'profile',
  },
}

const standaloneSectionTargets = {
  'cases-page': {
    home: `${homePagePath}#page-top`,
    consult: 'cases-contact',
    self: 'cases-top',
  },
  annual: {
    home: `${homePagePath}#page-top`,
    consult: 'annual-contact',
    self: 'annual-top',
  },
  partner: {
    home: `${homePagePath}#page-top`,
    consult: 'partner-contact',
    self: 'partner-top',
  },
  profile: {
    home: `${homePagePath}#page-top`,
    consult: 'profile-contact',
    self: 'profile-top',
  },
}

function scrollToSection(id) {
  const element = document.getElementById(id)

  if (!element) {
    return false
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return true
}

function goTo(path, hash = '') {
  const nextUrl = `${path}${hash}`

  if (`${window.location.pathname}${window.location.hash}` === nextUrl) {
    return
  }

  window.location.href = nextUrl
}

export function navigateSite(key, currentPage) {
  if (key === 'consult' || key === 'receive-guide') {
    window.location.href = guideFormPath
    return
  }

  if (key === 'encyclopedia') {
    goTo(knowledgePagePath)
    return
  }

  if (currentPage === 'advisor') {
    if (key === 'advisor') {
      scrollToSection(advisorSectionTargets.advisor)
      return
    }

    if (advisorSectionTargets[key]) {
      scrollToSection(advisorSectionTargets[key])
      return
    }

    if (sectionTargets[key]) {
      goTo(homePagePath, `#${sectionTargets[key]}`)
      return
    }

    goTo(homePagePath)
    return
  }

  if (standaloneSectionTargets[currentPage]) {
    const currentTargets = standaloneSectionTargets[currentPage]

    if (key === currentPage) {
      scrollToSection(currentTargets.self)
      return
    }

    if (key === 'advisor') {
      goTo(advisorPagePath)
      return
    }

    if (key === 'cases') {
      if (currentPage === 'cases-page') {
        scrollToSection(currentTargets.self)
        return
      }
      goTo(casesPagePath)
      return
    }

    if (placeholderPageTargets[key]) {
      goTo(placeholderPageTargets[key].path)
      return
    }

    if (sectionTargets[key]) {
      goTo(homePagePath, `#${sectionTargets[key]}`)
      return
    }

    goTo(homePagePath)
    return
  }

  if (key === 'advisor') {
    goTo(advisorPagePath)
    return
  }

  if (key === 'cases') {
    goTo(casesPagePath)
    return
  }

  if (placeholderPageTargets[key]) {
    goTo(placeholderPageTargets[key].path)
    return
  }

  if (sectionTargets[key]) {
    scrollToSection(sectionTargets[key])
    return
  }

  goTo(homePagePath)
}

export function syncHashNavigation(currentPage) {
  const hash = window.location.hash.replace('#', '')

  if (!hash) {
    return
  }

  const targetMap =
    currentPage === 'advisor'
      ? advisorSectionTargets
      : standaloneSectionTargets[currentPage]
        ? {
            consult: standaloneSectionTargets[currentPage].consult,
            [currentPage]: standaloneSectionTargets[currentPage].self,
          }
        : sectionTargets
  const targetId = targetMap[hash] ?? hash

  window.setTimeout(() => {
    scrollToSection(targetId)
  }, 80)
}
