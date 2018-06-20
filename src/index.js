import {css as cssUI,cssGhost,className} from './config/uiStyle'
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
  ,fontFamilies: ['serif','sans-serif','monospace','cursive','fantasy','system-ui','inherit','initial','unset']
  ,inline: false
}

let ghosts,dialog,dialogOptions,alterstyle,lastTarget,newTarget,currentQuerySelector,styleSheetBody,boundMove

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
  dialogOptions = Object.assign({},defaultOptions,options||{})
  alterstyle = dialogOptions.styleSheet||createElement('style',body)
  const {ownerDocument} = alterstyle
  styleSheetBody = ownerDocument.body
  const uitarget = dialogOptions.uitarget||body
  const {lengthUnits,fontFamilies,inline} = dialogOptions
  //
  console.log('alterstyle',alterstyle) // todo: remove log
  console.log('body',body) // todo: remove log
  console.log('styleSheetBody',styleSheetBody) // todo: remove log
  console.log('uitarget',uitarget) // todo: remove log
  console.log('inline',inline) // todo: remove log
  //
  const cssOptionsMap = new Map()
  cssOptionsMap.set('length',lengthUnits)
  cssOptionsMap.set(/generic-family$/,fontFamilies)
  cssOptionsMap.set(/^\d+(\s+\d+)+$/,m=>m.split(/\s+/g))
  setCSSValueOptions(cssOptionsMap)
  //
  ghosts = createElement('div')
  dialog = createElement(`${inline?'div':'dialog'}.${className.main}${dialogOptions.style?`.${className.main}--${dialogOptions.style}`:''}${inline?`.${className.main}--inline`:''}`,uitarget)
  createElement('style',uitarget,style=>style.innerHTML = cssUI)
  createElement('style',styleSheetBody,style=>style.innerHTML = cssGhost)
  //
  styleSheetBody.addEventListener('mousedown',onMouseDownBody,false)
  styleSheetBody.addEventListener('mouseup',onMouseUpBody,false)
  styleSheetBody.addEventListener('click',onClickBody,false)
  dialog.addEventListener('click',onClickDialog,false)
  dialog.addEventListener('change',onChangeDialog,false)
  dialog.addEventListener('input',onInputDialog,false)
  window.addEventListener('resize',onResize,false)
}

/**
 * Mousedown handler
 * @param {Event} e
 */
function onMouseDownBody(e){
  console.log('onMouseDownBody') // todo: remove log
  const {target} = e
  newTarget = target
  //
  const isTargetHandle = target.classList.contains(className.ghostHandle)
  if (isTargetHandle) {
    const {x,y,width,height} = target.getBoundingClientRect()
    const {clientX, clientY} = e
    const offsetX = clientX-(x+width/2)
    const offsetY = clientY-(y+height/2)
    console.log('offset',offsetX,offsetY) // todo: remove log
    setBoundMove(onMouseMoveBody.bind(null,target,offsetX,offsetY))
  }
}

/**
 * Mouseup handler
 * @param {Event} e
 */
function onMouseMoveBody(handle,xOffset,yOffset,e){
  const {clientX, clientY} = e
  const {style} = handle
  // const computed = getComputedStyle(handle)
  const computedLeft = clientX-xOffset// + parseFloat(computed.left)
  const computedTop =  clientY-yOffset// + parseFloat(computed.top)
  Object.assign(style,{
    left: `${computedLeft}px`
    ,top: `${computedTop}px`
  })
  console.log('mouseMove',e,computedLeft,computedTop) // todo: remove log
}

/**
 * Mouseup handler
 * @param {Event} e
 */
function onMouseUpBody(e){
  console.log('onMouseUpBody',e) // todo: remove log
  setBoundMove()
}

/**
 * Click handler
 */
function onClickBody(){
  const parents = elementAndParents(newTarget)
  const isTargetHandle = newTarget.classList.contains(className.ghostHandle)
  console.log('onClickBody',isTargetHandle) // todo: remove log
  if (!parents.includes(dialog)&&!isTargetHandle){
    dialog.close&&dialog.close()
    setDialog(newTarget)
    dialog.showModal&&dialog.showModal()
  }
}

/**
 * Dialog click handler
 * @param {Event} e
 */
function onClickDialog(e){
  //e.preventDefault()
  const {target} = e
  const parents = elementAndParents(target)
  console.log('onClickDialog',target) // todo: remove log
  if (target.classList.contains(className.close)){
    styleSheetBody.removeChild(ghosts)
    dialog.close&&dialog.close()
  } else if (target.nodeName==='BUTTON'&&parents.includes(dialog.querySelector(`.${className.tree}`))){
    const lastPparents = elementAndParents(lastTarget)
    const index = parseInt(target.getAttribute('data-index'),10)
    const element = lastPparents[lastPparents.length-1-index]
    setDialog(element)
  }
}

/**
 * Dialog change handler
 * @param {Event} e
 */
function onChangeDialog(e){
  const {target} = e
  const isSelectChildren = target.matches('select[data-children]')
  const isProp = target.matches('[data-prop]')
  const isCSS = target.matches('textarea')
  console.log('onChangeDialog',{isProp,isCSS}) // todo: remove log
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
    applyFormValues()
  }
}

/**
 * Input event handler
 * @param {Event} e
 */
function onInputDialog(e){
  const {target} = e
  const isProp = target.matches('[data-prop]')
  const isCSS = target.matches('textarea')
  console.log('onInputDialog',{isProp,isCSS}) // todo: remove log
  if (isProp){
    const name = target.getAttribute('name')
    const value = target.value + (target.getAttribute('data-unit')||'')
    addStyle(name,value)
    appendRealValueIput(target)
  } else if (isCSS){
    alterstyle.textContent = target.value
    // todo apply to props with applyFormValues() only when css is valid and has really changed
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
 * @param {object} map
 */
function setCSSValueOptions(map){
  Object.values(cssValsJson).forEach(list=>{
    map.forEach((value,key)=>{
      const keyType = typeof key
      const valueType = typeof value
      if (keyType === 'string'){
        const index = list.indexOf(key)
        index!==-1&&list.splice(index,1,...value)
      } if (key.constructor===RegExp){
        const toSplice = []
        list.forEach((option,i)=>{
          const match = option.match(key)
          if (match){
            Array.isArray(value)&&(toSplice[i] = value)
            valueType==='function'&&(toSplice[i] = value(option))
          }
        })
        toSplice.forEach((options,i)=>{ // todo better in reverse if list has multiple matches
          options&&Array.isArray(options)&&list.splice(i,1,...options)
        })
      }
    })
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
  console.log('setDialog',target) // todo: remove log
  lastTarget = target
  const {children} = target
  const parents = elementAndParents(target)
  //
  const appliedCSS = css(target)
  // console.log('appliedCSS',appliedCSS)
  //
  currentQuerySelector = getBestQuerySelector(target)
  //
  dialog.innerHTML = `<h3>${NAME}</h3>${dialogOptions.inline?'':`<button class="${className.close}"></button>`}

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
  styleSheetBody.appendChild(ghosts)
}

/**
 * Applies the form values by analysing the current style
 */
function applyFormValues(){
  const fieldsets = Array.from(dialog.querySelectorAll('fieldset select'))
  const currentStyle = getCurrentStyle()
  console.log('applyFormValues:currentStyle:',currentStyle) // todo: remove log
  currentStyle&&fieldsets.forEach(sel=>{
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
    currentQuerySelector&&Array.from(styleSheetBody.querySelectorAll(currentQuerySelector)).forEach(element=>{
      const {x,y,width,height} = element.getBoundingClientRect()
      createElement(`div.${className.ghost}`,ghosts,elm=>Object.assign(elm.style,{
        top: y+px
        ,left: x+px
        ,width: width+px
        ,height: height+px
      }))
      // only draw handles for lastTarget
      if (element===lastTarget) {
        [[x,y],[x+width,y],[x+width,y+height],[x,y+height]].forEach(([x,y])=>createElement(`div.${className.ghostHandle}`,ghosts,elm=>Object.assign(elm.style,{
          top: y+px
          ,left: x+px
        })))
      }
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
  console.log('css(element)',css(element)) // todo: remove log
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
        return id&&`#${id}`||classes&&classes.split(/\s+/g).map(c=>`.${c}`).join('')||elm.nodeName.toLowerCase()
      })
      .join(' ')
}

/**
 * Get the current style from the own styleSheet that is applied to the currently selected element
 * @returns {CSSStyleDeclaration}
 */
function getCurrentStyle(){
  console.log('getCurrentStyle',currentQuerySelector) // todo: remove log
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

/**
 * Set the bound move to a variable but first remove the listener
 * @param {Function} bound
 */
function setBoundMove(bound){
  if (styleSheetBody){
    boundMove&&styleSheetBody.removeEventListener('mousemove',boundMove,false)
    bound&&styleSheetBody.addEventListener('mousemove',bound,false)
    boundMove = bound
    // console.log('this',this,setBoundMove.foo,setBoundMove.foo=1) // todo: remove log
  }
}