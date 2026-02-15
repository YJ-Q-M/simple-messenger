
function addMessage(user,text){
 const container = document.getElementById('messages');
  const out_div = document.createElement('div');
  out_div.className='message';
  const span1 = document.createElement('span');
  span1.textContent=user+":"+text;
  if(user=='file'){
    span1.addEventListener('click', async()=>{
      window.location.href=text;
    })
  }
  out_div.appendChild(span1);
  container.appendChild(out_div);
  
    container.scrollTop=container.scrollHeight;
  
  }

function sendMessage(){
   var massege = document.getElementById('messageInput').value;
   document.getElementById('messageInput').value=null;
   fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ massage: massege })
}).then(result=>result.json())
}
async function waitForNewMessage(){
const res = await fetch('/api/wait-for-message');
const data = await res.json();
if(data.type === 'new_message'){
  addMessage(data.message.user,data.message.text);
}
waitForNewMessage();
}

document.addEventListener('DOMContentLoaded',()=>{
  const container = document.getElementById('messages');
    container.removeChild(container.firstChild)

  fetch('/api/aval',{cache:'no-store' , headers:{'Pragma':'no-cache','Cache-Control':'no-cache'}}).then(result=>result.json()).then(data=> { console.log(data);  data.forEach(msg=>{
    
    
    const out_div = document.createElement('div');
  out_div.className='message';
  const span1 = document.createElement('span');
  span1.textContent=msg.user+":"+msg.text;
  if(msg.user=='file'){
    span1.addEventListener('click',async()=>{
      const res = await fetch(msg.text);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href=url;
      a.download= msg.fileName;
      a.click()
      url.revokeObjectURL(url);
    })
  }
  out_div.appendChild(span1);
  container.appendChild(out_div);
    container.scrollTop=container.scrollHeight;
  })});
 
  waitForNewMessage();
  
})

  function sendFile(){
    const fileInput = document.createElement('input');
    fileInput.type='file';
    fileInput.style.display='none';
    document.body.appendChild(fileInput);
    fileInput.click()
    fileInput.addEventListener('change',async (e)=>{
      let file = e.target.files[0]
      if(file == null){console.log('null'); return;} 
      const formData = new FormData(); 
      formData.append('file',file)
      await fetch('/upload',{
        method:'POST',
        body:formData
      })
    })
  }