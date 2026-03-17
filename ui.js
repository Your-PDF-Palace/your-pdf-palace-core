function formatSize(bytes){
return (bytes/1024/1024).toFixed(2)+" MB"
}

function downloadBlob(blob,filename){

const url=URL.createObjectURL(blob)

const a=document.createElement("a")
a.href=url
a.download=filename
a.click()

URL.revokeObjectURL(url)

}
