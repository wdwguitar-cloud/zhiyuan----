import { useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import WhySection from './components/WhySection'
import DecisionSection from './components/DecisionSection'
import ServiceSection from './components/ServiceSection'
import FeatureEntrySection from './components/FeatureEntrySection'
import KnowledgeSection from './components/KnowledgeSection'
import CasesSection from './components/CasesSection'
import LeadCaptureSection from './components/LeadCaptureSection'
import Footer from './components/Footer'
import { useContentHub } from './hooks/useContentHub'
import { navigateSite, syncHashNavigation } from './lib/siteNavigation'

function App() {
  const { content, loading, error } = useContentHub()
  const handleNavigate = (key) => navigateSite(key, 'home')

  useEffect(() => {
    syncHashNavigation('home')
  }, [])

  return (
    <div id="page-top" className="home-page home-page-shell pb-28 md:pb-0">
      <Navbar onNavigate={handleNavigate} />
      {error ? (
        <div className="border-b border-amber-300/20 bg-amber-100/10 px-4 py-3 text-sm text-amber-100">
          内容库暂时未连接成功：{error}
        </div>
      ) : null}
      <HeroSection
        content={content}
        loading={loading}
        onPrimaryAction={() => handleNavigate('receive-guide')}
        onSecondaryAction={() => handleNavigate('consult')}
        onKnowledgeAction={() => handleNavigate('encyclopedia')}
      />
      <WhySection />
      <DecisionSection />
      <div id="services" className="scroll-mt-24">
        <ServiceSection content={content} onConsult={() => handleNavigate('consult')} />
      </div>
      <FeatureEntrySection onNavigate={handleNavigate} />
      <div id="encyclopedia" className="scroll-mt-24">
        <KnowledgeSection />
      </div>
      <div id="cases" className="scroll-mt-24">
        <CasesSection content={content} />
      </div>
      <div id="guide" className="scroll-mt-24">
        <div id="contact" className="scroll-mt-24">
          <LeadCaptureSection content={content} />
        </div>
      </div>
      <Footer content={content} onNavigate={handleNavigate} />
    </div>
  )
}

export default App
