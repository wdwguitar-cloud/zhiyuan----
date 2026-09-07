import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PlaceholderLandingPage from './pages/PlaceholderLandingPage.jsx'

const pageConfig = {
  pageKey: 'partner',
  pageTitle: '合作加盟',
  badge: '吉事将启',
  heroTitle: '合作加盟板块即将开放',
  heroSubtitle:
    '面向渠道合作、城市联动与项目协同的合作加盟页面正在整理中。',
  intro:
    '这里后续会承接合作方式说明、适配人群、合作流程、支持内容与提交入口。',
  featureTitle: '后续将开放的页面内容',
  featureItems: [
    '合作模式说明与适配对象介绍',
    '合作流程、支持内容与权益说明',
    '品牌物料、培训说明与协作边界',
    '加盟咨询入口与资料提交组件',
  ],
  slotTitle: '已预留的内容与素材位置',
  slotItems: [
    '合作说明文案与流程图位置',
    '招商资料 PDF 与政策说明入口',
    '合作案例、城市样板与成果展示',
    '表单提交、联系方式与后续跟进区块',
  ],
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaceholderLandingPage config={pageConfig} />
  </StrictMode>,
)
