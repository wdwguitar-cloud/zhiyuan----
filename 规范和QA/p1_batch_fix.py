# -*- coding: utf-8 -*-
"""
P1批量修复：
1. title分隔符统一（半角 | → 全角 ｜）
2. GEO-06旧文添加阅读时长
3. GEO-06旧文添加cta转化区域
"""
import os
import re

base_dir = r'F:\择日择吉项目\上线版\网站程序\frontend\min-su-yan-jiu'

# ========== 修复1：title分隔符统一 ==========
print("=== 修复1：title分隔符统一 ===")
files = sorted([f for f in os.listdir(base_dir) if f.startswith('GEO-') and f.endswith('.html')])
fixed_count = 0
for filename in files:
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替换半角竖线+空格为全角竖线
    new_content = content.replace(' | 知远风物志', '｜知远风物志')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        fixed_count += 1
        print(f"  ✅ {filename}")

print(f"  共修复 {fixed_count} 篇\n")

# ========== 修复2：GEO-06旧文添加阅读时长 ==========
print("=== 修复2：GEO-06旧文添加阅读时长 ===")
geo06_files = sorted([f for f in os.listdir(base_dir) if f.startswith('GEO-06-') and f.endswith('.html')])

# 为每篇文章估算阅读时长（基于正文字数）
def estimate_read_time(content):
    # 提取正文文本（去掉HTML标签）
    body_match = re.search(r'(<main.*?</main>)', content, re.DOTALL)
    if body_match:
        text = re.sub(r'<[^>]+>', '', body_match.group(1))
        text = re.sub(r'\s+', '', text)
        char_count = len(text)
        # 按每分钟500字计算
        minutes = max(5, round(char_count / 500))
        return minutes
    return 10

fixed_count = 0
for filename in geo06_files:
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有阅读时长
    if '约' in content and '分钟阅读' in content:
        print(f"  ⏭️ {filename} 已有阅读时长，跳过")
        continue
    
    read_time = estimate_read_time(content)
    
    # 在article-kicker后面添加阅读时长信息
    # GEO-06旧文结构：<span class="article-kicker">...</span>
    # 在kicker后面、h1前面添加阅读时长
    kicker_pattern = r'(<span class="article-kicker">[^<]+</span>\s*)'
    replacement = rf'\1<span class="article-kicker" style="margin-left:12px;color:#8B7355;">约{read_time}分钟阅读</span>\n        '
    
    new_content = re.sub(kicker_pattern, replacement, content, count=1)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        fixed_count += 1
        print(f"  ✅ {filename}（约{read_time}分钟阅读）")
    else:
        print(f"  ⚠️ {filename} 未找到article-kicker，跳过")

print(f"  共修复 {fixed_count} 篇\n")

# ========== 修复3：GEO-06旧文添加cta转化区域 ==========
print("=== 修复3：GEO-06旧文添加cta转化区域 ===")

cta_template = '''
<div class="cta-section" style="margin:40px 0;padding:28px;background:linear-gradient(135deg,#faf6f0 0%,#f5ede0 100%);border-radius:12px;border-left:4px solid #5A3A1F;">
  <h3 style="margin:0 0 12px;color:#5A3A1F;font-size:1.2em;">传统民俗日期咨询</h3>
  <p style="margin:0 0 16px;color:#6B5B4E;line-height:1.7;">本文梳理的民俗日期制度，源于岭南地方志的历史记录。如需结合具体事项（婚嫁、动土、开市、安葬等）咨询传统民俗日期的安排原则，可联系知远风物志研究团队。我们基于地方志与民俗学文献，提供传统日期制度的研究性咨询，不涉及封建迷信内容。</p>
  <a href="/guide-form#lead-form" style="display:inline-block;padding:10px 24px;background:#5A3A1F;color:#fff;text-decoration:none;border-radius:6px;font-size:0.95em;">了解咨询方式</a>
</div>
'''

fixed_count = 0
for filename in geo06_files:
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有cta区域
    if 'cta-section' in content or '传统民俗日期咨询' in content:
        print(f"  ⏭️ {filename} 已有cta区域，跳过")
        continue
    
    # 在参考资料之前插入cta区域
    ref_pattern = r'(<h2[^>]*>参考资料</h2>)'
    if re.search(ref_pattern, content):
        new_content = re.sub(ref_pattern, cta_template + r'\n\n\1', content, count=1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        fixed_count += 1
        print(f"  ✅ {filename}")
    else:
        print(f"  ⚠️ {filename} 未找到参考资料标题，跳过")

print(f"  共修复 {fixed_count} 篇\n")

print("=== P1批量修复完成 ===")
