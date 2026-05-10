/* =========================================================
   NAVIGATION MOBILE
   Le bouton burger ouvre ou ferme le menu sur tablette/mobile.
   On modifie aussi aria-expanded pour améliorer l'accessibilité.
========================================================= */
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* =========================================================
   CARROUSEL DE LA PAGE D'ACCUEIL
   Les slides sont affichées une par une. Les points permettent
   de changer manuellement de diapositive, et un setInterval
   fait défiler automatiquement le carrousel.
========================================================= */
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
// Affiche la slide demandée et met à jour le point actif.
function showSlide(index) {
  if (!slides.length) return;
  currentSlide = index;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}
dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
if (slides.length) setInterval(() => showSlide((currentSlide + 1) % slides.length), 5200);

/* =========================================================
   ANIMATIONS AU SCROLL
   IntersectionObserver détecte quand un élément arrive à l'écran.
   La classe .visible déclenche ensuite l'animation CSS.
========================================================= */
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add('visible'));
}

/* =========================================================
   FILTRES DE LA PAGE FORMATIONS
   Les boutons lisent leur attribut data-course-filter.
   Les cartes sont affichées ou masquées selon leur data-course-type.
========================================================= */
const courseButtons = document.querySelectorAll('[data-course-filter]');
const courseCards = document.querySelectorAll('[data-course-type]');
courseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.courseFilter;
    courseButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    courseCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.courseType === filter;
      card.classList.toggle('hidden', !visible);
    });
  });
});

/* =========================================================
   FILTRES ET RECHERCHE DE LA PAGE EXPERTISES
   On combine deux critères : le filtre choisi et le texte tapé
   dans la barre de recherche.
========================================================= */
const teamButtons = document.querySelectorAll('[data-team-filter]');
const teacherCards = document.querySelectorAll('[data-team-type]');
const teacherSearch = document.querySelector('#teacherSearch');
const resultCount = document.querySelector('#resultCount');
const noResult = document.querySelector('#noResult');
let currentTeamFilter = 'all';
// Met à jour les cartes visibles selon le filtre et la recherche.
function updateTeamView() {
  if (!teacherCards.length) return;
  const query = teacherSearch ? teacherSearch.value.trim().toLowerCase() : '';
  let visibleCount = 0;
  teacherCards.forEach((card) => {
    const matchFilter = currentTeamFilter === 'all' || card.dataset.teamType === currentTeamFilter;
    const matchSearch = card.textContent.toLowerCase().includes(query);
    const visible = matchFilter && matchSearch;
    card.classList.toggle('hidden', !visible);
    if (visible) visibleCount += 1;
  });
  if (resultCount) resultCount.textContent = `${visibleCount} pôle(s) affiché(s)`;
  if (noResult) noResult.classList.toggle('hidden', visibleCount !== 0);
}
teamButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentTeamFilter = button.dataset.teamFilter;
    teamButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    updateTeamView();
  });
});
if (teacherSearch) teacherSearch.addEventListener('input', updateTeamView);

/* =========================================================
   CALENDRIER DYNAMIQUE DE LA PAGE CONTACT
   Les événements sont stockés dans un tableau JavaScript.
   Le calendrier est généré automatiquement mois par mois.
========================================================= */
const calendarGrid = document.querySelector('#calendarGrid');
const calendarTitle = document.querySelector('#calendarTitle');
const calendarSubtitle = document.querySelector('#calendarSubtitle');
const eventList = document.querySelector('#eventList');
const prevMonth = document.querySelector('#prevMonth');
const nextMonth = document.querySelector('#nextMonth');

// Tableau des événements affichés dans le calendrier.
const calendarEvents = [
  { date: '2026-05-08', title: 'Journée Portes Ouvertes', type: 'Admissions', place: 'Villejuif', description: 'Découverte du campus, des formations et échanges avec les équipes admissions.' },
  { date: '2026-06-06', title: 'Journée Portes Ouvertes', type: 'Admissions', place: 'Villejuif', description: 'Rencontre avec les équipes, visite du campus et présentation des parcours.' },
  { date: '2026-05-13', title: 'Rendez-vous personnalisé', type: 'Orientation', place: 'En ligne / campus', description: 'Créneau indicatif pour échanger sur le choix de formation.' },
  { date: '2026-05-21', title: 'Atelier candidature', type: 'Admissions', place: 'En ligne', description: 'Aide à la préparation du dossier et des étapes d’admission.' },
  { date: '2026-06-18', title: 'Focus alternance & entreprises', type: 'Carrière', place: 'Campus Paris', description: 'Présentation des possibilités d’alternance et de l’accompagnement carrière.' }
];

let calendarDate = new Date(2026, 4, 1); // Mai 2026 pour montrer directement la JPO officielle
const monthNames = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
// Convertit une date JavaScript au format YYYY-MM-DD pour comparer avec les événements.
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
// Génère les cases du calendrier pour le mois courant.
function renderCalendar() {
  if (!calendarGrid) return;
  calendarGrid.innerHTML = '';
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  calendarTitle.textContent = `${monthNames[month]} ${year}`;
  calendarSubtitle.textContent = 'Cliquez sur une date avec événement';

  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day muted-day';
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const cellDate = new Date(year, month, day);
    const key = toDateKey(cellDate);
    const dayEvents = calendarEvents.filter((event) => event.date === key);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `calendar-day ${dayEvents.length ? 'has-event' : ''}`;
    cell.innerHTML = `<strong>${day}</strong>${dayEvents.length ? `<small>${dayEvents.length} événement</small>` : ''}`;
    cell.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day').forEach((d) => d.classList.remove('selected'));
      cell.classList.add('selected');
      renderEvents(dayEvents, key);
    });
    calendarGrid.appendChild(cell);
  }
  renderMonthEvents(year, month);
}
// Transforme une date YYYY-MM-DD en date lisible en français.
function formatEventDate(dateKey) {
  const date = new Date(dateKey + 'T12:00:00');
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}
// Affiche les événements d'un jour sélectionné.
function renderEvents(events, dateKey) {
  if (!eventList) return;
  if (!events.length) {
    eventList.innerHTML = `<p class="muted">Aucun événement affiché pour le ${formatEventDate(dateKey)}.</p>`;
    return;
  }
  eventList.innerHTML = events.map((event) => `
    <article class="event-item">
      <strong>${event.title}</strong>
      <span>${formatEventDate(event.date)} · ${event.type} · ${event.place}</span>
      <p>${event.description}</p>
    </article>
  `).join('');
}
// Affiche tous les événements du mois courant dans le panneau de droite.
function renderMonthEvents(year, month) {
  const events = calendarEvents.filter((event) => {
    const eventDate = new Date(event.date + 'T12:00:00');
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
  if (!eventList) return;
  if (!events.length) {
    eventList.innerHTML = '<p class="muted">Aucun événement enregistré pour ce mois.</p>';
    return;
  }
  eventList.innerHTML = events.map((event) => `
    <article class="event-item">
      <strong>${event.title}</strong>
      <span>${formatEventDate(event.date)} · ${event.type} · ${event.place}</span>
      <p>${event.description}</p>
    </article>
  `).join('');
}
if (prevMonth && nextMonth) {
  prevMonth.addEventListener('click', () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    renderCalendar();
  });
  nextMonth.addEventListener('click', () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    renderCalendar();
  });
  renderCalendar();
}

/* =========================================================
   VALIDATION DU FORMULAIRE DE CONTACT
   Le formulaire n'est pas envoyé réellement : on vérifie les champs,
   puis on affiche un message de succès si tout est correct.
========================================================= */
const contactForm = document.querySelector('#contactForm');
const successMessage = document.querySelector('#successMessage');
const messageInput = document.querySelector('#message');
const charCount = document.querySelector('#charCount');
// Affiche un message d'erreur sous le champ concerné.
function setError(fieldId, message) {
  const error = document.querySelector(`#${fieldId}Error`);
  if (error) error.textContent = message;
}
// Efface tous les messages d'erreur avant une nouvelle validation.
function clearErrors() {
  document.querySelectorAll('.error-message').forEach((el) => el.textContent = '');
}
if (messageInput && charCount) {
  messageInput.addEventListener('input', () => {
    charCount.textContent = `${messageInput.value.length} / 600`;
  });
}
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const campus = document.querySelector('#campus').value.trim();
    const subject = document.querySelector('#subject').value.trim();
    const message = document.querySelector('#message').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    if (name.length < 2) { setError('name', 'Veuillez saisir un nom valide.'); valid = false; }
    if (!emailPattern.test(email)) { setError('email', 'Veuillez saisir une adresse email valide.'); valid = false; }
    if (!campus) { setError('campus', 'Veuillez choisir un campus.'); valid = false; }
    if (!subject) { setError('subject', 'Veuillez choisir un sujet.'); valid = false; }
    if (message.length < 10) { setError('message', 'Votre message doit contenir au moins 10 caractères.'); valid = false; }
    if (valid) {
      successMessage.style.display = 'block';
      contactForm.reset();
      if (charCount) charCount.textContent = '0 / 600';
      setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
    }
  });
}
