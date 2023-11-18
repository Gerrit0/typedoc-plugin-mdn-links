const bcd = require("@mdn/browser-compat-data");
const { writeFileSync } = require("fs");

/** @typedef {import("../src/webApi").WebApiData} WebApiData */

/** @type {Record<string, WebApiData | string>} */
const results = {};

/**
 * @param {Record<string, WebApiData | string>} outResults
 * @param {string} key
 * @param {import("@mdn/browser-compat-data").Identifier} data
 */
function addResults(outResults, key, data) {
    // _event pages reference events emitted by an object, not a real property.
    // Would be nice to link to them somehow, but it's misleading to allow {@link foo.test_event}
    // since there isn't actually a property called that...
    if (key.endsWith("_event")) return;

    // No MDN page = no link
    if (!data.__compat?.mdn_url) return;

    /** @type {WebApiData} */
    const result = {
        url: data.__compat.mdn_url,
        inst: {},
        stat: {},
    };

    for (const key in data) {
        if (key !== "__compat") {
            addResults(
                key.endsWith("_static") ? result.stat : result.inst,
                key.replace(/_static$/, ""),
                data[key],
            );
        }
    }

    if (!Object.keys(result.inst).length) {
        delete result.inst;
    }
    if (!Object.keys(result.stat).length) {
        delete result.stat;
    }

    if (!result.inst && !result.stat) {
        outResults[key] = data.__compat.mdn_url;
    } else {
        outResults[key] = result;
    }
}

for (const key in bcd.api) {
    addResults(results, key, bcd.api[key]);
}
for (const key in bcd.javascript.builtins) {
    addResults(results, key, bcd.javascript.builtins[key]);
}

writeFileSync("data/web-api.json", JSON.stringify(results, null, "\t"));
