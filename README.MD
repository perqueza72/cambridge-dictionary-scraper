# Cambridge Dictionary Scraper

package that allows you to scrape the meaning and pronunciation of words from the Cambridge Dictionary.

In the examples folder you can see how to use this library. Here is an example:

```js
import DictionaryScraper from "../dictionary-scraper";

const dictionary = new DictionaryScraper()

dictionary.meaning("dictionary")
    .then(console.log)
    .catch(console.error);
```

If you find a bug or the scraper stops working you can notify me here: https://github.com/perqueza72/cambridge-dictionary-scraper/issues

Inspired by (camb-dict)[https://github.com/twlite/camb-dict].