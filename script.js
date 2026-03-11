let projects = [];
let activeProjectIndex = 0;
let activeImageIndex = 0;

const landing = document.getElementById("landing");
const enterButton = document.getElementById("enterButton");
const profileButton = document.getElementById("profileButton");
const headerContactButton = document.getElementById("headerContactButton");
const closeProfileButton = document.getElementById("closeProfileButton");
const profileOverlay = document.getElementById("profileOverlay");
const brandButton = document.getElementById("brandButton");

const heroImage = document.getElementById("heroImage");
const heroType = document.getElementById("heroType");
const heroYear = document.getElementById("heroYear");
const heroLocation = document.getElementById("heroLocation");
const projectTitle = document.getElementById("projectTitle");
const projectDesc = document.getElementById("projectDesc");

const sideTitle = document.getElementById("sideTitle");
const sideLocation = document.getElementById("sideLocation");
const sideYear = document.getElementById("sideYear");
const sideType = document.getElementById("sideType");
const sideDesc = document.getElementById("side-desc");

const thumbnails = document.getElementById("thumbnails");

const prevImageButton = document.getElementById("prevImage");
const nextImageButton = document.getElementById("nextImage");

const imageCurrent = document.getElementById("imageCurrent");
const imageTotal = document.getElementById("imageTotal");


function enterSite() {
  landing.classList.add("hidden");
}

function openProfile() {
  profileOverlay.style.display = "flex";
}

function closeProfile() {
  profileOverlay.style.display = "none";
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

  heroImage.src = project.images[activeImageIndex];
  heroImage.alt = `${project.title} ${activeImageIndex + 1}`;

  imageCurrent.innerText = activeImageIndex + 1;
  imageTotal.innerText = project.images.length;
}


/* -----------------------------
   제목을 항상 한 줄로 맞추는 함수
----------------------------- */

function fitProjectTitleToOneLine() {

  const isMobile = window.innerWidth <= 480;
  const isTablet = window.innerWidth <= 768;

  let maxSize;
  let minSize;

  if (isMobile) {
    maxSize = 12;
    minSize = 8;
  } 
  else if (isTablet) {
    maxSize = 14;
    minSize = 9;
  } 
  else {
    maxSize = 15;
    minSize = 10;
  }

  projectTitle.style.fontSize = maxSize + "px";

  while (
    projectTitle.scrollWidth > projectTitle.clientWidth &&
    maxSize > minSize
  ) {
    maxSize -= 0.5;
    projectTitle.style.fontSize = maxSize + "px";
  }
}


/* -----------------------------
   프로젝트 표시
----------------------------- */

function showProject(index) {

  const p = projects[index];
  if (!p) return;

  activeProjectIndex = index;
  activeImageIndex = 0;

  updateHeroImage();

  heroType.innerText = p.type || "";
  heroYear.innerText = p.year || "";
  heroLocation.innerText = p.location || "";

  projectTitle.innerText = p.title || "";
  projectDesc.innerText = p.desc || "";

  sideTitle.innerText = p.title || "";
  sideLocation.innerText = p.location || "";
  sideYear.innerText = p.year || "";
  sideType.innerText = p.type || "";

  if (sideDesc) {
    sideDesc.innerText = p.desc || "";
  }

  updateActiveThumbnail();

  fitProjectTitleToOneLine();
}


/* -----------------------------
   이미지 이동
----------------------------- */

function showPrevImage() {

  const project = projects[activeProjectIndex];

  if (!project || !project.images || project.images.length <= 1) return;

  activeImageIndex--;

  if (activeImageIndex < 0) {
    activeImageIndex = project.images.length - 1;
  }

  updateHeroImage();
}


function showNextImage() {

  const project = projects[activeProjectIndex];

  if (!project || !project.images || project.images.length <= 1) return;

  activeImageIndex++;

  if (activeImageIndex >= project.images.length) {
    activeImageIndex = 0;
  }

  updateHeroImage();
}


/* -----------------------------
   썸네일 활성화
----------------------------- */

function updateActiveThumbnail() {

  const thumbElements = thumbnails.querySelectorAll(".thumb");

  thumbElements.forEach((thumb, index) => {

    if (index === activeProjectIndex) {
      thumb.classList.add("active");
    } 
    else {
      thumb.classList.remove("active");
    }

  });
}


/* -----------------------------
   썸네일 생성
----------------------------- */

function loadThumbnails() {

  thumbnails.innerHTML = "";

  projects.forEach((p, i) => {

    const el = document.createElement("button");
    el.className = "thumb";
    el.type = "button";

    const thumbImage = p.thumbnail || (p.images && p.images[0]) || "";

    el.innerHTML = `
      <img src="${thumbImage}" alt="${p.title}">
      <div class="thumb-text">
        <p class="thumb-year">${p.year || ""}</p>
        <p class="thumb-title">${p.title || ""}</p>
        <p class="thumb-location">${p.location || ""}</p>
      </div>
    `;

    el.addEventListener("click", () => showProject(i));

    thumbnails.appendChild(el);

  });

  updateActiveThumbnail();
}


/* -----------------------------
   JSON 로드
----------------------------- */

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

    showProject(0);

    loadThumbnails();

  } 
  catch (err) {

    console.error(err);

    projectTitle.innerText = "Project data could not be loaded.";
    projectDesc.innerText = "Please check projects.json and file paths.";

    imageCurrent.innerText = "0";
    imageTotal.innerText = "0";

  }
}


/* -----------------------------
   이벤트
----------------------------- */

enterButton.addEventListener("click", enterSite);

if (profileButton) {
  profileButton.addEventListener("click", openProfile);
}

if (headerContactButton) {
  headerContactButton.addEventListener("click", openProfile);
}

if (closeProfileButton) {
  closeProfileButton.addEventListener("click", closeProfile);
}

if (brandButton) {
  brandButton.addEventListener("click", () => {
    landing.classList.remove("hidden");
  });
}

if (prevImageButton) {
  prevImageButton.addEventListener("click", showPrevImage);
}

if (nextImageButton) {
  nextImageButton.addEventListener("click", showNextImage);
}


window.addEventListener("wheel", (event) => {

  if (event.deltaY > 20 && !landing.classList.contains("hidden")) {
    enterSite();
  }

});


window.addEventListener("keydown", (event) => {

  if (
    (event.key === "Enter" || event.key === "ArrowDown") &&
    !landing.classList.contains("hidden")
  ) {
    enterSite();
  }

  if (event.key === "Escape") {
    closeProfile();
  }

  if (landing.classList.contains("hidden")) {

    if (event.key === "ArrowLeft") {
      showPrevImage();
    }

    if (event.key === "ArrowRight") {
      showNextImage();
    }

  }

});


if (profileOverlay) {

  profileOverlay.addEventListener("click", (event) => {

    if (event.target === profileOverlay) {
      closeProfile();
    }

  });

}


/* -----------------------------
   화면 크기 변경 시 제목 재계산
----------------------------- */

window.addEventListener("resize", fitProjectTitleToOneLine);


/* -----------------------------
   초기 실행
----------------------------- */

loadProjects();