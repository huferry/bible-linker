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

    test.each([
        ['1 Kor 2:3', 45],
        ['1 Raja-Raja 1:4-10', 10]
    ])
    ('with bible name %s, should grab verse with index', 
        (grabbed, bookIndex) => {
            // Arrange
            // Act
            const actual = grab(
                `Quote from ${grabbed} says..`, 'id')

            // Assert
            expect(actual).toStrictEqual([{
                grabbed,
                bookIndex
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

    test('with diacrtics in HTML encode, should recognize diacritics', () => {

        // Arrange
        const verse = 'Hebree&euml;n 11:9'

        // Act
        const actual = grab(
            `Quote from ${verse} says..`, ['Hebreeën'])

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: verse,
            bookIndex: 0
        }])
    })

    test('with multiple verse, should grab double', () => {
        
        // Arrange
        const book = 'Psalms'
        const chapter = '119'
        const group1 = '1-10'
        const group2 = '15-20'
        const compound = `${book} ${chapter}:${group1},${group2}`

        // Act
        const actual = grab(
            `These are the verse ${compound}, please look`,
            ['Psalms']
        )

        // Assert
        expect(actual).toStrictEqual([
            {
                grabbed: `${book} ${chapter}:${group1}`,
                bookIndex: 0
            },
            {
                grabbed: `,${group2}`,
                parent: `${book} ${chapter}:${group1}`,
                bookIndex: 0
            }
        ])
    })

    test('with multiple chapter ranges, should grab double', () => {
        
        // Arrange
        const book = 'Psalms'
        const chapter1 = '11'
        const chapter2 = '119'
        const group1 = '1-10'
        const group2 = '15-20'
        const compound = `${book} ${chapter1}:${group1},${chapter2}:${group2}`

        // Act
        const actual = grab(
            `These are the verse ${compound}, please look`,
            ['Psalms']
        )

        // Assert
        expect(actual).toStrictEqual([
            {
                grabbed: `${book} ${chapter1}:${group1}`,
                bookIndex: 0
            },
            {
                grabbed: `,${chapter2}:${group2}`,
                parent: `${book} ${chapter1}:${group1}`,
                bookIndex: 0
            }
        ])
    })


    test('with duplicate compound verse, should not grab compound', () => {
        
        // Arrange
        // Act
        const actual = grab(
            `Verses in Psalms 1:1-2,4-5 are different from Genesis 1:1-2,4-5`,
            ['Psalms', 'Genesis']
        )

        // Assert
        expect(actual).toStrictEqual([
            {
                grabbed: 'Psalms 1:1-2',
                bookIndex: 0
            },
            {
                grabbed: 'Genesis 1:1-2',
                bookIndex: 1
            }
        ])
    })

    test('with two verses, the other with range, grab two', () => {
        
        // Arrange
        // Act
        const actual = grab(
            'Psalms 91:14 for more complete in Psalms 91:14-16',
            ['Psalms']
        )

        // Assert
        expect(actual).toStrictEqual([
            {
                grabbed: 'Psalms 91:14',
                bookIndex: 0
            },
            {
                grabbed: 'Psalms 91:14-16',
                bookIndex: 0
            }
        ])
    })

})