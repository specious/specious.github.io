const puppeteer = require('puppeteer')
const log = require('fancy-log')

//
// Use a headless browser to find out which text is rendered by which font
//
// Returns:
//
// [
//   { fontFamily, text }
// ]
//
async function getTextByFontFamily( path ) {
  let res

  log( 'Launching headless browser...' )
  const browser = await puppeteer.launch()

  try {
    const page = await browser.newPage()

    log('Loading page: ' + path)
    await page.goto( "file://" + path )

    // Run a function in the headless browser to determine which text is rendered by which custom font
    res = await page.evaluate( () => {
      // Get text contained within a DOM node without also including text held by its child elements
      function getNodeText( e ) {
        let text = ''

        for( let i = 0; i < e.childNodes.length; i++ ) {
          let n = e.childNodes[i]

          if (n.nodeType == Node.TEXT_NODE )
            text += n.textContent
        }

        return text
      }

      let nodes = document.querySelectorAll( '*' )
      let res = []

      for( let i in nodes ) {
        let n = nodes[i]

        if( typeof n == 'object' ) {
          if( ['SCRIPT', 'STYLE', 'TITLE'].includes( n.tagName ) )
            continue

          let text = getNodeText( n ).trim()

          if( text != '' ) {
            let style = getComputedStyle( n )

            res.push( {
              fontFamily: style['font-family'].toLowerCase(),
              text
            } )
          }
        }
      }

      return res
    } )

    log( 'Captured custom font usage data from headless browser' )
    console.log(res)
  } catch( e ) {
    console.error( e )
  } finally {
    await browser.close()
    log( "Browser closed" )
  }

  return res
}

module.exports = {
  getTextByFontFamily
}
