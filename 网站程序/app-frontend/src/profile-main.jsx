import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PlaceholderLandingPage from './pages/PlaceholderLandingPage.jsx'

const pageConfig = {
  pageKey: 'profile',
  pageTitle: '我的',
  badge: '吉事将启',
  heroTitle: '个人中心即将开放',
  heroSubtitle:
    '面向会员资料、领取记录、咨询进度与后续服务入口的个人中心正在规划中。',
  intro:
    '这里以后会承接用户登录后的个人资料、资料领取记录、咨询订单与后续通知内容。',
  featureTitle: '后续将开放的页面内容',
  featureItems: [
    '会员登录后的个人资料与身份信息',
    'PDF 领取记录与历史咨询进度查看',
    '服务订单、通知消息与后续回访入口',
    '个人专属资料、下载与账号设置页面',
  ],
  slotTitle: '已预留的内容与素材位置',
  slotItems: [
    '会员欢迎文案与个人中心首页模块',
    '领取资料清单、下载按钮与状态提示',
    '咨询记录、订单进度与跟进说明位置',
    '账号设置、客服入口与后续功能卡片',
  ],
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaceholderLandingPage config={pageConfig} />
  </StrictMode>,
)
