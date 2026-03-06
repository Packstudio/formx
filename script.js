let projects = [];
let activeProjectIndex = 0;
let activeImageIndex = 0;

const landing = document.getElementById("landing");
const enterButton = document.getElementById("enterButton");
const aboutButton = document.getElementById("aboutButton");
const headerAboutButton = document.getElementById("headerAboutButton");
const closeAboutButton = document.getElementById("closeAboutButton");
const about = document.getElementById("about");
const brandButton = document.getElementById("brandButton");

const heroImage = document.getElementById("heroImage");
const heroType = document.getElementById("heroType");
const heroYear = document.getElementById("heroYear");
const heroLocation = document.getElementById("heroLocation");
const projectTitle = document.getElementById("projectTitle");
const projectDesc = document.getElementById("projectDesc");

const imageCurrent = document.getElementById("imageCurrent");
const imageTotal = document.getElementById("imageTotal");

const sideTitle = document.getElementById("sideTitle");
const sideLocation = document.getElementById("sideLocation");
const sideYear = document.getElementById("sideYear");
const sideType = document.getElementById("sideType");

const thumbnails = document.getElementById("thumbnails");

const prevImageButton = document.getElementById("prevImage");
const nextImageButton = document.getElementById("nextImage");

function enterSite() {
  landing.classList.add("hidden");
}

function openAbout() {
  about.style.display = "flex";
}

function closeAbout() {
  about.style.display = "none";
}

function updateHeroImage() {
  const project = projects[activeProjectIndex];
  const images = project.images || [];

  if (images.length === 0) {
    heroImage.src = "";
    heroImage.alt = project.title;
    imageCurrent.textContent = "0";
    imageTotal.textContent = "0";
    return;
  }

  heroImage.src = images[activeImageIndex];
  heroImage.alt = `${project.title} image ${activeImageIndex + 1}`;
  imageCurrent.textContent = String(activeImageIndex + 1);
  imageTotal.textContent = String(images.length);
}

function showProject(index) {
  activeProjectIndex = index;
  activeImageIndex = 0;

  const project = projects[index];

  heroType.textContent = project.type;
  heroYear.textContent = project.year;
  heroLocation.textContent = project.location;
  projectTitle.textContent = project.title;
  projectDesc.textContent = project.desc;

  sideTitle.textContent = project.title;
  sideLocation.textContent = project.location;
  sideYear.textContent = project.year;
  sideType.textContent = project.type;

  updateHeroImage();
  renderThumbnails();
}

function showNextImage() {
  const project = projects[activeProjectIndex];
  const images = project.images || [];

  if (images.length <= 1) return;

  activeImageIndex = (activeImageIndex + 1) % images.length;
  updateHeroImage();
}

function showPrevImage() {
  const project = projects[activeProjectIndex];
  const images = project.images || [];

  if (images.length <= 1) return;

  activeImageIndex = (activeImageIndex - 1 + images.length) % images.length;
  updateHeroImage();
}

function renderThumbnails() {
  thumbnails.innerHTML = "";

  projects.forEach((project, index) => {
    const thumb = document.createElement("button");
    thumb.className = "thumb";
    if (index === activeProjectIndex) {
      thumb.classList.add("active");
    }

    const thumbImage = project.thumbnail || (project.images && project.images[0]) || "";

    thumb.innerHTML = `
      <img src="${thumbImage}" alt="${project.title}">
      <div class="thumb-text">
        <p class="thumb-year">${project.year}</p>
        <p class="thumb-title">${project.title}</p>
        <p class="thumb-location">${project.location}</p>
      </div>
    `;

    thumb.addEventListener("click", () => showProject(index));
    thumbnails.appendChild(thumb);
  });
}

async function loadProjects() {
  try {
    const response = await fetch("projects.json");

    if (!response.ok) {
      throw new Error("Failed to load projects.json");
    }

    projects = await response.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("No project data found.");
    }

    showProject(0);
  } catch (error) {
    console.error(error);
    projectTitle.textContent = "Project data could not be loaded.";
    projectDesc.textContent = "Please check projects.json and file paths.";
  }
}

/* EVENTS */

enterButton.addEventListener("click", enterSite);
aboutButton.addEventListener("click", openAbout);
headerAboutButton.addEventListener("click", openAbout);
closeAboutButton.addEventListener("click", closeAbout);
brandButton.addEventListener("click", () => {
  landing.classList.remove("hidden");
});

prevImageButton.addEventListener("click", showPrevImage);
nextImageButton.addEventListener("click", showNextImage);

window.addEventListener("wheel", function (event) {
  if (event.deltaY > 20 && !landing.classList.contains("hidden")) {
    enterSite();
  }
});

window.addEventListener("keydown", function (event) {
  if ((event.key === "Enter" || event.key === "ArrowDown") && !landing.classList.contains("hidden")) {
    enterSite();
  }

  if (event.key === "Escape") {
    closeAbout();
  }

  if (event.key === "ArrowLeft" && landing.classList.contains("hidden")) {
    showPrevImage();
  }

  if (event.key === "ArrowRight" && landing.classList.contains("hidden")) {
    showNextImage();
  }
});

about.addEventListener("click", function (event) {
  if (event.target === about) {
    closeAbout();
  }
});

loadProjects();