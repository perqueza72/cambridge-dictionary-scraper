import * as cheerio from "cheerio";

/**
 * Class original developed by https://github.com/twlite
 */
export class ContentRetriever {
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