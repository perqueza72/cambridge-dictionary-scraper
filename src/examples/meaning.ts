import DictionaryScraper from "../dictionary-scraper";

const dictionary = new DictionaryScraper()

dictionary.meaning("dictionary")
    .then(console.log)
    .catch(console.error);