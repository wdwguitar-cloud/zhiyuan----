# -*- coding: utf-8 -*-
"""
批量QA检查脚本
检查min-su-yan-jiu目录下所有GEO文章
"""
import os
import re
import sys

def check_article_batch(file_path):
    """批量检查一篇文章，返回通过/失败和问题列表"""
    if not os.path.exists(file_path):
        return False, ["文件不存在"]
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    
    # A. 标题与首段
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else ""
    if '？' not in title and '?' not in title:
        issues.append("A1.title非问题式")
    
    h1_count = len(re.findall(r'<h1[^>]*>', content))
    if h1_count != 1:
        issues.append(f"A2.h1数量={h1_count}")
    
    # 首段
    has_overview = 'overview-card' in content
    has_article_lead = 'article-lead' in content
    first_para = ""
    if has_overview:
        overview_match = re.search(r'<div class="overview-card">(.*?)</div>', content, re.DOTALL)
        if overview_match:
            first_para = overview_match.group(1)
    elif has_article_lead:
        lead_match = re.search(r'<p class="article-lead">(.*?)</p>', content, re.DOTALL)
        if lead_match:
            first_para = lead_match.group(1)
    
    time_pattern = r'(清|明|唐|宋|元|民国|光绪|宣统|康熙|雍正|乾隆|嘉庆|道光|咸丰|同治|洪武|永乐|万历|嘉靖|正德|弘治|成化|正统|宣德|洪熙|建文|农历|正月|二月|三月|四月|五月|六月|七月|八月|九月|十月|冬月|腊月|初一|初二|初三|初四|初五|初六|初七|初八|初九|初十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十|廿一|廿二|廿三|廿四|廿五|廿六|廿七|廿八|廿九|三十)'
    place_pattern = r'(广东|广西|海南|潮州|嘉应|始兴|封川|吴川|兴宁|曲江|阳江|高要|连州|连山|柳州|贵县|罗城|榴江|龙胜|儋县|湛江|坡头|龙头|肇庆|广州|佛山|东莞|深圳|珠海|汕头|汕尾|揭阳|梅州|河源|韶关|清远|云浮|茂名|南宁|桂林|梧州|北海|防城港|钦州|贵港|玉林|百色|贺州|河池|来宾|崇左|海口|三亚)'
    if not (re.search(time_pattern, first_para) or re.search(place_pattern, first_para)):
        issues.append("A3.首段缺场景化")
    
    if len(first_para) < 100:
        issues.append(f"A4.首段过短({len(first_para)}字)")
    
    if re.search(r'(本文主要讨论|在讨论具体|在讨论之前|随着社会的发展|自古以来)', first_para):
        issues.append("A5.首段学术化开场")
    
    # B. 个人署名
    if '作者：王知远' not in content and '作者:王知远' not in content:
        issues.append("B1.缺作者署名")
    
    article_schema_match = re.search(r'"author"\s*:\s*\{([^}]+)\}', content)
    has_person_author = False
    if article_schema_match:
        author_block = article_schema_match.group(1)
        has_person_author = '"Person"' in author_block and '王知远' in author_block
    if not has_person_author:
        issues.append("B2.Article schema非Person类型")
    
    if 'article:author' not in content:
        issues.append("B3.缺OG article:author")
    
    if '研究者手记' not in content and 'author-note' not in content:
        issues.append("B4.缺研究者手记")
    
    # C. 观众质疑
    if '观众质疑' not in content and 'audience-question' not in content and '质疑一' not in content:
        issues.append("C1.缺观众质疑模块")
    
    question_count = len(re.findall(r'质疑[一二三四五]', content))
    if question_count != 2:
        issues.append(f"C2.质疑数量={question_count}")
    
    # E. 禁止事项
    if re.search(r'不是[AB]也不是[AB]真正重要的是[ABC]', content):
        issues.append("E1.抽象范式句")
    
    notice_match = re.search(r'<div class="notice">(.*?)</div>', content, re.DOTALL)
    if notice_match:
        notice_content = notice_match.group(1)
        body_without_notice = content.replace(notice_content, '')
    else:
        body_without_notice = content
    if re.search(r'本文不讨论|本文的研究范围限于', body_without_notice):
        issues.append("E2.正文免责式表述")
    
    hero_category_match = re.search(r'<div class="hero-category">([^<]*)</div>', content)
    hero_category_content = hero_category_match.group(1) if hero_category_match else ""
    if re.search(r'GEO-\d', hero_category_content):
        issues.append(f"E3.hero区内部编号: {hero_category_content}")
    
    if re.search(r'搜索流量型|最高潜力|高搜索量|品牌深度型|中潜力|低潜力', content):
        issues.append("E4.内部评估标注")
    
    if '择日师' in content:
        issues.append("E5.择日师身份自述")
    
    mingli_pattern = r'(算命大师|命理大师|风水大师|算命先生|命理师|风水师|运势测算|八字算命|免费算命|在线算命)'
    if re.search(mingli_pattern, content):
        issues.append("E6.命理营销内容")
    
    # F. 技术SEO
    meta_desc_match = re.search(r'<meta name="description" content="([^"]+)"', content)
    meta_desc = meta_desc_match.group(1) if meta_desc_match else ""
    # 将转义字符还原后计算实际长度
    meta_desc_actual = meta_desc.replace('&quot;', '"').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    if len(meta_desc_actual) < 150 or len(meta_desc_actual) > 165:
        issues.append(f"F1.meta description长度={len(meta_desc_actual)}")
    
    if 'canonical' not in content or 'zongsengzxone.cn' not in content:
        issues.append("F2.canonical URL错误")
    
    og_tags = ['og:type', 'og:title', 'og:description', 'og:image', 'og:site_name', 'article:published_time', 'article:author']
    missing_og = [tag for tag in og_tags if tag not in content]
    if missing_og:
        issues.append(f"F3.缺OG标签: {missing_og}")
    
    if 'twitter:card' not in content:
        issues.append("F4.缺Twitter card")
    
    if 'application/ld+json' not in content or 'Article' not in content:
        issues.append("F5.缺Article schema")
    
    if 'BreadcrumbList' not in content:
        issues.append("F6.缺Breadcrumb schema")
    
    if 'FAQPage' not in content and 'Question' not in content:
        issues.append("F7.缺FAQ schema")
    
    h2_count = len(re.findall(r'<h2[^>]*>', content))
    if h2_count < 3:
        issues.append(f"F8.h2数量={h2_count}")
    
    # G. 内链与转化
    if 'related-read' not in content and '延伸阅读' not in content:
        issues.append("G1.缺内链")
    
    internal_links = re.findall(r'href="(/min-su-yan-jiu/[^"]+)"', content)
    if len(internal_links) < 1:
        issues.append("G2.内链不足")
    
    if '传统民俗日期咨询' not in content and 'guide-form' not in content:
        issues.append("G3.缺转化区域")
    
    return len(issues) == 0, issues

def main():
    base_dir = r'F:\择日择吉项目\上线版\网站程序\frontend\min-su-yan-jiu'
    
    # 找出所有GEO文章HTML文件
    article_files = []
    for f in os.listdir(base_dir):
        if f.startswith('GEO-') and f.endswith('.html'):
            article_files.append(os.path.join(base_dir, f))
    
    article_files.sort()
    print(f"共找到 {len(article_files)} 篇GEO文章")
    print("="*80)
    
    passed_count = 0
    failed_count = 0
    all_issues = {}
    
    for file_path in article_files:
        filename = os.path.basename(file_path)
        passed, issues = check_article_batch(file_path)
        
        if passed:
            passed_count += 1
            print(f"✅ {filename}")
        else:
            failed_count += 1
            all_issues[filename] = issues
            print(f"❌ {filename} ({len(issues)}个问题)")
            for issue in issues:
                print(f"   - {issue}")
    
    print("="*80)
    print(f"\n汇总：✅ 通过 {passed_count} 篇, ❌ 失败 {failed_count} 篇")
    
    if failed_count > 0:
        print(f"\n需要修复的问题统计：")
        issue_stats = {}
        for filename, issues in all_issues.items():
            for issue in issues:
                # 提取问题类型（如"A1."、"B2."等）
                issue_type = issue.split('.')[0] if '.' in issue else issue
                issue_stats[issue_type] = issue_stats.get(issue_type, 0) + 1
        
        for issue_type, count in sorted(issue_stats.items()):
            print(f"  {issue_type}: {count}篇")

if __name__ == '__main__':
    main()
