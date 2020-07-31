const extract = require('../extract')

describe('extract', () => {

    test('with verse with range, returns full range', () => {
        // Arrange
        const grabbed = 'Gen 1:1-15'
        const text = `The story on ${grabbed}`

        const grabFn = t => 
            t === text 
                ? [{ grabbed, bookIndex: 0 }] 
                : undefined

        // Act
        const actual = extract(text, grabFn)

        // Assert
        expect(actual).toStrictEqual([{
            grabbed: 'Gen 1:1-15',
            bookIndex: 0,
            chapter: 1,
            verseFrom: 1,
            verseTo: 15
        }])
    })

    test('when grabbed is invalid, returns empty', () => {
        // Arrange
        const text = 'any text'

        // Act
        const actual = extract(text, () => [{
            grabbed: 'invalid'
        }])

        // Assert
        expect(actual).toHaveLength(0)
    })

    test('when grabbed contains parent, parse from parent', () => {
        // Arrange
        const grabbed = '11-15'
        const parent = 'Gen 1:1-3'
        const text = `${parent},${grabbed}`

        const grabFn = t => 
        t === text 
            ? [{ 
                grabbed, 
                parent,
                bookIndex: 0 
            }] 
            : undefined

        // Act
        const actual = extract(text, grabFn)

        // Assert
        expect(actual).toStrictEqual([{
            grabbed,
            bookIndex: 0,
            chapter: 1,
            verseFrom: 11,
            verseTo: 15
        }])
    })


})