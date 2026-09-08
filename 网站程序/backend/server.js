
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const articleManager = require("./article-manager");
require("dotenv").config();

const app = express();

const PORT = Number(process.env.PORT || 8787);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
const WEBHOOK_TYPE = (process.env.WEBHOOK_TYPE || "generic").toLowerCase();
const ALLOW_OPEN_ADMIN_WHEN_NO_TOKEN = (process.env.ALLOW_OPEN_ADMIN_WHEN_NO_TOKEN || "true").toLowerCase() === "true";
const SITE_ORIGIN = String(process.env.SITE_ORIGIN || "").replace(/\/+$/g, "");

const RATE_WINDOW_MS = Number(process.env.RATE_WINDOW_MS || 10 * 60 * 1000);
const RATE_MAX_LEADS = Number(process.env.RATE_MAX_LEADS || 5);
const leadRateMap = new Map();

const PUBLIC_SITEMAP_ENTRIES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/guide-form", changefreq: "weekly", priority: "0.8" },
  { path: "/cases.html", changefreq: "monthly", priority: "0.8" },
  { path: "/advisor.html", changefreq: "monthly", priority: "0.8" },
  { path: "/annual.html", changefreq: "monthly", priority: "0.8" },
  { path: "/partner.html", changefreq: "monthly", priority: "0.7" },
  { path: "/profile.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/", changefreq: "weekly", priority: "0.8" },
  { path: "/min-su-yan-jiu/GEO-06-02_%E4%B8%A4%E5%B9%BF%E5%BC%80%E5%B8%82%E6%8B%A9%E6%97%A5%E4%B8%8E%E5%A2%9F%E6%9C%9F%E4%B9%A0%E4%BF%97.html", changefreq: "monthly", priority: "0.8" },
  { path: "/min-su-yan-jiu/GEO-06-07_%E5%B2%AD%E5%8D%97%E5%AB%81%E5%A8%B6%E6%8B%A9%E6%97%A5%E4%B8%8E%E5%85%AD%E7%A4%BC%E5%90%88%E5%A9%9A%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-06_%E5%B2%AD%E5%8D%97%E5%AE%89%E8%91%AC%E6%8B%A9%E6%97%A5%E4%B8%8E%E9%A3%8E%E6%B0%B4%E7%A6%81%E5%BF%8C.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-01_%E4%BA%8C%E5%8D%81%E5%9B%9B%E8%8A%82%E6%B0%94%E4%B8%8E%E5%B2%AD%E5%8D%97%E5%86%9C%E4%BA%8B%E6%8B%A9%E5%90%89%E4%B9%A0%E4%BF%97.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-04_%E9%BB%84%E5%8E%86%E6%97%B6%E5%AE%AA%E4%B9%A6%E4%B8%8E%E5%AE%98%E6%96%B9%E6%8B%A9%E6%97%A5%E5%88%B6%E5%BA%A6.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-03_%E5%B9%BF%E8%A5%BF%E6%97%A7%E5%BF%97%E5%A9%9A%E4%BF%97%E4%B8%8E%E5%A2%9F%E6%9C%9F%E5%9C%B0%E5%9F%9F%E5%B7%AE%E5%BC%82.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-05_%E4%B8%A4%E5%B9%BF%E8%B5%B7%E5%90%8D%E4%B8%8E%E9%81%BF%E8%AE%B3%E4%B9%A0%E4%BF%97%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-12_%E5%B2%AD%E5%8D%97%E5%AD%97%E8%BE%88%E6%96%87%E5%8C%96%E4%B8%8E%E5%AE%97%E6%97%8F%E4%BC%A0%E6%89%BF.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-11_%E5%B2%AD%E5%8D%97%E5%B0%8F%E5%90%8D%E5%A4%A7%E5%90%8D%E4%B9%A0%E4%BF%97%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-10_%E5%B2%AD%E5%8D%97%E5%B2%81%E6%97%B6%E4%B9%A0%E4%BF%97%E4%B8%8E%E7%94%9F%E6%B4%BB%E8%8A%82%E5%BE%8B.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-08_%E5%B2%AD%E5%8D%97%E7%A5%AD%E7%A5%80%E4%B9%A0%E4%BF%97%E5%8E%86%E5%8F%B2%E6%BC%94%E5%8F%98%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-09_%E5%B2%AD%E5%8D%97%E7%A5%AD%E7%81%B6%E4%B9%A0%E4%BF%97%E4%B8%8E%E7%81%B6%E7%A5%9E%E4%BF%A1%E4%BB%B0.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-06-13_%E5%A7%8B%E5%85%B4%E7%A4%BE%E7%A8%B7%E5%9D%9B%E4%B8%8E%E5%AE%98%E6%96%B9%E7%A4%BE%E7%A5%AD%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-01-01_%E5%A2%9F%E6%97%A5%E8%B6%81%E5%A2%9F%E7%9A%84%E7%94%B1%E6%9D%A5%E4%B8%8E%E5%A2%9F%E6%9C%9F%E8%A7%84%E5%88%99.html", changefreq: "monthly", priority: "0.8" },
  { path: "/min-su-yan-jiu/GEO-01-02_%E5%BA%9A%E5%B8%96%E5%90%88%E5%85%AB%E5%AD%97%E4%B8%8E%E9%80%81%E6%97%A5%E5%AD%90%E6%B5%81%E7%A8%8B.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-01-04_%E7%AB%8B%E6%98%A5%E6%89%93%E6%98%A5%E7%89%9B%E7%9A%84%E7%94%B1%E6%9D%A5%E4%B8%8E%E4%BB%AA%E5%BC%8F%E7%BB%86%E8%8A%82.html", changefreq: "monthly", priority: "0.8" },
  { path: "/min-su-yan-jiu/GEO-01-05_%E8%B4%9E%E8%8A%82%E7%89%8C%E5%9D%8A%E5%88%B6%E5%BA%A6%E4%B8%8E%E8%8A%82%E5%A6%87%E5%AE%88%E8%8A%82%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-03-01_%E7%AB%AF%E5%8D%88%E9%BE%99%E8%88%9F%E7%AB%9E%E6%B8%A1%E7%9A%84%E7%94%B1%E6%9D%A5%E4%B8%8E%E8%A7%84%E5%88%99.html", changefreq: "monthly", priority: "0.8" },
  { path: "/min-su-yan-jiu/GEO-03-02_%E4%B8%AD%E5%85%83%E8%8A%82%E7%83%A7%E8%A1%97%E8%A1%A3%E4%B8%8E%E5%8E%89%E5%9D%9B%E5%88%B6%E5%BA%A6%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-03-03_%E5%85%88%E5%86%9C%E5%9D%9B%E4%B8%8E%E7%B1%9D%E7%94%B0%E7%A4%BC%E5%88%B6%E5%BA%A6%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-03-04_%E6%96%87%E5%BA%99%E9%A3%8E%E6%B0%B4%E4%B8%8E%E7%A7%91%E4%B8%BE%E5%85%B4%E8%A1%B0%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-03-05_%E5%9F%8E%E9%9A%8D%E7%A5%AD%E7%A5%80%E4%B8%8E%E5%91%8A%E5%9F%8E%E9%9A%8D%E6%96%87%E5%88%B6%E5%BA%A6%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-04-01_%E7%B3%96%E7%89%9B%E4%BC%A0%E8%AF%B4%E4%B8%8E%E8%B4%A1%E8%B5%8B%E5%8D%9A%E5%BC%88.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-04-04_%E6%9F%B3%E5%B7%9E%E9%B8%A1%E5%8D%9C%E4%B8%8E%E6%9F%B3%E5%AE%97%E5%85%83%E6%95%99%E5%8C%96%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-04-05_%E5%85%AB%E6%8E%92%E7%91%B6%E6%88%90%E5%B9%B4%E7%A4%BC%E4%B8%8E%E4%B8%A7%E8%91%AC%E4%B9%A0%E4%BF%97%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-04-06_%E9%AB%98%E8%A6%81%E5%8E%BF%E6%B0%91%E9%A3%8E%E5%85%A8%E6%99%AF%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-04-07_%E5%85%AB%E6%8E%92%E7%91%B6%E8%BA%AB%E4%BD%93%E8%AE%AD%E7%BB%83%E4%B8%8E%E7%94%9F%E5%AD%98%E6%99%BA%E6%85%A7.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-05-01_%E7%A6%81%E6%BA%BA%E5%A5%B3%E5%8A%9D%E8%B0%95%E4%B8%8E%E5%8F%A4%E4%BB%A3%E7%94%9F%E8%82%B2%E5%9B%B0%E5%A2%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/min-su-yan-jiu/GEO-05-02_%E8%80%86%E5%AF%BF%E5%AF%BF%E8%80%83%E4%B8%8E%E5%8F%A4%E4%BB%A3%E9%95%BF%E5%AF%BF%E7%8E%B0%E8%B1%A1%E8%80%83.html", changefreq: "monthly", priority: "0.7" },
  { path: "/faq.html", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy.html", changefreq: "yearly", priority: "0.4" },
  { path: "/pricing.html", changefreq: "monthly", priority: "0.7" },
  { path: "/factory.html", changefreq: "monthly", priority: "0.7" },
  { path: "/store.html", changefreq: "monthly", priority: "0.7" },
  { path: "/office.html", changefreq: "monthly", priority: "0.7" },
  { path: "/boss-absent-start.html", changefreq: "monthly", priority: "0.7" },
  { path: "/builder-time-conflict.html", changefreq: "monthly", priority: "0.7" },
  { path: "/factory-start-checklist.html", changefreq: "monthly", priority: "0.7" },
  { path: "/huangli-enough.html", changefreq: "monthly", priority: "0.7" },
  { path: "/office-renovation-property.html", changefreq: "monthly", priority: "0.7" },
  { path: "/store-opening-flow.html", changefreq: "monthly", priority: "0.7" },
  { path: "/what-is-full-process.html", changefreq: "monthly", priority: "0.7" },
  { path: "/why-199-review.html", changefreq: "monthly", priority: "0.7" }
];

const PUBLIC_CITY_PAGES = [
  "guangzhou",
  "shenzhen",
  "foshan",
  "dongguan",
  "zhongshan",
  "huizhou",
  "zhuhai",
  "jiangmen"
].flatMap(city => [
  `/${city}-company-move.html`,
  `/${city}-factory-renovation.html`,
  `/${city}-factory-start.html`,
  `/${city}-office-renovation.html`,
  `/${city}-store-opening.html`
]);

const NOINDEX_PATHS = new Set([
  "/admin.html",
  "/admin-login.html",
  "/backend-guide.html",
  "/content-center.html",
  "/internal-tools.html",
  "/growth-hub.html",
  "/traffic-hub.html",
  "/keyword-map.html",
  "/content-calendar.html",
  "/social-content-library.html",
  "/channel-link-builder.html",
  "/scripts-library.html",
  "/client-intake.html",
  "/process-standard.html",
  "/product-matrix.html",
  "/lead-segments.html",
  "/deliverables.html",
  "/delivery-templates.html",
  "/city-pages.html",
  "/self-check.html",
  "/ai-answer-hub.html",
  "/interactive-checklists.html",
  "/launch-checklist.html",
  "/thanks.html"
]);

function isLocalRequest(req) {
  const ip = String(req.ip || req.socket.remoteAddress || "");
  const host = String(req.headers.host || "");
  return ip.includes("127.0.0.1") || ip.includes("::1") || host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

function getClientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || "").split(",")[0].trim();
}

function rateLimitLead(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const old = leadRateMap.get(ip) || [];
  const recent = old.filter(t => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX_LEADS) {
    return res.status(429).json({
      ok: false,
      error: "Too many requests",
      message: "提交过于频繁，请稍后再试。"
    });
  }
  recent.push(now);
  leadRateMap.set(ip, recent);
  next();
}

function rejectBotHoneypot(req, res, next) {
  if (req.body && typeof req.body.website === "string" && req.body.website.trim()) {
    return res.status(400).json({ ok: false, error: "Invalid submission" });
  }
  next();
}

function getSiteOrigin(req) {
  if (SITE_ORIGIN) return SITE_ORIGIN;
  const host = String(req.headers.host || "").trim();
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const proto = forwardedProto || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host || `localhost:${PORT}`}`;
}

function isPublicSitemapPath(reqPath) {
  return PUBLIC_SITEMAP_ENTRIES.some(entry => entry.path === reqPath) || PUBLIC_CITY_PAGES.includes(reqPath);
}

function buildSitemapXml(origin) {
  const entries = [...PUBLIC_SITEMAP_ENTRIES];
  for (const pathItem of PUBLIC_CITY_PAGES) {
    if (!entries.some(entry => entry.path === pathItem)) {
      entries.push({ path: pathItem, changefreq: "monthly", priority: "0.6" });
    }
  }

  // 动态扫描风物志文章目录，自动添加到sitemap
  try {
    const articleDir = path.resolve(__dirname, "..", "frontend", "min-su-yan-jiu");
    if (fs.existsSync(articleDir)) {
      const articleFiles = fs.readdirSync(articleDir).filter(f => f.startsWith("GEO-") && f.endsWith(".html"));
      for (const filename of articleFiles) {
        const encodedName = encodeURIComponent(filename);
        const articlePath = `/min-su-yan-jiu/${encodedName}`;
        if (!entries.some(entry => entry.path === articlePath)) {
          entries.push({ path: articlePath, changefreq: "monthly", priority: "0.7" });
        }
      }
    }
  } catch (e) {
    console.error("[sitemap] 动态扫描文章目录失败:", e.message);
  }

  const today = nowISO().slice(0, 10);
  const lines = entries.map(entry => `  <url><loc>${origin}${entry.path}</loc><lastmod>${today}</lastmod><changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>\n`;
}

function buildRobotsTxt(origin) {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin.html",
    "Disallow: /admin-login.html",
    "Disallow: /backend-guide.html",
    "Disallow: /content-center.html",
    "Disallow: /internal-tools.html",
    "Disallow: /growth-hub.html",
    "Disallow: /traffic-hub.html",
    "Disallow: /keyword-map.html",
    "Disallow: /content-calendar.html",
    "Disallow: /social-content-library.html",
    "Disallow: /channel-link-builder.html",
    "Disallow: /scripts-library.html",
    "Disallow: /client-intake.html",
    "Disallow: /process-standard.html",
    "Disallow: /product-matrix.html",
    "Disallow: /lead-segments.html",
    "Disallow: /deliverables.html",
    "Disallow: /delivery-templates.html",
    "Disallow: /city-pages.html",
    "Disallow: /self-check.html",
    "Disallow: /ai-answer-hub.html",
    "Disallow: /interactive-checklists.html",
    "Disallow: /launch-checklist.html",
    "Disallow: /thanks.html",
    `Sitemap: ${origin}/sitemap.xml`
  ].join("\n");
}


const ROOT = path.resolve(__dirname, "..");
const APP_FRONTEND_DIR = path.join(ROOT, "app-frontend");
const APP_FRONTEND_DIST_DIR = path.join(APP_FRONTEND_DIR, "dist");
const LEGACY_FRONTEND_DIR = path.join(ROOT, "frontend");
const FRONTEND_DIR = fs.existsSync(APP_FRONTEND_DIST_DIR) ? APP_FRONTEND_DIST_DIR : LEGACY_FRONTEND_DIR;
const DATA_DIR = path.join(__dirname, "data");
const JSON_FILE = path.join(DATA_DIR, "leads.json");
const CSV_FILE = path.join(DATA_DIR, "leads.csv");
const CONTENT_HUB_DIR = path.join(ROOT, "content-hub");
const CONTENT_QR_DIR = path.join(CONTENT_HUB_DIR, "qr-images");
const CONTENT_TEACHER_DIR = path.join(CONTENT_HUB_DIR, "teacher-images");
const CONTENT_CASE_DIR = path.join(CONTENT_HUB_DIR, "case-images");
const CONTENT_HERO_DIR = path.join(CONTENT_HUB_DIR, "hero-images");
const CONTENT_PDF_DIR = path.join(CONTENT_HUB_DIR, "pdf-library");
const CONTENT_TEXT_DIR = path.join(CONTENT_HUB_DIR, "text-settings");
const CONTENT_CONTACT_FILE = path.join(CONTENT_TEXT_DIR, "contact.json");
const CONTENT_TEACHER_FILE = path.join(CONTENT_TEXT_DIR, "teacher-profile.json");
const CONTENT_HOMEPAGE_HERO_FILE = path.join(CONTENT_TEXT_DIR, "homepage-hero.json");
const CONTENT_ACTIVE_FILE = path.join(CONTENT_TEXT_DIR, "active-assets.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(CONTENT_QR_DIR, { recursive: true });
fs.mkdirSync(CONTENT_TEACHER_DIR, { recursive: true });
fs.mkdirSync(CONTENT_CASE_DIR, { recursive: true });
fs.mkdirSync(CONTENT_HERO_DIR, { recursive: true });
fs.mkdirSync(CONTENT_PDF_DIR, { recursive: true });
fs.mkdirSync(CONTENT_TEXT_DIR, { recursive: true });

const CONTENT_DEFAULTS = {
  contact: {
    footerLine: "老师一对一咨询｜微信预约",
    wechatId: "",
    phone: "",
    qrCaption: "请扫码联系",
    note: ""
  },
  teacherProfile: {
    heroTitle: "专注商业开工场景的日期与流程顾问",
    heroIntro: "我们不是把服务包装成“神秘承诺”，而是把商业开工拆成可执行的流程：资料确认、日期参考、时辰建议、供品准备、人员分工、现场注意事项和后续答疑。",
    displayName: "商业开工流程顾问",
    summary: "专注厂房、门店、办公室、公司乔迁、工地动土等商业场景。",
    serviceNote: "提供的是传统民俗日期与商业开工流程建议，不承诺工程结果。"
  },
  homepageHero: {
    logoText: "LOGO",
    title: "知远择吉",
    subtitle: "门店开业、企业开工、工程奠基、商业开市 专业择吉顾问服务",
    detail: "广东500家商铺开业择吉的首选！",
    primaryButton: "免费领取商业开工指南",
    secondaryButton: "预约顾问",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    imageMode: "split"
  },
  activeAssets: {
    qrImage: "",
    teacherImage: "",
    cases: { factory: "", store: "", office: "" },
    pdfs: {
      commercialStartGuide: "",
      factoryStartChecklist: "",
      storeOpeningGuide: "",
      officeRenovationGuide: "",
      casePhotoUploadChecklist: "",
      realCaseRecordTemplate: "",
      serviceAgreementTemplate: "",
      clientIntakeFormTemplate: "",
      delivery199ReviewTemplate: "",
      delivery999DateTimeTemplate: "",
      delivery2980FullProcessTemplate: ""
    }
  }
};

const CONTENT_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

function nowISO() {
  return new Date().toISOString();
}

function cleanString(value, max = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function readJsonFile(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error);
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function deepMerge(base, override) {
  if (!override || typeof override !== "object") return base;
  const result = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === "object" && !Array.isArray(value) && result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function ensureContentDefaults() {
  if (!fs.existsSync(CONTENT_CONTACT_FILE)) writeJsonFile(CONTENT_CONTACT_FILE, CONTENT_DEFAULTS.contact);
  if (!fs.existsSync(CONTENT_TEACHER_FILE)) writeJsonFile(CONTENT_TEACHER_FILE, CONTENT_DEFAULTS.teacherProfile);
  if (!fs.existsSync(CONTENT_HOMEPAGE_HERO_FILE)) writeJsonFile(CONTENT_HOMEPAGE_HERO_FILE, CONTENT_DEFAULTS.homepageHero);
  if (!fs.existsSync(CONTENT_ACTIVE_FILE)) writeJsonFile(CONTENT_ACTIVE_FILE, CONTENT_DEFAULTS.activeAssets);
}

function readContactSettings() {
  return deepMerge(CONTENT_DEFAULTS.contact, readJsonFile(CONTENT_CONTACT_FILE, {}));
}

function readTeacherProfile() {
  return deepMerge(CONTENT_DEFAULTS.teacherProfile, readJsonFile(CONTENT_TEACHER_FILE, {}));
}

function readHomepageHero() {
  return deepMerge(CONTENT_DEFAULTS.homepageHero, readJsonFile(CONTENT_HOMEPAGE_HERO_FILE, {}));
}

function readActiveAssets() {
  return deepMerge(CONTENT_DEFAULTS.activeAssets, readJsonFile(CONTENT_ACTIVE_FILE, {}));
}

function writeContactSettings(data) {
  writeJsonFile(CONTENT_CONTACT_FILE, deepMerge(CONTENT_DEFAULTS.contact, data));
}

function writeTeacherProfile(data) {
  writeJsonFile(CONTENT_TEACHER_FILE, deepMerge(CONTENT_DEFAULTS.teacherProfile, data));
}

function writeHomepageHero(data) {
  writeJsonFile(CONTENT_HOMEPAGE_HERO_FILE, deepMerge(CONTENT_DEFAULTS.homepageHero, data));
}

function writeActiveAssets(data) {
  writeJsonFile(CONTENT_ACTIVE_FILE, deepMerge(CONTENT_DEFAULTS.activeAssets, data));
}

function normalizeFileBaseName(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file";
}

function getContentDirectory(kind) {
  if (kind === "qr") return CONTENT_QR_DIR;
  if (kind === "teacher") return CONTENT_TEACHER_DIR;
  if (kind === "case") return CONTENT_CASE_DIR;
  if (kind === "hero") return CONTENT_HERO_DIR;
  if (kind === "pdf") return CONTENT_PDF_DIR;
  return "";
}

function getPublicContentUrl(kind, fileName) {
  if (!fileName) return "";
  if (kind === "qr") return `/content-media/qr-images/${encodeURIComponent(fileName)}`;
  if (kind === "teacher") return `/content-media/teacher-images/${encodeURIComponent(fileName)}`;
  if (kind === "case") return `/content-media/case-images/${encodeURIComponent(fileName)}`;
  if (kind === "hero") return `/content-media/hero-images/${encodeURIComponent(fileName)}`;
  if (kind === "pdf") return `/content-media/pdf-library/${encodeURIComponent(fileName)}`;
  return "";
}

function listContentFiles(kind) {
  const directory = getContentDirectory(kind);
  if (!directory || !fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter(fileName => {
      const fullPath = path.join(directory, fileName);
      return fs.statSync(fullPath).isFile() && CONTENT_EXTENSIONS.has(path.extname(fileName).toLowerCase());
    })
    .map(fileName => {
      const fullPath = path.join(directory, fileName);
      const stat = fs.statSync(fullPath);
      return {
        fileName,
        url: getPublicContentUrl(kind, fileName),
        size: stat.size,
        updatedAt: stat.mtime.toISOString()
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function buildContentCenterState() {
  const activeAssets = readActiveAssets();
  return {
    contact: readContactSettings(),
    teacherProfile: readTeacherProfile(),
    homepageHero: readHomepageHero(),
    activeAssets,
    files: {
      qr: listContentFiles("qr"),
      teacher: listContentFiles("teacher"),
      cases: listContentFiles("case"),
      pdfs: listContentFiles("pdf")
    },
    publicUrls: {
      qrImage: getPublicContentUrl("qr", activeAssets.qrImage),
      teacherImage: getPublicContentUrl("teacher", activeAssets.teacherImage),
      cases: {
        factory: getPublicContentUrl("case", activeAssets.cases.factory),
        store: getPublicContentUrl("case", activeAssets.cases.store),
        office: getPublicContentUrl("case", activeAssets.cases.office)
      },
      pdfs: Object.fromEntries(
        Object.entries(activeAssets.pdfs).map(([key, value]) => [key, getPublicContentUrl("pdf", value)])
      )
    }
  };
}

function requireLocalOnly(req, res, next) {
  if (isLocalRequest(req)) return next();
  return res.status(403).json({ ok: false, error: "Local access only" });
}

function saveUploadedContentFile(kind, originalName, buffer) {
  const directory = getContentDirectory(kind);
  if (!directory) throw new Error("Unsupported content kind");
  const extension = path.extname(originalName || "").toLowerCase();
  if (!CONTENT_EXTENSIONS.has(extension)) {
    throw new Error("Unsupported file type");
  }
  const stamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const baseName = normalizeFileBaseName(path.basename(originalName || "file", extension));
  const fileName = `${stamp}-${baseName}${extension}`;
  fs.writeFileSync(path.join(directory, fileName), buffer);
  return fileName;
}

function resolveLegacyAssetPath(reqPath) {
  const activeAssets = readActiveAssets();
  const pdfMap = {
    "/assets/guides/commercial-start-guide.pdf": activeAssets.pdfs.commercialStartGuide,
    "/assets/guides/factory-start-checklist.pdf": activeAssets.pdfs.factoryStartChecklist,
    "/assets/guides/store-opening-guide.pdf": activeAssets.pdfs.storeOpeningGuide,
    "/assets/guides/office-renovation-guide.pdf": activeAssets.pdfs.officeRenovationGuide,
    "/assets/guides/case-photo-upload-checklist.pdf": activeAssets.pdfs.casePhotoUploadChecklist,
    "/assets/guides/real-case-record-template.pdf": activeAssets.pdfs.realCaseRecordTemplate,
    "/assets/delivery-templates/service-agreement-template.pdf": activeAssets.pdfs.serviceAgreementTemplate,
    "/assets/delivery-templates/client-intake-form-template.pdf": activeAssets.pdfs.clientIntakeFormTemplate,
    "/assets/delivery-templates/delivery-199-review-template.pdf": activeAssets.pdfs.delivery199ReviewTemplate,
    "/assets/delivery-templates/delivery-999-date-time-template.pdf": activeAssets.pdfs.delivery999DateTimeTemplate,
    "/assets/delivery-templates/delivery-2980-full-process-template.pdf": activeAssets.pdfs.delivery2980FullProcessTemplate
  };
  const caseMap = {
    "/assets/case-factory.svg": activeAssets.cases.factory,
    "/assets/case-store.svg": activeAssets.cases.store,
    "/assets/case-office.svg": activeAssets.cases.office,
    "/assets/v7-case-factory.svg": activeAssets.cases.factory,
    "/assets/v7-case-store.svg": activeAssets.cases.store,
    "/assets/v7-case-office.svg": activeAssets.cases.office
  };

  if (pdfMap[reqPath]) return path.join(CONTENT_PDF_DIR, pdfMap[reqPath]);
  if (caseMap[reqPath]) return path.join(CONTENT_CASE_DIR, caseMap[reqPath]);
  return "";
}

function resolveNewFrontendHtml(reqPath) {
  if (!reqPath || reqPath === "/") {
    return path.join(FRONTEND_DIR, "index.html");
  }

  const allowedPages = new Set([
    "/index.html",
    "/advisor.html",
    "/annual.html",
    "/partner.html",
    "/profile.html"
  ]);

  if (!allowedPages.has(reqPath)) {
    return "";
  }

  return path.join(FRONTEND_DIR, reqPath.replace(/^\//, ""));
}

ensureContentDefaults();

function classifyLead(record) {
  let score = Number(record.score || 0);
  let grade = record.grade || "";

  if (!score) {
    const commercial = ["厂房 / 工厂","门店 / 商铺","办公室 / 公司","工地 / 工程项目","酒店 / 餐饮 / 会所","公司乔迁 / 搬厂"];
    const keyCities = ["广州","深圳","佛山","东莞","中山","惠州","珠海","江门"];
    const highRoles = ["老板本人","公司负责人"];
    if (commercial.includes(record.projectType)) score += 20;
    if (["7 天内","15 天内","30 天内"].includes(record.startTime)) score += 20;
    if (highRoles.includes(record.role)) score += 20;
    if (keyCities.includes(record.city)) score += 10;
    if ((record.contact || "").trim().length >= 2) score += 10;
    if (record.need && !record.need.includes("只想领取")) score += 20;
  }

  if (!grade) {
    grade = "D 类线索";
    if (score >= 80) grade = "A 类线索";
    else if (score >= 60) grade = "B 类线索";
    else if (score >= 40) grade = "C 类线索";
  }

  return { score, grade };
}

function normalizeLead(body, req) {
  const base = {
    id: body.id || (crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex")),
    createdAt: body.createdAt || nowISO(),
    updatedAt: body.updatedAt || "",
    projectType: cleanString(body.projectType, 80),
    city: cleanString(body.city, 80),
    startTime: cleanString(body.startTime, 80),
    role: cleanString(body.role, 80),
    need: cleanString(body.need, 120),
    contact: cleanString(body.contact, 120),
    note: cleanString(body.note, 2000),
    page: cleanString(body.page || body.source, 120),
    landingPage: cleanString(body.landingPage || "", 300),
    referrer: cleanString(body.referrer, 300),
    utmSource: cleanString(body.utmSource || "", 120),
    utmMedium: cleanString(body.utmMedium || "", 120),
    utmCampaign: cleanString(body.utmCampaign || "", 120),
    utmTerm: cleanString(body.utmTerm || "", 120),
    utmContent: cleanString(body.utmContent || "", 120),
    channelCode: cleanString(body.channelCode || body.channel || "", 120),
    pageViewPath: cleanString(body.pageViewPath || "", 800),
    userAgent: cleanString(body.userAgent || req.headers["user-agent"], 300),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "",
    status: cleanString(body.status || "新线索", 40),
    followNote: cleanString(body.followNote || "", 2000),
    tag: cleanString(body.tag || "", 120),
    autoTags: cleanString(body.autoTags || "", 300),
    recommendedProduct: cleanString(body.recommendedProduct || "", 120),
    completeness: cleanString(body.completeness || "", 80),
    complexity: cleanString(body.complexity || "", 80),
    dealAmount: Number(body.dealAmount || 0),
    nextFollowUp: cleanString(body.nextFollowUp || "", 80)
  };

  const result = classifyLead({ ...body, ...base });
  return {
    ...base,
    score: result.score,
    grade: result.grade
  };
}

function validateLead(record) {
  const errors = [];
  if (!record.projectType) errors.push("缺少项目类型");
  if (!record.city) errors.push("缺少城市");
  if (!record.startTime) errors.push("缺少计划开工时间");
  if (!record.role) errors.push("缺少咨询人身份");
  if (!record.need) errors.push("缺少当前需求");
  if (!record.contact) errors.push("缺少联系方式");
  return errors;
}

function readLeads() {
  if (!fs.existsSync(JSON_FILE)) return [];
  try {
    const raw = fs.readFileSync(JSON_FILE, "utf8");
    const list = JSON.parse(raw || "[]");
    return list.map(x => ({
      status: "新线索",
      followNote: "",
      tag: "",
      dealAmount: 0,
      nextFollowUp: "",
      ...x
    }));
  } catch (error) {
    console.error("读取 leads.json 失败：", error);
    return [];
  }
}

function writeLeads(leads) {
  fs.writeFileSync(JSON_FILE, JSON.stringify(leads, null, 2), "utf8");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function writeCsv(leads) {
  const headers = ["id","createdAt","updatedAt","status","grade","score","projectType","city","startTime","role","need","contact","note","followNote","tag","autoTags","recommendedProduct","completeness","complexity","dealAmount","nextFollowUp","page","landingPage","referrer","utmSource","utmMedium","utmCampaign","utmTerm","utmContent","channelCode","pageViewPath","ip"];
  const rows = [headers.join(",")].concat(leads.map(record => headers.map(h => csvEscape(record[h])).join(",")));
  fs.writeFileSync(CSV_FILE, rows.join("\n") + "\n", "utf8");
}

function appendAndRewriteCsv(leads) {
  writeCsv(leads);
}

function requireAdmin(req, res, next) {
  // 本地测试：未设置 ADMIN_TOKEN 时，允许 localhost 查看后台。
  // 正式上线：请在 .env 设置 ADMIN_TOKEN，并设置 ALLOW_OPEN_ADMIN_WHEN_NO_TOKEN=false。
  if (!ADMIN_TOKEN && ALLOW_OPEN_ADMIN_WHEN_NO_TOKEN && isLocalRequest(req)) return next();

  const token = req.headers["x-admin-token"] || req.query.token || "";
  if (ADMIN_TOKEN && token && token === ADMIN_TOKEN) return next();

  return res.status(401).json({
    ok: false,
    error: "Unauthorized",
    message: "请提供正确的 ADMIN_TOKEN。"
  });
}

function formatLeadText(record) {
  return [
    "【新开工咨询线索】",
    `等级：${record.grade} / ${record.score} 分`,
    `项目类型：${record.projectType}`,
    `城市：${record.city}`,
    `计划开工：${record.startTime}`,
    `咨询身份：${record.role}`,
    `当前需求：${record.need}`,
    `联系方式：${record.contact}`,
    `留言说明：${record.note || "无"}`,
    `来源页：${record.page || "-"}`
  ].join("\n");
}

async function pushWebhook(record) {
  if (!WEBHOOK_URL) return { skipped: true };

  const text = formatLeadText(record);
  let payload;

  if (WEBHOOK_TYPE === "feishu") {
    payload = { msg_type: "text", content: { text } };
  } else if (WEBHOOK_TYPE === "wecom") {
    payload = { msgtype: "text", text: { content: text } };
  } else {
    payload = { event: "new_lead", text, lead: record };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return { ok: response.ok, status: response.status };
  } catch (error) {
    console.error("Webhook 推送失败：", error);
    return { ok: false, error: String(error) };
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "kaigong-consultant-v13", time: nowISO() });
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(buildRobotsTxt(getSiteOrigin(req)));
});

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml").send(buildSitemapXml(getSiteOrigin(req)));
});

app.use((req, res, next) => {
  if (NOINDEX_PATHS.has(req.path)) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  next();
});

app.post("/api/leads", rateLimitLead, rejectBotHoneypot, async (req, res) => {
  const record = normalizeLead(req.body || {}, req);
  const errors = validateLead(record);

  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }

  const leads = readLeads();
  leads.unshift(record);
  const saved = leads.slice(0, 5000);
  writeLeads(saved);
  appendAndRewriteCsv(saved);

  const webhook = await pushWebhook(record);

  return res.status(201).json({
    ok: true,
    lead: record,
    webhook
  });
});

app.get("/api/leads", requireAdmin, (req, res) => {
  const leads = readLeads();
  res.json({
    ok: true,
    count: leads.length,
    leads
  });
});

app.patch("/api/leads/:id", requireAdmin, (req, res) => {
  const id = req.params.id;
  const leads = readLeads();
  const index = leads.findIndex(x => x.id === id);

  if (index === -1) {
    return res.status(404).json({ ok: false, error: "Lead not found" });
  }

  const allowed = ["status","followNote","tag","dealAmount","nextFollowUp"];
  const update = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      if (key === "dealAmount") update[key] = Number(req.body[key] || 0);
      else update[key] = cleanString(String(req.body[key] || ""), key === "followNote" ? 2000 : 120);
    }
  }

  leads[index] = {
    ...leads[index],
    ...update,
    updatedAt: nowISO()
  };

  writeLeads(leads);
  appendAndRewriteCsv(leads);

  res.json({ ok: true, lead: leads[index] });
});

app.get("/api/leads.csv", requireAdmin, (req, res) => {
  const leads = readLeads();
  writeCsv(leads);
  if (!fs.existsSync(CSV_FILE)) {
    return res.status(404).send("No CSV data yet.");
  }
  res.download(CSV_FILE, "kaigong-leads-v6.csv");
});

app.use("/content-media/qr-images", requireLocalOnly, express.static(CONTENT_QR_DIR));
app.use("/content-media/teacher-images", requireLocalOnly, express.static(CONTENT_TEACHER_DIR));
app.use("/content-media/case-images", requireLocalOnly, express.static(CONTENT_CASE_DIR));
app.use("/content-media/hero-images", requireLocalOnly, express.static(CONTENT_HERO_DIR));
app.use("/content-media/pdf-library", requireLocalOnly, express.static(CONTENT_PDF_DIR));

app.get("/api/content/public", requireLocalOnly, (req, res) => {
  const state = buildContentCenterState();
  res.json({
    ok: true,
    contact: state.contact,
    teacherProfile: state.teacherProfile,
    homepageHero: state.homepageHero,
    activeAssets: state.activeAssets,
    publicUrls: state.publicUrls
  });
});

app.get("/api/content-center/state", requireLocalOnly, (req, res) => {
  res.json({ ok: true, state: buildContentCenterState() });
});

app.post("/api/content-center/upload", requireLocalOnly, upload.single("file"), (req, res) => {
  try {
    const kind = cleanString(req.body.kind || "", 20);
    if (!["qr", "teacher", "case", "pdf"].includes(kind)) {
      return res.status(400).json({ ok: false, error: "Unsupported content kind" });
    }
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ ok: false, error: "Missing upload file" });
    }
    const fileName = saveUploadedContentFile(kind, req.file.originalname, req.file.buffer);
    res.status(201).json({
      ok: true,
      file: {
        kind,
        fileName,
        url: getPublicContentUrl(kind, fileName)
      },
      state: buildContentCenterState()
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: String(error.message || error) });
  }
});

app.post("/api/content-center/activate", requireLocalOnly, (req, res) => {
  const kind = cleanString(req.body.kind || "", 20);
  const slot = cleanString(req.body.slot || "", 60);
  const fileName = cleanString(req.body.fileName || "", 180);
  const next = readActiveAssets();

  if (kind === "qr") {
    next.qrImage = fileName;
  } else if (kind === "teacher") {
    next.teacherImage = fileName;
  } else if (kind === "case" && ["factory", "store", "office"].includes(slot)) {
    next.cases[slot] = fileName;
  } else if (kind === "pdf" && Object.prototype.hasOwnProperty.call(next.pdfs, slot)) {
    next.pdfs[slot] = fileName;
  } else {
    return res.status(400).json({ ok: false, error: "Unsupported activation target" });
  }

  writeActiveAssets(next);
  res.json({ ok: true, state: buildContentCenterState() });
});

app.post("/api/content-center/text/contact", requireLocalOnly, (req, res) => {
  writeContactSettings({
    footerLine: cleanString(req.body.footerLine || "", 200),
    wechatId: cleanString(req.body.wechatId || "", 120),
    phone: cleanString(req.body.phone || "", 120),
    qrCaption: cleanString(req.body.qrCaption || "", 120),
    note: cleanString(req.body.note || "", 300)
  });
  res.json({ ok: true, state: buildContentCenterState() });
});

app.post("/api/content-center/text/teacher", requireLocalOnly, (req, res) => {
  writeTeacherProfile({
    heroTitle: cleanString(req.body.heroTitle || "", 200),
    heroIntro: cleanString(req.body.heroIntro || "", 600),
    displayName: cleanString(req.body.displayName || "", 120),
    summary: cleanString(req.body.summary || "", 240),
    serviceNote: cleanString(req.body.serviceNote || "", 300)
  });
  res.json({ ok: true, state: buildContentCenterState() });
});

app.post("/api/content-center/text/homepage-hero", requireLocalOnly, (req, res) => {
  writeHomepageHero({
    logoText: cleanString(req.body.logoText || "", 40),
    title: cleanString(req.body.title || "", 120),
    subtitle: cleanString(req.body.subtitle || "", 240),
    detail: cleanString(req.body.detail || "", 180),
    primaryButton: cleanString(req.body.primaryButton || "", 60),
    secondaryButton: cleanString(req.body.secondaryButton || "", 60),
    image: cleanString(req.body.image || "", 500),
    imageMode: cleanString(req.body.imageMode || "", 30)
  });
  res.json({ ok: true, state: buildContentCenterState() });
});

// ===== 文章管理 API =====
app.get("/api/articles/list", requireLocalOnly, (req, res) => {
  res.json(articleManager.listArticles());
});

app.post("/api/articles/save", requireLocalOnly, express.json({ limit: "5mb" }), (req, res) => {
  try {
    const { markdown, category, subcategory, publishDate, slug } = req.body || {};
    if (!markdown || typeof markdown !== "string") {
      return res.status(400).json({ ok: false, error: "缺少文章内容（markdown）" });
    }
    if (!category) {
      return res.status(400).json({ ok: false, error: "缺少分类（category）" });
    }
    const result = articleManager.saveArticle({ markdown, category, subcategory, publishDate, slug });
    res.json(result);
  } catch (err) {
    console.error("文章保存失败:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/articles/delete", requireLocalOnly, express.json(), (req, res) => {
  try {
    const { slug } = req.body || {};
    if (!slug) return res.status(400).json({ ok: false, error: "缺少 slug" });
    const result = articleManager.deleteArticle(slug);
    res.json(result);
  } catch (err) {
    console.error("文章删除失败:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/articles/preview", requireLocalOnly, express.json({ limit: "5mb" }), (req, res) => {
  try {
    const { markdown, category, subcategory, publishDate } = req.body || {};
    if (!markdown) return res.status(400).json({ ok: false, error: "缺少文章内容" });
    const parsed = articleManager.parseMarkdown(markdown);
    const html = articleManager.generateArticleHtml({
      slug: "preview",
      title: parsed.title,
      lead: parsed.lead,
      bodyHtml: parsed.bodyHtml,
      faqList: parsed.faqList,
      category: category || "择日习俗",
      subcategory: subcategory || "",
      publishDate: publishDate || new Date().toISOString().slice(0, 10),
      scopeNotice: parsed.scopeNotice,
      disclaimer: parsed.disclaimer
    });
    res.json({ ok: true, html, title: parsed.title, lead: parsed.lead, faqCount: parsed.faqList.length });
  } catch (err) {
    console.error("预览生成失败:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get([
  "/assets/guides/commercial-start-guide.pdf",
  "/assets/guides/factory-start-checklist.pdf",
  "/assets/guides/store-opening-guide.pdf",
  "/assets/guides/office-renovation-guide.pdf",
  "/assets/guides/case-photo-upload-checklist.pdf",
  "/assets/guides/real-case-record-template.pdf",
  "/assets/delivery-templates/service-agreement-template.pdf",
  "/assets/delivery-templates/client-intake-form-template.pdf",
  "/assets/delivery-templates/delivery-199-review-template.pdf",
  "/assets/delivery-templates/delivery-999-date-time-template.pdf",
  "/assets/delivery-templates/delivery-2980-full-process-template.pdf",
  "/assets/case-factory.svg",
  "/assets/case-store.svg",
  "/assets/case-office.svg",
  "/assets/v7-case-factory.svg",
  "/assets/v7-case-store.svg",
  "/assets/v7-case-office.svg"
], (req, res, next) => {
  const activePath = resolveLegacyAssetPath(req.path);
  if (activePath && fs.existsSync(activePath)) {
    return res.sendFile(activePath);
  }
  return next();
});

app.get(["/guide-form", "/guide-form/"], (req, res) => {
  return res.sendFile(path.join(LEGACY_FRONTEND_DIR, "guide-form.html"));
});

app.get(["/min-su-yan-jiu/", "/min-su-yan-jiu/index.html"], (req, res) => {
  return res.sendFile(path.join(LEGACY_FRONTEND_DIR, "min-su-yan-jiu", "index.html"));
});


// 旧拼音URL 301重定向到新中文URL
app.get("/min-su-yan-jiu/guangdong-guangxi-kaishi-zeri/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-02_%E4%B8%A4%E5%B9%BF%E5%BC%80%E5%B8%82%E6%8B%A9%E6%97%A5%E4%B8%8E%E5%A2%9F%E6%9C%9F%E4%B9%A0%E4%BF%97.html"));
app.get("/min-su-yan-jiu/lingnan-jiaqu-zeri-lishi/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-07_%E5%B2%AD%E5%8D%97%E5%AB%81%E5%A8%B6%E6%8B%A9%E6%97%A5%E4%B8%8E%E5%85%AD%E7%A4%BC%E5%90%88%E5%A9%9A%E8%80%83.html"));
app.get("/min-su-yan-jiu/lingnan-anzhang-zeri-fengshui/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-06_%E5%B2%AD%E5%8D%97%E5%AE%89%E8%91%AC%E6%8B%A9%E6%97%A5%E4%B8%8E%E9%A3%8E%E6%B0%B4%E7%A6%81%E5%BF%8C.html"));
app.get("/min-su-yan-jiu/ershisi-jieqi-lingnan-nongshi/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-01_%E4%BA%8C%E5%8D%81%E5%9B%9B%E8%8A%82%E6%B0%94%E4%B8%8E%E5%B2%AD%E5%8D%97%E5%86%9C%E4%BA%8B%E6%8B%A9%E5%90%89%E4%B9%A0%E4%BF%97.html"));
app.get("/min-su-yan-jiu/huangli-yiji-laiyuan-yanbian/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-04_%E9%BB%84%E5%8E%86%E6%97%B6%E5%AE%AA%E4%B9%A6%E4%B8%8E%E5%AE%98%E6%96%B9%E6%8B%A9%E6%97%A5%E5%88%B6%E5%BA%A6.html"));
app.get("/min-su-yan-jiu/guangxi-jiu-zhi-xuqi-hun-su/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-03_%E5%B9%BF%E8%A5%BF%E6%97%A7%E5%BF%97%E5%A9%9A%E4%BF%97%E4%B8%8E%E5%A2%9F%E6%9C%9F%E5%9C%B0%E5%9F%9F%E5%B7%AE%E5%BC%82.html"));
app.get("/min-su-yan-jiu/liang-guang-qi-ming-bi-hui/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-05_%E4%B8%A4%E5%B9%BF%E8%B5%B7%E5%90%8D%E4%B8%8E%E9%81%BF%E8%AE%B3%E4%B9%A0%E4%BF%97%E8%80%83.html"));
app.get("/min-su-yan-jiu/lingnan-zibei-zongzu-zhuancheng/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-12_%E5%B2%AD%E5%8D%97%E5%AD%97%E8%BE%88%E6%96%87%E5%8C%96%E4%B8%8E%E5%AE%97%E6%97%8F%E4%BC%A0%E6%89%BF.html"));
app.get("/min-su-yan-jiu/lingnan-xiaoming-daming-xisu/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-11_%E5%B2%AD%E5%8D%97%E5%B0%8F%E5%90%8D%E5%A4%A7%E5%90%8D%E4%B9%A0%E4%BF%97%E8%80%83.html"));
app.get("/min-su-yan-jiu/lingnan-suishi-jinji-jielv/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-10_%E5%B2%AD%E5%8D%97%E5%B2%81%E6%97%B6%E4%B9%A0%E4%BF%97%E4%B8%8E%E7%94%9F%E6%B4%BB%E8%8A%82%E5%BE%8B.html"));
app.get("/min-su-yan-jiu/lingnan-jisi-lishi-yanbian/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-08_%E5%B2%AD%E5%8D%97%E7%A5%AD%E7%A5%80%E4%B9%A0%E4%BF%97%E5%8E%86%E5%8F%B2%E6%BC%94%E5%8F%98%E8%80%83.html"));
app.get("/min-su-yan-jiu/lingnan-jizao-zaoshen-xinyang/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-09_%E5%B2%AD%E5%8D%97%E7%A5%AD%E7%81%B6%E4%B9%A0%E4%BF%97%E4%B8%8E%E7%81%B6%E7%A5%9E%E4%BF%A1%E4%BB%B0.html"));
app.get("/min-su-yan-jiu/shixing-sheji-tandi-sheji/", (req, res) => res.redirect(301, "/min-su-yan-jiu/GEO-06-13_%E5%A7%8B%E5%85%B4%E7%A4%BE%E7%A8%B7%E5%9D%9B%E4%B8%8E%E5%AE%98%E6%96%B9%E7%A4%BE%E7%A5%AD%E8%80%83.html"));

app.get(["/min-su-yan-jiu/:slug/", "/min-su-yan-jiu/:slug.html"], (req, res, next) => {
  const rawSlug = String(req.params.slug || "");
  const slug = decodeURIComponent(rawSlug).replace(/\.\.+/g, "").replace(/\.html$/i, "");
  if (!slug) return next();
  const filePath = path.join(LEGACY_FRONTEND_DIR, "min-su-yan-jiu", `${slug}.html`);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return next();
});

if (fs.existsSync(APP_FRONTEND_DIST_DIR)) {
  app.use(express.static(APP_FRONTEND_DIST_DIR, { index: false }));
}

app.use(express.static(LEGACY_FRONTEND_DIR, { index: false }));

app.get(["/", "/index.html", "/advisor.html", "/annual.html", "/partner.html", "/profile.html"], (req, res, next) => {
  const nextHtml = resolveNewFrontendHtml(req.path);
  if (nextHtml && fs.existsSync(nextHtml)) {
    return res.sendFile(nextHtml);
  }
  return next();
});

app.get("*", (req, res) => {
  const nextHtml = resolveNewFrontendHtml(req.path);
  if (nextHtml && fs.existsSync(nextHtml)) {
    return res.sendFile(nextHtml);
  }
  return res.sendFile(path.join(LEGACY_FRONTEND_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`V13 server running: http://localhost:${PORT}`);
  console.log(`Frontend directory: ${FRONTEND_DIR}`);
  console.log(`Data directory: ${DATA_DIR}`);
});
