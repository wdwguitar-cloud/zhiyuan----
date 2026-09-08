/**
 * 文章管理核心模块
 * 功能：Markdown → HTML 自动排版、文章元数据管理、文件读写
 */

const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = path.join(__dirname, "..", "frontend", "min-su-yan-jiu");
const ARTICLES_INDEX_FILE = path.join(__dirname, "data", "articles.json");

const CATEGORY_MAP = {
  "01": { category: "择吉习俗", label: "择吉习俗" },
  "02": { category: "起名文化", label: "起名文化" },
  "03": { category: "岁时信仰", label: "岁时信仰" },
  "04": { category: "族群地域", label: "族群地域" },
  "05": { category: "社会历史", label: "社会历史" },
  "06": { category: "旧文改造", label: "旧文改造" },
  "07": { category: "新创作", label: "新创作" }
};

const CATEGORY_ORDER = ["择吉习俗", "起名文化", "岁时信仰", "族群地域", "社会历史", "旧文改造", "新创作"];

function ensureDirs() {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(ARTICLES_INDEX_FILE), { recursive: true });
}

function readIndex() {
  if (!fs.existsSync(ARTICLES_INDEX_FILE)) return { articles: [] };
  try {
    return JSON.parse(fs.readFileSync(ARTICLES_INDEX_FILE, "utf8"));
  } catch (e) {
    return { articles: [] };
  }
}

function writeIndex(data) {
  fs.writeFileSync(ARTICLES_INDEX_FILE, JSON.stringify(data, null, 2), "utf8");
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "article";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineFormat(text) {
  let t = escapeHtml(text);
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  t = t.replace(/`(.+?)`/g, "<code>$1</code>");
  t = t.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return t;
}

/**
 * 解析 Markdown 为结构化内容
 * 返回 { title, lead, bodyHtml, faqList, sources, scopeNotice, disclaimer }
 */
function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  let title = "";
  let lead = "";
  let bodyHtml = "";
  let faqList = [];
  let sources = [];
  let scopeNotice = "";
  let disclaimer = "";

  let mode = "body"; // body | faq | sources | notice
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listType = "";
  let listItems = [];
  let paraBuffer = [];

  function flushParagraph() {
    if (paraBuffer.length > 0) {
      const text = paraBuffer.join("").trim();
      if (text) {
        if (mode === "faq") {
          bodyHtml += `<p>${inlineFormat(text)}</p>\n`;
        } else if (mode === "notice") {
          if (text.startsWith("*研究范围声明") || text.startsWith("研究范围声明")) {
            scopeNotice = text.replace(/^\*?研究范围声明[：:]?\s*/, "").replace(/\*$/, "");
          } else if (text.startsWith("*免责声明") || text.startsWith("免责声明")) {
            disclaimer = text.replace(/^\*?免责声明[：:]?\s*/, "").replace(/\*$/, "");
          }
        } else {
          bodyHtml += `<p>${inlineFormat(text)}</p>\n`;
        }
      }
      paraBuffer = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      const tag = listType === "ol" ? "ol" : "ul";
      const cls = mode === "sources" ? ' class="source-list"' : "";
      bodyHtml += `<${tag}${cls}>\n${listItems.map(i => `  <li>${inlineFormat(i)}</li>`).join("\n")}\n</${tag}>\n`;
      listItems = [];
      inList = false;
      listType = "";
    }
  }

  function flushTable() {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const body = tableRows.slice(2); // skip separator
      bodyHtml += "<table>\n<thead><tr>";
      header.forEach(h => { bodyHtml += `<th>${inlineFormat(h.trim())}</th>`; });
      bodyHtml += "</tr></thead>\n<tbody>\n";
      body.forEach(row => {
        bodyHtml += "<tr>";
        row.forEach(c => { bodyHtml += `<td>${inlineFormat(c.trim())}</td>`; });
        bodyHtml += "</tr>\n";
      });
      bodyHtml += "</tbody>\n</table>\n";
      tableRows = [];
      inTable = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 标题
    if (trimmed.startsWith("# ")) {
      flushParagraph(); flushList(); flushTable();
      title = trimmed.slice(2).trim();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph(); flushList(); flushTable();
      const heading = trimmed.slice(3).trim();
      if (heading === "常见问题") {
        mode = "faq";
        bodyHtml += `<h2>常见问题</h2>\n`;
      } else if (heading === "参考资料") {
        mode = "sources";
        bodyHtml += `<h2>参考资料</h2>\n`;
      } else {
        mode = "body";
        bodyHtml += `<h2>${inlineFormat(heading)}</h2>\n`;
      }
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph(); flushList(); flushTable();
      const heading = trimmed.slice(4).trim();
      if (mode === "faq") {
        faqList.push({ question: heading.replace(/^Q\d+[：:]\s*/, "") });
        bodyHtml += `<h3 class="faq-question">${inlineFormat(heading)}</h3>\n`;
      } else {
        bodyHtml += `<h3>${inlineFormat(heading)}</h3>\n`;
      }
      continue;
    }

    // 表格
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushParagraph(); flushList();
      inTable = true;
      const cells = trimmed.slice(1, -1).split("|");
      if (cells.every(c => /^[-:\s]+$/.test(c))) {
        tableRows.push(cells); // separator
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // 列表
    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (ulMatch) {
      flushParagraph();
      if (!inList || listType !== "ul") { flushList(); inList = true; listType = "ul"; }
      listItems.push(ulMatch[1]);
      continue;
    }
    if (olMatch) {
      flushParagraph();
      if (!inList || listType !== "ol") { flushList(); inList = true; listType = "ol"; }
      listItems.push(olMatch[1]);
      continue;
    }
    if (inList && !trimmed) {
      flushList();
      continue;
    }

    // 引用
    if (trimmed.startsWith("> ")) {
      flushParagraph(); flushList(); flushTable();
      bodyHtml += `<blockquote>${inlineFormat(trimmed.slice(2))}</blockquote>\n`;
      continue;
    }

    // 分隔线
    if (trimmed === "---") {
      flushParagraph(); flushList(); flushTable();
      mode = "notice";
      continue;
    }

    // 空行
    if (!trimmed) {
      flushParagraph();
      continue;
    }

    // 导语（标题后第一段非空行）
    if (!lead && mode === "body" && !bodyHtml && paraBuffer.length === 0) {
      lead = trimmed;
      continue;
    }

    // 普通段落
    paraBuffer.push(trimmed);
  }

  flushParagraph(); flushList(); flushTable();

  // FAQ答案提取
  if (faqList.length > 0) {
    const faqSectionMatch = bodyHtml.match(/<h2>常见问题<\/h2>([\s\S]*?)(?=<h2>参考资料<\/h2>|$)/);
    if (faqSectionMatch) {
      const faqHtml = faqSectionMatch[1];
      const answers = [];
      const parts = faqHtml.split(/<h3 class="faq-question">/);
      for (let j = 1; j < parts.length; j++) {
        const ansMatch = parts[j].match(/<\/h3>\s*<p>([\s\S]*?)<\/p>/);
        if (ansMatch) {
          answers.push(ansMatch[1].replace(/<[^>]+>/g, "").trim());
        }
      }
      faqList = faqList.map((f, idx) => ({ ...f, answer: answers[idx] || "" }));
    }
  }

  // 参考资料提取
  const srcMatch = bodyHtml.match(/<h2>参考资料<\/h2>\s*<ul class="source-list">([\s\S]*?)<\/ul>/);
  if (srcMatch) {
    sources = srcMatch[1].match(/<li>([\s\S]*?)<\/li>/g)?.map(s => s.replace(/<\/?li>/g, "").trim()) || [];
  }

  return { title, lead, bodyHtml, faqList, sources, scopeNotice, disclaimer };
}

/**
 * 生成完整 HTML 页面（V1.2规范）
 */
function generateArticleHtml({ slug, title, lead, bodyHtml, faqList, category, subcategory, publishDate, scopeNotice, disclaimer, authorNote, audienceQuestions }) {
  const kicker = subcategory ? `${category} · ${subcategory}` : category;
  const breadcrumbName = title.length > 20 ? title.slice(0, 20) + "…" : title;
  const description = lead ? lead.slice(0, 160) : title;
  const canonicalUrl = `https://zongsengzxone.cn/min-su-yan-jiu/${slug}.html`;
  const heroImage = `/min-su-yan-jiu/images/hero-${slug}.jpg`;

  const faqJson = faqList.length > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  }, null, 2) : null;

  const articleJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": { "@type": "Person", "name": "王知远", "url": "https://zongsengzxone.cn/about.html" },
    "publisher": { "@type": "Organization", "name": "知远风物志" },
    "datePublished": publishDate,
    "dateModified": publishDate,
    "inLanguage": "zh-CN",
    "image": heroImage
  }, null, 2);

  const breadcrumbJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "首页", "item": "https://zongsengzxone.cn/" },
      { "@type": "ListItem", "position": 2, "name": "风物知识库", "item": "https://zongsengzxone.cn/min-su-yan-jiu/" },
      { "@type": "ListItem", "position": 3, "name": breadcrumbName, "item": canonicalUrl }
    ]
  }, null, 2);

  const noticeHtml = (scopeNotice || disclaimer) ? `
          <div class="notice">
            ${scopeNotice ? `研究范围声明：${inlineFormat(scopeNotice)}<br>` : ""}
            ${disclaimer ? `免责声明：${inlineFormat(disclaimer)}` : ""}
          </div>` : `
          <div class="notice">
            研究范围声明：本文基于所引地方志材料，覆盖部分地区，不代表整个岭南地区的统一情况。<br>
            免责声明：本文为岭南传统文化研究，所引内容均出自地方志史料，不构成任何择日、起名、运势建议。
          </div>`;

  // 研究者手记
  const authorNoteHtml = authorNote ? `
        <div class="author-note">
          <strong>研究者手记：</strong>${inlineFormat(authorNote)}
        </div>` : "";

  // 观众质疑模块
  let audienceHtml = "";
  if (audienceQuestions && audienceQuestions.length > 0) {
    audienceHtml = `<h2>两个常见质疑，以及${escapeHtml(category)}的社会史解读</h2>\n`;
    audienceQuestions.forEach((q, idx) => {
      audienceHtml += `<div class="audience-question">\n  <div class="question">质疑${idx === 0 ? "一" : "二"}：${escapeHtml(q.question)}</div>\n  <div class="answer">${inlineFormat(q.answer)}</div>\n</div>\n`;
    });
  }

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}｜知远风物志</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${escapeHtml(category)},${escapeHtml(title)},岭南民俗,地方志,知远风物志">
  <meta name="author" content="王知远">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${heroImage}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="知远风物志">
  <meta property="article:published_time" content="${publishDate}">
  <meta property="article:author" content="王知远">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${heroImage}">
  <link rel="stylesheet" href="/min-su-yan-jiu/styles.css">
  <script type="application/ld+json">
  ${articleJson}
  </script>
  <script type="application/ld+json">
  ${breadcrumbJson}
  </script>${faqJson ? `
  <script type="application/ld+json">
  ${faqJson}
  </script>` : ""}
</head>
<body>
  <div class="article-shell">
    <header>
      <div class="container header-inner">
        <a class="brand" href="/">知远风物志</a>
        <nav>
          <a href="/">首页</a>
          <a class="active" href="/min-su-yan-jiu/">风物知识库</a>
          <a href="/about.html">关于</a>
          <a href="/guide-form#lead-form">联系</a>
        </nav>
      </div>
    </header>
    <main class="article-main">
      <div class="container article-wrap">
        <div class="breadcrumbs"><a href="/">首页</a>　/　<a href="/min-su-yan-jiu/">风物知识库</a>　/　${escapeHtml(breadcrumbName)}</div>
        <div class="hero">
          <div class="hero-category">${escapeHtml(category)}</div>
          <h1 class="hero-title">${inlineFormat(title)}</h1>
          <div class="hero-meta">作者：王知远　·　知远风物志　·　发布日期：${publishDate}　·　研究型文章</div>
        </div>
        <div class="overview-card">
          <p>${inlineFormat(lead)}</p>
        </div>
        ${authorNoteHtml}
        <article class="article-body">
${bodyHtml}${audienceHtml}${noticeHtml}
        </article>
        <div class="cta-section">
          <h3>传统民俗日期咨询</h3>
          <p>开工、开业、动土、嫁娶等场景的传统民俗日期参考，基于岭南地方志与民间口述史料。</p>
          <a href="/guide-form" class="cta-button">免费咨询</a>
        </div>
        <div class="article-footer-links">
          <a href="/min-su-yan-jiu/">← 返回风物知识库</a>
          <a href="/guide-form#lead-form">了解相关服务 →</a>
        </div>
      </div>
    </main>
    <footer>
      <div class="container footer-grid footer-grid-3">
        <div><a class="brand" href="/">知远风物志</a></div>
        <div>
          <h4>知识库</h4>
          <a href="/min-su-yan-jiu/">民俗研究</a>
        </div>
        <div><p class="footer-teacher-line">传统文化研究 · 地方志史料整理</p></div>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * 保存文章：生成HTML文件 + 更新索引
 */
function saveArticle({ markdown, category, subcategory, publishDate, slug }) {
  ensureDirs();
  const parsed = parseMarkdown(markdown);
  const finalSlug = slug || slugify(parsed.title);
  const fileName = `${finalSlug}.html`;
  const filePath = path.join(ARTICLES_DIR, fileName);

  const html = generateArticleHtml({
    slug: finalSlug,
    title: parsed.title,
    lead: parsed.lead,
    bodyHtml: parsed.bodyHtml,
    faqList: parsed.faqList,
    category,
    subcategory,
    publishDate: publishDate || new Date().toISOString().slice(0, 10),
    scopeNotice: parsed.scopeNotice,
    disclaimer: parsed.disclaimer
  });

  fs.writeFileSync(filePath, html, "utf8");

  const index = readIndex();
  const existingIdx = index.articles.findIndex(a => a.slug === finalSlug);
  const record = {
    slug: finalSlug,
    title: parsed.title,
    lead: parsed.lead,
    category,
    subcategory: subcategory || "",
    publishDate: publishDate || new Date().toISOString().slice(0, 10),
    fileName,
    faqCount: parsed.faqList.length,
    updatedAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    index.articles[existingIdx] = record;
  } else {
    index.articles.push(record);
  }
  writeIndex(index);

  return { ok: true, slug: finalSlug, filePath, url: `/min-su-yan-jiu/${finalSlug}/` };
}

/**
 * 删除文章
 */
function deleteArticle(slug) {
  ensureDirs();
  const index = readIndex();
  const article = index.articles.find(a => a.slug === slug);
  if (!article) return { ok: false, error: "文章不存在" };

  const filePath = path.join(ARTICLES_DIR, article.fileName);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  index.articles = index.articles.filter(a => a.slug !== slug);
  writeIndex(index);
  return { ok: true };
}

/**
 * 从HTML文件中提取元数据
 */
function extractMetaFromHtml(filePath, fileName) {
  try {
    const html = fs.readFileSync(filePath, "utf8");
    // 提取title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    let title = titleMatch ? titleMatch[1] : fileName.replace(/\.html$/, "");
    // 去掉品牌后缀
    title = title.replace(/[｜|]\s*知远风物志\s*$/, "").trim();
    
    // 提取meta description
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const description = descMatch ? descMatch[1].substring(0, 100) + "..." : "";
    
    // 从文件名推断分类
    const catInfo = inferCategoryFromFilename(fileName);
    
    // 提取发布日期（从HTML中找，或者用文件修改时间）
    const dateMatch = html.match(/(\d{4})[-年](\d{1,2})[-月](\d{1,2})/);
    const publishDate = dateMatch ? `${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}-${dateMatch[3].padStart(2, "0")}` : "";
    
    return {
      slug: fileName.replace(/\.html$/, ""),
      fileName,
      title,
      description,
      category: catInfo.category,
      subcategory: "",
      publishDate,
      wordCount: html.length,
      source: "html-scan"
    };
  } catch (e) {
    return null;
  }
}

/**
 * 扫描HTML目录，自动生成文章列表
 */
function scanHtmlArticles() {
  const articles = [];
  if (!fs.existsSync(ARTICLES_DIR)) return articles;
  
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.startsWith("GEO-") && f.endsWith(".html"));
  for (const file of files) {
    const meta = extractMetaFromHtml(path.join(ARTICLES_DIR, file), file);
    if (meta) articles.push(meta);
  }
  return articles;
}

/**
 * 获取文章列表（按分类分组）
 * 优先从articles.json读取，如果为空则自动扫描HTML目录
 */
function listArticles() {
  let index = readIndex();
  
  // 如果articles.json为空，自动扫描HTML目录
  if (!index.articles || index.articles.length === 0) {
    const scanned = scanHtmlArticles();
    if (scanned.length > 0) {
      index = { articles: scanned };
      // 自动保存到articles.json，方便后续使用
      try {
        writeIndex(index);
      } catch (e) {
        // 忽略写入错误
      }
    }
  }
  
  const grouped = {};
  for (const cat of CATEGORY_ORDER) grouped[cat] = [];
  for (const a of index.articles) {
    if (!grouped[a.category]) grouped[a.category] = [];
    grouped[a.category].push(a);
  }
  return { articles: index.articles, grouped, categoryOrder: CATEGORY_ORDER };
}

/**
 * 从文件名推断分类（GEO-01-01 → 择日习俗）
 */
function inferCategoryFromFilename(filename) {
  const match = filename.match(/GEO-(\d+)-/);
  if (match && CATEGORY_MAP[match[1]]) return CATEGORY_MAP[match[1]];
  return { category: "传统文化课堂", label: "传统文化课堂" };
}

module.exports = {
  parseMarkdown,
  generateArticleHtml,
  saveArticle,
  deleteArticle,
  listArticles,
  inferCategoryFromFilename,
  scanHtmlArticles,
  extractMetaFromHtml,
  CATEGORY_ORDER,
  CATEGORY_MAP,
  ARTICLES_DIR
};
