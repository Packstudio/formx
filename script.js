const projects = [
  {
    title: "Terraced Housing Complex",
    location: "Busan",
    year: "2025",
    type: "Residential",
    desc: "Hillside terraced housing project exploring layered living.",
    img: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Community Stitch Center",
    location: "Seoul",
    year: "2024",
    type: "Community",
    desc: "Community building reconnecting fragmented urban flows.",
    img: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "Urban Renovation House",
    location: "Suwon",
    year: "2023",
    type: "Renovation",
    desc: "Urban house renovation focusing on daylight and clarity.",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
  }
];

let active = 0;

const landing = document.getElementById("landing");
const enterButton = document.getElementById("enterButton");
const aboutButton = document.getElementById("aboutButton");
const closeAboutButton = document.getElementById("closeAboutButton");
const about = document.getElementById("about");
const heroImage = document.getElementById("heroImage");
const projectTitle = document.getElementById("projectTitle");
const projectDesc = document.getElementById("projectDesc");
const sideTitle = document.getElementById("sideTitle");
const sideLocation = document.getElementById("sideLocation");
const sideYear = document.getElementById("sideYear");
const sideType = document.getElementById("sideType");
const thumbnails = document.getElementById("thumbnails");

function enterSite() {
  landing.classList.add("hidden");
}

function openAbout() {
  about.style.display = "flex";
}

function closeAbout() {
  about.style.display = "none";
}

function showProject(index) {
  const p = projects[index];
  active = index;

  heroImage.src = p.img;
  heroImage.alt = p.title;
  projectTitle.innerText = p.title;
  projectDesc.innerText = p.desc;

  sideTitle.innerText = p.title;
  sideLocation.innerText = p.location;
  sideYear.innerText = p.year;
  sideType.innerText = p.type;
}

function loadThumbnails() {
  thumbnails.innerHTML = "";

  projects.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "thumb";

    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div>
        <b>${p.title}</b><br>
        ${p.location}
      </div>
    `;

    el.addEventListener("click", () => showProject(i));
    thumbnails.appendChild(el);
  });
}

enterButton.addEventListener("click", enterSite);
aboutButton.addEventListener("click", openAbout);
closeAboutButton.addEventListener("click", closeAbout);

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
});

showProject(0);
loadThumbnails();
