//Funcionalidades instaladas
const chalk = require('chalk');
const fetch = require('node-fetch');
const path = require('path');
const marked = require('marked');
const fs = require('fs');
const FileHound = require('filehound');

//Declaración de variables globales
let arrayLinksFromFile =[];
let totalLinksFromOptionStats = [];
let uniqueLinksFromOptionStats = [];
let arrayStatusLinksWithFectch =[];
let arrayOnlyStatus = [];
let brokenLinksCounter = 0;

const mdLinks = (pathTerminal, options) => {

    //fs.stats() diferencia si lo introducido por el usuario es un archivo o un directorio
    fs.stat(pathTerminal, (err, stats) => {
        
    if (err) {
        console.error(err)
    }
    
    else if(stats.isFile()){
        //console.log(chalk.magenta('Soy un archivo'));
        getArrayLinksFromFileFromFile(pathTerminal);
    }

    else if(stats.isDirectory()){
        console.log(chalk.magenta('Soy un directorio'));
        getMdFilesFromDirectories(pathTerminal);
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
        console.log(options);
        if(options[0].both){
            parametersGivenByOptionStats(arrayLinksFromFile);
        }
      
        else if (options[0].validate) {
            evaluationStatusOfLinksWithFetch(arrayLinksFromFile); 
         }
        
        else if (options[0].stats) {
            parametersGivenByOptionStats(arrayLinksFromFile);
         }

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
    
    arrayStatusLinksWithFectch =[];

    array.map(element =>{
    
        fetch(element.href)
        
        .then( res =>{
        arrayStatusLinksWithFectch.push({
        
            statusText : res.statusText,
            status : res.status
        
        })   
            
        console.log(`${chalk.magenta(path.basename(element.file))} ${chalk.green(element.href)} ${chalk.yellow(res.statusText)} ${chalk.blue(res.status)} ${element.text}`);  
        
        if(array.length === arrayStatusLinksWithFectch.length && options[0].both){
            brokensLinksForOptionStatsAndValidate(arrayStatusLinksWithFectch);
        }
        return element;
        })

        .catch(error =>{
        console.log(error);
        })

    })

    }

    const brokensLinksForOptionStatsAndValidate = (arraystatus) =>{

    arrayOnlyStatus = arraystatus.map(el=>{
        return el.status;
    });
    
    arrayOnlyStatus.forEach((el, index) =>{
        if (el >= 400){    
        brokenLinksCounter = brokenLinksCounter + 1;    
        }
        
        if(arrayOnlyStatus.length-1 === index){
            console.log(`Broken: ${chalk.blue(brokenLinksCounter)}`);
        } 
    }) 
    } 

    //FileHound busca archivos con formato md dentro de los directorios
    const getMdFilesFromDirectories = (pathTerminal) =>{

    const files = FileHound.create()
    .discard('node_modules')
    .paths(pathTerminal)
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

}

module.exports = mdLinks;