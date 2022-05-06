const body = document.body
const main = document.getElementById("main")
const article =  main.querySelector(".article-entry")
const imgs = article.querySelectorAll("img")
let previewBox
if (imgs.length > 0) {
  previewBox = createPreviewBox()
  imgs.forEach(img => {
    img.setAttribute("loading", "lazy")
    img.dataset.allowPreview = "true"
    img.style.cursor = "pointer"
    img.addEventListener('click', (evt) => {
      evt.preventDefault()
      body.style.overflow = "hidden"
      previewBox.classList.contains("preview-on") ? previewBox.classList.remove("preview-on") : previewBox.classList.add("preview-on")
      const src = img.getAttribute("src")
      previewBox.querySelector("img").src = src
    })
  })
}


function createPreviewBox() {
  const div = document.createElement('div')
  div.classList.add('preview-container')
  div.addEventListener('click', (evt) => {
    evt.preventDefault()
    body.style.overflow = "auto"
    previewBox.classList.remove("preview-on")
  })
  div.id = "preview-container"
  const img = document.createElement('img')
  img.classList.add('preview-img')
  img.id = "preview-img"
  div.appendChild(img)
  body.append(div)

  return div
}