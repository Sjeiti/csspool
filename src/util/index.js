
/**
 * Returns a list with the element and its parents
 * @param {HTMLElement} element
 * @returns {HTMLElement[]}
 */
export function elementAndParents(element){
  const result = []
  while (element && element.parentNode){
    result.push(element)
    element = element.parentNode
  }
  return result
}

/**
 * Sluggifies
 * @param {string} s
 * @returns {string}
 */
export function sluggify(s){
  const slug = s
      .replace(/^[^a-zA-Z]*|[^a-zA-Z0-9\s]|[^a-zA-Z0-9]*$/g,'')
      .replace(/\s(\w)/g,(match,s)=>s.toUpperCase())
  return slug&&slug[0].toLowerCase()+slug.substr(1)
}


/**
 * from: https://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element
 * @param {HTMLElement} el
 * @returns {array}
 * todo: check //http://www.brothercake.com/site/resources/scripts/cssutilities/
 */
export function css(el){
  const sheets = document.styleSheets,ret = []
  el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector
  for (let i in sheets){
    try {
      const rules = sheets[i].rules || sheets[i].cssRules
      for (let r in rules){
        if (el.matches(rules[r].selectorText)){
          ret.push(rules[r].cssText)
        }
      }
    } catch (err){
      /*err*/
    }
  }
  return ret
}

/**
 * Create an element by querySelector and appendChild
 * @param {string} querySelector
 * @param {HTMLElement} [parentNode]
 * @param {Function} [method]
 * @returns {HTMLElement}
 */
export function createElement(querySelector,parentNode,method){
  const nodeName = querySelector.split(/[^\w]/).shift()
  const element = document.createElement(nodeName)
  // id
  const id = querySelector.match(/#-?[_a-zA-Z]+[_a-zA-Z0-9-]*/)
  id&&element.setAttribute('id',id.pop().substr(1))
  // classNames
  const classNames = querySelector.match(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g)
  classNames&&classNames.forEach(classSelector=>{
    element.classList.add(classSelector.substr(1))
  })
  // attributes
  method&&method(element)
  // appendChild
  parentNode&&parentNode.appendChild(element)
  return element
}

/**
 * Get documentFragment from an HTML string
 * @param {string} str
 * @returns {DocumentFragment}
 */
export function getFragment(str) {
    const fragment = document.createDocumentFragment()
    Array.from(wrapHTMLString(str).childNodes).forEach(elm => fragment.appendChild(elm))
    return fragment
}

/**
 * Set the innerHTML of a cached div
 * Helper method for getFragment and stringToElement
 * @param {string} str
 * @returns {HTMLElement}
 */
function wrapHTMLString(str) {
    const div = document.createElement('div')
    div.innerHTML = str
    return div
}