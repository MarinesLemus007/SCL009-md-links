#!/usr/bin/env node

const process = require('process'); 
const mdLinks= require('./src/md-links.js');

let rescueValuesFromTerminal = [];
let optionsFromTerminal = [];

//process.arg() me permite rescatar lo ingresado por el usuario desde la terminal
process.argv.forEach((val, index) => {

  rescueValuesFromTerminal.push(process.argv[index]);

});

if ((rescueValuesFromTerminal[3] === "--validate" && rescueValuesFromTerminal[4] === "--stats" ) || (rescueValuesFromTerminal[3] === "--stats" && rescueValuesFromTerminal[4] === "--validate" )){
  mdLinks(rescueValuesFromTerminal[2], optionsFromTerminal); 
  optionsFromTerminal.push({
    both: true
  });
}

else if(rescueValuesFromTerminal[3] === "--validate"){
  mdLinks(rescueValuesFromTerminal[2], optionsFromTerminal); 
  optionsFromTerminal.push({
    validate:true
  });
}

else if(rescueValuesFromTerminal[3] === "--stats"){
  mdLinks(rescueValuesFromTerminal[2], optionsFromTerminal); 
  optionsFromTerminal.push({
    stats:true
  });
}

else if(rescueValuesFromTerminal.length<=3){
  mdLinks(rescueValuesFromTerminal[2], optionsFromTerminal); 
  optionsFromTerminal.push({
    default:true
  });
}

  mdLinks(rescueValuesFromTerminal[2], optionsFromTerminal)
  .then(res => {   
    console.log(res);
  })
  .catch(err =>{
    console.log(err);
  })
  