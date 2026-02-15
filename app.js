const express = require('express')
const multer = require('multer')
const EventEmitter = require('events')
const storage = multer.diskStorage({destination:'static/filesss/',filename:(req,file,cd)=>cd(null,file.originalname)})
const upload = multer({storage})
const fs = require('fs')
const {doTheWrite,doTheread} = require('./read&write.js')
const app = express()
const messageEvents = new EventEmitter()
let waitingguys = []
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob: ws: wss:; " +
        "connect-src *; " +
        "img-src * data:;");
    next();
});
app.use('/',express.static("./static"));
app.use(express.json());
app.post('/api/messages',async (req,res)=>{
const massege = req.body.massage;
const ip = req.ip;
let ipU = ip.replace('::ffff:', '');
const result = await doTheWrite(massege,ipU,2);
messageEvents.emit('new_message',result)
res.json(result);
res.end();
});

app.get('/api/aval',async (req,res)=>{
try
{
const data = await doTheread('data.json')
const messages = JSON.parse(data || '[]')
res.json(messages);
}
catch(error)
{
  console.log(error)
  res.send([])
}

})

app.get('/api/wait-for-message',(req,res)=>{
waitingguys.push(res)
  messageEvents.once('new_message',(message)=>{
    res.json({type:'new_message',message})
  });
});

app.post('/upload',upload.single('file'),async(req,res)=>{
  let file_name = req.file.originalname
const ip = req.ip;
 let ipU = ip.replace('::ffff:', '');
const result = await doTheWrite(file_name,ipU,1);
messageEvents.emit('new_message',result)
res.json(result)
res.end()
})

app.listen(3000,'0.0.0.0', () => {
  console.log('Server is listening on port 3000');
});