const { glyph, ttf2woff } = Fontmin = require('fontmin')
const through = require('through2-concurrent')
const path = require('path')
const log = require('fancy-log')
const PluginError = require('plugin-error')

//
// Gulp plugin to prune unused glyphs from TTF fonts (outputs TTF and WOFF)
//
// opts = {
//   fontGlyphs: {
//     fontname: 'glyphs'
//     ...
//   }
// }
//
module.exports = function( opts ) {
  return through.obj( function( file, enc, cb ) {
    let parts = path.parse( file.path )

    if( parts.ext.toLowerCase() !== '.ttf' ) {
      log( "Skipping " + file.path + " (unsupported)" )
      cb( null, file )
      return
    }

    let fontName = parts.name.toLowerCase()

    log( "Pruning " + fontName + ": glyphs = [" + opts.fontGlyphs[fontName] + "]" )

    const fontmin = new Fontmin()
      .src( file.path )
      .use( glyph( {
        text: opts.fontGlyphs[fontName]
      } ) )
      .use( ttf2woff() )

    var filestream = this

    fontmin.run( function( err, files ) {
      if (err) {
        cb( new PluginError( 'fontprune', err, { fileName: file.path } ) )
        return
      }

      files.forEach( ( minfile, idx ) => {
        let filename = path.basename( minfile.path )

        if (idx === 0) { /* ttf */
          file.contents = minfile.contents
          log( "Removed unused glyphs: " + filename )
        } else {
          filestream.push( minfile )
          log( "Created: " + filename )
        }
      } )

      cb( null, file )
    } )
  } )
}
