module.exports = extract

// Extract: parses the grabbed text into the chapter/verses
function extract(text, grabber) {

    const grabbedTexts = grabber(text)

    grabbedTexts.reduce((_, verse, index) => {
        if (index>0) {
            verse.previous = grabbedTexts[index-1].grabbed
        }
    })

    return grabbedTexts
        .map(processGrabbedText)
        .filter(g => g !== undefined)
        .map(g => {
            delete g.previous
            return g
        })
}

function processGrabbedText(verse) {
    const { chapter, verseFrom, verseTo } = parseChapterAndVerses(verse.grabbed) 

    if (chapter === undefined || verseFrom === undefined) {
        return processFromParentOrSibling(verse)
    }

    return {
        grabbed: verse.grabbed,
        bookIndex: verse.bookIndex,
        chapter,
        verseFrom,
        verseTo
    }
}

function processFromParentOrSibling(verse) {
    const sibling = parseChapterAndVerses(verse.previous)
    const parent = parseChapterAndVerses(verse.parent)
    const range = parseVerseRange(verse.grabbed)
    const chapter = sibling.chapter || parent.chapter

    if (chapter && range.verseFrom) {
        const result = { 
            ...verse, 
            chapter, 
            ...range
        }

        delete result.parent
        return result
    }
}

function parseChapterAndVerses(verse) {
    if (!verse) return {}

    const match = verse.match(/(\d+)\:(\d+)(-(\d+))?/)
    if (match) {
        const result = {
            chapter: parseInt(match[1]),
            verseFrom: parseInt(match[2])
        }

        return match[4] ? {...result, ...{verseTo: parseInt((match[4]))}} : result
    }

    return {}
}

function parseVerseRange(verse) {
    const match = verse.match(/(\d+)(-(\d+))?/)
    if (match) {
        const range = { verseFrom: parseInt(match[1]) }
        return match[3]
            ? { ...range, verseTo: parseInt(match[3]) }
            : range
    }

    return {}
}