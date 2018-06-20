import {NAME} from './'
import {sluggify} from '../util'

const name = sluggify(NAME)

export const className = {
  main: `${name}`
  ,ghost: `${name}ghost`
  ,ghostHandle: `${name}ghostHandle`
  ,close: `${name}close`
  ,current: `${name}current`
  ,tree: `${name}tree`
  ,selectors: `${name}selectors`
}

export const css = `
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');

  .${name} {
  
    --color-font: #333;
    --color-input-background: #FFF;
    --color-background1: #FFF;
    --color-background2: #EEE;
    --color-border: #CCC;
    --colord-hr: #999;
    
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
  .${name}::backdrop {
    background-color: transparent;
  }
  .${name} * {
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
  .${name}--dark input, .${name}--dark textarea, .${name}--dark select {
    background-color: var(--color-input-background);
  }
  .${name}--inline {
    position: relative;
    right: auto;
    top: auto;
    box-shadow: none;
    background: none;
  }
  .${name}--dark {
    --color-font: #FFC66D;
    --color-input-background: #2B2B2B;
    --color-background1: #3C3F41;
    --color-background2: #313335;
    --color-border: #333;
    --color-hr: #FFC66D;
  }
  
  .${name} h3, .${name} .${className.close} {
    position: absolute;
    top: 2px;
    line-height: 100%;
    font-weight: bold;
  }
  .${name} h3 {
    left: 4px;
  }
  .${name} .${className.close} {
    right: 4px;
    border: 0;
    background: transparent;
  }
  .${name} .${className.close}:after {
    content: '✖';
  }
  .${name} .${className.current} {
    box-shadow: 0 0 0 1px #F04;
  }
  
  .${name} hr {
    margin: 8px 0;
    border: 0;
    height: 1px;
    background-color: var(--color-hr);
    box-shadow: 100px 0 0 var(--color-hr),  -100px 0 0 var(--color-hr);
  }
  
  .${name} input, .${name} select, .${name} textarea {
    border: 0;
    box-shadow: 2px 4px 16px rgba(0,0,0,0.1) inset, 0 0 1px #999 inset;
  }
  
  .${name} .${className.tree} {
    display: block;
    padding: 0;
  }
  .${name} .${className.tree} li {
    display: inline-block;
  }
  .${name} .${className.tree} li.current button {
    font-weight: bold;
  }
  .${name} .${className.tree} button, .${className.tree} select, .${className.tree} option {
    text-transform: lowercase;
  }
  .${name} .${className.tree} li:not(:first-child):before {
    content: '>';
  }
  .${name} .${className.tree} button {
    border: 0;
    background: transparent;
    padding: 0;
    box-shadow: none;
  }
  
  .${name} .${className.selectors} .current {
    font-weight: bold;
  }
  
  .${name} legend {
    display: block;
    width: 100%;
    box-shadow: 0 -1px 0 var(--color-border);
    cursor: pointer;
    font-weight: bold;
  }
  .${name} .collapse+label+div {
    display: none;
  }
  .${name} .collapse+label {
    display: block;
  }
  .${name} .collapse+label legend:after {
    content: '>';
    display: inline-block;
    margin-left: 10px;
  }
  .${name} .collapse:checked+label+div {
    display: block;
    margin: 8px 0;
  }
  .${name} .collapse:checked+label legend:after {
    transform: rotate(90deg); 
  }
  
  .${name} label {
    display: flex;
  }
  .${name} fieldset {
    border: 0;
  }
  .${name} fieldset div label>* {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .${name} fieldset div label>*:nth-child(1) {
    flex: 30% 0 0;
    max-width: 30%;
    order: 1;
  }
  .${name} fieldset div label>*:nth-child(2) {
    flex: 40px 1 0;
    /*max-width: 40px;*/
    order: 3;
  }
  .${name} fieldset div label>*:nth-child(3) {
    flex: auto 1 1;
    order: 2;
  }
  
  .${name} textarea {
    width: 100%;
    min-height: 150px;
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

const handleSize = 12
export const cssGhost = `
  .${className.ghost} {
    position: absolute;
    box-shadow: 0 0 0 1px rgba(0,0,255,0.6), 0 0 8px rgba(0,0,255,0.3);
    pointer-events: none;
  }
  .${className.ghostHandle} {
    position: absolute;
    width: ${handleSize}px;
    height: ${handleSize}px;
    transform: translate(-${handleSize/2}px,-${handleSize/2}px);
    cursor: pointer;
    box-shadow: 0 0 0 2px rgba(0,0,255,0.6) inset;
    background-color: white;
  }
`
