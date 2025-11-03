// navbar color change
var nav = document.querySelector('nav');
var navbarToggle = document.querySelector('.navbar-toggler');

// Function to add bg-dark class to navbar
function addBgDarkToNavbar() {
  nav.classList.add('bg-dark');
}

// Function to remove bg-dark class from navbar
function removeBgDarkFromNavbar() {
  nav.classList.remove('bg-dark');
}

window.addEventListener('scroll', function () {
  if (window.pageYOffset > 100) {
    nav.classList.add('shadow');
    addBgDarkToNavbar();
  } else {
    nav.classList.remove('shadow');
    removeBgDarkFromNavbar();
  }
});

navbarToggle.addEventListener('click', function () {
  if (!nav.classList.contains('bg-dark')) {
    addBgDarkToNavbar();
  } else {
    removeBgDarkFromNavbar();
  }
});


// type effect 
var typed = new Typed('.auto-input', {
    strings: ['Full Stack Developer', 'Tech Enthusiast', 'UI/UX Designer', 'Innovator'],
    typeSpeed: 20,
    backSpeed: 20,
    backDelay: 1500,
    loop: true,
    smartBackspace: true,
});

/* element toggle function */
const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }
 
/* skills toggle */
const toggleBtnBox = document.querySelector("[data-toggle-box]");
const toggleBtns = document.querySelectorAll("[data-toggle-btn]");
const skillsBox = document.querySelector("[data-skills-box]");

for (let i = 0; i < toggleBtns.length; i++) {
    toggleBtns[i].addEventListener("click", function () {

        elemToggleFunc(toggleBtnBox);
        for (let i = 0; i < toggleBtns.length; i++) { elemToggleFunc(toggleBtns[i]); }
        elemToggleFunc(skillsBox);
    });
}

function toggleContent(tab) {
  var educationContent = document.getElementById('education');
  var experienceContent = document.getElementById('experience');

  if (tab === 'education') {
    educationContent.style.display = 'block';
    experienceContent.style.display = 'none';
  } else if (tab === 'experience') {
    educationContent.style.display = 'none';
    experienceContent.style.display = 'block';
  }
}

document.getElementById("viewMoreBtn").addEventListener("click", function() {
  alert("View more button clicked!");
});


