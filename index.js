#!/usr/bin/env node
// module.exports = () => {
//   // ...
// };

//Funcionalidades instaladas
const chalk = require('chalk');
const fetch = require('node-fetch');
const path = require('path');
const process = require('process');
const marked = require('marked');
const fs = require('fs');
const FileHound = require('filehound');

//Declaración de variables globales
let arrayLinksFromFile =[];
let rescueValuesFromTerminal = [];
let totalLinksFromOptionStats = [];
let uniqueLinksFromOptionStats = [];
let brokenLinksCounter = 0;

//process.arg() me permite rescatar lo ingresado por el usuario desde la terminal
process.argv.forEach((val, index) => {

  rescueValuesFromTerminal.push(process.argv[index]);

});
//console.log(rescueValuesFromTerminal);

//fs.stats() diferencia si lo introducido por el usuario es un archivo o un directorio
fs.stat(rescueValuesFromTerminal[2], (err, stats) => {
    
  if (err) {
    console.error(err)
  }
  
  if(stats.isFile()){
    console.log(chalk.magenta('Soy un archivo'));
    getArrayLinksFromFileFromFile(rescueValuesFromTerminal[2]);
  }

  if(stats.isDirectory()){
    console.log(chalk.magenta('Soy un directorio'));
    getMdFilesFromDirectories(rescueValuesFromTerminal[2]);
  }
    
  })

//fs.readFile busca y toma los links encontrados en los archivos
  const getArrayLinksFromFileFromFile = (path) =>{
    fs.readFile(path,'utf8', (err,data) =>{
      
      if(err){
        throw err;
      }
      
      arrayLinksFromFile =[];
  
      const renderer = new marked.Renderer();
  
      renderer.link = function(href, title, text){
  
        arrayLinksFromFile.push({
          
          href:href,
          text:text,
          file:path
        
        })
 
      }
      
      marked(data, {renderer:renderer})
      //console.log(arrayLinksFromFile);
      
      evaluationStatusOfLinksWithFetch(arrayLinksFromFile);
      parametersGivenByOptionStats(arrayLinksFromFile);

    })
  
  }

//Función asociada a la opcion Stats que ofrece el total de links encontrados y únicos
const parametersGivenByOptionStats = (array) => {
  totalLinksFromOptionStats = array.map(el => {
    return el.href;
  });
  
  uniqueLinksFromOptionStats = totalLinksFromOptionStats.filter((item,index,arr) => {
      return arr.indexOf(item) === index;
  });
  
  console.log(`Total: ${chalk.blue(totalLinksFromOptionStats.length)} \nUnique: ${chalk.blue(uniqueLinksFromOptionStats.length)}`);
  
}
 
//fetch evalua los estatus de los links encontrados
const evaluationStatusOfLinksWithFetch = (array) => {
  
  array.map(element =>{
    
    return fetch(element.href)
    .then( res =>{
     
      element.status = res.status;
      element.statusText = res.statusText;
      
      console.log(`${chalk.green(element.href)} ${chalk.yellow(element.statusText)} ${chalk.blue(element.status)} ${element.text}`);  
      
      brokensLinksForOptionStatsAndValidate(element.status);
      return element;
    });  
    
  })
   
}

const brokensLinksForOptionStatsAndValidate = (status) =>{

  if (status >= 400){    
    brokenLinksCounter = brokenLinksCounter + 1;
  }
  console.log(`Broken: ${chalk.blue(brokenLinksCounter)}`);
  return brokenLinksCounter;   
} 
 
//FileHound busca archivos con formato md dentro de los directorios
const getMdFilesFromDirectories = (directory) =>{

  const files = FileHound.create()
  .discard('node_modules')
  .paths(directory)
  .ext('md')
  .find();
  
    files.then (res =>{
      res.forEach((element, index)=> {
        
        console.log(`${chalk.blue(index)}: ${path.basename(element)}`);
        
        getArrayLinksFromFileFromFile(element);
      })
    })

  .catch(error =>{
  console.log(error);
  })

}