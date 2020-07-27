const bibleIndex = require('./bibleIndex')

module.exports = grab

const candidatePattern = `((\\d\\s)?[a-z]+)\\s\\d+\\:\\d+(-\\d+)?`
const candidateGlobalRegex = new RegExp(candidatePattern, 'gi')
const candidateSingleRegex = new RegExp(candidatePattern, 'i')

function grab(text, patterns) {

    if (!text || !patterns) return []
    
    if (!Array.isArray(patterns)) 
        return grabByLanguage(text, patterns)

    const candidates = getCandidates(text)

    return candidates.map(grabbed => {
        const bookIndex = getBookIndex(grabbed, patterns)
        return {
            grabbed,
            bookIndex
        }
    })
    .filter(g => g.bookIndex !== undefined)
    .distinct()
}

const grabByLanguage = (text, language) => 
    grab(text, bibleIndex[language])

const getBookIndex = (grabbed, patterns) => {
    const match = grabbed.match(candidateSingleRegex)
    if (match) {
        const book = match[1]
        return patterns.reduce((result, pattern, index) => {
            if (result === undefined 
                && pattern.match(new RegExp(`^${book}`, 'i'))) {
                return index
            }
            return result
        }, undefined)
    }
}

const getCandidates = text => text.match(candidateGlobalRegex)

function getPartialMatch(candidate, pattern) {
    const match = candidate.match(new RegExp(candidatePattern, 'i'))
    const book = match[1]
    if (pattern.match(new RegExp(`^${book}`, 'i'))) 
        return candidate
}

Array.prototype.distinct = function() {
    if (!this) return []
    return this.reduce((result, element) => {
        if (!result.some(e => e.grabbed === element.grabbed)) {
            return [...result, element]
        }
        return result
    }, [])
}

