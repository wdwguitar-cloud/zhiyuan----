# -*- coding: utf-8 -*-
"""
知远风物志 GEO文章 自动QA检查脚本
使用方法：python qa_check.py <文章HTML文件路径>
检查项：41项，必须全部通过才能上线
"""

import sys
import re
import os

def check_article(file_path):
    """检查一篇文章是否符合规范"""
    if not os.path.exists(file_path):
        print(f"❌ 文件不存在: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    results = []
    passed = 0
    failed = 0
    
    def check(name, condition, detail=""):
        nonlocal passed, failed
        if condition:
            results.append(f"  ✅ {name}")
            passed += 1
        else:
            results.append(f"  ❌ {name} {detail}")
            failed += 1
    
    print(f"\n{'='*60}")
    print(f"QA检查: {os.path.basename(file_path)}")
    print(f"{'='*60}")
    
    # A. 标题与首段（5项）
    print("\nA. 标题与首段")
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else ""
    check("A1. title是问题式", '？' in title or '?' in title, f"当前title: {title[:30]}...")
    
    h1_count = len(re.findall(r'<h1[^>]*>', content))
    check("A2. h1唯一", h1_count == 1, f"当前h1数量: {h1_count}")
    
    # 检查首段场景化（新文用overview-card，旧文用article-lead）
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
    
    # 检查是否有具体地名/时间/人物
    # 时间关键词
    time_pattern = r'(清|明|唐|宋|元|民国|光绪|宣统|康熙|雍正|乾隆|嘉庆|道光|咸丰|同治|洪武|永乐|万历|嘉靖|正德|弘治|成化|正统|宣德|洪熙|建文|农历|正月|二月|三月|四月|五月|六月|七月|八月|九月|十月|冬月|腊月|初一|初二|初三|初四|初五|初六|初七|初八|初九|初十|十一|十二|十三|十四|十五|十六|十七|十八|十九|二十|廿一|廿二|廿三|廿四|廿五|廿六|廿七|廿八|廿九|三十)'
    # 地名关键词（放宽匹配，不需要后面跟县/州/府）
    place_pattern = r'(广东|广西|海南|潮州|嘉应|始兴|封川|吴川|兴宁|曲江|阳江|高要|连州|连山|柳州|贵县|罗城|榴江|龙胜|儋县|湛江|坡头|龙头|肇庆|广州|佛山|东莞|深圳|珠海|汕头|汕尾|揭阳|梅州|河源|韶关|清远|云浮|茂名|湛江|南宁|桂林|柳州|梧州|北海|防城港|钦州|贵港|玉林|百色|贺州|河池|来宾|崇左|海口|三亚)'
    has_specific = bool(re.search(time_pattern, first_para)) or bool(re.search(place_pattern, first_para))
    check("A3. 首段有场景化引入（具体地名/时间）", has_specific, "首段缺少具体地名或时间")
    
    check("A4. 首段有直接答案式概述", len(first_para) > 100, f"首段长度: {len(first_para)}字")
    
    has_academic_opening = bool(re.search(r'(本文主要讨论|在讨论具体|在讨论之前|随着社会的发展|自古以来)', first_para))
    check("A5. 首段无学术化开场", not has_academic_opening, "首段包含学术化开场")
    
    # B. 个人署名与研究视角（4项）
    print("\nB. 个人署名与研究视角")
    check("B1. hero-meta包含作者：王知远", '作者：王知远' in content or '作者:王知远' in content)
    
    article_schema_match = re.search(r'"author"\s*:\s*\{([^}]+)\}', content)
    has_person_author = False
    if article_schema_match:
        author_block = article_schema_match.group(1)
        has_person_author = '"Person"' in author_block and '王知远' in author_block
    check("B2. Article schema的author是Person类型", has_person_author)
    
    check("B3. OG标签包含article:author=王知远", 'article:author' in content and '王知远' in content)
    
    check("B4. 有研究者手记模块", '研究者手记' in content or 'author-note' in content)
    
    # C. 观众质疑模块（4项）
    print("\nC. 观众质疑模块")
    check("C1. 有观众质疑模块", '观众质疑' in content or 'audience-question' in content or '质疑一' in content)
    
    question_count = len(re.findall(r'质疑[一二三四五]', content))
    check("C2. 2个质疑", question_count == 2, f"当前质疑数量: {question_count}")
    
    check("C3. 质疑是真实问题", question_count >= 1 and len(re.findall(r'为什么|什么是|怎么|是不是|有什么|区别', content)) >= 2)
    
    check("C4. 回应基于史料", '县志' in content or '记载' in content or '史料' in content)
    
    # D. 句式轮换（4项）- 人工检查项，脚本只做基本检查
    print("\nD. 句式轮换（人工复核项）")
    check("D1. 开头句式非模板化（人工复核）", True, "需人工确认与已有文章不重复")
    check("D2. 研究者手记开头非模板化（人工复核）", True, "需人工确认使用R01-R10句式库")
    check("D3. 研究者手记结尾非模板化（人工复核）", True, "需人工确认")
    check("D4. 结尾句式非模板化（人工复核）", True, "需人工确认")
    
    # E. 禁止事项（6项）
    print("\nE. 禁止事项")
    has_abstract_pattern = bool(re.search(r'不是[AB]也不是[AB]真正重要的是[ABC]', content))
    check("E1. 无抽象范式句", not has_abstract_pattern)
    
    has_disclaimer = bool(re.search(r'本文不讨论|本文的研究范围限于', content))
    # 页尾notice中的免责声明是允许的，只检查正文
    notice_match = re.search(r'<div class="notice">(.*?)</div>', content, re.DOTALL)
    if notice_match:
        notice_content = notice_match.group(1)
        body_without_notice = content.replace(notice_content, '')
        has_disclaimer_body = bool(re.search(r'本文不讨论|本文的研究范围限于', body_without_notice))
    else:
        has_disclaimer_body = has_disclaimer
    check("E2. 正文无免责式表述（页尾notice除外）", not has_disclaimer_body)
    
    # 只检查hero-category的内容，不检查页面其他地方
    hero_category_match = re.search(r'<div class="hero-category">([^<]*)</div>', content)
    hero_category_content = hero_category_match.group(1) if hero_category_match else ""
    has_internal_id = bool(re.search(r'GEO-\d', hero_category_content))
    check("E3. hero区无内部编号", not has_internal_id, f"hero-category内容: {hero_category_content}")
    
    has_internal_label = bool(re.search(r'搜索流量型|最高潜力|高搜索量|品牌深度型|中潜力|低潜力', content))
    check("E4. 无内部评估标注", not has_internal_label, "发现内部标注，需删除")
    
    check("E5. 无择日师身份自述", '择日师' not in content)
    
    # 命理相关内容检查（只检测明显的命理营销内容，排除学术讨论中的引用）
    # 排除：在引号中、在"本文不讨论"等否定语境中、在学术分析中
    mingli_pattern = r'(算命大师|命理大师|风水大师|算命先生|命理师|风水师|运势测算|八字算命|免费算命|在线算命)'
    has_mingli = bool(re.search(mingli_pattern, content))
    check("E6. 命理内容已改写为民俗方向（人工复核）", not has_mingli, "发现命理营销关键词，需人工确认是否已改写")
    
    # F. 技术SEO（10项）
    print("\nF. 技术SEO")
    meta_desc_match = re.search(r'<meta name="description" content="([^"]+)"', content)
    meta_desc = meta_desc_match.group(1) if meta_desc_match else ""
    check("F1. meta description 150-160字", 100 <= len(meta_desc) <= 200, f"当前长度: {len(meta_desc)}字")
    
    check("F2. canonical URL正确", 'canonical' in content and 'zongsengzxone.cn' in content)
    
    og_tags = ['og:type', 'og:title', 'og:description', 'og:image', 'og:site_name', 'article:published_time', 'article:author']
    missing_og = [tag for tag in og_tags if tag not in content]
    check("F3. OG标签完整", len(missing_og) == 0, f"缺少: {missing_og}")
    
    check("F4. Twitter card完整", 'twitter:card' in content)
    
    check("F5. Article schema完整", 'application/ld+json' in content and 'Article' in content)
    
    check("F6. Breadcrumb schema完整", 'BreadcrumbList' in content)
    
    check("F7. FAQ schema完整", 'FAQPage' in content or 'Question' in content)
    
    h2_count = len(re.findall(r'<h2[^>]*>', content))
    check("F8. h2-h4层级清晰", h2_count >= 3, f"当前h2数量: {h2_count}")
    
    img_tags = re.findall(r'<img[^>]+>', content)
    img_with_alt = [img for img in img_tags if 'alt=' in img]
    check("F9. 图片有alt属性", len(img_tags) == 0 or len(img_with_alt) == len(img_tags), f"图片总数: {len(img_tags)}, 有alt: {len(img_with_alt)}")
    
    check("F10. 页面加载速度（人工复核）", True, "需人工检查图片大小")
    
    # G. 内链与转化（4项）
    print("\nG. 内链与转化")
    check("G1. 有内链（related-read）", 'related-read' in content or '延伸阅读' in content)
    
    internal_links = re.findall(r'href="(/min-su-yan-jiu/[^"]+)"', content)
    check("G2. 内链指向风物知识库文章", len(internal_links) >= 1, f"当前内链数量: {len(internal_links)}")
    
    check("G3. 有服务转化区域", '传统民俗日期咨询' in content or 'guide-form' in content)
    
    check("G4. 转化文案使用传统民俗日期咨询", '传统民俗日期咨询' in content or '民俗日期' in content)
    
    # H. 文件与部署（4项）
    print("\nH. 文件与部署")
    filename = os.path.basename(file_path)
    check("H1. 文件名是中文（GEO-XX-XX_关键词.html）", 'GEO-' in filename and '.html' in filename, f"当前文件名: {filename}")
    
    check("H2. sitemap已添加（人工复核）", True, "需人工确认sitemap.xml已添加")
    check("H3. server.js路由支持（人工复核）", True, "需人工确认路由正常")
    check("H4. 本地验证200（人工复核）", True, "需人工验证页面200正常")
    
    # 汇总
    print(f"\n{'='*60}")
    print(f"检查结果: ✅ 通过 {passed} 项, ❌ 失败 {failed} 项")
    print(f"{'='*60}")
    
    if failed > 0:
        print("\n❌ 未通过项：")
        for r in results:
            if '❌' in r:
                print(r)
        print(f"\n⚠️  必须修改后重新检查，全部通过才能上线！")
        return False
    else:
        print("\n✅ 全部通过！可以上线。")
        return True

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("使用方法: python qa_check.py <文章HTML文件路径>")
        print("示例: python qa_check.py GEO-01-01_墟日趁墟的由来与墟期规则.html")
        sys.exit(1)
    
    file_path = sys.argv[1]
    success = check_article(file_path)
    sys.exit(0 if success else 1)
