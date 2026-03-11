let projects = [];
let activeProjectIndex = 0;
let activeImageIndex = 0;
let currentMode = "projects"; // "projects" | "gallery"

const body = document.body;
const main = document.getElementById("main");
const enterButton = document.getElementById("enterButton");

const heroImage = document.getElementById("heroImage");
const heroType = document.getElementById("heroType");
const heroYear = document.getElementById("heroYear");
const heroLocation = document.getElementById("heroLocation");
const projectTitle = document.getElementById("projectTitle");
const projectDesc = document.getElementById("projectDesc");

const thumbnails = document.getElementById("thumbnails");
const prevImageButton = document.getElementById("prevImage");
const nextImageButton = document.getElementById("nextImage");

const imageCurrent = document.getElementById("imageCurrent");
const imageTotal = document.getElementById("imageTotal");

const backButton = document.getElementById("backButton");
const thumbSectionLabel = document.getElementById("thumbSectionLabel");
const thumbSectionGuide = document.getElementById("thumbSectionGuide");

const contactToggle = document.getElementById("contactToggle");
const contactPanel = document.getElementById("contactPanel");

function enterSite() {
  body.classList.add("entered");
}

function getSafeProjectImage(project, imageIndex = 0) {
  if (!project || !Array.isArray(project.images) || project.images.length === 0) {
    return "";
  }

  if (imageIndex < 0 || imageIndex >= project.images.length) {
    return project.images[0];
  }

  return project.images[imageIndex];
}

function updateHeroImage() {
  const project = projects[activeProjectIndex];

  if (!project || !project.images || project.images.length === 0) {
    heroImage.src = "";
    heroImage.alt = "";
    imageCurrent.innerText = "0";
    imageTotal.innerText = "0";
    return;
  }

  let displayImageIndex = 0;
  let totalCount = 0;

  if (currentMode === "projects") {
    displayImageIndex = 0;
    totalCount = projects.length;
    heroImage.src = getSafeProjectImage(project, 0);
    heroImage.alt = `${project.title} cover`;
    imageCurrent.innerText = String(activeProjectIndex + 1);
    imageTotal.innerText = String(totalCount);
    return;
  }

  displayImageIndex = activeImageIndex;
  totalCount = project.images.length;

  heroImage.src = getSafeProjectImage(project, displayImageIndex);
  heroImage.alt = `${project.title} ${displayImageIndex + 1}`;

  imageCurrent.innerText = String(displayImageIndex + 1);
  imageTotal.innerText = String(totalCount);
}

function updateProjectInfo() {
  const project = projects[activeProjectIndex];
  if (!project) return;

  heroType.innerText = project.type || "";
  heroYear.innerText = project.year || "";
  heroLocation.innerText = project.location || "";

  projectTitle.innerText = project.title || "";
  projectDesc.innerText = project.desc || "";
}

function renderProjectThumbnails() {
  thumbnails.innerHTML = "";

  if (thumbSectionLabel) {
    thumbSectionLabel.innerText = "Other Projects";
  }

  if (thumbSectionGuide) {
    thumbSectionGuide.innerText = "Select a project";
  }

  if (backButton) {
    backButton.classList.remove("show");
  }

  projects.forEach((project, index) => {
    if (index === activeProjectIndex) return;

    const el = document.createElement("button");
    el.className = "thumb";
    el.type = "button";

    const thumbImage = project.thumbnail || getSafeProjectImage(project, 0) || "";

    el.innerHTML = `
      <img src="${thumbImage}" alt="${project.title}">
      <div class="thumb-text">
        <p class="thumb-year">${project.year || ""}</p>
        <p class="thumb-title">${project.title || ""}</p>
        <p class="thumb-location">${project.location || ""}</p>
      </div>
    `;

    el.addEventListener("click", () => {
      activeProjectIndex = index;
      activeImageIndex = 0;
      currentMode = "gallery";

      updateHeroImage();
      updateProjectInfo();
      renderGalleryThumbnails();
      scrollMainToTop();
    });

    thumbnails.appendChild(el);
  });
}

function renderGalleryThumbnails() {
  thumbnails.innerHTML = "";

  const project = projects[activeProjectIndex];
  if (!project) return;

  if (thumbSectionLabel) {
    thumbSectionLabel.innerText = "Project Images";
  }

  if (thumbSectionGuide) {
    thumbSectionGuide.innerText = "Select an image";
  }

  if (backButton) {
    backButton.classList.add("show");
  }

  project.images.forEach((imgPath, index) => {
    const el = document.createElement("button");
    el.className = "thumb gallery-thumb";
    el.type = "button";

    if (index === activeImageIndex) {
      el.classList.add("active");
    }

    const label = String(index + 1).padStart(2, "0");

    el.innerHTML = `
      <img src="${imgPath}" alt="${project.title} ${label}">
      <div class="thumb-text">
        <p class="thumb-title">${project.title} / ${label}</p>
      </div>
    `;

    el.addEventListener("click", () => {
      activeImageIndex = index;
      updateHeroImage();
      renderGalleryThumbnails();
    });

    thumbnails.appendChild(el);
  });
}

function renderThumbsByMode() {
  if (currentMode === "gallery") {
    renderGalleryThumbnails();
  } else {
    renderProjectThumbnails();
  }
}

function showPrevImage() {
  if (projects.length === 0) return;

  if (currentMode === "projects") {
    activeProjectIndex -= 1;

    if (activeProjectIndex < 0) {
      activeProjectIndex = projects.length - 1;
    }

    activeImageIndex = 0;
    updateHeroImage();
    updateProjectInfo();
    renderProjectThumbnails();
    return;
  }

  const project = projects[activeProjectIndex];
  if (!project || !project.images || project.images.length <= 1) return;

  activeImageIndex -= 1;

  if (activeImageIndex < 0) {
    activeImageIndex = project.images.length - 1;
  }

  updateHeroImage();
  renderGalleryThumbnails();
}

function showNextImage() {
  if (projects.length === 0) return;

  if (currentMode === "projects") {
    activeProjectIndex += 1;

    if (activeProjectIndex >= projects.length) {
      activeProjectIndex = 0;
    }

    activeImageIndex = 0;
    updateHeroImage();
    updateProjectInfo();
    renderProjectThumbnails();
    return;
  }

  const project = projects[activeProjectIndex];
  if (!project || !project.images || project.images.length <= 1) return;

  activeImageIndex += 1;

  if (activeImageIndex >= project.images.length) {
    activeImageIndex = 0;
  }

  updateHeroImage();
  renderGalleryThumbnails();
}

function backToProjectList() {
  currentMode = "projects";
  activeImageIndex = 0;

  updateHeroImage();
  updateProjectInfo();
  renderProjectThumbnails();
}

function scrollMainToTop() {
  const top = main ? main.offsetTop : 0;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
}

function toggleContactPanel() {
  if (!contactPanel) return;
  contactPanel.classList.toggle("show");
}

function closeContactPanel() {
  if (!contactPanel) return;
  contactPanel.classList.remove("show");
}

async function loadProjects() {
  try {
    const res = await fetch("projects.json");

    if (!res.ok) {
      throw new Error("Failed to load projects.json");
    }

    projects = await res.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("No project data found.");
    }

    projects.sort((a, b) => {
      const yearA = String(a.year || "");
      const yearB = String(b.year || "");
      return yearB.localeCompare(yearA);
    });

    activeProjectIndex = 0;
    activeImageIndex = 0;
    currentMode = "projects";

    updateHeroImage();
    updateProjectInfo();
    renderProjectThumbnails();
  } catch (err) {
    console.error(err);

    projectTitle.innerText = "Project data could not be loaded.";
    projectDesc.innerText = "Please check projects.json and file paths.";
    imageCurrent.innerText = "0";
    imageTotal.innerText = "0";

    if (backButton) {
      backButton.classList.remove("show");
    }
  }
}

/* EVENTS */

if (enterButton) {
  enterButton.addEventListener("click", enterSite);
}

if (prevImageButton) {
  prevImageButton.addEventListener("click", showPrevImage);
}

if (nextImageButton) {
  nextImageButton.addEventListener("click", showNextImage);
}

if (backButton) {
  backButton.addEventListener("click", backToProjectList);
}

if (contactToggle) {
  contactToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleContactPanel();
  });
}

if (contactPanel) {
  contactPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

window.addEventListener("click", () => {
  closeContactPanel();
});

window.addEventListener(
  "wheel",
  (event) => {
    if (!body.classList.contains("entered") && event.deltaY > 20) {
      enterSite();
    }
  },
  { passive: true }
);

window.addEventListener("keydown", (event) => {
  if (!body.classList.contains("entered")) {
    if (event.key === "Enter" || event.key === "ArrowDown") {
      enterSite();
    }
    return;
  }

  if (event.key === "ArrowLeft") {
    showPrevImage();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }

  if (event.key === "Escape") {
    if (contactPanel && contactPanel.classList.contains("show")) {
      closeContactPanel();
      return;
    }

    if (currentMode === "gallery") {
      backToProjectList();
    }
  }
});

loadProjects();