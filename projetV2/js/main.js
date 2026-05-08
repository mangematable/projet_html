// Global navigation menu
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Home slider
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = index;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => showSlide(index));
});

if (slides.length > 0) {
  setInterval(() => {
    showSlide((currentSlide + 1) % slides.length);
  }, 5000);
}

// Courses filter
const courseButtons = document.querySelectorAll('[data-course-filter]');
const courseRows = document.querySelectorAll('[data-course-type]');

courseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.courseFilter;
    courseButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    courseRows.forEach((row) => {
      const isVisible = filter === 'all' || row.dataset.courseType === filter;
      row.classList.toggle('hidden', !isVisible);
    });
  });
});

// Team filters and search
const teamButtons = document.querySelectorAll('[data-team-filter]');
const teacherCards = document.querySelectorAll('[data-team-type]');
const teacherSearch = document.querySelector('#teacherSearch');
const resultCount = document.querySelector('#resultCount');
const noResult = document.querySelector('#noResult');
let currentTeamFilter = 'all';

function updateTeamView() {
  if (!teacherCards.length) return;
  const query = teacherSearch ? teacherSearch.value.trim().toLowerCase() : '';
  let visibleCount = 0;

  teacherCards.forEach((card) => {
    const matchFilter = currentTeamFilter === 'all' || card.dataset.teamType === currentTeamFilter;
    const matchSearch = card.textContent.toLowerCase().includes(query);
    const isVisible = matchFilter && matchSearch;
    card.classList.toggle('hidden', !isVisible);
    if (isVisible) visibleCount += 1;
  });

  if (resultCount) {
    resultCount.textContent = `${visibleCount} enseignant(s) affiché(s)`;
  }
  if (noResult) {
    noResult.classList.toggle('hidden', visibleCount !== 0);
  }
}

teamButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentTeamFilter = button.dataset.teamFilter;
    teamButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    updateTeamView();
  });
});

if (teacherSearch) {
  teacherSearch.addEventListener('input', updateTeamView);
}

// Contact form validation
const contactForm = document.querySelector('#contactForm');
const successMessage = document.querySelector('#successMessage');

function setError(fieldId, message) {
  const error = document.querySelector(`#${fieldId}Error`);
  if (error) error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach((element) => {
    element.textContent = '';
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();

    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const subject = document.querySelector('#subject').value.trim();
    const message = document.querySelector('#message').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (name.length < 2) {
      setError('name', 'Veuillez saisir un nom valide.');
      isValid = false;
    }
    if (!emailPattern.test(email)) {
      setError('email', 'Veuillez saisir une adresse email valide.');
      isValid = false;
    }
    if (!subject) {
      setError('subject', 'Veuillez choisir un sujet.');
      isValid = false;
    }
    if (message.length < 10) {
      setError('message', 'Votre message doit contenir au moins 10 caractères.');
      isValid = false;
    }

    if (isValid) {
      successMessage.style.display = 'block';
      contactForm.reset();
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 4500);
    }
  });
}
