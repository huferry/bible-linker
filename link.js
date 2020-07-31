module.exports = link

function link(text, linker, extractor) {
    if (!linker) return text

    const extractedVerses = extractor(text)

    const byGrabbedLength = (a,b) => 
        b.grabbed.length - a.grabbed.length

    if (!extractedVerses || extractedVerses.length == 0) return text

    const codedExtractedVerses = extractedVerses
        .sort(byGrabbedLength)
        .map((extraction, index) => {
            const id = `@@@###${index}###@@@`
            const replacement = linker(extraction)
            return {...extraction, id, replacement}
        })

    const firstPass = codedExtractedVerses
        .reduce((firstPass, verse) => 
            firstPass.replace(
                    new RegExp(verse.grabbed, 'g'), 
                    verse.id),
            text
        )

    return codedExtractedVerses
        .reduce((secondPass, verse) => 
            secondPass.replace(
                new RegExp(verse.id, 'g'), 
                verse.replacement),
        firstPass)
}