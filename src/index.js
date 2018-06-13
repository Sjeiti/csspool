import {css as uiCSS,className} from './config/uiStyle'
import {NAME} from './config'
import {elementAndParents,css,createElement,getFragment,dispatch} from './util'
import cssPropsJson from 'json-loader!./config/cssProps.json'
import cssValsJson from 'json-loader!./config/cssPropValues.json'

const defaultOption = '<option value="-1">…</option>'
const body = document.body
const px = 'px'
const lengthUnits = ['ch','em','ex','rem','em','vh','vw','vmin','vmax','px','cm','mm','in','pc','pt']

const defaultOptions = {
  lengthUnits: ['px','rem','em','vw','vh']
}

let ghosts,dialog,alterstyle,lastTarget,newTarget,currentQuerySelector

const csspool = {init}
export default csspool
window && (window.csspool = csspool)
module && (module.exports = csspool)

/**
 * Initialise
 * @param {Object} options
 * @param {HTMLStyleElement} [options.styleSheet]
 * @param {string} [options.lengthUnits]
 */
function init(options){
  options = Object.assign(options||{},defaultOptions)
  alterstyle = options.styleSheet||createElement('style',body)
  const {ownerDocument:{body}} = alterstyle
  const uitarget = options.uitarget||body
  setLengths(options.lengthUnits)
  ghosts = createElement('div',body)
  dialog = createElement(`dialog.${className.main}.${className.main}--dark`,uitarget)
  createElement('style',uitarget,style=>style.innerHTML = uiCSS)
  //
  body.addEventListener('mousedown',onMouseDownBody,false)
  body.addEventListener('click',onClickBody,false)
  body.addEventListener('change',onChange,false)
  body.addEventListener('input',onInput,false)
  window.addEventListener('resize',onResize,false)
}

/**
 * Mousedown handler
 * @param {Event} e
 */
function onMouseDownBody(e){
  const {target} = e
  newTarget = target
}

/**
 * Click handler
 */
function onClickBody(){
  const parents = elementAndParents(newTarget)
  if (!parents.includes(dialog)){
    dialog.close()
    setDialog(newTarget)
    dialog.showModal()
  } else if (newTarget.classList.contains(className.close)){
    body.removeChild(ghosts)
    dialog.close()
  } else if (newTarget.nodeName==='BUTTON'&&parents.includes(dialog.querySelector(`.${className.tree}`))){
    const lastPparents = elementAndParents(lastTarget)
    const index = parseInt(newTarget.getAttribute('data-index'),10)
    const element = lastPparents[lastPparents.length-1-index]
    setDialog(element)
  }
}

/**
 * Dialog change handler
 * @param {Event} e
 */
function onChange(e){
  const {target} = e
  const parents = elementAndParents(target)
  const isDialog = parents.includes(dialog)
  if (isDialog){
    const isSelectChildren = target.matches('select[data-children]')
    const isProp = target.matches('[data-prop]')
    const isCSS = target.matches('textarea')
    if (isSelectChildren){
      const {children} = lastTarget
      const index = parseInt(target.value,10)
      const element = children[index]
      setDialog(element)
    } else if (isProp){
      const name = target.getAttribute('name')
      const value = target.value + (target.getAttribute('data-unit')||'')
      addStyle(name,value)
      appendRealValueIput(target)
      target.style.maxWidth = 'auto'
    } else if (isCSS){
      showCSS()
    }
  }
}

/**
 * Input event handler
 * @param {Event} e
 */
function onInput(e){
  const {target} = e
  const parents = elementAndParents(target)
  const isDialog = parents.includes(dialog)
  if (isDialog){
    const isProp = target.matches('[data-prop]')
    const isCSS = target.matches('textarea')
    if (isProp){
      const name = target.getAttribute('name')
      const value = target.value + (target.getAttribute('data-unit')||'')
      addStyle(name,value)
      appendRealValueIput(target)
    } else if (isCSS){
      alterstyle.textContent = target.value
    }
  }
}

/**
 * Resize event handler
 */
function onResize(){
  moveGhosts()
}

/**
 * Map lengths to units
 * @param {string[]} lengths
 */
function setLengths(lengths){
  Object.values(cssValsJson).forEach(list=>{
    const index = list.indexOf('length')
    index!==-1&&list.splice(index,1,...lengths)
  })
}

/**
 * Add extra input element after original
 * @param {HTMLElement} from
 */
function appendRealValueIput(from){
  const {parentNode,value,nextElementSibling,name} = from
  nextElementSibling&&parentNode.removeChild(nextElementSibling)
  const fragment =
      lengthUnits.includes(value)&&`<input name="${name}" value="0" data-prop data-unit="${value}" type="number" />`
      ||value==='%'&&`<input name="${name}" value="0" data-prop data-unit="${value}" type="range" min="0" max="100" step="1" />`
      ||value==='color'&&`<input name="${name}" value="#F4A" data-prop type="color" />`
  fragment&&parentNode.appendChild(getFragment(fragment))
}

/**
 * Set the dialog
 * @param {HTMLElement} target
 */
function setDialog(target){
  lastTarget = target
  const {children} = target
  const parents = elementAndParents(target)
  //
  const appliedCSS = css(target)
  // console.log('appliedCSS',appliedCSS)
  //
  currentQuerySelector = getBestQuerySelector(target)
  //
  dialog.innerHTML = `<h3>${NAME}</h3><button class="${className.close}"></button>

      <ul class="${className.tree}">${
        parents.reverse().map((elm,i,a)=>`<li${i===a.length-1?' class="current"':''}><button data-index="${i}">${elm.nodeName}</button></li>`).join('')+(children.length?`&gt;<select data-children>${defaultOption+Array.from(children).map((child,j)=>`<option value="${j}">${child.nodeName}</option>`)}</select>`:'')
      }</ul>
      <hr>

      <ul class="${className.selectors}">${appliedCSS.map(s=>`
        <li title="${formatCSS(s)}"${s.includes(currentQuerySelector)?' class="current"':''}>${s.replace(/{[^}]*}/,'{ … }')}</li>`).join('')}
      </ul>
      <hr>
      
      ${Object.keys(cssPropsJson).map((legend,i)=>`<fieldset>
        <input type="checkbox" name="props" class="collapse visually-hidden" id="check${legend}" ${i===0?'checked':''} />
        <label for="check${legend}"><legend>${legend}</legend></label>
        <div>
          ${cssPropsJson[legend].map(propertyName=>`<label>
            <span title="${propertyName}">${propertyName}</span>
            <select name="${propertyName}" data-prop>
              ${defaultOption+cssValsJson[propertyName].map(value=>`<option value="${value}">${value}</option>`)}
            </select>
          </label>`).join('')}
        </div>
      </fieldset>`).join('')}

      <hr>
      <textarea></textarea>`

  applyFormValues()
  showCSS()
  moveGhosts()
  body.appendChild(ghosts)
}

/**
 * Applies the form values by analysing the current style
 */
function applyFormValues(){
  const fieldsets = Array.from(dialog.querySelectorAll('fieldset select'))
  const currentStyle = getCurrentStyle()
  fieldsets.forEach(sel=>{
    const name = sel.getAttribute('name')
    const value = Array.prototype.includes.call(currentStyle,name)&&currentStyle[name]
    if (value){
      const unit = value.replace(/^\d+(\w+)$/,'$1')
      sel.value = unit
      if (value!==unit){
        dispatch(sel,'change')
        const amount = value.replace(unit,'')
        const sibling = sel.nextElementSibling
        sibling && (sibling.value = amount)
      }
    }
  })
}

/**
 * Move the ghost element
 */
function moveGhosts(){
  if (lastTarget&&ghosts.parentNode){
    while (ghosts.firstChild) ghosts.removeChild(ghosts.firstChild)
    Array.from(body.querySelectorAll(currentQuerySelector)).forEach(element=>{
      const rect = element.getBoundingClientRect()
      createElement(`div.${className.ghost}`,ghosts,elm=>Object.assign(elm.style,{
        top: rect.y+px
        ,left: rect.x+px
        ,width: rect.width+px
        ,height: rect.height+px
      }))
    })
  }
}

/**
 * Add a style
 * @param {string} prop
 * @param {string} value
 */
function addStyle(prop,value){
  console.log('addStyle',{prop,value}) // todo: remove log
  const querySelector = getBestQuerySelector(lastTarget)
  const {sheet,sheet: {rules},sheet: {rules: {length}}} = alterstyle
  const rule = Array.from(rules).filter(rule => rule.selectorText===querySelector).pop()
  if (value==='-1'){
    rule&&rule.style.removeProperty(prop)
  } else if (rule){
    rule.style[prop] = value
  } else {
    sheet.insertRule(`${querySelector} { ${prop}: ${value} }`,length)
  }
  showCSS()
  moveGhosts()
}

/**
 * Get the best querySelector to overwrite
 * @param {HTMLElement} element
 * @returns {string}
 */
function getBestQuerySelector(element){
  return css(element)
      .map(s => s.split(/\s*{/).shift())
      .map(selector => ({selector,value: selector.split(/[.#\s]/g).length}))
      .reduce((highest,other) => other.value>=highest.value?other:highest,{selector: '',value: 0})
      .selector
      ||
      elementAndParents(element)
      .reverse()
      .splice(2)
      .map(elm => {
        const id = elm.getAttribute('id')
        const classes = elm.getAttribute('class')
        return id&&`#${id}`||classes&&classes.split(/\s/g).map(c=>`.${c}`).join('')||elm.nodeName.toLowerCase()
      })
      .join(' ')
}

/**
 * Get the current style
 * @returns {CSSStyleDeclaration}
 */
function getCurrentStyle() {
  const currentRule = Array.from(alterstyle.sheet.cssRules).filter(rule => rule.selectorText===currentQuerySelector).pop()
  return currentRule && currentRule.style
}

/**
 * Apply the new CSS to the textarea value
 * @implement formatCSS for last two replacements
 */
function showCSS(){
  const {sheet: {rules}} = alterstyle
  dialog.querySelector('textarea').value = Array.from(rules)
      .map(rule=>rule.cssText)
      .join('\n')
      .replace(/([{;])\s/g,'$1\n  ')
      .replace(/\s*}/g,'\n}\n  ')
}

/**
 * Format CSS whitespace
 * @param {string} css
 * @returns {string}
 */
function formatCSS(css){
  return css
      .replace(/([{;])\s/g,'$1\n  ')
      .replace(/\s*}/g,'\n}\n  ')
}
