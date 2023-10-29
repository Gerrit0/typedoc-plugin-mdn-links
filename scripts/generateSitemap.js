const { XMLParser } = require("fast-xml-parser");
const { get } = require("axios");
const { writeFileSync } = require("fs");
const { resolve } = require("path");

const sitemapUrl =
    "https://developer.mozilla.org/sitemaps/en-us/sitemap.xml.gz";
const webAPIUrl = "https://developer.mozilla.org/en-US/docs/Web/API";

async function getSitemap() {
    const { data } = await get(sitemapUrl, { responseType: "text" });
    const parser = new XMLParser();
    const sitemap = parser.parse(data);
    return sitemap;
}

async function getUrls() {
    const sitemap = await getSitemap();
    return sitemap.urlset.url
        .map((url) => url.loc)
        .filter((url) => url.startsWith(webAPIUrl) && url !== webAPIUrl);
}

const sitemap = getUrls().then((data) => {
    const path = resolve(__dirname, "../src/webApiUrls.json");
    writeFileSync(path, JSON.stringify(data, null, 2));
});
