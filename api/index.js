const fetch = require("node-fetch");

module.exports = async (req, res) => {
    const manifest = {
        id: "community.japanesesubs",
        version: "1.0.1",
        name: "JapaneseSubs",
        description: "Auto-fetches EN, JA, and MS subtitles from GitHub by IMDb ID",
        resources: ["subtitles"],
        types: ["movie", "series"],
        catalogs: []
    };

    const githubBase = "https://raw.githubusercontent.com/AlexzandrielHub105/subtitles-repo/main/jsubs-vtt-sample/subs/";

    const langs = {
        en: "English",
        ja: "Japanese",
        ms: "Malay"
    };

    if (req.url === "/manifest.json") {
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify(manifest));
    }

    if (req.url.startsWith("/subtitles")) {
        const url = new URL("http://localhost" + req.url);
        const imdbId = url.searchParams.get("id");

        const subtitles = [];

        await Promise.all(Object.keys(langs).map(async (lang) => {
            const subUrl = `${githubBase}${imdbId}.${lang}.vtt`;
            try {
                const head = await fetch(subUrl, { method: "HEAD" });
                if (head.ok) {
                    subtitles.push({
                        id: `${lang}-sub`,
                        lang,
                        langLabel: langs[lang],
                        url: subUrl
                    });
                }
            } catch (e) {}
        }));

        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ subtitles }));
    }

    res.statusCode = 404;
    res.end("Not Found");
};
