# -*- coding: utf-8 -*-
"""
全面重审29篇文章，检查所有我们讨论过的关键项
"""
import os
import re

base_dir = r'F:\择日择吉项目\上线版\网站程序\frontend\min-su-yan-jiu'
files = sorted([f for f in os.listdir(base_dir) if f.startswith('GEO-') and f.endswith('.html')])

print(f"=== 全面重审 {len(files)} 篇文章 ===\n")

# 定义所有检查项
checks = {
    # 🔴 严重项（直接影响GEO/SEO）
    'A1_问题式标题': {'pattern': r'<title>[^<]*[？?]', 'weight': '严重'},
    'A2_场景化首段_有具体地名时间人物': {'pattern': r'(光绪|嘉庆|乾隆|道光|咸丰|同治|宣统|康熙|雍正|高要|兴宁|曲江|吴川|贵县|封川|灵川|始兴|遂溪|嘉应|儋州|百色|柳州|榴江|雒容|罗城|连山|龙胜|雷州|八排瑶)', 'weight': '严重'},
    'A3_作者王知远': {'pattern': r'作者：王知远', 'weight': '严重'},
    'A4_Article_schema_Person': {'pattern': r'"@type":\s*"Person"', 'weight': '严重'},
    'A5_研究者手记': {'pattern': r'研究者手记', 'weight': '严重'},
    'A6_观众质疑模块': {'pattern': r'观众质疑|audience-question', 'weight': '严重'},
    'A7_内链related_read': {'pattern': r'related-read', 'weight': '严重'},
    'A8_cta转化区域': {'pattern': r'cta-section|传统民俗日期咨询', 'weight': '严重'},
    'A9_中文文件名': {'pattern': None, 'weight': '严重'},  # 特殊检查
    'A10_FAQ_schema': {'pattern': r'"@type":\s*"FAQPage"', 'weight': '严重'},
    
    # 🟡 中等项（影响质量）
    'B1_meta_description_150_160': {'pattern': None, 'weight': '中等'},  # 特殊检查
    'B2_OG标签完整': {'pattern': r'og:image.*og:site_name|og:site_name.*og:image', 'weight': '中等'},
    'B3_Twitter_card': {'pattern': r'twitter:card', 'weight': '中等'},
    'B4_canonical正确域名': {'pattern': r'https://zongsengzxone\.cn/', 'weight': '中等'},
    'B5_无www前缀': {'pattern': r'https://www\.zongsengzxone', 'weight': '中等', 'invert': True},  # 不应该有www
    'B6_title分隔符统一': {'pattern': r'｜知远风物志', 'weight': '中等'},
    'B7_阅读时长': {'pattern': r'约\d+分钟阅读|阅读时长', 'weight': '中等'},
    
    # 🔵 内容质量项（人工抽查重点）
    'C1_无择日师身份自述': {'pattern': r'择日师', 'weight': '内容', 'invert': True},  # 不应该有
    'C2_无内部标注_搜索流量型': {'pattern': r'搜索流量型|最高潜力|高潜力|中潜力', 'weight': '内容', 'invert': True},
    'C3_无内部编号展示_GEO01': {'pattern': None, 'weight': '内容', 'invert': True},
    'C4_首段无学术化开场': {'pattern': None, 'weight': '内容', 'invert': True},
    'C5_有地方志引用': {'pattern': r'县志|府志|州志|厅志|志卷|风土记|风土志|舆地志|地理志', 'weight': '内容'},
    'C6_有第一人称观点': {'pattern': r'我[^，。；]{0,10}(发现|注意|认为|觉得|整理|梳理|停了|被|选择|倾向|理解)|值得(注意|关注|深思|玩味)', 'weight': '内容'},
    'C7_有深度分析': {'pattern': None, 'weight': '内容'},
}

# 执行检查
results = {}
for filename in files:
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    article_results = {}
    for check_name, check_info in checks.items():
        if check_info['pattern'] is None:
            # 特殊检查
            if check_name == 'A9_中文文件名':
                passed = bool(re.search(r'[\u4e00-\u9fa5]', filename))
            elif check_name == 'B1_meta_description_150_160':
                meta_match = re.search(r'<meta name="description" content="([^"]*)"', content)
                if meta_match:
                    meta_text = meta_match.group(1).replace('&quot;', '"').replace('&amp;', '&')
                    passed = 150 <= len(meta_text) <= 165
                else:
                    passed = False
            elif check_name == 'C3_无内部编号展示_GEO01':
                # 只检查hero-category的内容中是否有GEO-XX
                cat_match = re.search(r'<div class="hero-category">([^<]+)</div>|<span class="hero-category">([^<]+)</span>|<span class="article-kicker">([^<]+)</span>', content)
                if cat_match:
                    cat_text = cat_match.group(1) or cat_match.group(2) or cat_match.group(3) or ''
                    passed = not bool(re.search(r'GEO-\d+', cat_text))
                else:
                    passed = True  # 没有hero-category就不会展示内部编号
            elif check_name == 'C4_首段无学术化开场':
                # 只检查首段（article-lead或正文第一段）
                lead_match = re.search(r'<p class="article-lead">([^<]+)</p>', content)
                if not lead_match:
                    # 尝试找正文第一段（main内的第一个p）
                    main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL)
                    if main_match:
                        p_match = re.search(r'<p[^>]*>([^<]+)</p>', main_match.group(1))
                        if p_match:
                            lead_text = p_match.group(1)
                        else:
                            lead_text = ''
                    else:
                        lead_text = ''
                else:
                    lead_text = lead_match.group(1)
                academic_pattern = r'本文主要讨论|在讨论具体|在讨论之前|随着社会的发展|自古以来'
                passed = not bool(re.search(academic_pattern, lead_text))
            elif check_name == 'C7_有深度分析':
                # 使用更宽泛的正则匹配深度分析表达
                depth_patterns = [
                    r'反映了|体现了|揭示了|说明了|象征着|意味着',
                    r'其(根本|核心|深层|本质)(原因|逻辑|动因|意义|层面|所在)',
                    r'不是[^。]{0,80}而是',
                    r'从(社会史|文化史|制度史|经济史|人类学|民俗学|历史学)(角度|视角|层面|看)',
                    r'形成了[^，。]{0,50}(机制|体系|制度|生态|网络|秩序)',
                    r'核心(在于|是|逻辑)|深层(原因|逻辑|动因)|本质(上|是|上是)',
                    r'说到底|归根结底|本质上|实际上|事实上',
                    r'这(背后|背后的)(逻辑|原因|动因|机制)',
                    r'可以(理解|解读|看作|视为)为',
                    r'与其说.*不如说',
                ]
                depth_count = 0
                for p in depth_patterns:
                    depth_count += len(re.findall(p, content))
                passed = depth_count >= 3  # 至少3处深度分析才算通过
            else:
                passed = False
        else:
            match = bool(re.search(check_info['pattern'], content, re.DOTALL))
            if check_info.get('invert'):
                passed = not match
            else:
                passed = match
        
        article_results[check_name] = passed
    
    results[filename] = article_results

# 统计每项通过率
print("=== 各项检查通过率 ===\n")
print(f"{'检查项':<35} {'权重':<6} {'通过数':<8} {'通过率':<8} {'状态'}")
print("-" * 80)

for check_name, check_info in checks.items():
    passed_count = sum(1 for r in results.values() if r[check_name])
    total = len(files)
    percent = passed_count / total * 100
    status = '✅' if percent == 100 else '⚠️' if percent >= 80 else '❌'
    print(f"{check_name:<35} {check_info['weight']:<6} {passed_count}/{total:<5} {percent:.0f}%{'':<3} {status}")

# 列出未通过的文章
print("\n\n=== 未通过项详情（仅列出通过率<100%的项）===\n")
for check_name, check_info in checks.items():
    passed_count = sum(1 for r in results.values() if r[check_name])
    if passed_count < len(files):
        failed_articles = [f for f, r in results.items() if not r[check_name]]
        print(f"\n❌ {check_name}（{check_info['weight']}）- {len(failed_articles)}篇未通过:")
        for f in failed_articles:
            # 提取简短标题
            short_name = f.replace('.html', '')[:40]
            print(f"   - {short_name}")

# 总结
print("\n\n=== 总结 ===")
total_checks = len(checks)
full_pass_articles = sum(1 for r in results.values() if all(r.values()))
print(f"总检查项: {total_checks}")
print(f"全部通过的文章: {full_pass_articles}/{len(files)}")
print(f"部分未通过的文章: {len(files) - full_pass_articles}/{len(files)}")
