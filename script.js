let projects = []
let active = 0

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

function enterSite(){
  landing.classList.add("hidden")
}

function openAbout(){
  about.style.display = "flex"
}

function closeAbout(){
  about.style.display = "none"
}

function showProject(index){

  const p = projects[index]

  active = index

  heroImage.src = p.images[0]
  heroImage.alt = p.title

  projectTitle.innerText = p.title
  projectDesc.innerText = p.desc

  sideTitle.innerText = p.title
  sideLocation.innerText = p.location
  sideYear.innerText = p.year
  sideType.innerText = p.type
}

function loadThumbnails(){

  thumbnails.innerHTML = ""

  projects.forEach((p,i)=>{

    const el = document.createElement("div")

    el.className = "thumb"

    el.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.title}">
      <div>
        <b>${p.title}</b><br>
        ${p.location}
      </div>
    `

    el.onclick = ()=>showProject(i)

    thumbnails.appendChild(el)

  })

}

async function loadProjects(){

  try{

    const res = await fetch("projects.json")

    projects = await res.json()

    showProject(0)

    loadThumbnails()

  }
  catch(err){

    console.error(err)

    projectTitle.innerText = "Project data could not be loaded."
    projectDesc.innerText = "Please check projects.json and file paths."

  }

}

enterButton.addEventListener("click",enterSite)
aboutButton.addEventListener("click",openAbout)
closeAboutButton.addEventListener("click",closeAbout)

window.addEventListener("wheel",(event)=>{
  if(event.deltaY>20 && !landing.classList.contains("hidden")){
    enterSite()
  }
})

window.addEventListener("keydown",(event)=>{
  if((event.key==="Enter"||event.key==="ArrowDown") && !landing.classList.contains("hidden")){
    enterSite()
  }

  if(event.key==="Escape"){
    closeAbout()
  }
})

loadProjects()