const link = require('../link')

describe('link', () => {

    test('when no linker, return text', () => {
        // Arrange
        const text = 'just any text'

        // Act
        const actual = link(text)

        // Assert
        expect(actual).toBe(text)
    })

    test('when verse matched, should replace verse using linnker', () => {
        // Arrange
        const replacement = '#replaced#'
        const verse = 'john 1:1'
        const text = `the verse ${verse} says`

        const extracted = {
            grabbed: verse,
            language: 'en',
            book: 12,
            chapter: 1,
            verseFrom: 1
        }

        const extractor = data =>
            data === text ? [extracted] : []

        const linker = data => 
            data === extracted ? replacement : undefined
        
        // Act
        const actual = link(text, linker, extractor)        

        // Assert
        expect(actual).toBe(`the verse ${replacement} says`)
    })

})