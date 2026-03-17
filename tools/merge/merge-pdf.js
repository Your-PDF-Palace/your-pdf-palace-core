const uploadZone=document.getElementById("uploadZone")
const fileInput=document.getElementById("fileInput")
const fileList=document.getElementById("fileList")

let files=[]
let mergedBlob=null

uploadZone.onclick=()=>fileInput.click()

fileInput.addEventListener("change",e=>{
addFiles(e.target.files)
})

uploadZone.addEventListener("dragover",e=>{
e.preventDefault()
uploadZone.classList.add("drag")
})

uploadZone.addEventListener("dragleave",()=>{
uploadZone.classList.remove("drag")
})

uploadZone.addEventListener("drop",e=>{
e.preventDefault()
uploadZone.classList.remove("drag")
addFiles(e.dataTransfer.files)
})

function addFiles(newFiles){

for(const f of newFiles){
files.push(f)
}

renderFiles()

}

function renderFiles(){

fileList.innerHTML=""

files.forEach((file,index)=>{

const div=document.createElement("div")
div.className="file-item"

const info=document.createElement("div")
info.textContent=file.name

const remove=document.createElement("button")
remove.textContent="❌"
remove.className="remove"

remove.onclick=()=>{
files.splice(index,1)
renderFiles()
}

div.appendChild(info)
div.appendChild(remove)

fileList.appendChild(div)

})

}

async function mergePDFs(){

const {PDFDocument}=PDFLib

const merged=await PDFDocument.create()

for(const file of files){

const bytes=await file.arrayBuffer()
const pdf=await PDFDocument.load(bytes)

const pages=await merged.copyPages(pdf,pdf.getPageIndices())

pages.forEach(p=>merged.addPage(p))

}

const mergedBytes=await merged.save()

mergedBlob=new Blob([mergedBytes],{type:"application/pdf"})

document.getElementById("successBox").style.display="block"

}

document.getElementById("downloadBtn").onclick=function(){
downloadBlob(mergedBlob,"merged.pdf")
}
