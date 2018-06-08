import {NAME} from './'
import {sluggify} from '../util'

const name = sluggify(NAME)

export const className = {
  main: `${name}`
  ,ghost: `${name}ghost`
  ,close: `${name}close`
  ,current: `${name}current`
  ,tree: `${name}tree`
}

export const css = `
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');

  dialog.${name} {
    position: absolute;
    left: 50px;
    top: 20px;
    padding: 20px 10px 10px;
    min-width: 200px;
    min-height: 200px;
    border: 0;
    border-radius: 2px;
    box-shadow: 1px 4px 16px rgba(0,0,0,0.3), 0 0 0 1px red;
    background: linear-gradient(#FFF, #EEE);
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
  }
  dialog.${name} h3, dialog.${name} .${className.close} {
    position: absolute;
    top: 2px;
    line-height: 100%;
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
    box-shadow: 0 0 0 1px red;
  }
  
  dialog.${name} hr {
    margin: 8px 0;
    border: 0;
    height: 2px;
    background-color: #CCC;
    box-shadow: 100px 0 0 #CCC,  -100px 0 0 #CCC;
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
  
  dialog.${name} legend {
    display: block;
    width: 100%;
    box-shadow: 0 1px 0 #DDD, 0 -1px 0 #CCC;
    cursor: pointer;
  }
  dialog.${name} .collapse+label+div {
    display: none;
  }
  dialog.${name} .collapse+label {
    display: block;
  }
  dialog.${name} .collapse+label legend:after {
    content: '>';
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
    flex: 33.33% 0 0;
    max-width: 33.33%;
  }
  
  dialog.${name} textarea {
    width: 100%;
    min-height: 50px;
  }
  
  .${className.ghost} {
    position: absolute;
    box-shadow: 0 0 0 1px blue;
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
