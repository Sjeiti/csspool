import {NAME} from './'
import {sluggify} from '../util'

const name = sluggify(NAME)

export const className = {
  main: `${name}`
  ,ghost: `${name}ghost`
  ,close: `${name}close`
  ,current: `${name}current`
  ,tree: `${name}tree`
  ,selectors: `${name}selectors`
}

export const css = `
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');


  dialog.${name} {
  
    --color-font: #333;
    --color-input-background: #FFF;
    --color-background1: #FFF;
    --color-background2: #EEE;
    --color-border: #CCC;
    --color-hr: #333;
    
    position: absolute;
    left: auto;
    right: 0;
    top: 0;
    padding: 20px 10px 10px;
    min-width: 200px;
    min-height: 200px;
    border: 0;
    border-radius: 2px;
    box-shadow: 1px 4px 16px rgba(0,0,0,0.3), 0 0 0 1px red;
    background: linear-gradient(var(--color-background1), var(--color-background2));
    overflow: hidden;
  }
  dialog.${name}::backdrop {
    background-color: transparent;
  }
  dialog.${name} * {
    position: initial;
    left: initial;
    top: initial;
    bottom: initial;
    right: initial;
    margin: initial;
    padding: initial;
    font-size: 12px;
    line-height: 140%;
    font-family: Source Code Pro,monospace;
    color: var(--color-font);
    border-color: var(--color-border);
  }
  dialog.${name}--dark input, dialog.${name}--dark textarea, dialog.${name}--dark select {
    background-color: var(--color-input-background);
  }
  
  dialog.${name}--dark {
    --color-font: #FFC66D;
    --color-input-background: #2B2B2B;
    --color-background1: #3C3F41;
    --color-background2: #313335;
    --color-border: #333;
    --color-hr: #FFC66D;
  }
  
  dialog.${name} h3, dialog.${name} .${className.close} {
    position: absolute;
    top: 2px;
    line-height: 100%;
    font-weight: bold;
  }
  dialog.${name} h3 {
    left: 4px;
  }
  dialog.${name} .${className.close} {
    right: 4px;
    border: 0;
    background: transparent;
  }
  dialog.${name} .${className.close}:after {
    content: '✖';
  }
  dialog.${name} .${className.current} {
    box-shadow: 0 0 0 1px #F04;
  }
  
  dialog.${name} hr {
    margin: 8px 0;
    border: 0;
    height: 1px;
    background-color: var(--color-hr);
    box-shadow: 100px 0 0 var(--color-hr),  -100px 0 0 var(--color-hr);
  }
  
  dialog.${name} .${className.tree} {
    display: block;
    padding: 0;
  }
  dialog.${name} .${className.tree} li {
    display: inline-block;
  }
  dialog.${name} .${className.tree} li.current button {
    font-weight: bold;
  }
  dialog.${name} .${className.tree} button, .${className.tree} select, .${className.tree} option {
    text-transform: lowercase;
  }
  dialog.${name} .${className.tree} li:not(:first-child):before {
    content: '>';
  }
  dialog.${name} .${className.tree} button {
    border: 0;
    background: transparent;
    padding: 0;
  }
  
  dialog.${name} .${className.selectors} .current {
    font-weight: bold;
  }
  
  dialog.${name} legend {
    display: block;
    width: 100%;
    box-shadow: 0 1px 0 var(--color-border), 0 -1px 0 var(--color-border);
    cursor: pointer;
    font-weight: bold;
  }
  dialog.${name} .collapse+label+div {
    display: none;
  }
  dialog.${name} .collapse+label {
    display: block;
  }
  dialog.${name} .collapse+label legend:after {
    content: '>';
    display: inline-block;
    margin-left: 10px;
  }
  dialog.${name} .collapse:checked+label+div {
    display: block;
    margin: 8px 0;
  }
  dialog.${name} .collapse:checked+label legend:after {
    transform: rotate(90deg); 
  }
  
  dialog.${name} label {
    display: flex;
  }
  dialog.${name} fieldset div label>* {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  dialog.${name} fieldset div label>*:nth-child(1) {
    flex: 30% 0 0;
    max-width: 30%;
    order: 1;
  }
  dialog.${name} fieldset div label>*:nth-child(2) {
    flex: 40px 1 0;
    /*max-width: 40px;*/
    order: 3;
  }
  dialog.${name} fieldset div label>*:nth-child(3) {
    flex: auto 1 1;
    order: 2;
  }
  
  dialog.${name} textarea {
    width: 100%;
    min-height: 150px;
  }
  
  .${className.ghost} {
    position: absolute;
    box-shadow: 0 0 0 1px rgba(0,0,255,0.6), 0 0 8px rgba(0,0,255,0.3);
  }
  
  .visually-hidden {
    position: absolute !important;
    clip: rect(1px, 1px, 1px, 1px);
    padding:0 !important;
    border:0 !important;
    height: 1px !important; 
    width: 1px !important; 
    overflow: hidden;
  }
`
