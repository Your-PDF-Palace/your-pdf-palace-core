const splitUpload = document.getElementById("splitUpload")
const splitInput = document.getElementById("splitInput")
const pageGrid = document.getElementById("pageGrid")

let splitFile = null
let selectedPages = []
let splitBlob = null

splitUpload.onclick = () => splitInput.click()

splitInput.addEventListener("change", async e => {

splitInput.addEventListener("change", async e => {

const file = e.target.files[0]

if(!file) return

if(file.type !== "application/pdf"){
alert("Please upload a valid PDF file")
return
}

splitFile = file

renderSplitPreview()

})

async function renderSplitPreview(){

pageGrid.innerHTML = ""
selectedPages = []

const buffer = await splitFile.arrayBuffer()
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

div.classList.toggle("selected")

if(selectedPages.includes(i)){
selectedPages = selectedPages.filter(p => p !== i)
}else{
selectedPages.push(i)
}

}

pageGrid.appendChild(div)

}

}

async function splitPDF(){

if(selectedPages.length === 0){
alert("Select pages to extract")
return
}

const {PDFDocument} = PDFLib

const srcBytes = await splitFile.arrayBuffer()

const srcPdf = await PDFDocument.load(srcBytes)

const newPdf = await PDFDocument.create()

const pages = await newPdf.copyPages(
srcPdf,
selectedPages.map(p => p - 1)
)

pages.forEach(p => newPdf.addPage(p))

const bytes = await newPdf.save()

splitBlob = new Blob([bytes],{type:"application/pdf"})

document.getElementById("splitSuccess").style.display = "block"

}

document.getElementById("splitDownload").onclick = function(){

const url = URL.createObjectURL(splitBlob)

const a = document.createElement("a")

a.href = url
a.download = "split.pdf"

a.click()

URL.revokeObjectURL(url)

}
