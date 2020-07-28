module.exports = link

function link(text, linker, extractor) {
    if (!linker) return text

    const extractedVerses = extractor(text)

    const byGrabbedLength = (a,b) => 
        b.grabbed - a.grabbed

    return !extractedVerses || extractedVerses.length == 0
        ? text
        : extractedVerses.sort(byGrabbedLength).reduce(
            (result, verses) => 
                result.replace(
                    new RegExp(verses.grabbed, 'g'),
                    linker(verses)
                ),
            text)
}