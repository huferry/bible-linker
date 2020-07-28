const grab = require('../grab')

describe('grab', () => {

    test('without arguments, returns empty', () => {

        // Arrange
        // Act
        const actual = grab()

        // Assert
        expect(actual).toHaveLength(0)
    })

    test('without pattern, returns empty', () => {

        // Arrange
        // Act
        const actual = grab()

        // Assert
        expect(actual).toHaveLength(0)
    })

    test('with multiple patterns and no match, returns empty', () => {

        // Arrange
        const patterns = ['john', 'matthew', 'revelation']
        const text = 'luke 1:12'

        // Act
        const actual = grab(text, patterns)

        // Assert
        expect(actual).toHaveLength(0)
    })

    test('with matching pattern in enriched text, returns only match', () => {

        // Arrange
        const patterns = ['luke', 'john']
        const verse = 'luke 1:12'
        const text = `the verse in ${verse} says`

        // Act
        const actual = grab(text, patterns)

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 0
        }])
    })

    test('with 2 exact matches, returns 1 match', () => {

        // Arrange
        const patterns = ['luke', 'revelation']
        const verse = 'luke 1:12'
        const text = `the verse in ${verse} says ${verse}`

        // Act
        const actual = grab(text, patterns)

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 0
        }])
    })

    test('with 2 exact matches, returns 2 matches', () => {

        // Arrange
        const patterns = ['genesis', 'luke']
        const verse1 = 'luke 1:12'
        const verse2 = 'luke 12:12'
        const text = `the verse ${verse1} differs from ${verse2}`

        // Act
        const actual = grab(text, patterns)

        // Assert
        expect(actual).toStrictEqual([
            {
                grabbed: verse1,
                bookIndex: 1
            },
            {
                grabbed: verse2,
                bookIndex: 1
            }
        ])
    })

    test('with match the beginning part of the pattern, returns match', () => {

        // Arrange
        const patterns = ['Revelation']
        const verse = 'rev 12:12'
        const text = `the verse ${verse} is good`

        // Act
        const actual = grab(text, patterns)

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 0
        }])
    })

    test('with verse range, returns with range', () => {

        // Arrange
        const patterns = ['judges']
        const verse = 'jud 12:10-13'
        const text = `the verse ${verse} is good`

        // Act
        const actual = grab(text, patterns)

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 0
        }])
    })

    test('with book volume, should recognize volume', () => {

        // Arrange
        const patterns = ['1 kings']
        const verse = '1 kings 4:12'
        const text = `the story in ${verse} tells us..`

        // Act
        const actual = grab(text, patterns)

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 0
        }])
    })

    test('with language, returns from actual bible', () => {

        // Arrange
        const verse = 'Rev 4:5-21'

        // Act
        const actual = grab(
            `Quote from ${verse} says..`, 'en')

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 65
        }])
    })

    test('with language and with book volume, returns from actual bible and book volume', () => {

        // Arrange
        const verse = '1 Kor 2:3'

        // Act
        const actual = grab(
            `Quote from ${verse} says..`, 'id')

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 45
        }])
    })

    test('with diacrtics, should recognize diacritics', () => {

        // Arrange
        const verse = 'Ezechiël 2:3'

        // Act
        const actual = grab(
            `Quote from ${verse} says..`, 'nl')

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 25
        }])
    })

})