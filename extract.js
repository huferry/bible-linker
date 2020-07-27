module.exports = extract

function extract(text, grabber) {

    const grabbedTexts = grabber(text)

    return grabbedTexts.map(g => {
        const { chapter, verseFrom, verseTo } = parse(g.grabbed)
        return {
            grabbed: g.grabbed,
            bookIndex: g.bookIndex,
            chapter,
            verseFrom,
            verseTo
        }
    })
}

function parse(verse) {
    const match = verse.match(/(\d+)\:(\d)+(-(\d+))?/)
    if (match) {
        return {
            chapter: parseInt(match[1]),
            verseFrom: parseInt(match[2]),
            verseTo: match.length > 3 ? parseInt(match[4]) : undefined
        }
    }
}