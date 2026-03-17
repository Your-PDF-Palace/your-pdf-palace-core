const deleteUpload = document.getElementById("deleteUpload")
const deleteInput = document.getElementById("deleteInput")
const deleteGrid = document.getElementById("deleteGrid")

let deleteFile = null
let pagesToDelete = []
let deleteBlob = null

deleteUpload.onclick = () => deleteInput.click()

deleteInput.addEventListener("change", async e => {

const file = e.target.files[0]

if(!file) return

if(file.type !== "application/pdf"){
alert("Please upload a valid PDF file")
return
}

deleteFile = file

renderDeletePreview()

})

async function renderDeletePreview(){

deleteGrid.innerHTML = ""
pagesToDelete = []

const buffer = await deleteFile.arrayBuffer()

const pdf = await pdfjsLib.getDocument({data:buffer}).promise

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i)

const viewport = page.getViewport({scale:0.5})

const canvas = document.createElement("canvas")

canvas.width = viewport.width
canvas.height = viewport.height

const ctx = canvas.getContext("2d")

await page.render({
canvasContext:ctx,
viewport
}).promise

const div = document.createElement("div")

div.className = "page"

div.appendChild(canvas)

div.onclick = () => {

div.classList.toggle("delete")

if(pagesToDelete.includes(i)){
pagesToDelete = pagesToDelete.filter(p => p !== i)
}else{
pagesToDelete.push(i)
}

}

deleteGrid.appendChild(div)

}

}

async function deletePages(){

const {PDFDocument} = PDFLib

const srcBytes = await deleteFile.arrayBuffer()

const srcPdf = await PDFDocument.load(srcBytes)

const newPdf = await PDFDocument.create()

const keepPages = []

for(let i=0;i<srcPdf.getPageCount();i++){

if(!pagesToDelete.includes(i+1)){
keepPages.push(i)
}

}

const pages = await newPdf.copyPages(srcPdf, keepPages)

pages.forEach(p => newPdf.addPage(p))

const bytes = await newPdf.save()

deleteBlob = new Blob([bytes],{type:"application/pdf"})

document.getElementById("deleteSuccess").style.display = "block"

}

document.getElementById("deleteDownload").onclick = function(){

const url = URL.createObjectURL(deleteBlob)

const a = document.createElement("a")

a.href = url
a.download = "clean.pdf"

a.click()

URL.revokeObjectURL(url)

}
