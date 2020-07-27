# bible-linker
Recognize bible verse references in the text and process them.
# Usage

```javascript
const { bibleLink, youVersion } = require('bible-linker')

// Use your own linker
const processed = bibleLink(
    'In the verse Gen 3:5-6...', 'en', ownLinker)

function ownLinker({
    grabbed,
    language,
    bookIndex,
    chapter,
    verseFrom,
    verseTo
}) {
    return `#${grabbed}#${bookIndex}##`
}

console.log(processed)
// In the verse #Gen 3:5-6#1##...

// Use YouVersion linker
const hyperlink = youVersion(
    'In the verse Gen 3:5-6...', 'en')

console.log(hyperlink)
// In the verse <a href="https://www.bible.com/bible/114/GEN.3.5.6">Gen 3:5-6</a>
```
