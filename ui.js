function goHome(){
window.location.href="../../index.html"
}

/* reusable upload system */

function setupUpload(zoneId,inputId,onFiles){

const zone=document.getElementById(zoneId)
const input=document.getElementById(inputId)

zone.onclick=()=>input.click()

input.addEventListener("change",e=>{
if(e.target.files.length){
onFiles(e.target.files)
}
})

zone.addEventListener("dragover",e=>{
e.preventDefault()
zone.classList.add("drag")
})

zone.addEventListener("dragleave",()=>{
zone.classList.remove("drag")
})

zone.addEventListener("drop",e=>{
e.preventDefault()
zone.classList.remove("drag")

if(e.dataTransfer.files.length){
onFiles(e.dataTransfer.files)
}

})

}
