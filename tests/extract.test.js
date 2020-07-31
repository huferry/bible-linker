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
        const grabbed = ',11-15'
        const parent = 'Gen 1:1-3'
        const text = `${parent}${grabbed}`

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

    test('when grabbed double chapter ranges', () => {
        // Arrange
        const grabbed = ',2:11-15'
        const parent = 'Gen 1:1-3'
        const text = `${parent}${grabbed}`

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
            chapter: 2,
            verseFrom: 11,
            verseTo: 15
        }])
    })

    test('when grabbe a chapter range, followed with 1 verse', () => {
        // Arrange
        const grabbed = ',8'
        const parent = 'Gen 1:1-3'
        const text = `${parent}${grabbed}`

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
            verseFrom: 8
        }])
    })

    test('with two children, last child gets the chapter from the sibling', () => {
        // Arrange
        const parent = 'Gen 1:1'
        const child1 = '2:2-5'
        const child2 = '8-9'

        const text = 'any text'

        const grabFn = _ => [
            {
                grabbed: parent,
                bookIndex: 1
            },
            {
                grabbed: child1,
                parent,
                bookIndex: 1
            },
            {
                grabbed: child2,
                parent,
                bookIndex: 1
            }
        ]

        // Act
        const actual = extract(text, grabFn)

        // Assert
        expect(actual).toStrictEqual([
            {
                grabbed: parent,
                bookIndex: 1,
                chapter: 1,
                verseFrom: 1,
                verseTo: undefined
            },
            {
                grabbed: child1,
                bookIndex: 1,
                chapter: 2,
                verseFrom: 2,
                verseTo: 5
            },
            {
                grabbed: child2,
                bookIndex: 1,
                chapter: 2,
                verseFrom: 8,
                verseTo: 9
            }
        ])
    })

})