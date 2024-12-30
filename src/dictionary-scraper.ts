import { ContentRetriever } from "./content-retriever";

const constants = {
    BASE_URL: "https://dictionary.cambridge.org",
    DICT: "/dictionary/english/",
};


export default class DictionaryScraper {

    /**
     * Search meaning of a word
     * @param word
     * @throws no word found
     * @author https://github.com/perqueza72
     */
    public meaning(word: string): Promise<{ meaning: string, ex: string[] }[]> {
        return new Promise(async (resolve, reject) => {
            if (typeof word !== "string") reject(new Error("Word must be a string!"));

            const html = await ContentRetriever.getHTML(`${constants.BASE_URL}${constants.DICT}${word.split(" ").join("-")}`);
            if (!html) return reject(new Error("Not found!"));
            const $ = ContentRetriever.loadHTML(html);

            const getDefinitions = (): { meaning: string, ex: string[] }[] => {
                // Add definitions
                const defDiv = $('.sense-body > .def-block.ddef_block > .ddef_h > .def.ddef_d.db')
                const objs = defDiv.toArray().map(v => v.children).map(div => div.map(v => {
                    if (v.type === "tag")
                        return v.attribs.title
                    if (v.type === "text")
                        return v.data
                }).join("")).map(v => { return { meaning: v, ex: new Array<string>() } })

                // add examples
                const exDiv = $('.sense-body > .def-block.ddef_block > .def-body.ddef_b')
                const examples = exDiv.toArray().map(divs => divs.children).map(div => div.map((v, i) => {
                    if (v?.type !== "tag")
                        return

                    const egs = v.children.filter(Boolean).filter(a => a.type === "tag" && a.attribs.class === "eg deg").map(v => {
                        if (v?.type !== "tag")
                            return

                        return v.children
                    }).at(0) || []

                    const examples = egs.map(v => {
                        if (v.type === "tag")
                            return v.attribs.title
                        if (v.type === "text")
                            return v.data
                    }).join("")

                    return examples
                }))

                objs.forEach((v, i) => {
                    if (examples[i]) {
                        const example = examples[i].filter(Boolean) as string[]
                        v.ex = example
                    }
                })

                return objs
            }
            const definitions = getDefinitions()
            resolve(definitions)
        });
    }

    /**
     * Returns pronounciation of a word
     * @param word
     * @throws no word found
     * @author https://github.com/perqueza72
     */
    public pronounciation(word: string): Promise<{ type: string, url: string }[]> {
        return new Promise(async (resolve, reject) => {
            if (typeof word !== "string") reject(new Error("Word must be a string!"));

            const html = await ContentRetriever.getHTML(`${constants.BASE_URL}${constants.DICT}${word.split(" ").join("-")}`);
            if (!html) return reject(new Error("Not found!"));
            const $ = ContentRetriever.loadHTML(html);

            const audios = $('.dpron-i .daud').find('source[type="audio/mpeg"]').map((_i, el) => {
                return {
                    type: el.attribs.type,
                    url: el.attribs.src
                }
            }).toArray()

            resolve(audios)
        });
    }

}
