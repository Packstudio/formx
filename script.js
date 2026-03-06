let projects = []
let activeProjectIndex = 0
let activeImageIndex = 0

const landing = document.getElementById("landing")
const enterButton = document.getElementById("enterButton")
const aboutButton = document.getElementById("aboutButton")
const closeAboutButton = document.getElementById("closeAboutButton")
const about = document.getElementById("about")

const heroImage = document.getElementById("heroImage")
const projectTitle = document.getElementById("projectTitle")
const projectDesc = document.getElementById("projectDesc")

const sideTitle = document.getElementById("sideTitle")
const sideLocation = document.getElementById("sideLocation")
const sideYear = document.getElementById("sideYear")
const sideType = document.getElementById("sideType")

const thumbnails = document.getElementById("thumbnails")

const prevImageButton = document.getElementById("prevImage")
const nextImageButton = document.getElementById("nextImage")

const imageCurrent = document.getElementById("imageCurrent")
const imageTotal = document.getElementById("imageTotal")

function enterSite() {
  landing.classList.add("hidden")
}

function openAbout() {
  about.style.display = "flex"
}

function closeAbout() {
  about.style.display = "none"
}

function updateHeroImage() {
  const project = projects[activeProjectIndex]

  if (!project.images || project.images.length === 0) {
    heroImage.src = ""
    heroImage.alt = project.title

    imageCurrent.innerText = "0"
    imageTotal.innerText = "0"
    return
  }

  heroImage.src = project.images[activeImageIndex]
  heroImage.alt = `${project.title} ${activeImageIndex + 1}`

  imageCurrent.innerText = activeImageIndex + 1
  imageTotal.innerText = project.images.length
}

function showProject(index) {
  const p = projects[index]

  activeProjectIndex = index
  activeImageIndex = 0

  updateHeroImage()

  projectTitle.innerText = p.title
  projectDesc.innerText = p.desc

  sideTitle.innerText = p.title
  sideLocation.innerText = p.location
  sideYear.innerText = p.year
  sideType.innerText = p.type
}

function showPrevImage() {
  const project = projects[activeProjectIndex]

  if (!project.images || project.images.length <= 1) return

  activeImageIndex--

  if (activeImageIndex < 0) {
    activeImageIndex = project.images.length - 1
  }

  updateHeroImage()
}

function showNextImage() {
  const project = projects[activeProjectIndex]

  if (!project.images || project.images.length <= 1) return

  activeImageIndex++

  if (activeImageIndex >= project.images.length) {
    activeImageIndex = 0
  }

  updateHeroImage()
}

function loadThumbnails() {
  thumbnails.innerHTML = ""

  projects.forEach((p, i) => {
    const el = document.createElement("div")
    el.className = "thumb"

    el.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.title}">
      <div>
        <b>${p.title}</b><br>
        ${p.location}
      </div>
    `

    el.onclick = () => showProject(i)

    thumbnails.appendChild(el)
  })
}

async function loadProjects() {
  try {
    const res = await fetch("projects.json")
    projects = await res.json()

    showProject(0)
    loadThumbnails()
  } catch (err) {
    console.error(err)

    projectTitle.innerText = "Project data could not be loaded."
    projectDesc.innerText = "Please check projects.json and file paths."
  }
}

enterButton.addEventListener("click", enterSite)
aboutButton.addEventListener("click", openAbout)
closeAboutButton.addEventListener("click", closeAbout)

if (prevImageButton) {
  prevImageButton.addEventListener("click", showPrevImage)
}

if (nextImageButton) {
  nextImageButton.addEventListener("click", showNextImage)
}

window.addEventListener("wheel", (event) => {
  if (event.deltaY > 20 && !landing.classList.contains("hidden")) {
    enterSite()
  }
})

window.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === "ArrowDown") && !landing.classList.contains("hidden")) {
    enterSite()
  }

  if (event.key === "Escape") {
    closeAbout()
  }

  if (landing.classList.contains("hidden")) {
    if (event.key === "ArrowLeft") {
      showPrevImage()
    }

    if (event.key === "ArrowRight") {
      showNextImage()
    }
  }
})

loadProjects()