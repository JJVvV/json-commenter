#!/usr/bin/env node
/******************************************
 *  Author : Author   
 *  Created On : Thu Oct 12 2017
 *  File : index.js
 *******************************************/


let path = require('path')
let fs = require('fs')
let program = require('commander')
let {exec} = require('child_process')
// 默认文件后缀
let extension = '.jc'
// 默认文件输出路径
let defaultOutput = './'
let createFolders = (to) => {
    
    let sep = path.sep,
        folder = '',
        folders
   
    folders = path.dirname(to).split(sep)
    while(folders.length){
        folder += folders.shift() + sep
        if(!fs.existsSync(folder)){
            // exec('')
            fs.mkdirSync(folder, 0777)
        }
    }
}

function list(val){
    return val.split(',')
}

program.version('0.1.0')
        .usage('json文件')
        .description('生成json文件')

program.option('-w --watch [value]', 'watch（是否实时监测文件变化）', list)
        .option('-f --file <value>', 'url of entry（入口文件地址或文件夹）', list)
        .option('-t --to [value]',   "url of output（输出文件夹地址，默认当前文件夹'./'）", defaultOutput)
        .option('-e --ext [value]',  "extension of file being watched（被检测的文件后缀，默认为'.jc'）", extension)

    
program.parse(process.argv)


if(program.file){
    if(Array.isArray(program.file)){
        program.file.forEach((item)=> {
            handleFile(item, program.to)
        })
    }else{
        handleFile(program.file, program.to)
    }
    
}

function loopSrc(from, filter=()=>{return true}, callback){
    
    if(!fs.existsSync(from)) {
        console.log(`file not exit: ${from}`)
        return
    }
    if(fs.statSync(from).isDirectory()){
        
        let files = fs.readdirSync(from)
        files.forEach((file, index) => {
           let curPath = `${from}/${file}`
         
           loopSrc(curPath, filter, callback)
        });
    }else{
        
        if(filter(from)) callback(from)
    }
}

function handleFile(fileFrom, fileTo){
    console.log(fileFrom)
    // let from = path.join(__dirname, fileFrom)
    let readWrite = (f, to)=> {
        fs.readFile(f, (err, data) => {
            if(err) throw err
        
            let content = data.toString()
            content = (new Function(`let data = ${content}; return data`))()
            fs.writeFile(to, JSON.stringify(content, null, 4), (err) => {
                if(err) throw err
                console.log(`${f}--->${to} 成功`)
            })
        })   
    }
    loopSrc(fileFrom,(f) => {
        return path.extname(f) === program.ext
    }, (f) => {
       console.log('readwrite')
        let fromName = path.basename(f, program.ext)
        let to = path.join(fileTo||'./', `${fromName}.json`)
        createFolders(to)
     
        readWrite(f, to)
        
        if(program.watch){
            console.log(`正在监听${f}`)
            fs.watchFile(f, () => {
                console.log('文件变化，正在重新生成')
                readWrite(f, to)
            })    
        }
    })
}

program.parse(process.argv)

