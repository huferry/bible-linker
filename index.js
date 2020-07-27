const extract = require('./extract')
const grab = require('./grab')
const youVersionLinker = require('./youVersionLinker')
const link = require('./link')

const bibleLink = (text, language, linker) => {
    const grabber = text => grab(text, language)
    const extractor = text => extract(text, grabber)
    return link(text, linker, extractor)
} 

const youVersionLinkerByLanguage = language => data => {
    const dataWithLanguage = {...data, language}
    return youVersionLinker(dataWithLanguage)
}

const youVersion = (text, language) => 
    bibleLink(text, language, youVersionLinkerByLanguage(language))

module.exports = { 
    bibleLink,
    youVersion 
}