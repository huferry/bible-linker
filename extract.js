module.exports = extract

function extract(text, grabber) {

    const grabbedTexts = grabber(text)

    return grabbedTexts
        .map(processGrabbedText)
        .filter(g => g !== undefined)
}

function processGrabbedText(verse) {
    const { chapter, verseFrom, verseTo } = parseChapterAndVerses(verse.grabbed) 

    if (chapter === undefined || verseFrom === undefined) {
        return processFromParent(verse)
    }

    return {
        grabbed: verse.grabbed,
        bookIndex: verse.bookIndex,
        chapter,
        verseFrom,
        verseTo
    }
}

function processFromParent(verse) {
    if (!verse.parent) return

    const parent = parseChapterAndVerses(verse.parent)
    const range = parseVerseRange(verse.grabbed)

    if (parent.chapter && range.verseFrom) {
        const result = { 
            ...verse, 
            chapter: parent.chapter, 
            ...range
        }

        delete result.parent
        return result
    }
}

function parseChapterAndVerses(verse) {
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
    const match = verse.match(/(\d+)-(\d+)/)
    if (match) {
        return {
            verseFrom: parseInt(match[1]),
            verseTo: parseInt(match[2])
        }
    }

    return {}
}