const uploadZone=document.getElementById("uploadZone")
const fileInput=document.getElementById("fileInput")
const pageGrid=document.getElementById("pageGrid")

let file=null
let selectedPages=[]
let splitBlob=null

uploadZone.onclick=()=>fileInput.click()

fileInput.addEventListener("change",async e=>{
file=e.target.files[0]
renderPreview()
})

async function renderPreview(){

pageGrid.innerHTML=""
selectedPages=[]

const buffer=await file.arrayBuffer()
const pdf=await pdfjsLib.getDocument({data:buffer}).promise

for(let i=1;i<=pdf.numPages;i++){

const page=await pdf.getPage(i)
const viewport=page.getViewport({scale:0.5})

const canvas=document.createElement("canvas")
canvas.width=viewport.width
canvas.height=viewport.height

const ctx=canvas.getContext("2d")

await page.render({canvasContext:ctx,viewport}).promise

const div=document.createElement("div")
div.className="page"

div.appendChild(canvas)

div.onclick=()=>{

div.classList.toggle("selected")

if(selectedPages.includes(i)){
selectedPages=selectedPages.filter(p=>p!==i)
}else{
selectedPages.push(i)
}

}

pageGrid.appendChild(div)

}

}

async function splitPDF(){

const {PDFDocument}=PDFLib

const srcBytes=await file.arrayBuffer()
const srcPdf=await PDFDocument.load(srcBytes)

const newPdf=await PDFDocument.create()

const pages=await newPdf.copyPages(srcPdf,selectedPages.map(p=>p-1))

pages.forEach(p=>newPdf.addPage(p))

const bytes=await newPdf.save()

splitBlob=new Blob([bytes],{type:"application/pdf"})

document.getElementById("successBox").style.display="block"

}

document.getElementById("downloadBtn").onclick=function(){
downloadBlob(splitBlob,"split.pdf")
}
