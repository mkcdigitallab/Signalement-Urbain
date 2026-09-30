const state={
  role:"citizen",
  page:"dashboard",
  reports:[
    {id:"SIG-2048",title:"Nid-de-poule sur l’avenue Blaise Diagne",category:"Voirie & Routes",location:"Dakar-Plateau",status:"assigned",date:"30 sept. 2026",agent:"Amadou Sow",municipality:"Mairie de Dakar-Plateau"},
    {id:"SIG-2041",title:"Lampadaire hors service",category:"Éclairage public",location:"Médina",status:"inspection",date:"29 sept. 2026",agent:"Awa Ndiaye",municipality:"Mairie de Médina"},
    {id:"SIG-2037",title:"Dépôt sauvage près du marché",category:"Déchets & Salubrité",location:"Grand Dakar",status:"progress",date:"28 sept. 2026",agent:"Moussa Diop",municipality:"Mairie de Grand Dakar"}
  ]
};

const navs={
 citizen:[["dashboard","⌂","Vue d’ensemble"],["reports","▣","Mes signalements"],["new","＋","Nouveau signalement"],["map","⌖","Carte de la ville"]],
 mairie:[["dashboard","⌂","Pilotage"],["inbox","◫","Signalements reçus"],["missions","✓","Missions terrain"],["services","◈","Services municipaux"]],
 agent:[["dashboard","⌂","Ma journée"],["missions","✓","Mes missions"],["reports","▣","Rapports terrain"],["history","◷","Historique"]]
};
const labels={received:"Reçu",assigned:"Affecté",inspection:"Inspection",awaiting:"Rapport terrain",progress:"Intervention",resolved:"Clôturé"};
const iconMap={received:"1",assigned:"2",inspection:"3",awaiting:"4",progress:"5",resolved:"✓"};

function setRole(role){state.role=role;state.page="dashboard";render()}
function setPage(page){state.page=page;render()}
function roleLabel(){return state.role==="citizen"?"Citoyen":state.role==="mairie"?"Administration municipale":"Agent terrain"}
function reportCard(r){
 return '<div class="report"><div class="report-thumb">◉</div><div><h4>'+r.title+'</h4><p>'+r.id+' · '+r.location+' · '+r.date+'</p></div><span class="badge '+(r.status==="progress"?"blue":r.status==="inspection"?"amber":"green")+'">'+labels[r.status]+'</span></div>'
}
function workflow(current){
 const order=["received","assigned","inspection","awaiting","progress","resolved"], index=order.indexOf(current);
 return '<div class="workflow">'+order.map((s,i)=>'<div class="workflow-step '+(i<=index?"done":"")+'"><span class="num">ÉTAPE '+(i+1)+'</span><strong>'+iconMap[s]+' '+labels[s]+'</strong><span>'+({received:"Le signalement est enregistré",assigned:"La mairie responsable est identifiée",inspection:"Un agent vérifie sur place",awaiting:"Le constat est transmis",progress:"Le service intervient",resolved:"La mairie contrôle le résultat"}[s])+'</span></div>').join("")+'</div>'
}
function dashboard(){
 const title=state.role==="citizen"?"Votre ville, votre voix.":"Pilotage des interventions municipales";
 const sub=state.role==="citizen"?"Signalez un problème, suivez chaque étape et voyez qui agit sur le terrain.":"Une vue claire des signalements, des missions et des interventions en cours.";
 return '<section class="hero"><div><div class="mini-label">SUNUGOX · '+roleLabel().toUpperCase()+'</div><h1>'+title+'</h1><p>'+sub+'</p><div class="hero-actions"><button class="btn btn-primary" onclick="setPage(\'new\')">＋ Nouveau signalement</button><button class="btn btn-white" onclick="setPage(\'reports\')">Voir les dossiers</button></div></div><div class="hero-card"><span class="mini-label">Dossiers actifs</span><strong>128</strong><span>dont 24 nécessitent une action terrain aujourd’hui</span></div></section>'+
 '<div class="section-head"><div><h2>Vue d’ensemble</h2><p>Les indicateurs essentiels, sans bruit.</p></div></div>'+
 '<div class="stats"><div class="stat"><div class="stat-top"><span>Signalements</span><span>↗</span></div><strong>248</strong><span class="trend">+12% ce mois</span></div><div class="stat"><div class="stat-top"><span>En inspection</span><span>⌖</span></div><strong>24</strong><span class="trend">8 missions aujourd’hui</span></div><div class="stat"><div class="stat-top"><span>Interventions</span><span>✓</span></div><strong>67</strong><span class="trend">18 terminées cette semaine</span></div><div class="stat"><div class="stat-top"><span>Délai moyen</span><span>◷</span></div><strong>2,4 j</strong><span class="trend">-0,6 j vs. mois dernier</span></div></div>'+
 '<div class="section-head"><div><h2>Activité récente</h2><p>Les dossiers qui demandent votre attention.</p></div><button class="link" onclick="setPage(\'reports\')">Tout voir →</button></div>'+
 '<div class="grid-2"><div class="panel"><div class="panel-title"><h3>Signalements récents</h3><span class="badge green">En direct</span></div><div class="report-list">'+state.reports.map(reportCard).join("")+'</div></div><div class="panel"><div class="panel-title"><h3>Parcours d’un dossier</h3><span class="badge gray">SIG-2048</span></div><div class="timeline"><div class="event"><div class="dot">✓</div><div><strong>Signalement reçu</strong><p>30 sept. · 08:42 · Position enregistrée à Dakar-Plateau.</p></div></div><div class="event"><div class="dot">✓</div><div><strong>Mairie identifiée</strong><p>Le dossier a été orienté vers le service Voirie.</p></div></div><div class="event"><div class="dot">→</div><div><strong>Agent affecté</strong><p>Amadou Sow · inspection prévue aujourd’hui.</p></div></div><div class="event"><div class="dot">○</div><div><strong>Intervention</strong><p>En attente du constat terrain.</p></div></div></div></div></div>'
}
function reportsPage(){
 return '<div class="section-head"><div><h2>Signalements</h2><p>Une seule fiche de dossier, du citoyen jusqu’à la clôture.</p></div><button class="btn btn-primary" onclick="setPage(\'new\')">＋ Nouveau</button></div>'+
 '<div class="panel"><div class="panel-title"><h3>248 dossiers</h3><span class="badge gray">Dakar · 30 sept. 2026</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Dossier</th><th>Problème</th><th>Territoire</th><th>Responsable</th><th>État</th></tr></thead><tbody>'+state.reports.map(r=>'<tr><td><strong>'+r.id+'</strong><br><small>'+r.date+'</small></td><td>'+r.title+'<br><small>'+r.category+'</small></td><td>'+r.location+'</td><td>'+r.municipality+'<br><small>'+r.agent+'</small></td><td><span class="badge '+(r.status==="progress"?"blue":r.status==="inspection"?"amber":"green")+'">'+labels[r.status]+'</span></td></tr>').join("")+'</tbody></table></div></div>'+
 '<div class="section-head"><div><h2>Chaîne de traitement</h2><p>Chaque acteur sait ce qui vient avant et après son action.</p></div></div>'+workflow("progress")
}
function newPage(){
 return '<div class="section-head"><div><h2>Nouveau signalement</h2><p>Décrivez le problème. SunuGox prépare automatiquement le dossier pour la mairie compétente.</p></div></div>'+
 '<div class="grid-2"><div class="panel"><div class="form-grid"><div class="field"><label>Catégorie</label><select><option>Voirie & Routes</option><option>Éclairage public</option><option>Déchets & Salubrité</option><option>Eau & Assainissement</option><option>Espaces verts</option></select></div><div class="field"><label>Localisation</label><select><option>Dakar-Plateau</option><option>Médina</option><option>Grand Dakar</option><option>Liberté 6</option></select></div><div class="field full"><label>Titre du signalement</label><input placeholder="Ex. Nid-de-poule devant la pharmacie..."></div><div class="field full"><label>Description</label><textarea placeholder="Décrivez ce que vous avez constaté, depuis quand et ce qui peut aider l’agent à le retrouver."></textarea></div><div class="field"><label>Photo</label><input type="file"></div><div class="field"><label>Position</label><input value="14.7167, -17.4677" readonly></div></div><div style="display:flex;justify-content:flex-end;margin-top:18px"><button class="btn btn-primary" onclick="alert('Dossier SIG-2049 créé et orienté vers la mairie compétente.');setPage('reports')">Créer le signalement →</button></div></div><div class="panel"><div class="panel-title"><h3>Routage automatique</h3><span class="badge green">Prêt</span></div><div class="map-card"><div class="map-pin" style="left:54%;top:38%"><span>●</span></div><div class="map-label">Dakar-Plateau · Mairie compétente identifiée</div></div><div style="margin-top:14px"><strong style="font-size:12px">Mairie de Dakar-Plateau</strong><p style="font-size:10px;color:var(--muted);line-height:1.5">Service Voirie · Le dossier sera transmis à l’administration avant affectation à un agent terrain.</p></div></div></div>'
}
function rolePage(){
 if(state.page==="new")return newPage();
 if(state.page==="reports")return reportsPage();
 return dashboard();
}
function render(){
 const nav=navs[state.role];
 document.querySelector("#app").innerHTML='<div class="app-shell"><aside class="sidebar"><div class="logo"><span class="logo-mark">S</span><span>SunuGox</span></div><div class="role-switch"><small>Mode actuel</small><select onchange="setRole(this.value)"><option value="citizen" '+(state.role==="citizen"?"selected":"")+'>Citoyen</option><option value="mairie" '+(state.role==="mairie"?"selected":"")+'>Administration</option><option value="agent" '+(state.role==="agent"?"selected":"")+'>Agent terrain</option></select></div><nav class="nav">'+nav.map(n=>'<button class="'+(state.page===n[0]?"active":"")+'" onclick="setPage(\''+n[0]+'\')"><span class="nav-icon">'+n[1]+'</span><span>'+n[2]+'</span></button>').join("")+'</nav><div class="sidebar-footer">Sénégal · Dakar<br>Plateforme civique 2026</div></aside><main class="main"><header class="topbar"><div class="breadcrumb">SunuGox <span style="margin:0 7px">/</span> '+roleLabel()+'</div><div class="top-actions"><button class="icon-btn">⌕</button><button class="icon-btn">♢</button><div class="avatar">'+(state.role==="citizen"?"MC":state.role==="mairie"?"ID":"AS")+'</div></div></header><div class="content">'+rolePage()+'</div><nav class="mobile-nav">'+nav.slice(0,4).map(n=>'<button class="'+(state.page===n[0]?"active":"")+'" onclick="setPage(\''+n[0]+'\')"><span>'+n[1]+'</span><span>'+n[2]+'</span></button>').join("")+'</nav></main></div>'
}
render();
