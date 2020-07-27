module.exports = link

function link(text, linker, extractor) {
    if (!linker) return text

    const extractedVerses = extractor(text)

    return !extractedVerses || extractedVerses.length == 0
        ? text
        : extractedVerses.reduce(
            (result, verses) => 
                result.replace(
                    new RegExp(verses.grabbed, 'g'),
                    linker(verses)
                ),
            text)
}