import {css as uiCSS,className} from './config/uiStyle'
import {NAME} from './config'
import {elementAndParents,css,createElement} from './util'
import cssPropsJson from 'json-loader!./config/cssProps.json'
import cssValsJson from 'json-loader!./config/cssPropValues.json'

const defaultOption = '<option value="-1">…</option>'
const body = document.body
const px = 'px'

const ghost = createElement(`div.${className.ghost}`)

const dialog = createElement(`dialog.${className.main}`,body)
console.log('dialog',dialog) // todo: remove log

createElement('style',body,style=>style.innerHTML = uiCSS)

const alterstyle = createElement('style',body)

console.log('cssPropsJson',cssPropsJson) // todo: remove log
console.log('cssValsJson',cssValsJson) // todo: remove log

//////////////////////////////////////////////////////////////////////////////////////////

body.addEventListener('mousedown',onMouseDownBody,false)
body.addEventListener('click',onClickBody,false)
body.addEventListener('change',onChange,false)
body.addEventListener('input',onInput,false)
window.addEventListener('resize',onResize,false)

let lastTarget
let newTarget

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
    body.removeChild(ghost)
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
      const value = target.value
      addStyle(name,value)
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
    const isCSS = target.matches('textarea')
    if (isCSS){
      alterstyle.textContent = target.value
    }
  }
}

/**
 * Resize event handler
 */
function onResize(){
  moveGhost()
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
  //
  dialog.innerHTML = `<h3>${NAME}</h3><button class="${className.close}"></button>

      <ul class="${className.tree}">${
        parents.reverse().map((elm,i,a)=>`<li${i===a.length-1?' class="current"':''}><button data-index="${i}">${elm.nodeName}</button></li>`).join('')+(children.length?`&gt;<select data-children>${defaultOption+Array.from(children).map((child,j)=>`<option value="${j}">${child.nodeName}</option>`)}</select>`:'')
      }</ul>
      <hr>

      <ul class="css">${appliedCSS.map(s=>`<li>${s}</li>`).join('')}</ul>

      <hr>
      ${Object.keys(cssPropsJson).map((legend,i)=>`<fieldset>
        <input type="checkbox" name="props" class="collapse visually-hidden" id="check${legend}" ${i===0?'checked':''} />
        <label for="check${legend}"><legend>${legend}</legend></label>
        <div>
          ${cssPropsJson[legend].map(propertyName=>`<label>
            <span>${propertyName}</span>
            <select name="${propertyName}" data-prop>
              ${defaultOption+cssValsJson[propertyName].map(value=>`<option>${value}</option>`)}
            </select>
          </label>`).join('')}
        </div>
      </fieldset>`).join('')}

      <hr>
      <fieldset>
        <label>background-color<input name="background-color" type="color" data-prop></input></label>
      </fieldset>

      <hr>
      <textarea></textarea>`

  showCSS()
  moveGhost()
  body.appendChild(ghost)
}

/**
 * Move the ghost element
 */
function moveGhost(){
  if (lastTarget&&ghost.parentNode){
    const rect = lastTarget.getBoundingClientRect()
    Object.assign(ghost.style,{
        top: rect.y+px
        ,left: rect.x+px
        ,width: rect.width+px
        ,height: rect.height+px
    })
  }
}

/**
 * Add a style
 * @param {string} prop
 * @param {string} value
 */
function addStyle(prop,value){
  const querySelector = css(lastTarget)
      .map(s => s.split(/\s*{/).shift())
      .map(selector => ({selector,value: selector.split(/[.#\s]/g).length}))
      .reduce((highest,other) => other.value>=highest.value?other:highest,{selector: '',value: 0})
      .selector
      ||
      elementAndParents(lastTarget)
      .reverse()
      .splice(2)
      .map(elm => {
        const id = elm.getAttribute('id')
        const classes = elm.getAttribute('class')
        return id&&`#${id}`||classes&&classes.split(/\s/g).map(c=>`.${c}`).join('')||elm.nodeName.toLowerCase()
      })
      .join(' ')
  //
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
  moveGhost()
}

/**
 * Apply the new CSS to the textarea value
 */
function showCSS(){
  const {sheet: {rules}} = alterstyle
  dialog.querySelector('textarea').value = Array.from(rules)
      .map(rule=>rule.cssText)
      .join('\n')
      .replace(/([{;])\s/g,'$1\n  ')
      .replace(/\s*}/g,'\n}\n  ')
}