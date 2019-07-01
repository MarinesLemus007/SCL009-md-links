#!/usr/bin/env node
// module.exports = () => {
//   // ...
// };

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
  optionsFromTerminal.push(
    {both: true}
  );
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

else if(rescueValuesFromTerminal[3] === ""){
  
  mdLinks(rescueValuesFromTerminal[2], optionsFromTerminal); 
}

console.log(rescueValuesFromTerminal);