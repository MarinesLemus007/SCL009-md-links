//Dependencias instaladas
const fetch = require('node-fetch');
const marked = require('marked');
const fs = require('fs');
const FileHound = require('filehound');

const mdLinks = (pathTerminal, options) => {
    return new Promise((resolve, reject) =>{
        //fs.stats() diferencia si lo introducido por el usuario es un archivo o un directorio
        fs.stat(pathTerminal, (err, stats) => {
            
            if (err) {
                reject(err);
            }

            else if(stats.isFile()){
                getArrayLinksFromFile(pathTerminal, options)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
            }

            else if(stats.isDirectory()){
                getMdFilesFromDirectories(pathTerminal, options)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
            }
        })
        
        //fs.readFile busca y toma los links encontrados en los archivos
        const getArrayLinksFromFile = (path, options) =>{
            
            return new Promise((resolve, reject) =>{
                
                fs.readFile(path,'utf8', (err,data) =>{
               
                    if(err){
                        reject(err);
                    }
                
                    let arrayLinksFromFile =[];
                
                    const renderer = new marked.Renderer();
                
                    renderer.link = function(href, title, text){
                
                        arrayLinksFromFile.push({
                        
                            href:href,
                            text:text,
                            file:path
                        
                        })  
                    }
            
                    marked(data, {renderer:renderer})

                    if(options[0].default){
                        resolve(arrayLinksFromFile);   
                    }
                
                    else if(options[0].both){
                       
                        resolve(evaluationStatusOfLinksWithFetch(arrayLinksFromFile));     
                    }
            
                    else if (options[0].validate) {
                        resolve(evaluationStatusOfLinksWithFetch(arrayLinksFromFile)); 
                    }
                
                    else if (options[0].stats) {
                        resolve(parametersGivenByOptionStats(arrayLinksFromFile));
                    }
                })
            })
        }

        //Función asociada a la opcion Stats que ofrece el total de links encontrados y únicos
        const parametersGivenByOptionStats = (arrayStats) => {
            return new Promise((resolve, reject) => {

                let optionResponseStats= {};

                let totalLinksFromOptionStats = [];
                totalLinksFromOptionStats = arrayStats.map(el => {
                    return el.href;
                });

                let uniqueLinksFromOptionStats = [];
                uniqueLinksFromOptionStats = totalLinksFromOptionStats.filter((item,index,arr) => {
                    return arr.indexOf(item) === index;
                });

                optionResponseStats.Total = totalLinksFromOptionStats.length;
                optionResponseStats.Unique = uniqueLinksFromOptionStats.length;
                resolve(optionResponseStats);

                if(err){
                    reject(err);
                }

            })
        }

        //fetch evalua los estatus de los links encontrados
        const evaluationStatusOfLinksWithFetch = (arrayLinksFromFile) => {
        
            let arrayStatusLinksWithFectch =[];
          
            return new Promise((resolve, reject) =>{
         
                arrayLinksFromFile.forEach((element, index) => {
                    
                   fetch(element.href)
                    .then(res => {
                    
                        arrayStatusLinksWithFectch.push({
                                
                            file: element.file,
                            href: res.url, 
                            statusText: res.statusText,
                            status: res.status,
                            text: element.text
                    
                        });
                    
                        if(options[0].validate){
                            setTimeout(() => {
                                resolve(arrayStatusLinksWithFectch); 
                            }, 3000); 
                        }
                        
                        if(options[0].both){
                            setTimeout(() => {
                                resolve(parametersGivenByOptionBoth(arrayStatusLinksWithFectch));
                            }, 2000);   
                        }

                    })

                    .catch(error =>{
                        reject(error);
                    })
                });  
            });
        }

        const parametersGivenByOptionBoth = (arrayBoth) => {
            return new Promise((resolve, reject) => {

                let optionResponseStats= {};

                let totalLinksFromOptionBoth = [];
                totalLinksFromOptionBoth = arrayBoth.map(el => {
                    return el.href;
                });

                let uniqueLinksFromOptionBoth = [];
                uniqueLinksFromOptionBoth = totalLinksFromOptionBoth.filter((item,index,arr) => {
                    return arr.indexOf(item) === index;
                });

                let BrokenLinksFromOptionBoth =[];
                BrokenLinksFromOptionBoth = arrayBoth.filter(el => el.statusText === "Not Found");
            

                optionResponseStats.Total = totalLinksFromOptionBoth.length;
                optionResponseStats.Unique = uniqueLinksFromOptionBoth.length;
                optionResponseStats.Broken =  BrokenLinksFromOptionBoth.length; 
                resolve(optionResponseStats);

                if(err){
                    reject(err);
                }

            })
        }

        //FileHound busca archivos con formato md dentro de los directorios
        const getMdFilesFromDirectories = (pathTerminal, options) =>{
            return new Promise((resolve, reject) =>{
                const files = FileHound.create()
                .discard('node_modules')
                .paths(pathTerminal)
                .ext('md')
                .find();
                
                files
                 .then (res => {
                    res.forEach((element, index) => { 
                        resolve(getArrayLinksFromFile(element, options));
                    });
                })    
                .catch(error =>{
                    reject(error);
                })
            })
        }
    })
}

module.exports = mdLinks;