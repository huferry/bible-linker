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

    test('with double chapter ranges', () => {
        // Arrange
        const text = 'Gen 1:1-3, 2:5-7'

        // Act
        const actual = youVersion(text, 'en')

        // Assert
        expect(actual).toBe('<a href="https://bible.com/bible/114/GEN.1.1-3">Gen 1:1-3</a><a href="https://bible.com/bible/114/GEN.2.5-7">, 2:5-7</a>')
    })

    test('with mixed chapter ranges', () => {
        // Arrange
        const text = 'Gen 1:1-3,4-6,10,12-15'

        // Act
        const actual = youVersion(text, 'en')

        // Assert
        expect(actual).toBe("<a href=\"https://bible.com/bible/114/GEN.1.1-3\">Gen 1:1-3</a><a href=\"https://bible.com/bible/114/GEN.1.4-6\">,4-6</a><a href=\"https://bible.com/bible/114/GEN.1.10\">,10</a><a href=\"https://bible.com/bible/114/GEN.1.12-15\">,12-15</a>")
    })

    test('with null, returns null', () => {
        // Arrange
        // Act
        const actual = youVersion(null, 'en')

        // Assert
        expect(actual).toBe(null)

    })

    test('without reference, returns same as input', () => {
        // Arrange
        const text = 'no references'

        // Act
        const actual = youVersion(text, 'en')

        // Assert
        expect(actual).toBe(text)

    })

})