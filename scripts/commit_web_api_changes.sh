#!/bin/bash

set -e

if ! git diff --exit-code data/web-api.json >/dev/null; then
    echo "Web API index changed, building new release"
    version=$(npm version patch --git-tag-version=false)
    compat_version=$(node -p "JSON.parse(fs.readFileSync('node_modules/@mdn/browser-compat-data/package.json')).version")

extra=$"\
\n\
### $version ($(date '+%Y-%m-%d'))\n\
\n\
-   Updated MDN API index with @mdn/browser-compat-data version $compat_version\n\
"

    awk $"
        modif {
            printf(\"$extra\")
            modif = 0
        }
        /^## Changelog/ && !modif {
            modif = 1
        }
        {print}
    " README.md > README2.md
    mv README2.md README.md

    git add README.md ./package.json ./package-lock.json ./data/web-api.json
    git commit -m "[github-actions] Update Web API Index";
    git push
else
    echo "No web API changes"
fi
