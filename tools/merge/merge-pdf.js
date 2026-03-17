const MAX_FILE_SIZE = 50 * 1024 * 1024
const MAX_TOTAL_SIZE = 150 * 1024 * 1024
const uploadZone = document.getElementById("uploadZone")
const fileInput = document.getElementById("fileInput")
const fileList = document.getElementById("fileList")

let files = []
let mergedBlob = null

uploadZone.onclick = () => fileInput.click()

fileInput.addEventListener("change", e=>{
 addFiles(e.target.files)
})

uploadZone.addEventListener("dragover", e=>{
 e.preventDefault()
 uploadZone.classList.add("drag")
})

uploadZone.addEventListener("dragleave", ()=>{
 uploadZone.classList.remove("drag")
})

uploadZone.addEventListener("drop", e=>{
 e.preventDefault()
 uploadZone.classList.remove("drag")
 addFiles(e.dataTransfer.files)
})

function addFiles(newFiles){

let currentTotal = files.reduce((sum,f)=>sum+f.size,0)

for(const f of newFiles){

if(f.type !== "application/pdf"){
alert("Only PDF files are allowed")
continue
}

if(f.size > MAX_FILE_SIZE){
alert(f.name + " exceeds the 50MB file limit")
continue
}

if(currentTotal + f.size > MAX_TOTAL_SIZE){
alert("Total upload limit is 150MB")
break
}

files.push(f)
currentTotal += f.size

}

renderFiles()

}

function renderFiles(){

 fileList.innerHTML=""

 files.forEach((file,index)=>{

  const div=document.createElement("div")
  div.className="file-item"

  const info=document.createElement("div")
  info.className="file-info"
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

 const {PDFDocument} = PDFLib
 const merged = await PDFDocument.create()

 for(let f of files){

  const bytes = await f.arrayBuffer()
  const pdf = await PDFDocument.load(bytes)

  const pages = await merged.copyPages(pdf,pdf.getPageIndices())

  pages.forEach(p=>merged.addPage(p))

 }

 const mergedBytes = await merged.save()

 mergedBlob = new Blob([mergedBytes],{type:"application/pdf"})

 document.getElementById("successBox").style.display="block"

}

document.getElementById("downloadBtn").onclick = function(){

 const url = URL.createObjectURL(mergedBlob)

 const a = document.createElement("a")

 a.href = url
 a.download="merged.pdf"
 a.click()

 URL.revokeObjectURL(url)

}
