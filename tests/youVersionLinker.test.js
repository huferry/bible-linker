const linker = require('../youVersionLinker')

describe('youVersionLinker', () => {

    test('when book exists, returns book abbr', () => {

        // Arrange
        // Act
        const actual = linker({
            grabbed: '#a text#',
            language: 'en',
            bookIndex: 65,
            chapter: 12,
            verseFrom: 3,
            verseTo: 18
        })

        // Assert
        expect(actual).toBe('<a href="https://bible.com/bible/114/REV.12.3-18">#a text#</a>')
    })
})