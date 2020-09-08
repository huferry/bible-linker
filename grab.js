const bibleIndex = require('./bibleIndex')
const Entities = require('html-entities').AllHtmlEntities;
 
const entities = new Entities();

module.exports = grab

const candidatePattern = `((\\d\\s)?[a-ž;&-]+)\\s\\d+\\:\\d+(-\\d+)?`
const candidateGlobalRegex = new RegExp(candidatePattern, 'gi')
const candidateSingleRegex = new RegExp(candidatePattern, 'i')

function grab(text, patterns) {

    if (!text || !patterns) return []
    
    if (!Array.isArray(patterns)) 
        return grabByLanguage(text, patterns)

    const mixedCandidates = getCandidates(text)
    .map(grabbed => {
        const bookIndex = getBookIndex(grabbed, patterns)
        const parent = { grabbed, bookIndex }
        const tails = getTails(text, grabbed)
            .map(tail => {
                return { grabbed, bookIndex, tail }
        })

        return [ parent, ...tails ]
    })

    const candidates = flatten(mixedCandidates)
    .filter(g => g.bookIndex !== undefined)
    .distinct()

    const tails = candidates
        .filter(g => g.tail != undefined)
        .map(g => {
            return {
                grabbed: g.tail,
                bookIndex: g.bookIndex,
                parent: g.grabbed
            }
        })

    const candidateWithoutTail = candidates
        .filter(c => c.tail === undefined)

    const union = tails.hasDuplicate()
        ? candidateWithoutTail
        : [...candidateWithoutTail, ...tails]

    return union.map(g => {
        delete g.tail
        return g
    })
}

const flatten = array => {
    const result = []
    array.forEach(item => {
        if (Array.isArray(item)) 
            item.forEach(x => result.push(x))
        else
            result.push(item)
    })
    return result
}

const getTail = (text, grabbed) => {
    const match = text.match(new RegExp(`${grabbed}\\s*(,\\s*(\\d+:)?\\d+(-\\d+)?)`))
    return match ? match[1] : undefined
}

const getTails = (text, grabbed, list) => {
    if (list === undefined) return getTails(text, grabbed, [])

    const tail = getTail(text, grabbed)

    return tail === undefined
        ? list
        : [tail, 
            ...getTails(text, `${grabbed}${tail}`, list)]
}

const grabByLanguage = (text, language) => 
    grab(text, bibleIndex[language])

const getBookIndex = (grabbed, patterns) => {
    const match = grabbed.match(candidateSingleRegex)
    if (match) {
        const bookRegExp = new RegExp(`^${match[1]}`, 'i')
        return patterns.reduce((result, pattern, index) => {

            const patternHtmlEncode = entities.encode(pattern)

            if (result !== undefined) return result

            if (pattern.match(bookRegExp)
            || patternHtmlEncode.match(bookRegExp)) {
                return index
            }

            return result
        }, undefined)
    }
}

const getCandidates = text => text.match(candidateGlobalRegex) || []

Array.prototype.distinct = function() {
    if (!this) return []
    return this.reduce((result, element) => {
        if (!result.some(e => 
                e.grabbed === element.grabbed
                && e.tail === element.tail)) {
            return [...result, element]
        }
        return result
    }, [])
}

Array.prototype.hasDuplicate = function() {
    return this 
        && this.length > this.distinct().length
}