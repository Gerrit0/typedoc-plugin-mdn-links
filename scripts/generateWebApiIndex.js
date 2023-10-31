const { XMLParser } = require("fast-xml-parser");
const { get } = require("axios");
const { writeFileSync } = require("fs");
const { resolve } = require("path");

const webAPIUrl = "https://developer.mozilla.org/en-US/docs/Web/API";
const sitemapUrl =
    "https://developer.mozilla.org/sitemaps/en-us/sitemap.xml.gz";

// this is certainly not exhaustive, yet
const subdirsToFilter = [
    "/WebRTC_API/Build_a_phone_with_peerjs",
    "/WebGL_API/By_example",
    "/HTML_DOM_API/Microtask_guide",
    "/Canvas_API/Tutorial",
    "/WebGL_API/Tutorial",
];

async function getSitemap() {
    const { data } = await get(sitemapUrl, { responseType: "text" });
    const parser = new XMLParser();
    const sitemap = parser.parse(data);
    return sitemap;
}

async function getUrls() {
    const sitemap = await getSitemap();
    const rawUrls = sitemap.urlset.url
        .map((url) => url.loc)
        .filter((url) => url.startsWith(webAPIUrl) && url !== webAPIUrl);

    let validUrls = [];
    for (const url of rawUrls) {
        const [_, subdir] = url.split(webAPIUrl);

        if (
            subdir &&
            !subdirsToFilter.some((sdir) =>
                subdir.toLowerCase().startsWith(sdir.toLowerCase()),
            )
        ) {
            validUrls.push(url);
        }
    }

    return validUrls;
}

getUrls().then((data) => {
    const path = resolve(__dirname, "../src/webApiIndex.ts");
    const source = `export const webApiIndex: string[] = ${JSON.stringify(
        data,
        null,
        4,
    )};`;

    writeFileSync(path, source);
});
