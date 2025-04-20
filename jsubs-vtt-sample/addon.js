const { addonBuilder } = require("stremio-addon-sdk");
const fetch = require("node-fetch");

const manifest = {
    id: "community.japanesesubs",
    version: "1.0.1",
    name: "JapaneseSubs",
    description: "Auto-fetches EN, JA, and MS subtitles from GitHub by IMDb ID",
    resources: ["subtitles"],
    types: ["movie", "series"],
    catalogs: []
};

const builder = new addonBuilder(manifest);

const githubBase = "https://raw.githubusercontent.com/AlexzandrielHub105/subtitles-repo/main/jsubs-vtt-sample/subs/";

const langs = {
    en: "English",
    ja: "Japanese",
    ms: "Malay"
};

builder.defineSubtitlesHandler(async ({ id }) => {
    const subtitles = [];

    await Promise.all(Object.keys(langs).map(async (lang) => {
        const url = `${githubBase}${id}.${lang}.vtt`;
        try {
            const res = await fetch(url, { method: "HEAD" });
            if (res.ok) {
                subtitles.push({
                    id: `${lang}-sub`,
                    lang,
                    langLabel: langs[lang],
                    url
                });
            }
        } catch (e) {
            // Ignore if fetch fails
        }
    }));

    return { subtitles };
});

module.exports = builder.getInterface();