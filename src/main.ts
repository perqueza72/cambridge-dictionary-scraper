// const CambDict = require("camb-dict");

import * as cheerio from "cheerio";

const constants = {
    BASE_URL: "https://dictionary.cambridge.org",
    DICT: "/dictionary/english/",
    PRON: "/pronunciation/english/",
    NOT_FOUND: 302
};


class Util {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }

    /**
     * Parse html of the given url
     * @param url Website url to parse html from
     */
    static async getHTML(url: string): Promise<string> {
        if (typeof url !== "string") throw new Error(`The url type must be a string, received "${typeof url}"!`);

        try {
            const res = await fetch(url, { redirect: "manual" })
            if (res.status !== 200) return "";
            const html = await res.text();
            return html;
        } catch (e) {
            return "";
        }
    }

    /**
     * Loads HTML
     * @param html Raw html to load
     */
    static loadHTML(html: string): cheerio.CheerioAPI {
        if (typeof html !== "string") throw new Error(`The html type must be a string, received "${typeof html}"!`);

        return cheerio.load(html);
    }

}

export default Util;

class Dictionary {

    /**
     * Search meaning of a word
     * @param word Word
     */
    meaning(word: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (typeof word !== "string") reject(new Error("Word must be a string!"));

            const html = await Util.getHTML(`${constants.BASE_URL}${constants.DICT}${word.split(" ").join("-")}`);
            if (!html) return reject(new Error("Not found!"));
            const $ = Util.loadHTML(html);

            const definition = $('meta[itemprop="headline"]').attr("content");
            const getDefinitions = (): { meaning: string, ex: string[] }[] => {
                // Add definitions
                const defDiv = $('.sense-body > .def-block.ddef_block > .ddef_h > .def.ddef_d.db')
                const objs = defDiv.toArray().map(v => v.children).map(div => div.map(v => {
                    if (v.type === "tag")
                        return v.attribs.title
                    if (v.type === "text")
                        return v.data
                }).join("")).map(v => { return { meaning: v, ex: [] } })

                // add examples
                const exDiv = $('.sense-body > .def-block.ddef_block > .def-body.ddef_b')
                const examples = exDiv.toArray().map(v => v.children).map(div => div.map(v => {
                    if (v?.type === "tag") {
                        return v
                    }
                })).filter(Boolean)

                examples.map(v => v.)

                // .map(examples => examples.filter(Boolean).map(v => {
                //     console.log(v)
                //     if (v.type === "tag")
                //         return v.attribs.title
                //     if (v.type === "text")
                //         return v.data
                // }))
                console.log(examples)

            }
            const definitions = getDefinitions()
            console.log(definitions)

            const m = definition.split("definition: 1. ")[1].split(" 2. ")[0] ? definition.split("definition: 1. ")[1].split(" 2. ")[0] : definition.split("definition: 1. ")[1];

            const pron: any[] = [];
            const examples: string[] = [];

            $('source[type="audio/mpeg"]').each((i, elm) => {
                pron.push({
                    type: elm.attribs.type,
                    url: `${constants.BASE_URL}${elm.attribs.src}`
                });
            });

            $('source[type="audio/ogg"]').each((i, elm) => {
                pron.push({
                    type: elm.attribs.type,
                    url: `${constants.BASE_URL}${elm.attribs.src}`
                });
            });

            $('span[class="deg"]').each((i, elm) => {
                if ($(elm).text().length) examples.push($(elm).text().trim());
            });

            const obj = {
                word: definition.split("definition: ")[0].trim(),
                meaning: m.substring(0, m.lastIndexOf(". Learn more.")) || m,
                pronounciation: $('.dipa').first().text(),
                type: $('.dpos').eq(0).text().toUpperCase(),
                examples: examples,
                audio: pron
            };

            return resolve(obj);
        });
    }

    /**
     * Returns pronounciation of a word
     * @param word Word
     */
    pronounciation(word: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (typeof word !== "string") reject(new Error("Word must be a string!"));

            const html = await Util.getHTML(`${constants.BASE_URL}${constants.PRON}${word.split(" ").join("-")}`);
            if (!html) return reject(new Error("Not found!"));
            const $ = Util.loadHTML(html);

            const pron: any[] = [];

            $('source[type="audio/mpeg"]').each((i, elm) => {
                pron.push({
                    type: elm.attribs.type,
                    url: `${constants.BASE_URL}${elm.attribs.src}`
                });
            });

            $('source[type="audio/ogg"]').each((i, elm) => {
                pron.push({
                    type: elm.attribs.type,
                    url: `${constants.BASE_URL}${elm.attribs.src}`
                });
            });

            const obj = {
                word: $('meta[itemprop="transcript"]').attr("content"),
                audio: pron
            };

            return resolve(obj);
        });
    }

}
const dictionary = new Dictionary()

dictionary.meaning("dictionary")
    // .then(console.log)
    .catch(console.error);
