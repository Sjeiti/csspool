//http://www.brothercake.com/site/resources/scripts/cssutilities/

import {NAME} from './config'

const name = 'xmqp'
const classNameGhost = `${name}ghost`
const classNameClose = `${name}close`
const classNameCurrent = `${name}current`
const classNameTree = `${name}tree`
const defaultOption = '<option value="-1">…</option>'
const body = document.body
const px = 'px'
const cssProps = [
    {name:'position',values:["static","absolute","fixed","relative","initial","inherit"]}
    ,{name:'left',values:["auto","length","%","initial","inherit"]}
    ,{name:'top',values:["auto","length","%","initial","inherit"]}
    ,{name:'right',values:["auto","length","%","initial","inherit"]}
    ,{name:'bottom',values:["auto","length","%","initial","inherit"]}
]

const ghost = document.createElement('div')
ghost.classList.add(classNameGhost)

const dialog = document.createElement('dialog')
dialog.classList.add(name)
body.appendChild(dialog)

const uistyle = document.createElement('style')
uistyle.innerHTML = `
dialog.${name} {
  position: absolute;
  left: 50px;
  top: 20px;
    /*display: block;*/
  min-width: 200px;
  min-height: 200px;
  border: 0;
  box-shadow: 0 0 16px black;
}
dialog.${name} * {
  position: initial;
  left: initial;
  top: initial;
  bottom: initial;
  right: initial;
  margin: initial;
  padding: initial;
}
/*::backdrop*/
dialog.${name} .${classNameCurrent} {
  box-shadow: 0 0 0 1px red;
}
dialog.${name} .${classNameTree} {
  display: block;
  padding: 0;
}
dialog.${name} .${classNameTree} li {
  display: inline-block;
}
dialog.${name} .${classNameTree} button, .${classNameTree} select, .${classNameTree} option {
  text-transform: lowercase;
}
dialog.${name} .${classNameTree} li:not(:first-child):before {
  content: '>';
}
dialog.${name} .${classNameTree} button {
  border: 0;
  background: transparent;
  padding: 0;
}
.${classNameGhost} {
  position: absolute;
  box-shadow: 0 0 0 1px blue;
}
dialog.${name} .${classNameClose} {
  position: absolute;
  right: 2px;
  top: 2px;
  border: 0;
  background: transparent;
}
dialog.${name} .${classNameClose}:after {
  content: '✖';
}`
body.appendChild(uistyle)

const alterstyle = document.createElement('style')
body.appendChild(alterstyle)

//////////////////////////////////////////////////////////////////////////////////////////

body.addEventListener('mousedown',onMouseDownBody,false)
body.addEventListener('click',onClickBody,false)
body.addEventListener('change',onChange,false)
let lastTarget
let newTarget
function onMouseDownBody(e){
  const {target} = e
  newTarget = target
}
function onClickBody(){
  const parents = elementAndParents(newTarget)
  if (!parents.includes(dialog)) {
    dialog.close()
    setDialog(newTarget)
    dialog.showModal()
  } else if (newTarget.classList.contains(classNameClose)) {
    body.removeChild(ghost)
    dialog.close()
  } else if (newTarget.nodeName==='BUTTON'&&parents.includes(dialog.querySelector(`.${classNameTree}`))) {
    const lastPparents = elementAndParents(lastTarget)
    const index = parseInt(newTarget.getAttribute('data-index'),10)
    const element = lastPparents[lastPparents.length-1-index]
    setDialog(element)
  }
}
function onChange(e){
  const {target} = e
  const parents = elementAndParents(target)
  const isDialog = parents.includes(dialog)
  if (isDialog) {
    const isSelectChildren = target.matches('select[data-children]')
    const isProp = target.matches('[data-prop]')
    if (isSelectChildren) {
      const {children} = lastTarget
      const index = parseInt(target.value,10)
      const element = children[index]
      setDialog(element)
    } else if (isProp) {
      const name = target.getAttribute('name')
      const value = target.value
      addStyle(name,value)
    }
  }
}
function setDialog(target){
  lastTarget = target
  const {children} = target
  const parents = elementAndParents(target)
  //
  const appliedCSS = css(target)
  console.log('appliedCSS',appliedCSS)
  //
  //
  dialog.innerHTML = `<h3>${name}</h3><button class="${classNameClose}"></button>
      <ul class="${classNameTree}">${parents.reverse().map((elm,i)=>`<li><button data-index="${i}">${elm.nodeName}</button></li>`).join('')+(children.length?`&gt;<select data-children>${defaultOption+Array.from(children).map((child,j)=>`<option value="${j}">${child.nodeName}</option>`)}</select>`:'')}</ul>
          
      element: ${target.nodeName}
          
      <ul>${appliedCSS.map(s=>`<li>${s}</li>`)}</ul>
      
      ${cssProps.map(prop=>`<fieldset>
      	<label>${prop.name}<select name="${prop.name}" data-prop>${defaultOption+prop.values.map(value=>`<option>${value}</option>`)}</select><fieldset>`).join('')}
        <fieldset>
      	<label>background-color<input name="background-color" type="color" data-prop></input></label></fieldset>`
  // ghost element
  const rect = target.getBoundingClientRect()
  Object.assign(ghost.style,{
      top: rect.y+px
      ,left: rect.x+px
      ,width: rect.width+px
      ,height: rect.height+px
  })
  body.appendChild(ghost)
}
function addStyle(prop,value){
  console.log('rules',alterstyle.sheet.rules)
  const parents = elementAndParents(lastTarget).reverse()
  const selector = parents.map(elm=>elm.nodeName.toLowerCase()).join(' ')
  console.log(name,value,alterstyle,alterstyle.sheet)
  console.log(parents.map(elm=>elm.nodeName.toLowerCase()).join(' '))
  alterstyle.sheet.insertRule(`${selector} { ${prop}: ${value} }`)//, 1
}
/**
 * Returns a list with the element and its parents
 * @param {HTMLElement} element
 * @returns {HTMLElement[]}
 * @todo: unit test
 */
function elementAndParents(element) {
    const result = [];
    while (element && element.parentNode) {
        result.push(element);
        element = element.parentNode;
    }
    return result;
}
/**
 * from: https://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element
 */
function css(el) {
    var sheets = document.styleSheets, ret = [];
    el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector
        || el.msMatchesSelector || el.oMatchesSelector;
    for (var i in sheets) {
            //
        try{
        //
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (el.matches(rules[r].selectorText)) {
                ret.push(rules[r].cssText);
            }
        }
        //
        }catch(err){err}
        //
    }
    return ret;
}