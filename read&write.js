const fs = require('fs')
const {promisify} =require('util')
 function write(massege,ipU,file,calback) {
try
{
let masseges='';
const read_file = fs.createReadStream('data.json',{encoding:"utf-8"})
read_file.on('data',(chunk)=>{masseges+=chunk})
read_file.on('error',(error)=>{console.log(error); calback(error,null); return;})
read_file.on('end',()=>{
     let goingToAdd = JSON.parse(masseges || '[]');
     let f =null;
     if(file!=1){
         f = {
            text: massege,
            user: ipU,  
            timestamp: new Date().toISOString()
        }
        }
        else{
          f = {
            text: "/filesss/"+massege,
            user: "file",  
            sender:ipU,
            file:"itsAFile",
            timestamp: new Date().toISOString()
        }   
        }
     goingToAdd.push(f);
    const writeing = fs.createWriteStream('data.json')
    writeing.write(JSON.stringify(goingToAdd,null,2))
    writeing.end(()=>{
        let res = f
        calback(null,res)
    })
    writeing.on('error',(error)=>{console.log(error); calback(error,null); return;})

})

}

catch(error)
{
    calback(error,null); return;
}
    
}

function read(path,calback)
{
    try{
    let masseges='';
const read_file = fs.createReadStream(path,{encoding:"utf-8"})
read_file.on('data',(chunk)=>{masseges+=chunk})
read_file.on('error',(error)=>{console.log(error); calback(error,null); return;})
read_file.on('end',()=>{
    calback(null,masseges)
})
}
catch(error){
    console.log(error)
    calback(error,null)

}
}

const promises = promisify(write)
const read_promises = promisify(read)
const doTheWrite = async (message,ipU,file) => {
    return await promises(message,ipU,file);  
};
const doTheread = async (path) => {
    return await read_promises(path);  
};
module.exports = { doTheWrite,doTheread };