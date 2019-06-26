#!/usr/bin/env node
// module.exports = () => {
//   // ...
// };

const fetch = require('node-fetch');
const path = require('path');
const process = require("process");
const marked = require("marked");
const fs = require('fs');
const FileHound = require('filehound');

let terminalValue = [];

console.log(process.argv);

process.argv.forEach((val, index) => {
  terminalValue.push(process.argv[index]);
  //console.log(`${index}: ${val}`);
});
console.log(terminalValue);
  //terminalValue[2] = path

  fs.stat(terminalValue[2], (err, stats) => {
    
    if (err) {
      console.error(err)
    }
  
    if(stats.isFile()){

      console.log("Soy un archivo");
      links(terminalValue[2]);

    }

    if(stats.isDirectory()){
      console.log("Soy un directorio");
      SearDirectoryFile(terminalValue[2]);
    }
    
  })

  const links = (path) =>{
    fs.readFile(path,"utf8", (err,data) =>{
      if(err){
        throw err;
      }
        let links =[];
  
      const renderer = new marked.Renderer();
  
      renderer.link = function(href, title, text){
  
        links.push({
          
          href:href,
          text:text,
          file:path
        
        })
  
      }
      marked(data, {renderer:renderer})
        console.log(links);
        fetchlinks(links);
    })
  
  }
  //links(terminalValue[2]);

  const fetchlinks = (links) => {
    let hrefLink = [];
    hrefLink = links.map(link=>{
    return link.href;
    });

    console.log(hrefLink);

  hrefLink.forEach(element => {
  fetch(element)
    .then(res => {
     
        console.log(res.url);
        console.log(res.ok);
        console.log(res.status);
        console.log(res.statusText);
  
    });
        })
        
      }

  const SearDirectoryFile = (directory) =>{

  const files = FileHound.create()
    .paths(directory)
    .ext('md')
    .find();
  files.then(console.log);
  
}