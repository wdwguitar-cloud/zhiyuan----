# 广东商业开工顾问网站 V13 - 工具化引流与产品矩阵

## 广东商业开工顾问网站 V10 - 交付运营系统

- 后台显示客户留言 / 补充说明
- 后台支持跟进状态
- 后台支持跟进备注
- 后台支持客户标签
- 后台支持成交金额
- 后台支持下次回访时间
- 后端新增 PATCH /api/leads/:id
- CSV 导出包含完整运营字段
- 首页、场景页、案例页、老师介绍页、FAQ 继续保留

## 启动方式

Windows 双击：

start-windows.bat

或者手动：

cd backend
npm install
npm start

打开：

http://localhost:8787

后台：

http://localhost:8787/admin.html

## 数据保存位置

backend/data/leads.json
backend/data/leads.csv

## 后台状态建议

- 新线索
- 已加微信
- 已报价
- 已成交
- 已流失
- 待回访

## 新手说明

请查看：

V6运营后台说明.md

## 下一步可升级 V7

- 登录密码
- 多账号权限
- 飞书 / 企业微信自动提醒
- 微信话术库
- 自动回访提醒
- 客户详情页
- 成交统计图表


# V7 内容资产强化版新增

## 新增重点

- 资料中心 guide-center.html
- 交付样张 deliverables.html
- 厂房样板案例详情 case-factory-detail.html
- 门店样板案例详情 case-store-detail.html
- 办公室样板案例详情 case-office-detail.html
- 4 份开工流程指引 HTML + PDF
- 3 张专业样板案例图
- 3 张交付样张图
- V7 内容资产说明.md

## 使用建议

V7 的重点不是再加技术，而是补齐成交前的信任资产。  
客户看到案例、资料、交付样张后，更容易理解你不是“随口看日子”，而是在做商业开工流程咨询。


# V8 案例上图与流程标准版新增

## 新增页面

- case-upload-guide.html：真实案例拍摄与上图指南
- process-standard.html：商业开工流程标准 - 民俗顾问版

## 新增图像

- v8-case-layout-map.svg
- v8-photo-shotlist.svg
- v8-replacement-map.svg
- v8-process-boundary.svg

## 新增资料

- 真实案例拍摄与上图替换清单
- 商业开工流程标准操作手册 - 民俗顾问版
- 真实案例记录表模板

## 核心原则

你负责民俗日期与流程协调，不替代工程施工、安全管理、物业审批或法律责任。  
真实案例上架时要匿名、打码、不夸大效果、不伪造反馈。


# V9 微信话术与成交跟进版新增

## 完整继承

V9 完整继承 V8，不删除 V6/V7/V8 的任何功能。

## 新增

- scripts-library.html：微信话术库
- 后台每条线索一键复制话术
- 首次回复、补资料、199、999、2980、嫌贵、犹豫、成交后、流失回访话术
- V9微信话术与成交跟进说明.md

## 启动

双击 start-windows.bat

访问：

http://localhost:8787
http://localhost:8787/admin.html
http://localhost:8787/scripts-library.html


# V10 交付运营系统新增

## 完整继承

V10 完整继承 V9，不删除 V6/V7/V8/V9 的功能。

## 新增页面

- pricing.html
- delivery-templates.html
- service-agreement.html
- client-intake.html

## 新增交付模板

- 199 资料初审报告模板
- 999 日期与时辰建议单模板
- 2980 完整开工流程方案模板
- 上门服务记录表模板
- 成交后客户资料收集表模板
- 服务协议与退款说明模板

## 重点访问

http://localhost:8787/pricing.html
http://localhost:8787/delivery-templates.html
http://localhost:8787/service-agreement.html
http://localhost:8787/client-intake.html
http://localhost:8787/admin.html


# V11 正式上线与扩流系统新增

## 完整继承

V11 完整继承 V10，不删除 V6/V7/V8/V9/V10 功能。

## 新增页面

- growth-hub.html
- city-pages.html
- partner.html
- download-center.html
- launch-checklist.html
- admin-login.html
- 40 个城市 x 场景 SEO 页面

## 新增安全

- 后台密钥本机保存
- 正式上线 ADMIN_TOKEN 建议
- 表单防刷
- 蜜罐字段
- 无效线索状态

## 新增追踪

- utm_source / utm_campaign / channel
- landingPage / pageViewPath
- CSV 导出来源字段

## 重点访问

http://localhost:8787/growth-hub.html
http://localhost:8787/city-pages.html
http://localhost:8787/partner.html
http://localhost:8787/download-center.html
http://localhost:8787/launch-checklist.html
http://localhost:8787/admin-login.html


# V12 流量增长引擎新增

## 完整继承

V12 完整继承 V11，不删除 V6/V7/V8/V9/V10/V11 功能。

## 新增页面

- traffic-hub.html
- keyword-map.html
- content-calendar.html
- social-content-library.html
- channel-link-builder.html
- ai-answer-hub.html
- 8 个问题型长尾回答页

## 新增资料

- traffic-growth-checklist.pdf
- 30-day-content-calendar.pdf
- social-video-script-library.pdf
- keyword-map.csv

## 重点访问

http://localhost:8787/traffic-hub.html
http://localhost:8787/keyword-map.html
http://localhost:8787/content-calendar.html
http://localhost:8787/social-content-library.html
http://localhost:8787/channel-link-builder.html
http://localhost:8787/ai-answer-hub.html


# V13 工具化引流与产品矩阵新增

## 完整继承

V13 完整继承 V12，不删除 V6/V7/V8/V9/V10/V11/V12 功能。

## 新增页面

- self-check.html
- interactive-checklists.html
- product-matrix.html
- annual-consultant.html
- partner-exclusive.html
- lead-segments.html

## 新增资料

- self-check-tool-guide.pdf
- interactive-checklist-guide.pdf
- product-matrix-guide.pdf

## 重点访问

http://localhost:8787/self-check.html
http://localhost:8787/interactive-checklists.html
http://localhost:8787/product-matrix.html
http://localhost:8787/annual-consultant.html
http://localhost:8787/partner-exclusive.html
http://localhost:8787/lead-segments.html
