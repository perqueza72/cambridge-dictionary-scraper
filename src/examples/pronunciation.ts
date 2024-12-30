import DictionaryScraper from "../dictionary-scraper";

const dictionary = new DictionaryScraper()

dictionary.pronounciation("dictionary")
    .then(console.log)
    .catch(console.error);