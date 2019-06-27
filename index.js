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
let linksStatus =[];
let hrefLink = [];
let filename = [];

//console.log(process.argv);

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
    
    hrefLink = links.map(link=>{
    return link.href;
    });

    console.log(hrefLink);
    console.log("Total =" +" "+ hrefLink.length);


  hrefLink.forEach(element => {
    let hrefLink = {};
  fetch(element)
    .then(res => {
     
      hrefLink.url = res.url;
      hrefLink.ok = res.ok;
      hrefLink.status = res.status;
      hrefLink.statusText = res.statusText;
      linksStatus.push(hrefLink);
      console.log(linksStatus);

      //console.log( hrefLink.url+" "+  hrefLink.ok+" "+  hrefLink.status+" "+  hrefLink.statusText);
     // console.log(res.url+" "+ res.ok+" "+ res.status+" "+ res.statusText);
       
    });
        })

    // .catch(error =>{
    //   console.log(error);
    // })
      }

  const SearDirectoryFile = (directory) =>{

  const files = FileHound.create()
    .discard("node_modules")
    .paths(directory)
    .ext('md')
    .find();
  //files.then(console.log);
  files.then (res =>{
    res.forEach((element, index)=> {
      //imprimir los archivos con basename
      console.log(`${index}: ${path.basename(element)}`);
   links(element);
    // res.forEach (element =>{
    //   filename =  path.basename(element);
    //   console.log(filename);
    })
  })

  // .catch(error =>{
  //   console.log(error);
  // })
//filename.then(name => {
//name.forEach(element => {
//let analized = links(element);
//console.log(analized);
// })
// })

// links.forEach((element) => {
//   if (!LinksUnique.includes(element)) {
//       LinksUnique.push(element);
//   }

}