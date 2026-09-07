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
  "04": { category: "族群地域", label: "族群地域" }
};

const CATEGORY_ORDER = ["择吉习俗", "起名文化", "岁时信仰", "族群地域"];

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
 * 生成完整 HTML 页面
 */
function generateArticleHtml({ slug, title, lead, bodyHtml, faqList, category, subcategory, publishDate, scopeNotice, disclaimer }) {
  const kicker = subcategory ? `${category} · ${subcategory}` : category;
  const breadcrumbName = title.length > 20 ? title.slice(0, 20) + "…" : title;
  const description = lead ? lead.slice(0, 160) : title;

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
    "author": { "@type": "Organization", "name": "知远风物志" },
    "publisher": { "@type": "Organization", "name": "知远风物志" },
    "datePublished": publishDate,
    "dateModified": publishDate,
    "inLanguage": "zh-CN"
  }, null, 2);

  const breadcrumbJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "首页", "item": "/" },
      { "@type": "ListItem", "position": 2, "name": "风物知识库", "item": "/min-su-yan-jiu/" },
      { "@type": "ListItem", "position": 3, "name": breadcrumbName }
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

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}｜知远风物志</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="author" content="知远风物志">
  <link rel="canonical" href="/min-su-yan-jiu/${slug}/">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="article:published_time" content="${publishDate}">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">
  ${articleJson}
  </script>
  <script type="application/ld+json">
  ${breadcrumbJson}
  </script>${faqJson ? `
  <script type="application/ld+json">
  ${faqJson}
  </script>` : ""}
  <style>
    .article-shell{min-height:100vh;background:linear-gradient(180deg,#f8f5ef 0%,#fff 38%)}
    .article-main{padding:54px 0 84px}
    .article-wrap{max-width:860px;margin:0 auto}
    .breadcrumbs{margin-bottom:22px;color:#8b765e;font-size:14px}
    .breadcrumbs a{text-decoration:underline;text-decoration-color:#d8b982;text-underline-offset:3px}
    .article-kicker{display:inline-block;padding:6px 11px;border:1px solid #ead8b4;border-radius:999px;color:#7f5b1b;background:#fff7e7;font-size:13px;font-weight:800}
    .article-title{margin:18px 0 14px;font-size:44px;line-height:1.25;letter-spacing:.01em}
    .article-lead{margin:0 0 28px;padding:22px 24px;border-left:4px solid var(--gold);border-radius:0 14px 14px 0;background:#fffaf0;color:#4d5c71;font-size:18px;line-height:1.9}
    .article-meta{color:#8b765e;font-size:13px;margin-bottom:36px}
    .article-body{padding:34px 38px;background:#fff;border:1px solid #eadfce;border-radius:22px;box-shadow:0 14px 34px rgba(61,43,22,.06)}
    .article-body h2{margin:34px 0 14px;padding-top:8px;font-size:27px;line-height:1.5;border-top:1px solid #efe5d8}
    .article-body h2:first-child{margin-top:0;border-top:0}
    .article-body h3{margin:24px 0 10px;font-size:20px;line-height:1.55}
    .article-body p{margin:0 0 17px;color:#34465d;font-size:16px;line-height:1.95}
    .article-body strong{color:#6b4514}
    .article-body blockquote{margin:18px 0;padding:14px 18px;border-left:4px solid #d6b36d;background:#fffaf0;color:#5d4a35}
    .article-body table{width:100%;border-collapse:collapse;margin:18px 0 24px;background:#fff}
    .article-body th,.article-body td{padding:12px;border:1px solid #dfd4c5;text-align:left;vertical-align:top;line-height:1.7}
    .article-body th{background:#f8f1e5;color:#5a3d15}
    .article-body .faq-question{margin-top:24px;margin-bottom:6px;font-size:18px}
    .article-body .source-list{padding-left:22px;color:#34465d;line-height:1.9}
    .article-body .notice{margin-top:28px;padding:18px;border-radius:14px;background:#f8f5ef;color:#6b6258;font-size:14px;line-height:1.8}
    .article-footer-links{display:flex;justify-content:space-between;gap:16px;margin-top:22px}
    .article-footer-links a{color:#7f5b1b;font-weight:800}
    @media (max-width:720px){.article-main{padding:30px 0 56px}.article-title{font-size:26px;line-height:1.42;letter-spacing:0}.article-kicker{font-size:12px;padding:5px 9px}.article-lead{font-size:16px;line-height:1.85;padding:18px}.article-body{padding:24px 18px;border-radius:16px}.article-body h2{margin:30px 0 12px;font-size:20px;line-height:1.55}.article-body h3{margin:22px 0 8px;font-size:17px;line-height:1.6}.article-body .faq-question{font-size:17px;line-height:1.6}.article-body p{font-size:16px;line-height:1.9}.article-body table{font-size:14px;display:block;overflow-x:auto;white-space:normal}.article-footer-links{flex-direction:column}}
  </style>
</head>
<body>
  <div class="article-shell">
    <header>
      <div class="container header-inner">
        <a class="brand" href="/">知远风物志</a>
        <nav>
          <a href="/">首页</a>
          <a class="active" href="/min-su-yan-jiu/">风物知识库</a>
          <a href="/cases.html">案例</a>
          <a href="/guide-form#lead-form">联系</a>
        </nav>
        <div class="header-actions"><a class="btn btn-outline btn-small" href="/min-su-yan-jiu/">知识库首页</a></div>
      </div>
    </header>
    <main class="article-main">
      <div class="container article-wrap">
        <div class="breadcrumbs"><a href="/">首页</a>　/　<a href="/min-su-yan-jiu/">风物知识库</a>　/　${escapeHtml(breadcrumbName)}</div>
        <span class="article-kicker">${escapeHtml(kicker)}</span>
        <h1 class="article-title">${inlineFormat(title)}</h1>
        <p class="article-lead">${inlineFormat(lead)}</p>
        <div class="article-meta">知远风物志　·　发布日期：${publishDate}　·　研究型文章</div>
        <article class="article-body">
${bodyHtml}${noticeHtml}
        </article>
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
          <a href="/min-su-yan-jiu/${slug}/">${escapeHtml(breadcrumbName)}</a>
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
 * 获取文章列表（按分类分组）
 */
function listArticles() {
  const index = readIndex();
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
  CATEGORY_ORDER,
  ARTICLES_DIR
};
