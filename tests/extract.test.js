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


})