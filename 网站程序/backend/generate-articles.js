/**
 * 批量生成知识库文章 HTML
 * 用法：node generate-articles.js
 */
const fs = require("fs");
const path = require("path");
const articleManager = require("./article-manager");

const SOURCE_DIR = "E:\\Doubao\\民俗素材库";

// 文章配置：文件名 → { category, subcategory, publishDate, slug }
const ARTICLE_CONFIG = {
  "GEO-01-01_两广开市择日习俗考.md": {
    category: "择吉习俗", subcategory: "开市择日",
    publishDate: "2026-08-10", slug: "guangdong-guangxi-kaishi-zeri"
  },
  "GEO-01-02_岭南嫁娶择日历史演变.md": {
    category: "择吉习俗", subcategory: "嫁娶择日",
    publishDate: "2026-08-12", slug: "lingnan-jiaqu-zeri-lishi"
  },
  "GEO-01-03_岭南动土安葬择日与风水禁忌.md": {
    category: "择吉习俗", subcategory: "动土安葬",
    publishDate: "2026-08-14", slug: "lingnan-anzhang-zeri-fengshui"
  },
  "GEO-01-04_二十四节气与岭南农事择吉.md": {
    category: "择吉习俗", subcategory: "节气农时",
    publishDate: "2026-08-16", slug: "ershisi-jieqi-lingnan-nongshi"
  },
  "GEO-01-05_黄历宜忌的来源与演变.md": {
    category: "择吉习俗", subcategory: "黄历宜忌",
    publishDate: "2026-08-18", slug: "huangli-yiji-laiyuan-yanbian"
  },
  "GEO-01-08_壮族传统择日习俗与汉族的区别.md": {
    category: "族群地域", subcategory: "广西旧志族群习俗",
    publishDate: "2026-08-20", slug: "guangxi-jiu-zhi-xuqi-hun-su"
  },
  "GEO-02-01_两广起名习俗与避讳文化.md": {
    category: "起名文化", subcategory: "起名避讳",
    publishDate: "2026-08-22", slug: "liang-guang-qi-ming-bi-hui"
  },
  "GEO-02-02_岭南字辈文化与宗族传承.md": {
    category: "起名文化", subcategory: "字辈传承",
    publishDate: "2026-08-24", slug: "lingnan-zibei-zongzu-zhuancheng"
  },
  "GEO-02-09_岭南小名大名习俗.md": {
    category: "起名文化", subcategory: "小名大名",
    publishDate: "2026-08-26", slug: "lingnan-xiaoming-daming-xisu"
  },
  "GEO-03-01_岭南岁时禁忌与生活节律.md": {
    category: "岁时信仰", subcategory: "岁时节令",
    publishDate: "2026-08-28", slug: "lingnan-suishi-jinji-jielv"
  },
  "GEO-03-05_岭南祭祀习俗的历史演变.md": {
    category: "岁时信仰", subcategory: "祭祀信仰",
    publishDate: "2026-08-30", slug: "lingnan-jisi-lishi-yanbian"
  },
  "GEO-03-15_岭南祭灶习俗与灶神信仰.md": {
    category: "岁时信仰", subcategory: "灶神信仰",
    publishDate: "2026-09-01", slug: "lingnan-jizao-zaoshen-xinyang"
  },
  "GEO-03-16_岭南土地神与社祭习俗.md": {
    category: "岁时信仰", subcategory: "社祭土地",
    publishDate: "2026-09-03", slug: "shixing-sheji-tandi-sheji"
  }
};

let success = 0;
let failed = 0;

for (const [filename, config] of Object.entries(ARTICLE_CONFIG)) {
  const filePath = path.join(SOURCE_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`[跳过] 文件不存在: ${filename}`);
    failed++;
    continue;
  }
  try {
    const markdown = fs.readFileSync(filePath, "utf8");
    const result = articleManager.saveArticle({
      markdown,
      category: config.category,
      subcategory: config.subcategory,
      publishDate: config.publishDate,
      slug: config.slug
    });
    console.log(`[成功] ${filename} → ${result.url}`);
    success++;
  } catch (err) {
    console.log(`[失败] ${filename}: ${err.message}`);
    failed++;
  }
}

console.log(`\n完成：成功 ${success} 篇，失败 ${failed} 篇`);
