const { youVersion } = require('../index')

describe('youVersion', () => {

    test('with double ranges', () => {
        // Arrange
        const text = 'Gen 1:1-3,5-7'

        // Act
        const actual = youVersion(text, 'en')

        // Assert
        expect(actual).toBe('<a href="https://bible.com/bible/114/GEN.1.1-3">Gen 1:1-3</a><a href="https://bible.com/bible/114/GEN.1.5-7">,5-7</a>')
    })
    
})