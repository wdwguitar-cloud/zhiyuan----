# 广东商业开工顾问网站 V4

## V4 新增内容
- about.html：老师介绍 / 服务理念 / 交付标准 / 方案样例
- faq.html：独立常见问题页
- privacy.html：服务边界与隐私说明页
- backend-guide.html：表单接入说明页
- admin.html：本机线索管理页，可导出 CSV
- config.js：表单接口配置文件
- script.js：升级为可配置后台提交 + 本地备份 + 咨询话术复制

## 原有页面
- index.html：首页落地页
- factory.html：厂房开工独立页
- store.html：门店开业独立页
- office.html：办公室装修独立页
- cases.html：案例中心
- thanks.html：感谢页

## 使用方式
1. 解压压缩包。
2. 双击 index.html 查看首页。
3. 双击 admin.html 可以看本机线索记录。
4. 修改 config.js 中的 FORM_ENDPOINT 即可接入自己的表单后台。
5. 替换底部二维码、主体信息、联系方式和备案信息。

## 注意
当前仍是静态站，适合测试、展示、搭建初版业务闭环。正式商用建议接入飞书、企业微信、金数据、Supabase 或自建后端。
