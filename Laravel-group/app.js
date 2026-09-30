/**
 * Signal City Sénégal (SunuGox)
 * Plateforme Citoyenne & Municipale - Sénégal
 * Design System Moderne & Épuré
 */

// DOM Elements
const app = document.querySelector('#app');
const toastElement = document.querySelector('#toast');
const modalContainer = document.querySelector('#modal-container');

// 14 Régions du Sénégal
const regionsSenegal = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Fatick',
  'Kaolack', 'Louga', 'Matam', 'Tambacounda', 'Kédougou',
  'Kaffrine', 'Kolda', 'Ziguinchor', 'Sédhiou'
];

// Catégories avec icônes Lucide
const categories = [
  { name: 'Voirie & Routes', icon: 'route', count: 18 },
  { name: 'Éclairage public', icon: 'lightbulb', count: 12 },
  { name: 'Déchets & Salubrité', icon: 'trash-2', count: 24 },
  { name: 'Eau & Assainissement', icon: 'droplets', count: 9 },
  { name: 'Espaces verts', icon: 'trees', count: 7 },
  { name: 'Sécurité & Tranquillité', icon: 'shield', count: 5 },
  { name: 'Mobilité & Stationnement', icon: 'parking-square', count: 8 },
  { name: 'Autre signalement', icon: 'more-horizontal', count: 4 },
];

const statusLabels = {
  received: 'Nouveau / À affecter',
  assigned: 'Affecté au service',
  inspection: 'Inspection en cours',
  awaiting: 'Rapport à valider',
  progress: 'Intervention en cours',
  resolved: 'Résolu & Clôturé',
  rejected: 'Rejeté / Hors périmètre'
};

const statusClasses = {
  received: 'nouveau',
  assigned: 'pris_en_charge',
  inspection: 'en_cours',
  awaiting: 'pris_en_charge',
  progress: 'en_cours',
  resolved: 'resolu',
  rejected: 'rejete'
};

// Rôles utilisateurs
const roles = {
  citizen: {
    id: 'citizen',
    title: 'Citoyen',
    name: 'Awa Diop',
    subtitle: 'Citoyenne engagée',
    location: 'Dakar Plateau',
    initial: 'AD',
    badge: 'Citoyen',
    avatarBg: '#00875a'
  },
  agent: {
    id: 'agent',
    title: 'Agent Terrain',
    name: 'Amadou Sow',
    subtitle: 'Services Techniques Voirie',
    location: 'District Dakar Centre',
    initial: 'AS',
    badge: 'Agent Terrain',
    avatarBg: '#f59e0b'
  },
  admin: {
    id: 'admin',
    title: 'Admin Régional',
    name: 'Ibrahima Diallo',
    subtitle: 'Mairie & Gouvernance',
    location: 'Région de Dakar',
    initial: 'ID',
    badge: 'Admin Régional',
    avatarBg: '#2563eb'
  }
};

// Données initiales réalistes (Sénégal)
const initialReports = [
  {
    id: 'SIG-SN-0158',
    title: 'Nid-de-poule dangereux sur l’Avenue Cheikh Anta Diop',
    category: 'Voirie & Routes',
    description: 'Un trou très profond s’est creusé près du couloir piéton, risquant d’endommager les véhicules et dangereux pour les deux-roues en soirée.',
    location: 'Avenue Cheikh Anta Diop, près de Fann Hock',
    region: 'Dakar',
    date: '28 sept. 2026',
    status: 'progress',
    priority: 'Urgente',
    service: 'Voirie',
    supports: 24,
    supportedByUser: true,
    author: 'Awa Diop',
    authorized: true,
    photo: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=75',
    report: 'Inspection réalisée le 27/09. Décapage de la chaussée et pose d’enrobé bitumineux autorisés par la mairie.'
  },
  {
    id: 'SIG-SN-0163',
    title: 'Lampadaire public éteint depuis 5 jours',
    category: 'Éclairage public',
    description: 'Le candélabre à l’angle est totalement hors service. Carrefour plongé dans le noir, sentiment d’insécurité pour les riverains.',
    location: 'Croisement Rue 12 et Allées Pape Guèye Fall',
    region: 'Dakar',
    date: '27 sept. 2026',
    status: 'awaiting',
    priority: 'Moyenne',
    service: 'Éclairage',
    supports: 14,
    supportedByUser: false,
    author: 'Moussa Ndiaye',
    photo: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=75',
    report: 'Câblage souterrain corrodé suite aux fortes pluies. Remplacement du coffret d’alimentation requis sous 48h.',
    inspectionPhoto: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=200&q=75'
  },
  {
    id: 'SIG-SN-0169',
    title: 'Dépôt d’ordures et encombrants non collectés',
    category: 'Déchets & Salubrité',
    description: 'Accumulation importante d’ordures ménagères et décombres bloquant partiellement le trottoir piéton.',
    location: 'Boulevard du Général de Gaulle, Médina',
    region: 'Dakar',
    date: '29 sept. 2026',
    status: 'received',
    priority: 'Moyenne',
    service: 'À affecter',
    supports: 19,
    supportedByUser: false,
    author: 'Fatou Kébé',
    photo: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=75'
  },
  {
    id: 'SIG-SN-0172',
    title: 'Rupture de buse et refoulement d’eaux usées',
    category: 'Eau & Assainissement',
    description: 'Écoulement d’eaux sur la voie publique dégageant de fortes odeurs. Risque sanitaire pour les habitations riveraines.',
    location: 'Cité Castors, près du marché aux légumes',
    region: 'Dakar',
    date: '29 sept. 2026',
    status: 'assigned',
    priority: 'Urgente',
    service: 'Assainissement',
    supports: 31,
    supportedByUser: true,
    author: 'Babacar Fall',
    photo: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=400&q=75'
  },
  {
    id: 'SIG-SN-0142',
    title: 'Branches d’acacia menaçant de rompre sur la route',
    category: 'Espaces verts',
    description: 'Après le coup de vent, de grosses branches sont brisées et pendent dangereusement au-dessus de la circulation.',
    location: 'Avenue Malick Sy, Dakar',
    region: 'Dakar',
    date: '24 sept. 2026',
    status: 'resolved',
    priority: 'Faible',
    service: 'Espaces verts',
    supports: 8,
    supportedByUser: true,
    author: 'Awa Diop',
    photo: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=75',
    report: 'Élagage complet réalisé par l’équipe Espaces Verts le 25/09. Voie totalement dégagée et sécurisée.'
  },
  {
    id: 'SIG-SN-0177',
    title: 'Feu tricolore clignotant en panne',
    category: 'Mobilité & Stationnement',
    description: 'Le feu est bloqué à l’orange clignotant provoquant des embouteillages monstres aux heures de pointe.',
    location: 'Rond-Point Liberté 6, VDN',
    region: 'Dakar',
    date: '29 sept. 2026',
    status: 'received',
    priority: 'Urgente',
    service: 'À affecter',
    supports: 42,
    supportedByUser: false,
    author: 'Omar Sène',
    photo: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=75'
  }
];

// Objets perdus & CNI
const initialFoundItems = [
  {
    id: 'OBJ-SN-0924',
    name: 'CNI (Carte Nationale d’Identité) au nom de S. Ndiaye',
    category: 'Documents officiels',
    description: 'Carte biométrique CEDEAO trouvée sur le trottoir après la descente du bus TATA Ligne 44.',
    place: 'Arrêt Bus Liberté 6, Dakar',
    date: '29 sept. 2026',
    status: 'Retrouvé',
    station: 'Commissariat Central de Dakar — Bureau des Objets Trouvés',
    contact: '+221 33 823 25 25',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'OBJ-SN-0918',
    name: 'Trousseau de clés avec ruban vert-jaune-rouge',
    category: 'Clés & Badges',
    description: '3 clés métalliques, 1 badge magnétique gris et un porte-clés tissu aux couleurs du Sénégal.',
    place: 'Entrée principale Marché Sandaga',
    date: '28 sept. 2026',
    status: 'Retrouvé',
    station: 'Mairie d’Arrondissement du Plateau — Accueil Guichet Unique',
    contact: '+221 33 849 50 00',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'OBJ-SN-0912',
    name: 'Pochette cuir marron avec Permis de Conduire',
    category: 'Maroquinerie & Documents',
    description: 'Pochette oubliée dans un taxi jaune-noir, contenant un permis et un reçu bancaire.',
    place: 'Colobane / Avenue Malick Sy',
    date: '26 sept. 2026',
    status: 'Retrouvé',
    station: 'Poste de Police de Médina — Service Citoyen',
    contact: '+221 33 821 11 22',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80'
  }
];

// État Global de l'Application
const state = {
  theme: 'light',
  role: 'citizen', // null pour la page de connexion, ou 'citizen', 'agent', 'admin'
  region: 'Dakar',
  view: 'dashboard', // 'dashboard', 'new-report', 'my-reports', 'lost-items', 'services', 'notifications'
  query: '',
  lostSearch: '',
  lostTypeFilter: 'all',
  lostCategoryFilter: 'all',
  activeStep: 1,
  draft: {
    title: '',
    category: 'Voirie & Routes',
    description: '',
    location: '',
    region: 'Dakar',
    priority: 'Moyenne'
  },
  photo: '',
  coordinates: '',
  reports: [...initialReports],
  items: [...initialFoundItems],
  toastTimer: null,
  activeModal: null,
  confirmedResolved: false,
  authMode: 'login', // 'login' ou 'register'
  myReportsExpanded: false
};

// Initialisation Thème depuis LocalStorage ou par défaut
const savedTheme = localStorage.getItem('sunugox-theme');
if (savedTheme) {
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  document.documentElement.setAttribute('data-theme', 'light');
}

// Helpers
function icon(name, size = 18, extraClass = '') {
  return `<i data-lucide="${name}" width="${size}" height="${size}" class="${extraClass}"></i>`;
}

function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({
      attrs: { 'stroke-width': 1.8 }
    });
  }
}

function notify(message, type = 'success') {
  const iconName = type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-triangle' : 'info';
  toastElement.innerHTML = `${icon(iconName, 18)} <span>${escapeHtml(message)}</span>`;
  toastElement.className = 'app-toast-alert visible';
  renderIcons();
  
  if (state.toastTimer) window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => {
    toastElement.classList.remove('visible');
  }, 3400);
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('sunugox-theme', state.theme);
  render();
  notify(`Mode ${state.theme === 'dark' ? 'Sombre' : 'Clair'} activé`);
}

function setRole(newRole) {
  state.role = newRole;
  state.view = 'dashboard';
  state.query = '';
  render();
  if (newRole) {
    notify(`Connecté en tant que ${roles[newRole].title} (${roles[newRole].name})`);
  }
}

// ==========================================================================
// RENDU PRINCIPAL
// ==========================================================================
function render() {
  let html = `
    <!-- Bandeau National Tricolore Sénégal -->
    <div class="senegal-stripe-header"></div>
  `;

  // Si l'utilisateur n'est pas connecté, afficher la page d'authentification dédiée
  if (!state.role) {
    html += authPageView();
  } else {
    // Si connecté, afficher le layout fluide 100% plein écran
    html += `
      <div class="app-container-fluid">
        ${sidebarView()}
        <div class="app-main-viewport">
          ${topbarView()}
          <main class="app-content-scroll">
            ${mainContentView()}
          </main>
        </div>
      </div>
    `;
  }

  // Modale Popup si active
  if (state.activeModal) {
    html += modalView(state.activeModal);
  }

  app.innerHTML = html;
  renderIcons();
}

// ==========================================================================
// PAGE AUTHENTIFICATION (DÉDIÉE & ACCÈS DÉMO 1-CLIC)
// ==========================================================================
function authPageView() {
  return `
    <div class="auth-page-wrapper">
      <div class="auth-container-card">
        <!-- Volet Gauche Branding Sénégal & SunuGox -->
        <div class="auth-left-branding">
          <div class="auth-brand-logo">
            <div class="brand-icon-box">
              ${icon('landmark', 22)}
            </div>
            <div class="brand-text-block">
              <span class="brand-title">Signal City</span>
              <span class="brand-badge-flag">SunuGox · Sénégal 🇸🇳</span>
            </div>
          </div>
          
          <div class="auth-hero-text">
            <h2>Votre cadre de vie au Sénégal, protégé ensemble.</h2>
            <p>Plateforme nationale citoyenne unifiée pour signaler les anomalies urbaines, coordonner les services municipaux et retrouver les objets égarés.</p>
          </div>
          
          <div class="auth-features-list">
            <div class="auth-feature-item">
              ${icon('check-circle', 16)}
              <span>Signalement géolocalisé avec photo en moins de 2 minutes</span>
            </div>
            <div class="auth-feature-item">
              ${icon('check-circle', 16)}
              <span>Interconnexion directe avec les services des 14 régions</span>
            </div>
            <div class="auth-feature-item">
              ${icon('check-circle', 16)}
              <span>Transparence totale et suivi en temps réel jusqu'à résolution</span>
            </div>
            <div class="auth-feature-item">
              ${icon('check-circle', 16)}
              <span>Réseau de restitution sécurisé pour les CNI & objets trouvés</span>
            </div>
          </div>
          
          <div style="font-size:11.5px; color:rgba(255,255,255,0.7);">
            © 2026 République du Sénégal · SunuGox Initiative Citoyenne
          </div>
        </div>
        
        <!-- Volet Droit Formulaire & Accès 1-Clic -->
        <div class="auth-right-form-pane">
          <!-- Barre Accès Démo 1-Clic -->
          <div class="auth-demo-bar">
            <div class="auth-demo-title">
              ${icon('sparkles', 13)} Accès Démo Rapide (1-Clic) :
            </div>
            <div class="auth-demo-buttons-grid">
              <button class="btn-demo-pill" data-action="quick-role" data-role="citizen">
                ${icon('user', 14)} Citoyen (Awa)
              </button>
              <button class="btn-demo-pill" data-action="quick-role" data-role="agent">
                ${icon('hard-hat', 14)} Agent (Amadou)
              </button>
              <button class="btn-demo-pill" data-action="quick-role" data-role="admin">
                ${icon('landmark', 14)} Mairie (Admin)
              </button>
            </div>
          </div>
          
          <!-- Onglets Connexion / Inscription -->
          <div class="auth-tabs-header">
            <button class="auth-tab-btn ${state.authMode === 'login' ? 'active' : ''}" data-action="auth-tab" data-tab="login">
              Connexion
            </button>
            <button class="auth-tab-btn ${state.authMode === 'register' ? 'active' : ''}" data-action="auth-tab" data-tab="register">
              Créer un compte
            </button>
          </div>
          
          <!-- Formulaire -->
          <form id="auth-form" onsubmit="event.preventDefault(); window.handleAuthSubmit();">
            ${state.authMode === 'register' ? `
              <div class="auth-form-group">
                <label class="auth-label">Prénom & Nom complet</label>
                <input class="auth-input" type="text" required placeholder="Ex. : Awa Diop" value="Awa Diop">
              </div>
            ` : ''}
            
            <div class="auth-form-group">
              <label class="auth-label">Numéro de téléphone ou Email</label>
              <input class="auth-input" type="text" required placeholder="Ex. : 77 123 45 67 ou awa@sunugox.sn" value="awa.diop@sunugox.sn">
            </div>
            
            <div class="auth-form-group">
              <label class="auth-label">Région de résidence</label>
              <select class="auth-select" id="auth-region-select">
                ${regionsSenegal.map(r => `<option value="${r}" ${r === state.region ? 'selected' : ''}>${r}</option>`).join('')}
              </select>
            </div>
            
            <div class="auth-form-group">
              <label class="auth-label">Mot de passe</label>
              <input class="auth-input" type="password" required placeholder="••••••••" value="sunugox2026">
            </div>
            
            <button type="submit" class="btn-auth-submit">
              ${icon('log-in', 16)} ${state.authMode === 'login' ? 'Se connecter à mon espace' : 'Valider mon inscription'}
            </button>
          </form>
          
          <div style="font-size:12px; color:var(--text-muted); text-align:center; margin-top:6px;">
            Accessible sur tout le territoire national · Version Desktop Plein Écran
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// SIDEBAR (VERT FORÊT ÉMÉRAUDE #07271b)
// ==========================================================================
function sidebarView() {
  const user = roles[state.role];
  
  // Navigation spécifique par rôle
  let navItems = [];
  if (state.role === 'citizen') {
    navItems = [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'layout-dashboard' },
      { id: 'new-report', label: 'Nouveau signalement', icon: 'plus-circle' },
      { id: 'my-reports', label: 'Mes signalements', icon: 'file-text', badge: state.reports.filter(r => r.author === 'Awa Diop').length },
      { id: 'lost-items', label: 'Objets perdus & CNI', icon: 'search' },
      { id: 'notifications', label: 'Notifications', icon: 'bell', badge: 3 }
    ];
  } else if (state.role === 'agent') {
    navItems = [
      { id: 'dashboard', label: 'Mes missions terrain', icon: 'hard-hat' },
      { id: 'inspections', label: 'Rapports d’inspection', icon: 'clipboard-list', badge: 2 },
      { id: 'notifications', label: 'Notifications', icon: 'bell', badge: 4 }
    ];
  } else {
    // Admin Régional
    navItems = [
      { id: 'dashboard', label: 'Vue d’ensemble (KPI)', icon: 'layout-grid' },
      { id: 'to-assign', label: 'Dossiers à affecter', icon: 'inbox', badge: state.reports.filter(r => r.status === 'received').length },
      { id: 'to-validate', label: 'Rapports à valider', icon: 'file-check', badge: state.reports.filter(r => r.status === 'awaiting').length },
      { id: 'services', label: 'Services municipaux', icon: 'wrench' },
      { id: 'notifications', label: 'Notifications', icon: 'bell', badge: 5 }
    ];
  }

  return `
    <aside class="app-sidebar">
      <div>
        <!-- Logo Brand -->
        <div class="sidebar-logo-brand" data-action="navigate" data-view="dashboard">
          <div class="brand-icon-box">
            ${icon('landmark', 20)}
          </div>
          <div class="brand-text-block">
            <span class="brand-title">Signal City</span>
            <span class="brand-badge-flag">SunuGox · Sénégal 🇸🇳</span>
          </div>
        </div>
        
        <!-- Navigation List -->
        <ul class="sidebar-nav-list">
          ${navItems.map(item => `
            <li class="sidebar-nav-item ${state.view === item.id ? 'active' : ''}">
              <button class="sidebar-nav-link ${state.view === item.id ? 'active' : ''}" data-action="navigate" data-view="${item.id}">
                ${icon(item.icon, 16)}
                <span>${item.label}</span>
                ${item.badge !== undefined ? `<span class="nav-badge-pill">${item.badge}</span>` : ''}
              </button>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <!-- Footer Profil -->
      <div class="sidebar-footer-box">
        <div class="profile-card-btn">
          <div class="profile-avatar-thumb" style="background-color:${user.avatarBg};">
            ${user.initial}
          </div>
          <div class="profile-meta-text">
            <span class="profile-name">${user.name}</span>
            <span class="profile-role-badge">${user.badge} · ${user.location}</span>
          </div>
        </div>
        
        <button class="btn-sidebar-auth" data-action="logout">
          ${icon('log-out', 14)} Déconnexion / Changer
        </button>
      </div>
    </aside>
  `;
}

// ==========================================================================
// TOPBAR (HEADER DU VIEWPORT)
// ==========================================================================
function topbarView() {
  const user = roles[state.role];
  const viewTitles = {
    dashboard: state.role === 'citizen' ? 'Tableau de bord Citoyen' : state.role === 'agent' ? 'Espace Agent de Terrain' : 'Supervision Régionale',
    'new-report': 'Déposer un Signalement Urbain',
    'my-reports': 'Mes Remontées Citoyennes',
    'lost-items': 'Objets Égarés & CNI Retrouvés',
    'inspections': 'Rapports Techniques & Visites',
    'to-assign': 'Dossiers en attente d’affectation',
    'to-validate': 'Rapports d’inspection à valider',
    'services': 'Services & Équipes d’Intervention',
    'notifications': 'Centre de Notifications'
  };

  return `
    <header class="app-topbar">
      <div class="topbar-left">
        <h1 class="topbar-title">${viewTitles[state.view] || 'Signal City Sénégal'}</h1>
        <span class="role-pill-indicator">
          ${icon(state.role === 'citizen' ? 'user' : state.role === 'agent' ? 'hard-hat' : 'landmark', 12)}
          ${user.title}
        </span>
      </div>
      
      <div class="topbar-right-controls">
        <!-- Sélecteur 14 Régions du Sénégal -->
        <div class="region-select-badge" title="Filtrer par région">
          ${icon('map-pin', 14)}
          <select data-action="change-region">
            ${regionsSenegal.map(r => `
              <option value="${r}" ${r === state.region ? 'selected' : ''}>Région : ${r}</option>
            `).join('')}
          </select>
        </div>
        
        <!-- Sélecteur Rapide de Rôle -->
        <div class="role-switcher-badge" title="Changer d'espace">
          ${icon('users', 14)}
          <select data-action="quick-role-select">
            <option value="citizen" ${state.role === 'citizen' ? 'selected' : ''}>👤 Citoyen</option>
            <option value="agent" ${state.role === 'agent' ? 'selected' : ''}>👷 Agent Terrain</option>
            <option value="admin" ${state.role === 'admin' ? 'selected' : ''}>🏛️ Admin Régional</option>
          </select>
        </div>
        
        <!-- Toggle Mode Sombre / Clair -->
        <button class="action-circle-btn" data-action="toggle-theme" title="Basculer Mode Clair / Sombre">
          ${icon(state.theme === 'dark' ? 'sun' : 'moon', 15)}
        </button>
        
        <!-- Notifications -->
        <button class="action-circle-btn" data-action="navigate" data-view="notifications" title="Notifications">
          ${icon('bell', 15)}
          <span class="notif-dot"></span>
        </button>
        
        <!-- Bouton Nouveau Signalement (pour le citoyen) -->
        ${state.role === 'citizen' ? `
          <button class="btn-report-quick" data-action="navigate" data-view="new-report">
            ${icon('plus', 16)} Signaler un problème
          </button>
        ` : ''}
      </div>
    </header>
  `;
}

// ==========================================================================
// VUE DU CONTENU PRINCIPAL
// ==========================================================================
function mainContentView() {
  if (state.view === 'notifications') return notificationsView();
  
  if (state.role === 'citizen') {
    if (state.view === 'new-report') return citizenWizardView();
    if (state.view === 'lost-items') return lostItemsView();
    if (state.view === 'my-reports') return citizenMyReportsView();
    return citizenDashboardView();
  }
  
  if (state.role === 'agent') {
    if (state.view === 'inspections') return agentInspectionsView();
    return agentDashboardView();
  }
  
  // Admin Régional
  if (state.view === 'to-assign') return adminToAssignView();
  if (state.view === 'to-validate') return adminToValidateView();
  if (state.view === 'services') return adminServicesView();
  return adminDashboardView();
}


// ==========================================================================
// DASHBOARD CITOYEN
// ==========================================================================
function citizenDashboardView() {
  const myReports = state.reports.filter(r => r.author === 'Awa Diop');
  const myActive = myReports.filter(r => !['resolved','rejected'].includes(r.status));
  const myResolved = myReports.filter(r => r.status === 'resolved');
  const mySupports = state.reports.filter(r => r.supportedByUser).length;
  const filteredReports = state.reports
    .filter(r => r.region === state.region)
    .filter(r => `${r.title} ${r.category} ${r.location}`.toLowerCase().includes(state.query.toLowerCase()))
    .slice(0, 6);

  const statusProgress = { received: 25, assigned: 45, inspection: 65, awaiting: 78, progress: 88, resolved: 100, rejected: 100 };
  const trackingSteps = ['received', 'assigned', 'inspection', 'progress', 'resolved'];

  return `
    <section class="citizen-dashboard-shell">
      <div class="citizen-welcome-hero">
        <div class="citizen-welcome-content">
          <span class="citizen-hero-eyebrow">${icon('map-pin',13)} Dakar · ${escapeHtml(state.region)}</span>
          <h2>Dalal ak jàmm, Awa 👋</h2>
          <p>Votre espace citoyen pour signaler un problème, suivre vos dossiers et voir ce qui change dans votre quartier.</p>
          <div class="citizen-hero-buttons">
            <button class="btn-primary-green" data-action="navigate" data-view="new-report">${icon('plus-circle',16)} Faire un signalement</button>
            <button class="btn-default-outline citizen-hero-secondary" data-action="navigate" data-view="my-reports">${icon('file-text',16)} Voir mes signalements</button>
          </div>
        </div>
        <div class="citizen-hero-visual" aria-hidden="true"><div class="citizen-hero-orbit orbit-one"></div><div class="citizen-hero-orbit orbit-two"></div><div class="citizen-hero-pin">${icon('map-pin',32)}</div></div>
      </div>

      <section class="citizen-kpi-grid" aria-label="Résumé de votre activité">
        <div class="citizen-kpi-card"><div class="citizen-kpi-icon">${icon('file-text',19)}</div><div><span>Mes signalements</span><strong>${myReports.length}</strong><small>déposés par vous</small></div></div>
        <div class="citizen-kpi-card"><div class="citizen-kpi-icon is-blue">${icon('activity',19)}</div><div><span>En cours</span><strong>${myActive.length}</strong><small>à suivre</small></div></div>
        <div class="citizen-kpi-card"><div class="citizen-kpi-icon is-green">${icon('check-circle-2',19)}</div><div><span>Résolus</span><strong>${myResolved.length}</strong><small>dossiers clôturés</small></div></div>
        <div class="citizen-kpi-card"><div class="citizen-kpi-icon is-orange">${icon('heart',19)}</div><div><span>Mes soutiens</span><strong>${mySupports}</strong><small>problèmes soutenus</small></div></div>
      </section>

      ${!state.confirmedResolved ? `
        <section class="confirmation-alert-card citizen-action-card">
          <div class="confirmation-alert-text"><span class="citizen-section-kicker">${icon('check-circle',14)} Action attendue</span><strong>Confirmez une intervention terminée</strong><p>La mairie indique que le signalement « Branches d’acacia menaçant de rompre » est résolu sur l’Avenue Malick Sy. Votre confirmation permet de clôturer le dossier côté citoyen.</p></div>
          <div class="citizen-action-buttons"><button class="btn-primary-green" data-action="confirm-resolution">${icon('check',14)} Confirmer</button><button class="btn-default-outline" data-action="contest-resolution">${icon('x',14)} Le problème persiste</button></div>
        </section>
      ` : `<section class="citizen-confirmed-card"><span>${icon('check-circle',18)} Confirmation enregistrée</span><button class="btn-default-outline" data-action="undo-confirmation">Annuler</button></section>`}

      <div class="citizen-dashboard-grid">
        <section class="citizen-feed-panel">
          <div class="citizen-section-heading">
            <div><span class="citizen-section-kicker">${icon('radio',14)} Vie du quartier</span><h3>Signalements récents à ${escapeHtml(state.region)}</h3><p>Les problèmes signalés récemment dans votre région.</p></div>
            <button class="btn-default-outline" data-action="navigate" data-view="new-report">${icon('plus',14)} Signaler</button>
          </div>
          <div class="citizen-search-bar">${icon('search',16)}<input type="search" aria-label="Rechercher un signalement" placeholder="Rechercher un problème, une rue, une catégorie…" value="${escapeHtml(state.query)}" data-action="citizen-search"></div>
          <div class="citizen-reports-grid">
            ${filteredReports.length ? filteredReports.map(report => `
              <article class="citizen-report-card" data-action="open-detail" data-id="${report.id}">
                <img class="report-thumb-img" src="${report.photo || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=240&q=75'}" alt="${escapeHtml(report.title)}">
                <div class="report-card-info">
                  <div class="citizen-report-card-head"><span class="citizen-category-label">${escapeHtml(report.category)}</span><span class="status-tag ${statusClasses[report.status]}">${statusLabels[report.status]}</span></div>
                  <h4 class="report-title-text">${escapeHtml(report.title)}</h4>
                  <div class="report-loc-time">${icon('map-pin',12)}<span>${escapeHtml(report.location)}</span></div>
                  <div class="citizen-report-footer"><button class="btn-support-issue ${report.supportedByUser?'supported':''}" data-action="toggle-support" data-id="${report.id}" onclick="event.stopPropagation();">${icon('users',13)}<span>${report.supportedByUser?'Soutenu':'Moi aussi'}</span><span class="support-badge-count">${report.supports}</span></button><span class="citizen-report-date">${report.date}</span></div>
                </div>
              </article>`).join('') : `<div class="citizen-empty-state">${icon('search-x',28)}<strong>Aucun signalement trouvé</strong><p>Essayez un autre mot-clé ou changez de région.</p></div>`}
          </div>
        </section>

        <aside class="citizen-side-column">
          <section class="dashboard-card-widget citizen-my-reports-widget ${state.myReportsExpanded ? 'is-expanded' : ''}" data-action="toggle-my-reports">
            <button class="citizen-my-reports-summary" type="button" aria-expanded="${state.myReportsExpanded}">
              <span class="citizen-my-reports-summary-icon">${icon('clipboard-list',17)}</span>
              <span class="citizen-my-reports-summary-text"><strong>Mes signalements</strong><small>${myReports.length} dossier${myReports.length > 1 ? 's' : ''} · ${myActive.length} en cours · ${myResolved.length} résolu${myResolved.length > 1 ? 's' : ''}</small></span>
              <span class="citizen-my-reports-summary-arrow">${icon(state.myReportsExpanded ? 'chevron-up' : 'chevron-down',16)}</span>
            </button>
            <div class="citizen-my-reports-details">
              <div class="citizen-widget-intro">Ouvrez un dossier pour consulter son suivi détaillé.</div>
              <div class="citizen-my-reports-list">
                ${myReports.length ? myReports.map(report => {
                  const progress = statusProgress[report.status] || 0;
                  return `
                    <article class="citizen-my-report-item">
                      <div class="citizen-my-report-top">
                        <div><span class="citizen-my-report-id">${escapeHtml(report.id)}</span><h4>${escapeHtml(report.title)}</h4></div>
                        <span class="status-tag ${statusClasses[report.status]}">${statusLabels[report.status]}</span>
                      </div>
                      <div class="citizen-my-report-meta">${icon('map-pin',11)} ${escapeHtml(report.location)} <span>·</span> ${report.date}</div>
                      <div class="citizen-mini-progress" aria-label="Progression du signalement à ${progress}%"><span style="width:${progress}%"></span></div>
                      <button class="btn-default-outline citizen-track-button" data-action="open-detail" data-id="${report.id}">${icon('route',14)} Voir le suivi</button>
                    </article>`;
                }).join('') : `<div class="citizen-empty-state">${icon('file-x',26)}<strong>Vous n'avez encore aucun signalement</strong><p>Créez votre premier signalement pour suivre son traitement ici.</p></div>`}
              </div>
            </div>
          </section>

          <section class="citizen-quick-actions"><div class="citizen-section-kicker">${icon('zap',14)} Accès rapide</div><button data-action="navigate" data-view="lost-items">${icon('search',17)}<span><strong>Objets trouvés</strong><small>Consulter les objets et CNI retrouvés</small></span>${icon('chevron-right',16)}</button><button data-action="navigate" data-view="my-reports">${icon('clipboard-list',17)}<span><strong>Mes dossiers</strong><small>Historique de vos signalements</small></span>${icon('chevron-right',16)}</button></section>
        </aside>
      </div>
    </section>
  `;
}
function citizenWizardView() {
  const draft = state.draft;
  const step = Math.min(4, Math.max(1, state.activeStep || 1));
  const steps = [
    { number: 1, label: 'Localisation' },
    { number: 2, label: 'Problème' },
    { number: 3, label: 'Photo & urgence' },
    { number: 4, label: 'Vérification' }
  ];
  const content = {
    1: `
      <div class="report-step-intro"><span class="report-step-kicker">Étape 1 sur 4</span><h2>Où se trouve le problème ?</h2><p>Une adresse précise aide le bon service à intervenir plus vite.</p></div>
      <div class="report-form-stack">
        <div class="auth-form-group"><label class="auth-label">Région</label><select class="auth-select" id="draft-region">${regionsSenegal.map(r => `<option value="${r}" ${r === (draft.region || state.region) ? 'selected' : ''}>${r}</option>`).join('')}</select></div>
        <div class="auth-form-group"><label class="auth-label">Adresse, quartier ou repère <span class="field-required">*</span></label><input class="auth-input" id="draft-location" required placeholder="Ex. Avenue Cheikh Anta Diop, près de la pharmacie" value="${escapeHtml(draft.location)}"></div>
        <button type="button" class="report-gps-card" data-action="get-gps"><span class="report-gps-icon">${icon('locate-fixed',19)}</span><span><strong>Utiliser ma position</strong><small>Détecter automatiquement l'endroit où vous êtes</small></span>${icon('chevron-right',17)}</button>
        ${state.coordinates ? `<div class="report-location-confirmed">${icon('check-circle-2',16)} Position enregistrée : ${escapeHtml(state.coordinates)}</div>` : ''}
      </div>`,
    2: `
      <div class="report-step-intro"><span class="report-step-kicker">Étape 2 sur 4</span><h2>Qu'est-ce qui ne va pas ?</h2><p>Choisissez une catégorie puis décrivez simplement ce que vous avez constaté.</p></div>
      <div class="report-form-stack">
        <div><label class="auth-label">Catégorie <span class="field-required">*</span></label><div class="categories-grid-tiles report-category-grid">${categories.map(cat => `<button type="button" class="cat-tile-btn ${draft.category === cat.name ? 'selected' : ''}" data-action="select-category" data-cat="${cat.name}">${icon(cat.icon,19)}<span>${cat.name}</span></button>`).join('')}</div></div>
        <div class="auth-form-group"><label class="auth-label">Titre du problème <span class="field-required">*</span></label><input class="auth-input" id="draft-title" required placeholder="Ex. Lampadaire éteint" value="${escapeHtml(draft.title)}"></div>
        <div class="auth-form-group"><label class="auth-label">Que se passe-t-il ? <span class="field-required">*</span></label><textarea class="auth-input" id="draft-description" rows="5" required placeholder="Décrivez le problème, le danger éventuel et depuis quand vous l'avez remarqué.">${escapeHtml(draft.description)}</textarea></div>
      </div>`,
    3: `
      <div class="report-step-intro"><span class="report-step-kicker">Étape 3 sur 4</span><h2>Ajoutez une preuve et indiquez l'urgence</h2><p>Une photo aide les équipes à comprendre la situation avant de se déplacer.</p></div>
      <div class="report-form-stack">
        <label class="upload-dropzone report-upload-zone">${state.photo ? `<img src="${state.photo}" alt="Aperçu du signalement"><span class="report-upload-success">${icon('image-check',16)} Photo ajoutée · cliquez pour remplacer</span>` : `<span class="report-upload-icon">${icon('camera',30)}</span><strong>Ajouter une photo</strong><small>JPG ou PNG · 10 Mo maximum · facultatif</small>`}<input type="file" accept="image/*" onchange="window.handlePhotoUpload(event)"></label>
        <div><label class="auth-label">Niveau d'urgence perçu</label><div class="priority-selector-grid report-priority-grid">${['Faible','Moyenne','Urgente'].map(p => `<button type="button" class="priority-choice-btn ${p.toLowerCase()} ${draft.priority === p ? 'selected' : ''}" data-action="select-priority" data-priority="${p}"><strong>${p}</strong><small>${p === 'Urgente' ? 'Danger immédiat' : p === 'Moyenne' ? 'Gêne importante' : 'À traiter normalement'}</small></button>`).join('')}</div></div>
      </div>`,
    4: `
      <div class="report-step-intro"><span class="report-step-kicker">Étape 4 sur 4</span><h2>Tout est prêt ?</h2><p>Vérifiez les informations avant d'envoyer votre signalement à la mairie.</p></div>
      <div class="report-review-card">
        <div class="report-review-row"><span>Lieu</span><strong>${escapeHtml(draft.location || 'Non renseigné')} · ${escapeHtml(draft.region || state.region)}</strong></div>
        <div class="report-review-row"><span>Catégorie</span><strong>${escapeHtml(draft.category)}</strong></div>
        <div class="report-review-row"><span>Problème</span><strong>${escapeHtml(draft.title || 'Non renseigné')}</strong></div>
        <div class="report-review-row report-review-description"><span>Description</span><p>${escapeHtml(draft.description || 'Non renseignée')}</p></div>
        <div class="report-review-row"><span>Urgence</span><span class="priority-review ${draft.priority.toLowerCase()}">${escapeHtml(draft.priority)}</span></div>
        <div class="report-review-row"><span>Photo</span><strong>${state.photo ? 'Ajoutée' : 'Aucune photo'}</strong></div>
      </div>
      <div class="report-trust-note">${icon('shield-check',18)}<span><strong>Vos informations sont prêtes à être transmises.</strong><small>Vous pourrez suivre l'avancement depuis « Mes signalements ».</small></span></div>`
  };
  return `
    <section class="report-wizard-shell">
      <div class="report-wizard-top"><button type="button" class="btn-default-outline" data-action="navigate" data-view="dashboard">${icon('arrow-left',15)} Retour</button><div><span class="citizen-section-kicker">${icon('plus-circle',14)} Nouveau signalement</span><p>Quelques étapes simples, puis c'est transmis.</p></div></div>
      <div class="report-stepper">${steps.map((s,i)=>`<div class="report-stepper-item ${step===s.number?'active':''} ${step>s.number?'done':''}"><span class="report-stepper-circle">${step>s.number?icon('check',13):s.number}</span><span>${s.label}</span></div>${i<3?'<div class="report-stepper-line"></div>':''}`).join('')}</div>
      <form id="wizard-report-form" class="report-wizard-card" onsubmit="event.preventDefault(); window.handleWizardNext();">
        <div class="report-wizard-content">${content[step]}</div>
        <div class="report-wizard-footer"><span class="report-step-counter">Étape ${step} / 4</span><div class="report-wizard-actions">${step>1?'<button type="button" class="btn-default-outline" data-action="wizard-back">'+icon('arrow-left',15)+' Précédent</button>':''}${step<4?`<button type="submit" class="btn-primary-green">${step===1?'Continuer':step===2?'Ajouter une photo':'Vérifier le signalement'} ${icon('arrow-right',15)}</button>`:`<button type="button" class="btn-primary-green" data-action="submit-report">${icon('send',15)} Envoyer le signalement</button>`}</div></div>
      </form>
    </section>`;
}
function lostItemsView() {
  const filtered = state.items.filter(item => {
    const matchesSearch = `${item.name} ${item.description} ${item.place} ${item.station}`.toLowerCase().includes(state.lostSearch.toLowerCase());
    const matchesType = state.lostTypeFilter === 'all' || item.status.toLowerCase() === state.lostTypeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      <!-- Panneau de recherche & Filtres -->
      <div class="objets-search-panel">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:17px; font-weight:800; color:var(--text-main);">
              ${icon('search', 18)} Objets Perdus & Cartes Nationales d’Identité (CNI)
            </h3>
            <p style="font-size:13px; color:var(--text-muted);">
              Consultez les pièces d'identité et objets déposés dans les commissariats et mairies du Sénégal.
            </p>
          </div>
          <button class="btn-primary-green" data-action="open-declare-lost">
            ${icon('plus', 14)} Déclarer une perte
          </button>
        </div>
        
        <div class="objets-search-inputs">
          <input class="auth-input" type="text" placeholder="Rechercher par nom (ex. S. Ndiaye), objet, lieu..." value="${escapeHtml(state.lostSearch)}" oninput="state.lostSearch = this.value; render();">
          
          <select class="auth-select" onchange="state.lostTypeFilter = this.value; render();">
            <option value="all">Tous les statuts</option>
            <option value="Retrouvé" ${state.lostTypeFilter === 'Retrouvé' ? 'selected' : ''}>Objets Retrouvés (En poste)</option>
            <option value="Perdu" ${state.lostTypeFilter === 'Perdu' ? 'selected' : ''}>Signalés Perdus</option>
          </select>
          
          <select class="auth-select" onchange="state.region = this.value; render();">
            ${regionsSenegal.map(r => `<option value="${r}" ${r === state.region ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
          
          <button class="btn-default-outline" data-action="reset-lost-filter">
            ${icon('rotate-ccw', 14)} Réinitialiser
          </button>
        </div>
      </div>
      
      <!-- Liste des objets -->
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:18px;">
        ${filtered.map(item => `
          <div class="citizen-report-card" style="flex-direction:column; padding:0; overflow:hidden;">
            <div style="height:150px; position:relative; overflow:hidden; background-color:var(--border-color);">
              <img src="${item.image}" alt="${escapeHtml(item.name)}" style="width:100%; height:100%; object-fit:cover;">
              <span class="status-tag ${item.status === 'Retrouvé' ? 'resolu' : 'en_cours'}" style="position:absolute; top:12px; right:12px; box-shadow:var(--shadow-sm);">
                ${item.status}
              </span>
            </div>
            
            <div style="padding:18px; display:flex; flex-direction:column; gap:10px; flex:1;">
              <div>
                <span style="font-size:11px; font-weight:700; color:var(--primary-green); text-transform:uppercase;">
                  ${item.id} · ${item.date}
                </span>
                <h4 style="font-size:15px; font-weight:800; color:var(--text-main); margin-top:2px;">
                  ${escapeHtml(item.name)}
                </h4>
                <p style="font-size:12.5px; color:var(--text-muted); margin-top:4px; line-height:1.4;">
                  ${escapeHtml(item.description)}
                </p>
                <div style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:6px; margin-top:6px;">
                  ${icon('map-pin', 12)} Lieu : ${escapeHtml(item.place)}
                </div>
              </div>
              
              <!-- Poste de dépôt pour récupération -->
              ${item.station ? `
                <div class="poste-depot-card">
                  <div class="poste-depot-header">
                    ${icon('building-2', 15)} Poste de dépôt sécurisé
                  </div>
                  <div class="poste-depot-details-list">
                    <div class="poste-depot-item">
                      ${icon('map-pin', 13)}
                      <span><strong>Lieu :</strong> ${escapeHtml(item.station)}</span>
                    </div>
                    ${item.contact ? `
                      <div class="poste-depot-item">
                        ${icon('phone', 13)}
                        <span><strong>Contact :</strong> ${escapeHtml(item.contact)}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
                
                <button class="btn-primary-green" style="margin-top:auto; justify-content:center;" data-action="claim-object" data-id="${item.id}">
                  ${icon('check-circle', 14)} Réclamer cet objet
                </button>
              ` : `
                <button class="btn-default-outline" style="margin-top:auto; justify-content:center;" data-action="help-find" data-id="${item.id}">
                  ${icon('message-circle', 14)} J’ai des informations
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// DASHBOARD AGENT TERRAIN (AMADOU SOW)
// ==========================================================================
function agentDashboardView() {
  const assignedReports = state.reports.filter(r => r.service === 'Voirie' || r.service === 'Assainissement');
  const awaitingInspection = assignedReports.filter(r => r.status === 'assigned' || r.status === 'inspection');
  const inProgress = assignedReports.filter(r => r.status === 'progress');

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      <!-- Header de Mission Agent -->
      <div class="agent-mission-header">
        <div>
          <span style="font-size:11.5px; font-weight:800; color:#fdef42; text-transform:uppercase; letter-spacing:1px;">
            ${icon('shield', 13)} Équipe Technique Voirie & Réseaux
          </span>
          <h2 style="font-size:24px; font-weight:800; margin-top:4px;">
            Missions & Ordres d’Intervention
          </h2>
          <p style="font-size:13.5px; color:rgba(255,255,255,0.85); margin-top:2px;">
            Agent référent : <strong>Amadou Sow</strong> · District Dakar Centre
          </p>
        </div>
        
        <div style="display:flex; gap:16px;">
          <div style="text-align:right;">
            <div style="font-size:24px; font-weight:800; color:#fdef42;">${awaitingInspection.length}</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.7);">À inspecter</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:24px; font-weight:800; color:#4ade80;">${inProgress.length}</div>
            <div style="font-size:11px; color:rgba(255,255,255,0.7);">Travaux autorisés</div>
          </div>
        </div>
      </div>
      
      <!-- Liste des Missions avec Rapport d'inspection & Autorisation Mairie -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        <h3 style="font-size:16px; font-weight:800; color:var(--text-main);">
          Feuille de route opérationnelle
        </h3>
        
        ${assignedReports.map(report => `
          <div class="agent-mission-card">
            <div class="agent-mission-top">
              <div style="display:flex; align-items:center; gap:14px;">
                <img class="report-thumb-img" src="${report.photo}" alt="" style="width:72px; height:72px;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <span class="status-tag ${statusClasses[report.status]}">
                      ${statusLabels[report.status]}
                    </span>
                    <span style="font-size:11.5px; font-weight:700; color:var(--text-muted);">
                      ${report.id} · Priorité ${report.priority}
                    </span>
                  </div>
                  <h4 style="font-size:16px; font-weight:800; color:var(--text-main);">
                    ${escapeHtml(report.title)}
                  </h4>
                  <div style="font-size:12.5px; color:var(--text-muted); display:flex; align-items:center; gap:6px; margin-top:3px;">
                    ${icon('map-pin', 13)} ${escapeHtml(report.location)}
                  </div>
                </div>
              </div>
              
              <div style="display:flex; align-items:center; gap:10px;">
                ${report.status === 'assigned' ? `
                  <button class="btn-primary-green" data-action="agent-start-inspection" data-id="${report.id}">
                    ${icon('clipboard', 14)} Démarrer l’inspection
                  </button>
                ` : report.status === 'inspection' ? `
                  <button class="btn-primary-green" data-action="agent-submit-report" data-id="${report.id}">
                    ${icon('send', 14)} Rédiger le rapport
                  </button>
                ` : report.status === 'progress' ? `
                  <button class="btn-primary-green" data-action="agent-resolve" data-id="${report.id}">
                    ${icon('check-circle', 14)} Clôturer & Marquer résolu
                  </button>
                ` : `
                  <span style="font-size:12.5px; font-weight:700; color:#16a34a; display:flex; align-items:center; gap:6px;">
                    ${icon('check-circle-2', 16)} Mission terminée
                  </span>
                `}
              </div>
            </div>
            
            <!-- Encadré Rapport d'Inspection Technique -->
            ${report.report ? `
              <div class="inspection-report-box">
                <div class="inspection-header">
                  <div class="inspection-title-badge">
                    ${icon('clipboard-check', 16)} Rapport d’inspection technique sur site
                  </div>
                  <span class="inspection-meta">Validé par l'Agent Amadou Sow</span>
                </div>
                
                <div class="inspection-content-grid">
                  <div class="inspection-text-details">
                    <p><strong>Constat de terrain :</strong> ${escapeHtml(report.report)}</p>
                    <p style="color:var(--text-muted); font-size:11.5px;">Matériel préconisé : Camion benne, bitume à froid 2T, signalisation de sécurité VDN.</p>
                  </div>
                  ${report.photo ? `
                    <img class="inspection-photo-thumb" src="${report.photo}" alt="Inspection photo">
                  ` : ''}
                </div>
              </div>
            ` : ''}
            
            <!-- Encadré Autorisation Mairie (si accordé) -->
            ${report.authorized ? `
              <div class="authorization-box">
                <div class="authorization-stamp">
                  <div class="authorization-stamp-icon">
                    ${icon('stamp', 22)}
                  </div>
                  <div>
                    <strong style="color:var(--primary-green); font-size:14px; display:block;">
                      Arrêté Municipal d'Intervention Validé
                    </strong>
                    <span style="font-size:12px; color:var(--text-muted);">
                      Autorisé par : Mairie Régionale de Dakar · Dossier conforme aux normes d'aménagement
                    </span>
                  </div>
                </div>
                <div style="font-size:11.5px; font-weight:800; color:var(--primary-green); text-transform:uppercase;">
                  Feu vert travaux
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// DASHBOARD ADMINISTRATEUR RÉGIONAL (MAIRIE DE DAKAR & 14 RÉGIONS)
// ==========================================================================
function adminDashboardView() {
  const unassigned = state.reports.filter(r => r.status === 'received');
  const awaitingReports = state.reports.filter(r => r.status === 'awaiting');
  const inProgress = state.reports.filter(r => r.status === 'progress' || r.status === 'assigned');
  const resolved = state.reports.filter(r => r.status === 'resolved');
  
  const total = state.reports.length;
  const pctUnassigned = Math.round((unassigned.length / total) * 100);
  const pctInProgress = Math.round((inProgress.length / total) * 100);
  const pctResolved = Math.round((resolved.length / total) * 100);

  return `
    <div style="display:flex; flex-direction:column; gap:22px;">
      <!-- Grille KPI 4 Cartes -->
      <div class="admin-kpi-grid">
        <div class="kpi-stat-box">
          <div class="kpi-icon-pill red">${icon('inbox', 22)}</div>
          <div class="kpi-data-content">
            <span class="kpi-label-text">Nouveaux / À affecter</span>
            <span class="kpi-count-number">${unassigned.length}</span>
          </div>
        </div>
        
        <div class="kpi-stat-box">
          <div class="kpi-icon-pill orange">${icon('clipboard-check', 22)}</div>
          <div class="kpi-data-content">
            <span class="kpi-label-text">Rapports d’inspection à valider</span>
            <span class="kpi-count-number">${awaitingReports.length}</span>
          </div>
        </div>
        
        <div class="kpi-stat-box">
          <div class="kpi-icon-pill blue">${icon('wrench', 22)}</div>
          <div class="kpi-data-content">
            <span class="kpi-label-text">Chantiers en cours</span>
            <span class="kpi-count-number">${inProgress.length}</span>
          </div>
        </div>
        
        <div class="kpi-stat-box">
          <div class="kpi-icon-pill green">${icon('check-circle', 22)}</div>
          <div class="kpi-data-content">
            <span class="kpi-label-text">Résolus & Clôturés</span>
            <span class="kpi-count-number">${resolved.length}</span>
          </div>
        </div>
      </div>
      
      <!-- Ligne Médiane : Donut Chart SVG & Répartition Régionale -->
      <div class="admin-middle-row">
        <!-- Widget Donut SVG Moderne -->
        <div class="dashboard-card-widget">
          <div class="widget-header-title">
            <span>${icon('pie-chart', 16)} État du Traitement Urbain</span>
            <span style="font-size:12px; color:var(--text-muted);">Total : ${total} dossiers</span>
          </div>
          
          <div class="donut-chart-container">
            <div class="donut-svg-wrap">
              <svg viewBox="0 0 36 36" style="width:100%; height:100%; transform:rotate(-90deg);">
                <!-- Cercle de fond -->
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--border-color)" stroke-width="3.2"></circle>
                <!-- Segment Résolu (Vert) -->
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#16a34a" stroke-width="3.6"
                  stroke-dasharray="${pctResolved} ${100 - pctResolved}" stroke-dashoffset="0"></circle>
                <!-- Segment En cours (Bleu) -->
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2563eb" stroke-width="3.6"
                  stroke-dasharray="${pctInProgress} ${100 - pctInProgress}" stroke-dashoffset="${-pctResolved}"></circle>
                <!-- Segment À affecter (Orange) -->
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f97316" stroke-width="3.6"
                  stroke-dasharray="${pctUnassigned} ${100 - pctUnassigned}" stroke-dashoffset="${-(pctResolved + pctInProgress)}"></circle>
              </svg>
              <div class="donut-center-total">
                <span class="num">${total}</span>
                <span class="lbl">Signalements</span>
              </div>
            </div>
            
            <div class="donut-legend-list">
              <div class="legend-item-row">
                <span class="legend-dot" style="background-color:#f97316;"></span>
                <span>À affecter</span>
                <span class="legend-percent">${pctUnassigned}% (${unassigned.length})</span>
              </div>
              <div class="legend-item-row">
                <span class="legend-dot" style="background-color:#2563eb;"></span>
                <span>En cours / Inspecté</span>
                <span class="legend-percent">${pctInProgress}% (${inProgress.length})</span>
              </div>
              <div class="legend-item-row">
                <span class="legend-dot" style="background-color:#16a34a;"></span>
                <span>Résolus</span>
                <span class="legend-percent">${pctResolved}% (${resolved.length})</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Widget Répartition par Arrondissement / Commune -->
        <div class="dashboard-card-widget">
          <div class="widget-header-title">
            <span>${icon('map', 16)} Répartition des Signalements · ${state.region}</span>
            <span style="font-size:12px; color:var(--primary-green); font-weight:700;">Temps moyen : 48h</span>
          </div>
          
          <div class="admin-map-preview-wrap">
            <div class="region-stat-row">
              <div class="region-stat-header">
                <span>Dakar Plateau & Médina</span>
                <span>42% (26 dossiers)</span>
              </div>
              <div class="region-progress-bar">
                <div class="region-progress-fill" style="width:42%;"></div>
              </div>
            </div>
            
            <div class="region-stat-row">
              <div class="region-stat-header">
                <span>Grand Dakar & Castors</span>
                <span>28% (17 dossiers)</span>
              </div>
              <div class="region-progress-bar">
                <div class="region-progress-fill" style="width:28%; background-color:#2563eb;"></div>
              </div>
            </div>
            
            <div class="region-stat-row">
              <div class="region-stat-header">
                <span>Parcelles Assainies & Almadies</span>
                <span>18% (11 dossiers)</span>
              </div>
              <div class="region-progress-bar">
                <div class="region-progress-fill" style="width:18%; background-color:#f59e0b;"></div>
              </div>
            </div>
            
            <div class="region-stat-row">
              <div class="region-stat-header">
                <span>Pikine, Guédiawaye & Rufisque</span>
                <span>12% (8 dossiers)</span>
              </div>
              <div class="region-progress-bar">
                <div class="region-progress-fill" style="width:12%; background-color:#8b5cf6;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Table des Signalements Propre & Épurée -->
      <div class="dashboard-card-widget" style="padding:0; overflow:hidden;">
        <div style="padding:18px 24px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:16px; font-weight:800; color:var(--text-main);">
              Registre Général des Signalements
            </h3>
            <p style="font-size:12.5px; color:var(--text-muted);">
              Affectation directe aux services municipaux et délivrance des autorisations de travaux.
            </p>
          </div>
          
          <div style="display:flex; gap:8px;">
            <input class="auth-input" type="text" placeholder="Filtrer un dossier..." style="width:220px; padding:6px 12px; font-size:12px;" value="${escapeHtml(state.query)}" oninput="state.query = this.value; render();">
          </div>
        </div>
        
        <table class="clean-data-table">
          <thead>
            <tr>
              <th>ID & Problème</th>
              <th>Catégorie</th>
              <th>Localisation</th>
              <th>Priorité</th>
              <th>Soutiens</th>
              <th>Statut</th>
              <th style="text-align:right;">Action Mairie</th>
            </tr>
          </thead>
          <tbody>
            ${state.reports.map(report => `
              <tr onclick="window.openReportDetails('${report.id}')">
                <td>
                  <strong style="color:var(--text-main); font-weight:800; display:block;">${escapeHtml(report.title)}</strong>
                  <span style="font-size:11px; color:var(--text-muted); font-weight:600;">${report.id} · ${report.date}</span>
                </td>
                <td>
                  <span style="font-weight:700; font-size:12.5px; color:var(--text-main);">${escapeHtml(report.category)}</span>
                </td>
                <td style="font-size:12px; color:var(--text-muted);">
                  ${icon('map-pin', 12)} ${escapeHtml(report.location)}
                </td>
                <td>
                  <span class="status-tag ${report.priority === 'Urgente' ? 'nouveau' : 'pris_en_charge'}">
                    ${report.priority}
                  </span>
                </td>
                <td>
                  <span style="font-weight:800; color:var(--primary-green); display:flex; align-items:center; gap:4px;">
                    ${icon('users', 12)} ${report.supports}
                  </span>
                </td>
                <td>
                  <span class="status-tag ${statusClasses[report.status]}">
                    ${statusLabels[report.status]}
                  </span>
                </td>
                <td style="text-align:right;" onclick="event.stopPropagation();">
                  ${report.status === 'received' ? `
                    <button class="btn-primary-green" style="padding:6px 12px; font-size:12px;" data-action="admin-assign" data-id="${report.id}">
                      Affecter au service
                    </button>
                  ` : report.status === 'awaiting' ? `
                    <button class="btn-primary-green" style="padding:6px 12px; font-size:12px; background-color:#2563eb;" data-action="admin-authorize" data-id="${report.id}">
                      ${icon('stamp', 13)} Autoriser travaux
                    </button>
                  ` : `
                    <button class="btn-default-outline" style="padding:6px 12px; font-size:12px;" data-action="open-detail" data-id="${report.id}">
                      Détails
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ==========================================================================
// VUES COMPLÉMENTAIRES (MES SIGNALEMENTS, INSPECTIONS, SERVICES)
// ==========================================================================
function citizenMyReportsView() {
  const myReports = state.reports.filter(r => r.author === 'Awa Diop');
  return `
    <div style="display:flex; flex-direction:column; gap:18px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Mes Remontées Citoyennes</h2>
          <p style="font-size:13px; color:var(--text-muted);">Historique de vos signalements et statut d’intervention en direct.</p>
        </div>
        <button class="btn-primary-green" data-action="navigate" data-view="new-report">
          ${icon('plus-circle', 16)} Nouveau signalement
        </button>
      </div>

      <div class="citizen-reports-grid">
        ${myReports.map(report => `
          <div class="citizen-report-card" data-action="open-detail" data-id="${report.id}">
            <img class="report-thumb-img" src="${report.photo || 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=160&q=75'}" alt="${escapeHtml(report.title)}">
            <div class="report-card-info">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <span style="font-size:10.5px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">
                    ${escapeHtml(report.category)} · ${report.id}
                  </span>
                  <span class="status-tag ${statusClasses[report.status]}">
                    ${statusLabels[report.status]}
                  </span>
                </div>
                <h4 class="report-title-text">${escapeHtml(report.title)}</h4>
                <div class="report-loc-time">
                  ${icon('map-pin', 12)} ${escapeHtml(report.location)}
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px; padding-top:8px; border-top:1px solid var(--border-color);">
                <span style="font-size:12px; font-weight:700; color:var(--primary-green); display:flex; align-items:center; gap:5px;">
                  ${icon('users', 13)} ${report.supports} soutiens
                </span>
                <span style="font-size:11px; color:var(--text-muted); font-weight:600;">
                  Déposé le ${report.date}
                </span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function agentInspectionsView() {
  const inspectionReports = state.reports.filter(r => r.status === 'awaiting' || r.status === 'inspection');
  return `
    <div style="display:flex; flex-direction:column; gap:18px;">
      <div>
        <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Rapports d’Inspection Technique</h2>
        <p style="font-size:13px; color:var(--text-muted);">Constats réalisés sur le terrain soumis à la Mairie pour autorisation de travaux.</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        ${inspectionReports.map(report => `
          <div class="agent-mission-card">
            <div class="agent-mission-top">
              <div style="display:flex; align-items:center; gap:14px;">
                <img class="report-thumb-img" src="${report.photo}" alt="" style="width:72px; height:72px;">
                <div>
                  <span class="status-tag ${statusClasses[report.status]}">${statusLabels[report.status]}</span>
                  <h4 style="font-size:16px; font-weight:800; color:var(--text-main); margin-top:4px;">${escapeHtml(report.title)}</h4>
                  <div style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:6px; margin-top:2px;">
                    ${icon('map-pin', 12)} ${escapeHtml(report.location)}
                  </div>
                </div>
              </div>
            </div>
            ${report.report ? `
              <div class="inspection-report-box">
                <div class="inspection-header">
                  <span class="inspection-title-badge">${icon('clipboard-check', 15)} Rapport transmis à la Mairie</span>
                  <span class="inspection-meta">${report.date}</span>
                </div>
                <div class="inspection-text-details">
                  <p>${escapeHtml(report.report)}</p>
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function adminToAssignView() {
  const unassigned = state.reports.filter(r => r.status === 'received');
  return `
    <div style="display:flex; flex-direction:column; gap:18px;">
      <div>
        <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Dossiers Nouveaux à Affecter (${unassigned.length})</h2>
        <p style="font-size:13px; color:var(--text-muted);">Affectez les signalements entrants aux directions techniques régionales.</p>
      </div>
      <table class="clean-data-table">
        <thead>
          <tr>
            <th>Signalement</th>
            <th>Catégorie</th>
            <th>Lieu</th>
            <th>Priorité</th>
            <th>Soutiens</th>
            <th style="text-align:right;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${unassigned.map(report => `
            <tr>
              <td><strong>${escapeHtml(report.title)}</strong><br><small style="color:var(--text-muted);">${report.id} · ${report.date}</small></td>
              <td>${escapeHtml(report.category)}</td>
              <td>${escapeHtml(report.location)}</td>
              <td><span class="status-tag nouveau">${report.priority}</span></td>
              <td><strong>${report.supports}</strong></td>
              <td style="text-align:right;">
                <button class="btn-primary-green" style="padding:6px 12px; font-size:12px;" data-action="admin-assign" data-id="${report.id}">
                  Affecter au service
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function adminToValidateView() {
  const awaiting = state.reports.filter(r => r.status === 'awaiting');
  return `
    <div style="display:flex; flex-direction:column; gap:18px;">
      <div>
        <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Rapports d’Inspection en Attente de Validation (${awaiting.length})</h2>
        <p style="font-size:13px; color:var(--text-muted);">Examinez les constats des agents de terrain et délivrez l’autorisation de travaux.</p>
      </div>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${awaiting.map(report => `
          <div class="agent-mission-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <span class="status-tag en_cours">Rapport Déposé</span>
                <h4 style="font-size:16px; font-weight:800; margin-top:4px;">${escapeHtml(report.title)}</h4>
                <p style="font-size:12.5px; color:var(--text-muted);">${escapeHtml(report.location)} · Service : ${report.service}</p>
              </div>
              <button class="btn-primary-green" style="background-color:#2563eb;" data-action="admin-authorize" data-id="${report.id}">
                ${icon('stamp', 14)} Délivrer l’autorisation
              </button>
            </div>
            <div class="inspection-report-box" style="margin-top:10px;">
              <strong>Constat de l'agent :</strong>
              <p style="margin-top:4px; font-size:13px;">${escapeHtml(report.report)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function adminServicesView() {
  const servicesList = [
    { name: 'Voirie & Réseaux Divers', lead: 'Ing. Malick Thiam', staff: 24, icon: 'route', activeWorks: 6, color: '#00875a' },
    { name: 'Éclairage Public & Énergie', lead: 'Cheikh Tidiane Wade', staff: 14, icon: 'lightbulb', activeWorks: 4, color: '#f59e0b' },
    { name: 'Propreté Urbaine & Salubrité', lead: 'Aïssatou Ndiaye', staff: 48, icon: 'trash-2', activeWorks: 12, color: '#2563eb' },
    { name: 'Assainissement & Eaux Pluviales', lead: 'Mamadou Gueye', staff: 18, icon: 'droplets', activeWorks: 5, color: '#06b6d4' },
    { name: 'Espaces Verts & Cadre de Vie', lead: 'Ousmane Cissé', staff: 16, icon: 'trees', activeWorks: 3, color: '#16a34a' },
    { name: 'Police Municipale & Tranquillité', lead: 'Cdt. Ibrahima Diop', staff: 32, icon: 'shield', activeWorks: 7, color: '#8b5cf6' }
  ];

  return `
    <div style="display:flex; flex-direction:column; gap:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Services Municipaux & Équipes d’Intervention</h2>
          <p style="font-size:13px; color:var(--text-muted);">Pôles techniques mobilisables dans les 14 régions du Sénégal.</p>
        </div>
      </div>
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px;">
        ${servicesList.map(srv => `
          <div class="dashboard-card-widget">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <div style="width:44px; height:44px; border-radius:12px; background-color:${srv.color}15; color:${srv.color}; display:flex; align-items:center; justify-content:center;">
                ${icon(srv.icon, 22)}
              </div>
              <div>
                <h4 style="font-size:15px; font-weight:800; color:var(--text-main);">${srv.name}</h4>
                <span style="font-size:12px; color:var(--text-muted);">Responsable : ${srv.lead}</span>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12.5px; border-top:1px solid var(--border-color); padding-top:10px; margin-top:8px;">
              <span>Effectif : <strong>${srv.staff} agents</strong></span>
              <span style="color:var(--primary-green); font-weight:700;"><strong>${srv.activeWorks}</strong> chantiers en cours</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// VUE NOTIFICATIONS
// ==========================================================================
function notificationsView() {
  const notifs = [
    { title: 'Signalement validé', desc: 'Votre signalement "Nid-de-poule Av. Cheikh Anta Diop" a été inspecté et autorisé.', time: 'Il y a 10 min', icon: 'check-circle', color: '#16a34a' },
    { title: 'Nouveau soutien citoyen', desc: '5 voisins ont également signalé le problème de lampadaire à Liberté 6.', time: 'Il y a 1 heure', icon: 'users', color: '#0284c7' },
    { title: 'Objet retrouvé déposé', desc: 'Une CNI a été déposée au Commissariat Central de Dakar.', time: 'Hier à 14h20', icon: 'file-text', color: '#f59e0b' },
    { title: 'Arrêté municipal délivré', desc: 'Travaux de voirie planifiés pour ce jeudi sur la VDN.', time: 'Il y a 2 jours', icon: 'landmark', color: '#8b5cf6' }
  ];

  return `
    <div style="max-width:760px; margin:0 auto; width:100%; display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Notifications & Alertes</h2>
          <p style="font-size:13px; color:var(--text-muted);">Restez informé de l'avancement de vos démarches et de votre quartier.</p>
        </div>
        <button class="btn-default-outline" data-action="clear-notifs">
          ${icon('check', 14)} Tout marquer comme lu
        </button>
      </div>
      
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${notifs.map(n => `
          <div class="notification-item-card">
            <div style="width:40px; height:40px; border-radius:10px; background-color:${n.color}15; color:${n.color}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              ${icon(n.icon, 20)}
            </div>
            <div style="flex:1;">
              <strong style="color:var(--text-main); font-size:14px; font-weight:800; display:block;">${n.title}</strong>
              <p style="color:var(--text-muted); font-size:12.5px; margin-top:2px;">${n.desc}</p>
            </div>
            <span style="font-size:11.5px; color:var(--text-light); font-weight:600;">${n.time}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// MODALES POPUP (DÉTAILS, GUIDE SCÉNARIO, ASSIGNATION)
// ==========================================================================
function modalView(modal) {
  return `
    <div class="modal-overlay-bg active" onclick="if(event.target === this) window.closeModal();">
      <div class="modal-card-dialog">
        <div class="modal-dialog-header">
          <h3>${escapeHtml(modal.title)}</h3>
          <button class="action-circle-btn" onclick="window.closeModal();" aria-label="Fermer">
            ${icon('x', 16)}
          </button>
        </div>
        <div class="modal-dialog-body">
          ${modal.content}
        </div>
        <div class="modal-dialog-footer">
          ${modal.buttons || `
            <button class="btn-primary-green" onclick="window.closeModal();">Fermer</button>
          `}
        </div>
      </div>
    </div>
  `;
}

// Guide Scénario Modal
function openScenarioGuideModal() {
  state.activeModal = {
    title: 'Guide de la Version Test · SunuGox Sénégal',
    content: `
      <div style="display:flex; flex-direction:column; gap:14px; font-size:13.5px; line-height:1.5; color:var(--text-main);">
        <p>Bienvenue dans l'interface de test de <strong>Signal City Sénégal (SunuGox)</strong>. Cette démonstration interactive permet d'expérimenter le flux complet de signalement citoyen et de gouvernance municipale.</p>
        
        <div style="background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px;">
          <h4 style="font-size:14px; font-weight:800; color:var(--primary-green); margin-bottom:6px;">
            1. En tant que Citoyen (Awa Diop) :
          </h4>
          <p>Créez un signalement avec photo et position GPS, ou cliquez sur <em>"Moi aussi"</em> pour soutenir un problème existant. Testez la boucle de confirmation en validant la fin d'un chantier.</p>
        </div>
        
        <div style="background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px;">
          <h4 style="font-size:14px; font-weight:800; color:#2563eb; margin-bottom:6px;">
            2. En tant qu'Admin Régional (Mairie de Dakar) :
          </h4>
          <p>Consultez la boîte de réception générale, affectez le signalement au bon service technique (Voirie, Éclairage, Propreté), et délivrez l'autorisation officielle de travaux une fois le rapport reçu.</p>
        </div>
        
        <div style="background:var(--bg-app); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px;">
          <h4 style="font-size:14px; font-weight:800; color:#f59e0b; margin-bottom:6px;">
            3. En tant qu'Agent de Terrain (Amadou Sow) :
          </h4>
          <p>Recevez la mission sur votre feuille de route, effectuez l'inspection sur site, envoyez votre rapport d'inspection technique à la mairie, puis clôturez les travaux après réalisation.</p>
        </div>
      </div>
    `,
    buttons: `
      <button class="btn-primary-green" onclick="window.closeModal();">J'ai compris, commencer le test</button>
    `
  };
  render();
}

// Modal Détails Signalement
function openReportDetailsModal(reportId) {
  const report = state.reports.find(r => r.id === reportId);
  if (!report) return;

  state.activeModal = {
    title: `${report.id} · ${report.title}`,
    content: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <img src="${report.photo}" alt="" style="width:100%; height:200px; object-fit:cover; border-radius:var(--radius-lg);">
        
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="status-tag ${statusClasses[report.status]}">
            ${statusLabels[report.status]}
          </span>
          <span style="font-size:12.5px; font-weight:700; color:var(--text-muted);">
            Priorité : <strong>${report.priority}</strong> · Service : <strong>${report.service}</strong>
          </span>
        </div>
        
        <div>
          <h4 style="font-size:14px; font-weight:800; color:var(--text-main); margin-bottom:4px;">Description du problème :</h4>
          <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">${escapeHtml(report.description)}</p>
        </div>
        
        <div style="font-size:12.5px; color:var(--text-main); display:flex; align-items:center; gap:8px;">
          ${icon('map-pin', 14)} <strong>Localisation :</strong> ${escapeHtml(report.location)}
        </div>
        
        ${report.report ? `
          <div class="inspection-report-box" style="margin-top:8px;">
            <div class="inspection-header">
              <span class="inspection-title-badge">${icon('file-text', 14)} Constat Technique d’Inspection</span>
            </div>
            <p style="font-size:12.5px; color:var(--text-main); margin-top:6px;">${escapeHtml(report.report)}</p>
          </div>
        ` : ''}
      </div>
    `,
    buttons: `
      <button class="btn-default-outline" onclick="window.closeModal();">Fermer</button>
      <button class="btn-primary-green" data-action="toggle-support" data-id="${report.id}" onclick="window.closeModal();">
        ${icon('users', 14)} Soutenir (${report.supports})
      </button>
    `
  };
  render();
}

// ==========================================================================
// GESTION DES ACTIONS ET ÉVÉNEMENTS GLOBAUX
// ==========================================================================
window.closeModal = function() {
  state.activeModal = null;
  render();
};

window.openReportDetails = function(id) {
  openReportDetailsModal(id);
};

window.handleAuthSubmit = function() {
  const regSelect = document.querySelector('#auth-region-select');
  if (regSelect) state.region = regSelect.value;
  setRole('citizen');
  notify('Bienvenue sur Signal City Sénégal (SunuGox) !');
};

window.handlePhotoUpload = function(event) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      state.photo = e.target.result;
      render();
      notify('Photo ajoutée avec succès');
    };
    reader.readAsDataURL(file);
  }
};

window.handleWizardNext = function() {
  const step = state.activeStep || 1;
  if (step === 1) {
    const location = document.querySelector('#draft-location')?.value.trim();
    if (!location) return notify('Indiquez une adresse, un quartier ou un repère.', 'warning');
    state.draft.region = document.querySelector('#draft-region')?.value || state.region;
    state.draft.location = location;
  } else if (step === 2) {
    const title = document.querySelector('#draft-title')?.value.trim();
    const desc = document.querySelector('#draft-description')?.value.trim();
    if (!title || !desc) return notify('Ajoutez un titre et une description du problème.', 'warning');
    state.draft.title = title;
    state.draft.description = desc;
  }
  state.activeStep = Math.min(4, step + 1);
  render();
};

window.submitNewReport = function() {
  const title = document.querySelector('#draft-title')?.value.trim();
  const desc = document.querySelector('#draft-description')?.value.trim();
  const loc = document.querySelector('#draft-location')?.value.trim();
  const region = document.querySelector('#draft-region')?.value || state.region;

  if (!title || !desc || !loc) {
    notify('Veuillez remplir tous les champs obligatoires.', 'warning');
    return;
  }

  const newId = `SIG-SN-0${Math.floor(180 + Math.random() * 800)}`;
  const newReport = {
    id: newId,
    title,
    category: state.draft.category,
    description: desc,
    location: loc,
    region,
    date: '29 sept. 2026',
    status: 'received',
    priority: state.draft.priority,
    service: 'À affecter',
    supports: 1,
    supportedByUser: true,
    author: 'Awa Diop',
    photo: state.photo || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=400&q=75'
  };

  state.reports.unshift(newReport);
  state.photo = '';
  state.coordinates = '';
  state.draft = {
    title: '',
    category: 'Voirie & Routes',
    description: '',
    location: '',
    region: state.region,
    priority: 'Moyenne'
  };
  state.view = 'dashboard';
  state.activeStep = 1;
  render();
  notify(`Signalement ${newId} transmis avec succès à la Mairie !`);
};

// Gestionnaire de clics universel
app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  
  const action = target.dataset.action;
  
  if (action === 'quick-role') {
    setRole(target.dataset.role);
    return;
  }
  
  if (action === 'open-guide') {
    openScenarioGuideModal();
    return;
  }
  
  if (action === 'toggle-theme') {
    toggleTheme();
    return;
  }
  
  if (action === 'logout') {
    state.role = null;
    state.view = 'dashboard';
    render();
    notify('Déconnexion effectuée.');
    return;
  }
  
  if (action === 'navigate') {
    state.view = target.dataset.view;
    render();
    return;
  }
  
  if (action === 'auth-tab') {
    state.authMode = target.dataset.tab;
    render();
    return;
  }
  
  if (action === 'toggle-my-reports') {\n    if (target.closest('.citizen-track-button')) return;\n    state.myReportsExpanded = !state.myReportsExpanded;\n    render();\n    return;\n  }\n  \n  if (action === 'open-detail') {
    openReportDetailsModal(target.dataset.id);
    return;
  }
  
  // Bouton Soutien "Moi aussi j'ai ce problème"
  if (action === 'toggle-support') {
    const report = state.reports.find(r => r.id === target.dataset.id);
    if (report) {
      if (report.supportedByUser) {
        report.supports = Math.max(1, report.supports - 1);
        report.supportedByUser = false;
        notify('Soutien retiré.');
      } else {
        report.supports += 1;
        report.supportedByUser = true;
        notify('Merci ! Votre voix a été comptabilisée pour ce problème.');
      }
      render();
    }
    return;
  }
  
  // Confirmation citoyenne (Cahier des charges)
  if (action === 'confirm-resolution') {
    state.confirmedResolved = true;
    render();
    notify('Résolution confirmée par le citoyen ! Le dossier est archivé.');
    return;
  }
  
  if (action === 'contest-resolution') {
    notify('Signalement renvoyé à l’équipe technique pour vérification.', 'warning');
    return;
  }
  
  if (action === 'undo-confirmation') {
    state.confirmedResolved = false;
    render();
    return;
  }
  
  if (action === 'wizard-back') {
    state.activeStep = Math.max(1, (state.activeStep || 1) - 1);
    render();
    return;
  }
  if (action === 'submit-report') {
    window.submitNewReport();
    return;
  }

  // Wizard selections
  if (action === 'select-category') {
    const titleInput = document.querySelector('#draft-title');
    const descriptionInput = document.querySelector('#draft-description');
    if (titleInput) state.draft.title = titleInput.value;
    if (descriptionInput) state.draft.description = descriptionInput.value;
    state.draft.category = target.dataset.cat;
    render();
    return;
  }
  
  if (action === 'select-priority') {
    state.draft.priority = target.dataset.priority;
    render();
    return;
  }
  
  if (action === 'get-gps') {
    if (navigator.geolocation) {
      target.textContent = 'Calcul en cours...';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.coordinates = `${pos.coords.latitude.toFixed(5)}° N, ${pos.coords.longitude.toFixed(5)}° W (Dakar)`;
          state.draft.location = 'Position GPS actuelle, Dakar';
          render();
          notify('Position GPS détectée avec succès');
        },
        () => {
          state.coordinates = '14.6937° N, 17.4441° W (Dakar Plateau)';
          state.draft.location = 'Dakar Plateau, Sénégal';
          render();
          notify('Coordonnées de Dakar enregistrées.');
        }
      );
    } else {
      state.coordinates = '14.6937° N, 17.4441° W (Dakar Plateau)';
      render();
    }
    return;
  }
  
  // Objets perdus actions
  if (action === 'claim-object') {
    notify('Dossier de réclamation ouvert. Présentez-vous au poste avec une pièce justificative.');
    return;
  }
  
  if (action === 'help-find') {
    notify('Merci pour votre civisme ! Votre message a été transmis à la mairie.');
    return;
  }
  
  if (action === 'reset-lost-filter') {
    state.lostSearch = '';
    state.lostTypeFilter = 'all';
    render();
    return;
  }
  
  // Actions Agent Terrain
  if (action === 'agent-start-inspection') {
    const report = state.reports.find(r => r.id === target.dataset.id);
    if (report) {
      report.status = 'inspection';
      render();
      notify(`Inspection démarrée sur place pour ${report.id}.`);
    }
    return;
  }
  
  if (action === 'agent-submit-report') {
    const report = state.reports.find(r => r.id === target.dataset.id);
    if (report) {
      report.status = 'awaiting';
      report.report = 'Inspection technique terminée le 29/09. Chaussée endommagée sur 15 mètres. Travaux de réfection d’urgence requis sous 48h.';
      render();
      notify(`Rapport technique transmis à la Mairie pour autorisation.`);
    }
    return;
  }
  
  if (action === 'agent-resolve') {
    const report = state.reports.find(r => r.id === target.dataset.id);
    if (report) {
      report.status = 'resolved';
      render();
      notify(`Signalement ${report.id} marqué résolu ! Les citoyens du quartier sont notifiés.`);
    }
    return;
  }
  
  // Actions Mairie / Admin
  if (action === 'admin-assign') {
    const report = state.reports.find(r => r.id === target.dataset.id);
    if (report) {
      report.service = report.category.includes('Éclairage') ? 'Éclairage' : report.category.includes('Eau') ? 'Assainissement' : 'Voirie';
      report.status = 'assigned';
      render();
      notify(`Signalement ${report.id} affecté au service ${report.service} !`);
    }
    return;
  }
  
  if (action === 'admin-authorize') {
    const report = state.reports.find(r => r.id === target.dataset.id);
    if (report) {
      report.status = 'progress';
      report.authorized = true;
      render();
      notify(`Autorisation de travaux accordée par la Mairie pour ${report.id}.`);
    }
    return;
  }
  
  if (action === 'clear-notifs') {
    notify('Toutes les notifications ont été marquées comme lues.');
    return;
  }
});

// Recherche instantanée du tableau de bord citoyen
app.addEventListener('input', (event) => {
  const target = event.target;
  if (target.dataset.action === 'citizen-search') {
    state.query = target.value;
    const caret = target.selectionStart;
    render();
    const input = document.querySelector('[data-action="citizen-search"]');
    if (input) {
      input.focus();
      input.setSelectionRange(caret, caret);
    }
  }
});

// Écouteur pour le changement de région et rôle rapide dans les select
app.addEventListener('change', (event) => {
  const target = event.target;
  if (target.dataset.action === 'change-region') {
    state.region = target.value;
    render();
    notify(`Région active : ${state.region}`);
  }
  if (target.dataset.action === 'quick-role-select') {
    setRole(target.value);
  }
});

// Lancement initial
render();