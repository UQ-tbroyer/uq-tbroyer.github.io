const translations = {
  en: {
    name: "Thomas Bissonnette-Royer",
    tagline: "Software Engineer",
    navAbout: "About",
    navProjects: "Projects",
    navContact: "Contact",
    aboutTitle: "About Me",
    aboutText: "Hello! I'm Thomas, a developer passionate about building impactful projects.",
    projectsTitle: "Projects",
    project1Title: "Project One",
    project1Desc: "Short description of your project.",
    contactTitle: "Contact",
    contactEmail: "Email: tbroyer@proton.me",
    footerText: "© 2025 Thomas Bissonnette-Royer"
  },
  fr: {
    name: "Thomas Bissonnette-Royer",
    tagline: "Étudiant en Génie informatique",
    navAbout: "À propos",
    navProjects: "Projets",
    navContact: "Contact",
    aboutTitle: "À propos de moi",
    aboutText: "Bonjour ! Je suis Thomas, un développeur passionné par la création de projets impactants.",
    projectsTitle: "Projets",
    project1Title: "Projet Un",
    project1Desc: "Brève description de votre projet.",
    contactTitle: "Contact",
    contactEmail: "Courriel : tbroyer@proton.me",
    footerText: "© 2025 Thomas Bissonnette-Royer"
  }
};

// Load saved language or default to English
const langSelect = document.getElementById("lang-select");
const savedLang = localStorage.getItem("lang") || "fr";
langSelect.value = savedLang;
setLanguage(savedLang);

langSelect.addEventListener("change", () => {
  const selectedLang = langSelect.value;
  localStorage.setItem("lang", selectedLang);
  setLanguage(selectedLang);
});

function setLanguage(lang) {
  const t = translations[lang];
  document.getElementById("name").textContent = t.name;
  document.getElementById("tagline").textContent = t.tagline;
  document.getElementById("nav-about").textContent = t.navAbout;
  document.getElementById("nav-projects").textContent = t.navProjects;
  document.getElementById("nav-contact").textContent = t.navContact;
  document.getElementById("about-title").textContent = t.aboutTitle;
  document.getElementById("about-text").textContent = t.aboutText;
  document.getElementById("projects-title").textContent = t.projectsTitle;
  document.getElementById("project1-title").textContent = t.project1Title;
  document.getElementById("project1-desc").textContent = t.project1Desc;
  document.getElementById("contact-title").textContent = t.contactTitle;
  document.getElementById("contact-email").childNodes[0].textContent = t.contactEmail;
  document.getElementById("footer-text").textContent = t.footerText;
}
