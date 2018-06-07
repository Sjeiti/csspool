const util = require('./util')
    ,{read,save} = util
    ,cssProps = require('css-properties-values').reduce((acc,o)=>(acc[o.property]=o.values,acc),{})
    // ,fs = require('fs')
    // ,commander = require('commander')
    //     .usage('[options] <files ...>')
    //     .option('--source [source]', 'Source path')
    //     .option('--target [target]', 'Target path')
    //     .option('--sizes [sizes]', 'Sizes')
    //     .parse(process.argv)
    // ,{source,target} = commander
    // ,sizes = commander.sizes.split(/,/g).map(size=>size.split(/x/).map(parseFloat))

read('./src/config/cssProps.json')
  .then(JSON.parse)
  .then((props,list=[])=>(Object.values(props).forEach(values=>list.push(...values)),list))
  .then((list,obj={})=>(list.forEach(key=>obj[key]=cssProps[key]),obj))
  .then(JSON.stringify)
  .then(data=>save('./src/config/cssPropValues.json',data))