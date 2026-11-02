'use strict';

const STORAGE_KEY = 'profile-builder:v1';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TEMPLATES = ['classic', 'modern'];
const WORD_FONTS = {
  sans: 'Calibri, Arial, sans-serif',
  serif: "Georgia, 'Times New Roman', serif",
};

const PERSONAL_FIELDS = [
  { key: 'fullName', label: 'Full name', placeholder: 'Aarav Sharma', autocomplete: 'name' },
  { key: 'title', label: 'Job title / headline', placeholder: 'Senior Frontend Engineer', autocomplete: 'organization-title' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210', autocomplete: 'tel' },
  { key: 'location', label: 'Location', placeholder: 'Gurugram, Haryana', autocomplete: 'address-level2' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
  { key: 'github', label: 'GitHub', placeholder: 'github.com/username' },
  { key: 'website', label: 'Portfolio / website', placeholder: 'yourname.dev' },
  {
    key: 'summary', label: 'Professional summary', type: 'textarea', full: true, rows: 5,
    placeholder: '2-4 sentences about your experience, strengths, and the role you are looking for.',
  },
];

const LIST_SECTIONS = {
  experience: {
    title: 'Work experience',
    addLabel: 'Add experience',
    open: true,
    itemLabel: (it) => [it.role, it.company].filter(Boolean).join(' at ') || 'New position',
    fields: [
      { key: 'role', label: 'Job title', placeholder: 'Frontend Developer' },
      { key: 'company', label: 'Company', placeholder: 'Acme Technologies' },
      { key: 'location', label: 'Location', placeholder: 'Bengaluru / Remote' },
      { key: 'type', label: 'Employment type', type: 'select', options: ['', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'] },
      { key: 'start', label: 'Start date', type: 'month' },
      { key: 'end', label: 'End date', type: 'month', disabledWhen: 'current' },
      { key: 'current', label: 'I currently work here', type: 'checkbox', full: true },
      {
        key: 'description', label: 'Responsibilities & achievements (one per line)', type: 'textarea', full: true, rows: 5,
        placeholder: 'Built a reusable component library used by 6 product teams\nCut page load time by 40% with code splitting and caching',
      },
    ],
  },
  education: {
    title: 'Education',
    addLabel: 'Add education',
    itemLabel: (it) => it.degree || it.institution || 'New education',
    fields: [
      { key: 'degree', label: 'Degree / qualification', placeholder: 'B.Tech' },
      { key: 'field', label: 'Field of study', placeholder: 'Computer Science' },
      { key: 'institution', label: 'School / college / university', placeholder: 'Delhi Technological University', full: true },
      { key: 'location', label: 'Location', placeholder: 'New Delhi' },
      { key: 'grade', label: 'Grade / CGPA / %', placeholder: '8.6 CGPA' },
      { key: 'start', label: 'Start date', type: 'month' },
      { key: 'end', label: 'End date', type: 'month', disabledWhen: 'current' },
      { key: 'current', label: 'I currently study here', type: 'checkbox', full: true },
      { key: 'description', label: 'Highlights (optional, one per line)', type: 'textarea', full: true, rows: 3 },
    ],
  },
  projects: {
    title: 'Projects',
    addLabel: 'Add project',
    itemLabel: (it) => it.name || 'New project',
    fields: [
      { key: 'name', label: 'Project name', placeholder: 'Expense Tracker' },
      { key: 'role', label: 'Your role', placeholder: 'Lead developer' },
      { key: 'tech', label: 'Tech stack', placeholder: 'React, Node.js, MongoDB', full: true },
      { key: 'link', label: 'Link', placeholder: 'github.com/you/project', full: true },
      { key: 'start', label: 'Start date', type: 'month' },
      { key: 'end', label: 'End date', type: 'month' },
      { key: 'description', label: 'What you built and the impact (one per line)', type: 'textarea', full: true, rows: 4 },
    ],
  },
  skills: {
    title: 'Skills',
    addLabel: 'Add skill group',
    hint: 'Group related skills, for example Frontend, Backend, Tools.',
    itemLabel: (it) => it.category || 'Skill group',
    fields: [
      { key: 'category', label: 'Category', placeholder: 'Frontend', full: true },
      { key: 'items', label: 'Skills (comma separated)', placeholder: 'React, TypeScript, Next.js, Redux Toolkit', full: true },
    ],
  },
  certifications: {
    title: 'Certifications',
    addLabel: 'Add certification',
    itemLabel: (it) => it.name || 'New certification',
    fields: [
      { key: 'name', label: 'Certification', placeholder: 'AWS Certified Developer - Associate', full: true },
      { key: 'issuer', label: 'Issued by', placeholder: 'Amazon Web Services' },
      { key: 'date', label: 'Issue date', type: 'month' },
      { key: 'credentialId', label: 'Credential ID', placeholder: 'ABC-123456' },
      { key: 'link', label: 'Credential link', placeholder: 'credly.com/badges/...' },
    ],
  },
  languages: {
    title: 'Languages',
    addLabel: 'Add language',
    itemLabel: (it) => it.language || 'New language',
    fields: [
      { key: 'language', label: 'Language', placeholder: 'English' },
      { key: 'proficiency', label: 'Proficiency', type: 'select', options: ['', 'Native', 'Fluent', 'Professional working', 'Intermediate', 'Basic'] },
    ],
  },
  achievements: {
    title: 'Achievements & awards',
    addLabel: 'Add achievement',
    itemLabel: (it) => it.title || 'New achievement',
    fields: [
      { key: 'title', label: 'Title', placeholder: 'Employee of the Quarter', full: true },
      { key: 'date', label: 'Date', type: 'month' },
      { key: 'description', label: 'Details (optional, one per line)', type: 'textarea', full: true, rows: 3 },
    ],
  },
};

const LIST_KEYS = Object.keys(LIST_SECTIONS);

const uid = () => Math.random().toString(36).slice(2, 10);

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

function emptyItem(key) {
  const item = { id: uid() };
  for (const field of LIST_SECTIONS[key].fields) {
    item[field.key] = field.type === 'checkbox' ? false : '';
  }
  return item;
}

function defaultState() {
  const state = {
    personal: Object.fromEntries(PERSONAL_FIELDS.map((f) => [f.key, ''])),
    interests: '',
    settings: { template: 'classic', font: 'sans', accent: '#1f6f78', showPhoto: true },
  };
  state.personal.photo = '';
  for (const key of LIST_KEYS) state[key] = [];
  return state;
}

function sampleData() {
  return {
    personal: {
      fullName: 'Aarav Sharma',
      title: 'Senior Frontend Engineer',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      location: 'Gurugram, Haryana',
      linkedin: 'linkedin.com/in/aaravsharma',
      github: 'github.com/aaravsharma',
      website: 'aaravsharma.dev',
      summary: 'Frontend engineer with 5+ years of experience building fast, accessible web applications with React, TypeScript, and Next.js. Led the move to a shared design system across four products and enjoy mentoring developers and improving performance.',
    },
    experience: [
      {
        role: 'Senior Frontend Engineer', company: 'Nimbus Fintech', location: 'Gurugram', type: 'Full-time',
        start: '2022-04', end: '', current: true,
        description: 'Lead a team of 5 engineers building the customer dashboard used by 200k+ users\nBuilt a design system in React and TypeScript adopted by 4 product teams\nImproved Largest Contentful Paint from 4.1s to 1.8s with code splitting and image optimization',
      },
      {
        role: 'Frontend Developer', company: 'BrightApps Solutions', location: 'Noida', type: 'Full-time',
        start: '2019-07', end: '2022-03', current: false,
        description: 'Developed 30+ features for a telecom self-care portal in React and Redux\nIntroduced unit testing with Jest and React Testing Library, reaching 75% coverage',
      },
    ],
    education: [
      {
        degree: 'B.Tech', field: 'Computer Science', institution: 'Delhi Technological University', location: 'New Delhi',
        grade: '8.4 CGPA', start: '2015-08', end: '2019-06', current: false, description: '',
      },
    ],
    projects: [
      {
        name: 'Interview Prep App', role: 'Creator', tech: 'React, JavaScript, CSS', link: 'github.com/aaravsharma/interview-prep',
        start: '2024-01', end: '2024-03',
        description: 'Searchable question bank with 300+ frontend interview questions\nLocal answer editing with JSON export',
      },
    ],
    skills: [
      { category: 'Frontend', items: 'React, TypeScript, Next.js, Redux Toolkit, HTML, CSS, Tailwind CSS' },
      { category: 'Backend', items: 'Node.js, Express, GraphQL, MongoDB' },
      { category: 'Tools', items: 'Git, Jest, Playwright, Webpack, Vite, Figma' },
    ],
    certifications: [
      { name: 'AWS Certified Developer - Associate', issuer: 'Amazon Web Services', date: '2023-05', credentialId: '', link: '' },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
    ],
    achievements: [
      { title: 'Employee of the Quarter', date: '2023-09', description: 'Recognized for delivering the dashboard redesign two weeks ahead of schedule' },
    ],
    interests: 'Open source, Chess, Travel',
  };
}

function normalize(data) {
  const base = defaultState();
  const src = data && typeof data === 'object' ? data : {};
  const personal = src.personal || {};

  for (const key of Object.keys(base.personal)) {
    if (typeof personal[key] === 'string') base.personal[key] = personal[key];
  }
  if (!base.personal.photo.startsWith('data:image/')) base.personal.photo = '';

  if (typeof src.interests === 'string') base.interests = src.interests;

  const settings = src.settings || {};
  if (TEMPLATES.includes(settings.template)) base.settings.template = settings.template;
  if (settings.font in WORD_FONTS) base.settings.font = settings.font;
  if (/^#[0-9a-f]{6}$/i.test(settings.accent || '')) base.settings.accent = settings.accent;
  if (typeof settings.showPhoto === 'boolean') base.settings.showPhoto = settings.showPhoto;

  for (const key of LIST_KEYS) {
    if (!Array.isArray(src[key])) continue;
    base[key] = src[key].map((raw) => {
      const item = emptyItem(key);
      for (const field of LIST_SECTIONS[key].fields) {
        const value = raw?.[field.key];
        item[field.key] = field.type === 'checkbox' ? Boolean(value) : value == null ? '' : String(value);
      }
      if (raw?.id) item.id = String(raw.id);
      return item;
    });
  }
  return base;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch {
    // Fall through to sample data if storage is unavailable or corrupted.
  }
  return normalize(sampleData());
}

let state = loadState();

const editor = document.getElementById('editor');
const resumeEl = document.getElementById('resume');
const previewScroll = document.querySelector('.preview-scroll');
const toastEl = document.getElementById('toast');

// Helpers for formatting resume content

function formatMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(value || '');
  return match ? `${MONTHS[Number(match[2]) - 1]} ${match[1]}` : String(value || '').trim();
}

function dateRange(start, end, current) {
  const from = formatMonth(start);
  const to = current ? 'Present' : formatMonth(end);
  if (from && to) return `${from} - ${to}`;
  return from || to;
}

const toBullets = (text) => String(text || '')
  .split('\n')
  .map((line) => line.replace(/^\s*[-\u2022*\u25AA]\s*/, '').trim())
  .filter(Boolean);

const splitList = (text) => String(text || '')
  .split(/[,\n]/)
  .map((part) => part.trim())
  .filter(Boolean);

const hasContent = (item) => Object.entries(item)
  .some(([key, value]) => key !== 'id' && typeof value === 'string' && value.trim());

function safeUrl(value) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(url)) return `https://${url}`;
  return '';
}

const prettyUrl = (value) => String(value || '').trim()
  .replace(/^https?:\/\//i, '')
  .replace(/^www\./i, '')
  .replace(/\/$/, '');

function linkOf(value) {
  const href = safeUrl(value);
  return href ? { href, text: prettyUrl(value) } : null;
}

function initialsOf(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join('');
}

function contactItems(p) {
  const items = [];
  const email = p.email.trim();
  const phone = p.phone.trim();
  if (email) items.push({ text: email, href: `mailto:${email}` });
  if (phone) items.push({ text: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}` });
  if (p.location.trim()) items.push({ text: p.location.trim() });
  for (const key of ['linkedin', 'github', 'website']) {
    const value = p[key].trim();
    if (value) items.push({ text: prettyUrl(value), href: safeUrl(value) });
  }
  return items;
}

// A template-independent view of the resume, shared by the preview and the Word export.
function buildModel(s) {
  const p = s.personal;
  const filled = (key) => s[key].filter(hasContent);
  const sub = (...parts) => parts.map((part) => String(part || '').trim()).filter(Boolean);

  return {
    name: p.fullName.trim(),
    title: p.title.trim(),
    summary: p.summary.trim(),
    initials: initialsOf(p.fullName),
    photo: s.settings.showPhoto ? p.photo : '',
    showPhoto: s.settings.showPhoto,
    contacts: contactItems(p),
    experience: filled('experience').map((it) => ({
      title: it.role, sub: sub(it.company, it.location, it.type),
      date: dateRange(it.start, it.end, it.current), bullets: toBullets(it.description),
    })),
    education: filled('education').map((it) => ({
      title: sub(it.degree, it.field).join(', '),
      sub: sub(it.institution, it.location, it.grade && `Grade: ${it.grade}`),
      date: dateRange(it.start, it.end, it.current), bullets: toBullets(it.description),
    })),
    projects: filled('projects').map((it) => ({
      title: it.name, link: linkOf(it.link), sub: sub(it.role, it.tech && `Tech: ${it.tech}`),
      date: dateRange(it.start, it.end, false), bullets: toBullets(it.description),
    })),
    certifications: filled('certifications').map((it) => ({
      title: it.name, link: linkOf(it.link), sub: sub(it.issuer, it.credentialId && `Credential ID: ${it.credentialId}`),
      date: formatMonth(it.date), bullets: [],
    })),
    achievements: filled('achievements').map((it) => ({
      title: it.title, sub: [], date: formatMonth(it.date), bullets: toBullets(it.description),
    })),
    skills: filled('skills')
      .map((it) => ({ category: it.category.trim(), items: splitList(it.items) }))
      .filter((group) => group.items.length),
    languages: filled('languages').map((it) => ({ name: it.language.trim(), level: it.proficiency })),
    interests: splitList(s.interests),
  };
}

// Preview rendering

const section = (title, inner) => `<section class="r-section"><h2>${escapeHtml(title)}</h2>${inner}</section>`;

function entryHtml(entry) {
  const link = entry.link
    ? ` <a class="r-link" href="${escapeHtml(entry.link.href)}">${escapeHtml(entry.link.text)}</a>`
    : '';
  const sub = entry.sub.length ? `<p class="r-sub">${escapeHtml(entry.sub.join(' \u00B7 '))}</p>` : '';
  const date = entry.date ? `<span class="r-date">${escapeHtml(entry.date)}</span>` : '';
  const bullets = entry.bullets.length
    ? `<ul class="r-bullets">${entry.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
    : '';
  return `<div class="r-entry"><div class="r-entry-head"><div><h3>${escapeHtml(entry.title)}${link}</h3>${sub}</div>${date}</div>${bullets}</div>`;
}

const entriesSection = (title, entries) => (entries.length ? section(title, entries.map(entryHtml).join('')) : '');

function buildResumeHtml(m, template) {
  const photo = m.showPhoto
    ? `<div class="r-photo">${m.photo ? `<img src="${escapeHtml(m.photo)}" alt="">` : escapeHtml(m.initials)}</div>`
    : '';
  const name = `<h1 class="r-name${m.name ? '' : ' is-placeholder'}">${escapeHtml(m.name || 'Your Name')}</h1>`
    + (m.title ? `<p class="r-title">${escapeHtml(m.title)}</p>` : '');
  const contacts = m.contacts.length
    ? `<ul class="r-contact">${m.contacts.map((c) => `<li>${c.href ? `<a href="${escapeHtml(c.href)}">${escapeHtml(c.text)}</a>` : escapeHtml(c.text)}</li>`).join('')}</ul>`
    : '';

  const summary = m.summary ? section('Profile', `<p class="r-summary">${escapeHtml(m.summary).replace(/\n/g, '<br>')}</p>`) : '';
  const languages = m.languages.length
    ? section('Languages', `<ul class="r-plain">${m.languages.map((l) => `<li><strong>${escapeHtml(l.name)}</strong>${l.level ? ` - ${escapeHtml(l.level)}` : ''}</li>`).join('')}</ul>`)
    : '';
  const interests = m.interests.length ? section('Interests', `<p>${escapeHtml(m.interests.join(' \u00B7 '))}</p>`) : '';
  const experience = entriesSection('Experience', m.experience);
  const projects = entriesSection('Projects', m.projects);
  const education = entriesSection('Education', m.education);
  const certifications = entriesSection('Certifications', m.certifications);
  const achievements = entriesSection('Achievements', m.achievements);

  if (template === 'modern') {
    const skills = m.skills.length
      ? section('Skills', m.skills.map((g) => (g.category ? `<h4 class="r-chip-group">${escapeHtml(g.category)}</h4>` : '')
        + `<div class="r-chips">${g.items.map((i) => `<span>${escapeHtml(i)}</span>`).join('')}</div>`).join(''))
      : '';
    return `<div class="r-grid">
      <aside class="r-aside">${photo}${contacts ? section('Contact', contacts) : ''}${skills}${languages}${interests}</aside>
      <div class="r-main"><header class="r-header"><div>${name}</div></header>${summary}${experience}${projects}${education}${certifications}${achievements}</div>
    </div>`;
  }

  const skills = m.skills.length
    ? section('Skills', `<div class="r-skills">${m.skills.map((g) => `<p>${g.category ? `<strong>${escapeHtml(g.category)}:</strong> ` : ''}${escapeHtml(g.items.join(', '))}</p>`).join('')}</div>`)
    : '';
  return `<header class="r-header">${photo}<div>${name}${contacts}</div></header>`
    + summary + experience + projects + education + skills + certifications + achievements + languages + interests;
}

function renderPreview() {
  const { template, font, accent } = state.settings;
  resumeEl.className = `resume tpl-${template} font-${font}`;
  resumeEl.style.setProperty('--accent', accent);
  resumeEl.innerHTML = buildResumeHtml(buildModel(state), template);
}

function fitPreview() {
  resumeEl.style.zoom = '';
  const styles = getComputedStyle(previewScroll);
  const available = previewScroll.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  const scale = Math.min(1, available / resumeEl.offsetWidth);
  if (scale < 1) resumeEl.style.zoom = String(scale);
}

// Editor rendering

function fieldHtml(field, value, attrs, disabled = false) {
  const id = `f-${uid()}`;
  const common = `id="${id}" ${attrs}${disabled ? ' disabled' : ''}${field.autocomplete ? ` autocomplete="${field.autocomplete}"` : ''}`;
  const placeholder = field.placeholder ? ` placeholder="${escapeHtml(field.placeholder)}"` : '';
  const full = field.full ? ' full' : '';

  if (field.type === 'checkbox') {
    return `<label class="check${full}"><input type="checkbox" ${common}${value ? ' checked' : ''}> ${escapeHtml(field.label)}</label>`;
  }

  let control;
  if (field.type === 'textarea') {
    control = `<textarea ${common} rows="${field.rows || 4}"${placeholder}>${escapeHtml(value)}</textarea>`;
  } else if (field.type === 'select') {
    const options = field.options
      .map((opt) => `<option value="${escapeHtml(opt)}"${opt === value ? ' selected' : ''}>${escapeHtml(opt || 'Select...')}</option>`)
      .join('');
    control = `<select ${common}>${options}</select>`;
  } else {
    control = `<input type="${field.type || 'text'}" ${common} value="${escapeHtml(value)}"${placeholder}>`;
  }
  return `<div class="field${full}"><label for="${id}">${escapeHtml(field.label)}</label>${control}</div>`;
}

function itemHtml(key, item, index, total) {
  const cfg = LIST_SECTIONS[key];
  const target = `data-list="${key}" data-index="${index}"`;
  const fields = cfg.fields
    .map((f) => fieldHtml(f, item[f.key], `${target} data-key="${f.key}"`, Boolean(f.disabledWhen && item[f.disabledWhen])))
    .join('');

  return `<div class="item">
    <div class="item-head">
      <span class="item-title">${escapeHtml(cfg.itemLabel(item))}</span>
      <div class="item-actions">
        <button type="button" class="icon-btn" data-action="up" ${target}${index === 0 ? ' disabled' : ''} aria-label="Move up" title="Move up">&uarr;</button>
        <button type="button" class="icon-btn" data-action="down" ${target}${index === total - 1 ? ' disabled' : ''} aria-label="Move down" title="Move down">&darr;</button>
        <button type="button" class="icon-btn danger" data-action="remove" ${target} aria-label="Remove" title="Remove">&times;</button>
      </div>
    </div>
    <div class="grid">${fields}</div>
  </div>`;
}

function personalPanel() {
  const p = state.personal;
  const fields = PERSONAL_FIELDS.map((f) => fieldHtml(f, p[f.key], `data-bind="personal.${f.key}"`)).join('');
  return `<details class="panel" open>
    <summary>Personal details</summary>
    <div class="panel-body">
      <div class="photo-row">
        <div class="photo-thumb" id="photoThumb"></div>
        <div class="photo-actions">
          <button type="button" class="btn small" data-cmd="pick-photo">Upload photo</button>
          <button type="button" class="btn small ghost" data-cmd="remove-photo">Remove</button>
          <label class="check"><input type="checkbox" data-bind="settings.showPhoto"${state.settings.showPhoto ? ' checked' : ''}> Show photo on resume</label>
          <input type="file" id="photoInput" accept="image/*" hidden>
        </div>
      </div>
      <div class="grid">${fields}</div>
    </div>
  </details>`;
}

function listPanel(key) {
  const cfg = LIST_SECTIONS[key];
  return `<details class="panel"${cfg.open ? ' open' : ''}>
    <summary>${escapeHtml(cfg.title)} <span class="count" data-count="${key}"></span></summary>
    <div class="panel-body">
      ${cfg.hint ? `<p class="panel-hint">${escapeHtml(cfg.hint)}</p>` : ''}
      <div class="items" data-items="${key}"></div>
      <button type="button" class="btn small add-btn" data-action="add" data-list="${key}">+ ${escapeHtml(cfg.addLabel)}</button>
    </div>
  </details>`;
}

function additionalPanel() {
  const field = { key: 'interests', label: 'Interests / hobbies (comma separated)', placeholder: 'Open source, Chess, Travel', full: true };
  return `<details class="panel">
    <summary>Interests</summary>
    <div class="panel-body"><div class="grid">${fieldHtml(field, state.interests, 'data-bind="interests"')}</div></div>
  </details>`;
}

function renderList(key) {
  const items = state[key];
  editor.querySelector(`[data-items="${key}"]`).innerHTML = items.length
    ? items.map((item, i) => itemHtml(key, item, i, items.length)).join('')
    : '<p class="empty-hint">No entries yet.</p>';
  editor.querySelector(`[data-count="${key}"]`).textContent = items.length || '';
}

function renderPhotoThumb() {
  const thumb = document.getElementById('photoThumb');
  if (!thumb) return;
  thumb.innerHTML = state.personal.photo
    ? `<img src="${escapeHtml(state.personal.photo)}" alt="Profile photo">`
    : escapeHtml(initialsOf(state.personal.fullName) || '?');
}

function renderEditor() {
  editor.innerHTML = personalPanel() + LIST_KEYS.map(listPanel).join('') + additionalPanel();
  LIST_KEYS.forEach(renderList);
  renderPhotoThumb();
}

function syncDesignControls() {
  document.querySelectorAll('[data-bind^="settings."]').forEach((control) => {
    const value = state.settings[control.dataset.bind.split('.')[1]];
    if (control.type === 'checkbox') control.checked = value;
    else control.value = value;
  });
}

// State updates

let saveTimer;

function saveNow() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    toast('Could not save in this browser. Storage may be full or blocked.');
  }
}

function update() {
  renderPreview();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 300);
}

function replaceState(next) {
  state = next;
  renderEditor();
  syncDesignControls();
  update();
}

function handleInput(event) {
  const target = event.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;

  if (target.dataset.bind) {
    const [group, key] = target.dataset.bind.split('.');
    if (key) state[group][key] = value;
    else state[group] = value;
    if (target.dataset.bind === 'personal.fullName') renderPhotoThumb();
  } else if (target.dataset.key) {
    const { list, index, key } = target.dataset;
    const item = state[list][Number(index)];
    item[key] = value;

    const card = target.closest('.item');
    for (const field of LIST_SECTIONS[list].fields) {
      if (field.disabledWhen === key) card.querySelector(`[data-key="${field.key}"]`).disabled = Boolean(value);
    }
    card.querySelector('.item-title').textContent = LIST_SECTIONS[list].itemLabel(item);
  } else {
    return;
  }
  update();
}

function handleListAction(action, list, index) {
  const items = state[list];
  if (action === 'add') {
    items.push(emptyItem(list));
    renderList(list);
    editor.querySelector(`[data-items="${list}"] .item:last-child :is(input, select, textarea)`)?.focus();
  } else if (action === 'remove') {
    if (hasContent(items[index]) && !confirm('Remove this entry?')) return;
    items.splice(index, 1);
    renderList(list);
  } else if (action === 'up' || action === 'down') {
    const to = action === 'up' ? index - 1 : index + 1;
    if (to < 0 || to >= items.length) return;
    [items[index], items[to]] = [items[to], items[index]];
    renderList(list);
    editor.querySelector(`[data-items="${list}"] [data-action="${action}"][data-index="${to}"]:not(:disabled)`)?.focus();
  }
  update();
}

// Photo

function handlePhoto(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    toast('Please choose an image file.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 320;
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      state.personal.photo = canvas.toDataURL('image/jpeg', 0.85);
      renderPhotoThumb();
      update();
    };
    img.onerror = () => toast('That image could not be read.');
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

// Export helpers

function fileBaseName() {
  const name = state.personal.fullName.trim().replace(/[^\w\- ]+/g, '').replace(/\s+/g, '_');
  return name ? `${name}_Resume` : 'Resume';
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportPdf() {
  renderPreview();
  const previousTitle = document.title;
  document.title = fileBaseName();
  window.addEventListener('afterprint', () => { document.title = previousTitle; }, { once: true });
  window.print();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  download(blob, `${fileBaseName()}.json`);
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      replaceState(normalize(JSON.parse(reader.result)));
      toast('Profile imported.');
    } catch {
      toast('That file is not a valid Profile Builder JSON export.');
    }
  };
  reader.readAsText(file);
}

// Word export: an MHTML document, which Word opens as a .doc with the photo embedded.

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

const wrapBase64 = (b64) => b64.replace(/.{1,76}/g, '$&\r\n').trimEnd();

function buildWordHtml(m, settings, photoSrc) {
  const accent = settings.accent;
  const muted = '#555555';
  const heading = (title) => `<p style="margin:14pt 0 5pt 0;padding-bottom:2pt;border-bottom:solid ${accent} 1.0pt;font-size:11pt;font-weight:bold;color:${accent};text-transform:uppercase;letter-spacing:.8pt">${escapeHtml(title)}</p>`;
  const linkHtml = (link, size = '9.5pt') => (link
    ? ` <a href="${escapeHtml(link.href)}" style="color:${accent};text-decoration:none;font-weight:normal;font-size:${size}">${escapeHtml(link.text)}</a>`
    : '');

  const entry = (e) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:6pt">
      <tr>
        <td style="vertical-align:top;padding:0">
          <p style="font-size:11pt;font-weight:bold;color:#111111">${escapeHtml(e.title)}${linkHtml(e.link)}</p>
          ${e.sub.length ? `<p style="color:${muted};font-size:9.5pt">${escapeHtml(e.sub.join(' \u00B7 '))}</p>` : ''}
        </td>
        <td width="140" style="width:105pt;vertical-align:top;text-align:right;padding:0;color:${muted};font-size:9.5pt">${escapeHtml(e.date)}</td>
      </tr>
    </table>
    ${e.bullets.length ? `<ul style="margin-top:2pt;margin-bottom:0">${e.bullets.map((b) => `<li style="margin-bottom:1pt">${escapeHtml(b)}</li>`).join('')}</ul>` : ''}`;
  const entries = (title, list) => (list.length ? heading(title) + list.map(entry).join('') : '');

  const contacts = m.contacts
    .map((c) => (c.href ? `<a href="${escapeHtml(c.href)}" style="color:#444444;text-decoration:none">${escapeHtml(c.text)}</a>` : escapeHtml(c.text)))
    .join(' &nbsp;|&nbsp; ');

  const header = `
    <table width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      <tr>
        ${photoSrc ? `<td width="96" style="width:72pt;vertical-align:middle;padding:0 12pt 0 0"><img src="${photoSrc}" width="84" height="84" alt=""></td>` : ''}
        <td style="vertical-align:middle;padding:0">
          <p style="font-size:22pt;font-weight:bold;color:#111111">${escapeHtml(m.name || 'Your Name')}</p>
          ${m.title ? `<p style="font-size:12pt;font-weight:bold;color:${accent};margin-top:2pt">${escapeHtml(m.title)}</p>` : ''}
          ${contacts ? `<p style="font-size:9.5pt;color:#444444;margin-top:4pt">${contacts}</p>` : ''}
        </td>
      </tr>
    </table>`;

  const body = [
    header,
    m.summary ? heading('Profile') + `<p>${escapeHtml(m.summary).replace(/\n/g, '<br>')}</p>` : '',
    entries('Experience', m.experience),
    entries('Projects', m.projects),
    entries('Education', m.education),
    m.skills.length
      ? heading('Skills') + m.skills.map((g) => `<p style="margin-bottom:2pt">${g.category ? `<b>${escapeHtml(g.category)}:</b> ` : ''}${escapeHtml(g.items.join(', '))}</p>`).join('')
      : '',
    entries('Certifications', m.certifications),
    entries('Achievements', m.achievements),
    m.languages.length
      ? heading('Languages') + `<p>${m.languages.map((l) => `<b>${escapeHtml(l.name)}</b>${l.level ? ` - ${escapeHtml(l.level)}` : ''}`).join(' &nbsp;|&nbsp; ')}</p>`
      : '',
    m.interests.length ? heading('Interests') + `<p>${escapeHtml(m.interests.join(' \u00B7 '))}</p>` : '',
  ].join('');

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${escapeHtml(m.name || 'Resume')}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
  @page WordSection1 { size: 595.3pt 841.9pt; margin: 42pt 48pt 42pt 48pt; }
  div.WordSection1 { page: WordSection1; }
  body { font-family: ${WORD_FONTS[settings.font]}; font-size: 10.5pt; color: #222222; }
  p { margin: 0; }
  li { font-size: 10.5pt; }
</style>
</head>
<body><div class="WordSection1">${body}</div></body>
</html>`;
}

function exportWord() {
  const model = buildModel(state);
  const boundary = '----=_NextPart_ProfileBuilder';
  const photoMatch = /^data:(image\/[\w.+-]+);base64,(.+)$/.exec(model.photo || '');
  const photoLocation = 'file:///C:/profile-photo.jpg';
  const html = buildWordHtml(model, state.settings, photoMatch ? photoLocation : '');

  const parts = [
    'MIME-Version: 1.0',
    `Content-Type: multipart/related; boundary="${boundary}"; type="text/html"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="utf-8"',
    'Content-Transfer-Encoding: base64',
    'Content-Location: file:///C:/resume.htm',
    '',
    wrapBase64(utf8ToBase64(html)),
    '',
  ];
  if (photoMatch) {
    parts.push(
      `--${boundary}`,
      `Content-Type: ${photoMatch[1]}`,
      'Content-Transfer-Encoding: base64',
      `Content-Location: ${photoLocation}`,
      '',
      wrapBase64(photoMatch[2]),
      '',
    );
  }
  parts.push(`--${boundary}--`, '');

  download(new Blob([parts.join('\r\n')], { type: 'application/msword' }), `${fileBaseName()}.doc`);
}

// Toast

let toastTimer;

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// Events

document.addEventListener('input', handleInput);

document.addEventListener('change', (event) => {
  const input = event.target;
  if (input.id === 'photoInput') handlePhoto(input.files[0]);
  if (input.id === 'importInput') importJson(input.files[0]);
  if (input.type === 'file') input.value = '';
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action], [data-cmd]');
  if (!button || button.disabled) return;

  const { action, cmd, list } = button.dataset;
  if (action) {
    handleListAction(action, list, Number(button.dataset.index));
    return;
  }

  switch (cmd) {
    case 'pick-photo':
      document.getElementById('photoInput').click();
      break;
    case 'remove-photo':
      state.personal.photo = '';
      renderPhotoThumb();
      update();
      break;
    case 'sample':
      if (confirm('Replace your current details with sample data?')) replaceState(normalize(sampleData()));
      break;
    case 'clear':
      if (confirm('Clear all details? Export JSON first if you want a backup.')) {
        replaceState(normalize({ settings: state.settings }));
      }
      break;
    case 'import':
      document.getElementById('importInput').click();
      break;
    case 'export-json':
      exportJson();
      break;
    case 'export-word':
      exportWord();
      toast('Word document downloaded.');
      break;
    case 'export-pdf':
      exportPdf();
      break;
    default:
  }
});

editor.addEventListener('submit', (event) => event.preventDefault());
window.addEventListener('resize', fitPreview);

renderEditor();
syncDesignControls();
renderPreview();
fitPreview();
