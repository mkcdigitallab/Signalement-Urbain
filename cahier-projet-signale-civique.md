# PROJET INTÉGRATEUR — SignalCivique

**Plateforme de signalement citoyen et d'objets perdus et trouvés avec Laravel**
Cahier de projet technique fondé sur une démarche incrémentale

| Paramètre | Cadre proposé |
|---|---|
| Niveau | Intermédiaire |
| Prérequis | PHP POO, SOLID, SQL, Git et notions Docker |
| Modalité | Travail individuel avec revues de jalons |
| Charge indicative | Quarante-quatre à cinquante-deux heures selon l'environnement de déploiement |
| Socle | PHP 8.3 ou 8.4, Laravel, MySQL, Redis, MinIO, Composer, Docker, GitLab CI/CD |
| Livraison | Seize versions intermédiaires puis une release 1.0.0 |

> **Principe directeur** — Chaque incrément produit une application exécutable, une version Git identifiable, une évolution maîtrisée de l'environnement, une preuve de pipeline et un DevLog. Les notions apparaissent lorsqu'un problème concret les rend nécessaires.

> **Compétence finale visée** — À l'issue du projet, l'étudiant doit pouvoir concevoir, tester, conteneuriser et livrer une application Laravel multi-espaces construite autour d'un workflow d'états à plusieurs acteurs (signalement, inspection, rapport, autorisation, intervention), expliquer ses choix d'architecture et distinguer le déploiement du code du déploiement d'une image immuable.

> **Point de départ** — Une maquette front (HTML, CSS et JavaScript) nommée SignalCivique existe déjà. Elle décrit les écrans, les rôles et le parcours attendus, avec des données fictives remises à zéro au rechargement. Le projet consiste à construire le vrai back-end Laravel, persistant, sécurisé et livrable, qui donne vie à cette maquette.

---

## Sommaire

- [A — Description du projet](#a--description-du-projet)
- [B — Incréments](#b--incréments)
- [C — Stratégie GitLab imposée](#c--stratégie-gitlab-imposée)
- [D — Stratégie Docker évolutive](#d--stratégie-docker-évolutive)
- [E — Pipeline et déploiement](#e--pipeline-et-déploiement)
- [F — DevLog obligatoire](#f--devlog-obligatoire)
- [G — Scénarios d'acceptation](#g--scénarios-dacceptation)
- [H — Livrables](#h--livrables)
- [I — Évaluation](#i--évaluation)
- [J — Questions de synthèse](#j--questions-de-synthèse)

---

## A — Description du projet

### 1. Contexte

Les habitants d'une ville constatent tous les jours des problèmes dans l'espace public : nid-de-poule, lampadaire éteint, dépôt d'ordures, fuite d'eau, branche tombée, marquage effacé. Ces problèmes remontent par téléphone, réseaux sociaux ou courrier : les demandes se perdent, se répètent, et personne ne sait quel service doit intervenir ni où en est le traitement. Les objets perdus ou retrouvés suivent le même chemin dispersé.

SignalCivique centralise ces échanges autour de trois acteurs :

- **le citoyen** signale un problème avec photo et position, soutient les signalements de son quartier, suit leur résolution et recherche ses objets perdus ;
- **la mairie (administrateur)** affecte chaque signalement au bon service, valide le rapport d'inspection puis autorise l'intervention ;
- **l'agent technique** du service concerné inspecte les lieux, transmet son rapport, réalise l'intervention autorisée et la marque comme résolue.

La première version est rendue localement, puis industrialisée progressivement jusqu'à deux modes de livraison automatisée.

### 2. Objectifs pédagogiques

- Comprendre le cycle d'une requête Laravel depuis la route jusqu'à la réponse.
- Modéliser les données avec migrations, Eloquent, relations, enums, factories et seeders.
- Valider et transformer les données HTTP avant leur utilisation.
- Distinguer authentification, autorisation par rôle, autorisation par périmètre (service) et règles métier.
- Modéliser un cycle de vie à plusieurs acteurs par une machine à états et en conserver l'historique.
- Séparer orchestration HTTP, règles métier, accès aux données et présentation.
- Utiliser l'injection de dépendances et le conteneur de services Laravel.
- Composer les requêtes Eloquent avec des scopes, réaliser une recherche et une détection de proximité testables.
- Maîtriser les effets de bord avec Observers, Events, Listeners et notifications.
- Écrire des tests unitaires, fonctionnels et d'intégration.
- Traiter les conflits de traitement simultané et le risque de concurrence.
- Construire une image Docker reproductible et exécuter l'application avec Compose.
- Mettre en place une chaîne GitLab de qualité, publication et déploiement.
- Documenter une progression technique par versions, tags, releases et DevLogs.

### 3. Socle technique

| Besoin | Choix |
|---|---|
| Framework | Laravel sur une version stable compatible avec PHP 8.3 ou 8.4 |
| Persistance | MySQL et Eloquent ORM |
| Authentification | Starter kit Laravel (Breeze) ou Fortify, choix unique justifié |
| Interface | Blade, CSS et JavaScript léger issus de la maquette SignalCivique |
| Géolocalisation | API de géolocalisation du navigateur ; carte facultative |
| Validation | Form Requests et règles Laravel |
| Fichiers | MinIO (stockage objet compatible S3) pour les photos |
| Cache | Redis |
| Notifications | Notifications Laravel (canal base de données), extensibles |
| Tests | Pest ou PHPUnit, choix unique justifié |
| Qualité | Laravel Pint et Larastan ou PHPStan |
| Conteneurs | Dockerfile multi stage et Docker Compose |
| Forge | GitLab Issues, Merge Requests, Registry, Environments et Releases |
| Automatisation | GitLab CI/CD |

> **Version de Laravel** — La version exacte est figée dans `composer.lock`. Toute montée de version en cours de projet est une décision documentée, testée et livrée dans un incrément dédié.

> **Ressources externes** — La maquette charge ses polices et ses icônes depuis des CDN. Le projet documente un choix : héberger ces ressources localement ou les conserver en CDN avec politique de sécurité de contenu adaptée. Aucun test ne dépend d'un service externe.

### 4. Espaces, rôles et permissions

La maquette propose trois espaces. Chacun répond à une question simple : qui fait quoi ?

| Rôle | Devise | Ce qu'il fait |
|---|---|---|
| **Citoyen** | Signaler et suivre | Crée un signalement (titre, catégorie, description, photo, position, priorité perçue), soutient ceux des autres (« Moi aussi »), suit leur avancement, consulte ses notifications, recherche et déclare des objets perdus |
| **Agent technique** | Inspecter et intervenir | Est rattaché à un service. Ne voit que les signalements affectés à son service. Démarre l'inspection sur place, transmet un rapport d'inspection, réalise l'intervention une fois les travaux autorisés et la marque comme résolue |
| **Administrateur (mairie)** | Affecter et autoriser | Voit tous les signalements, affecte chacun au service compétent, valide le rapport et autorise les travaux, gère les services et les comptes, enregistre les objets retrouvés, consulte le tableau de bord global |

**Matrice des permissions**

| Action | Citoyen | Agent technique | Administrateur |
|---|---|---|---|
| Créer un signalement, le soutenir | oui | non | non |
| Voir la liste des signalements | oui | son service | tous |
| Affecter ou réaffecter à un service | non | non | oui |
| Démarrer l'inspection, transmettre le rapport | non | son service | non |
| Autoriser les travaux | non | non | oui |
| Marquer comme résolu | non | son service | non |
| Déclarer un objet perdu | oui | non | oui |
| Enregistrer un objet retrouvé | non | non | oui |
| Gérer services, catégories, utilisateurs | non | non | oui |
| Tableau de bord | le sien | celui de son service | global |

### 5. Fonctionnalités attendues

**Signalements (citoyen)**

- Créer un signalement : titre, catégorie parmi huit, description, photo, adresse ou repère, position GPS facultative, priorité perçue (faible, moyenne, urgente).
- Consulter les signalements du quartier, les soutenir, suivre les siens avec leur chronologie.
- Rechercher par titre, catégorie, lieu, référence ou service.

**Traitement (mairie et agents techniques)**

- La mairie affecte chaque nouveau signalement à un service, avec le service suggéré d'après la catégorie.
- L'agent démarre l'inspection puis transmet un rapport (constat, état du matériel, travaux recommandés).
- La mairie examine le rapport, autorise les travaux ou le renvoie pour complément.
- L'agent réalise l'intervention et marque le signalement résolu.

**Objets perdus et trouvés**

- Le citoyen déclare un objet perdu ; la mairie enregistre un objet retrouvé avec son lieu de dépôt.
- Recherche par mot clé dans le nom, la description et le lieu ; indication du lieu de retrait.

**Administration et pilotage**

- Gérer les services (avec, si besoin, l'organisme partenaire : ONAS pour l'assainissement, SEN'EAU pour l'eau, etc.), les catégories et les utilisateurs.
- Tableaux de bord par rôle : indicateurs, répartition par domaine, pipeline de traitement, rapports à valider.

**Notifications**

- Chaque acteur est notifié lorsqu'une action le concerne (voir règles).

**Entités**

| Entité | Attributs |
|---|---|
| Utilisateur | id, nom, email, mot_de_passe, role, service_id (agents), created_at, updated_at |
| Service | id, nom, description, organisme (facultatif), actif, created_at, updated_at |
| Catégorie | id, nom, icône, service_suggere_id, active, created_at, updated_at |
| Signalement | id, reference (SIG-AAAA-NNNN), auteur_id, categorie_id, service_id (nul), titre, description, lieu, latitude et longitude (nuls), priorite_percue, score_priorite, statut, travaux_autorises, autorise_par, autorise_le, version, resolu_le, created_at, updated_at |
| Soutien | id, signalement_id, utilisateur_id, created_at |
| RapportInspection | id, signalement_id, agent_id, contenu, statut (transmis, accepté, à compléter), created_at, updated_at |
| HistoriqueStatut | id, signalement_id, acteur_id, de_statut, vers_statut, motif, created_at |
| PhotoSignalement | id, signalement_id, nom_original, mime_type, taille, cle_stockage, created_at |
| Objet | id, reference (OBJ-NNNN), declarant_id, nom, description, lieu, date, statut (perdu, retrouvé), lieu_depot (nul), photo_cle (nulle), created_at, updated_at |

- **Catégories de départ** — Voirie et routes, éclairage public, déchets et propreté, eau et assainissement, espaces verts, sécurité, mobilité et stationnement, autre.
- **Services de départ** — Voirie, éclairage, propreté, assainissement, espaces verts, sécurité.
- **Statuts d'un signalement** — Signalement reçu, affecté au service, inspection en cours, rapport à valider, intervention en cours, résolu.
- **Priorités perçues** — Faible, moyenne, urgente.

### 6. Règles métier

#### Création d'un signalement

1. L'auteur est un citoyen authentifié.
2. La catégorie existe et est active.
3. Le titre contient entre cinq et quatre-vingt-dix caractères.
4. La description contient entre vingt et cinq cents caractères.
5. Le lieu (adresse ou repère) est renseigné.
6. Une photo est obligatoire : JPEG, PNG ou WebP, cinq Mo maximum, type MIME réel vérifié.
7. La position GPS est facultative ; si elle est fournie, elle est cohérente et comprise dans la zone documentée.
8. La priorité perçue appartient à l'ensemble autorisé ; la valeur par défaut est « moyenne ».
9. Un citoyen ne crée pas plus de cinq signalements par jour.
10. La référence `SIG-AAAA-NNNN` est unique et générée par le système, jamais saisie.

#### Proximité

Lorsque la position GPS est fournie, deux signalements sont candidats au doublon s'ils ont la même catégorie, que l'existant n'est pas résolu et que la distance entre les deux points est inférieure ou égale au rayon configuré (cent mètres par défaut). Le système suggère alors de soutenir l'existant ; la création reste possible après confirmation explicite.

#### Transitions de statut

| De | Vers | Qui | Condition |
|---|---|---|---|
| (création) | Signalement reçu | citoyen | règles de création respectées |
| Signalement reçu | Affecté au service | administrateur | service actif choisi ; motif obligatoire s'il diffère du service suggéré |
| Affecté au service | Affecté au service | administrateur | réaffectation à un autre service, motif obligatoire, tant que l'inspection n'a pas commencé |
| Affecté au service | Inspection en cours | agent du service affecté | — |
| Inspection en cours | Rapport à valider | agent du service affecté | rapport non vide |
| Rapport à valider | Intervention en cours | administrateur | travaux autorisés ; auteur et date d'autorisation enregistrés |
| Rapport à valider | Inspection en cours | administrateur | rapport à compléter, motif obligatoire |
| Intervention en cours | Résolu | agent du service affecté | — |

Toute autre transition est refusée par une exception métier explicite. Chaque transition acceptée écrit une ligne d'historique **dans la même transaction**.

**Périmètre de l'agent** — Un agent ne peut ni voir ni traiter un signalement affecté à un autre service, même en connaissant son identifiant.

#### Soutien

1. Un utilisateur soutient un même signalement au plus une fois.
2. On ne soutient pas un signalement résolu.
3. Le retrait d'un soutien est autorisé tant que le signalement n'est pas résolu.

#### Priorité affichée

Le score combine la priorité perçue par le citoyen, le nombre de soutiens et l'ancienneté. La formule exacte et les seuils faible, moyenne et urgente sont documentés dans le DevLog et lus depuis la configuration. Le calcul est une fonction pure testable sans base de données.

#### Notifications

| Événement | Destinataires |
|---|---|
| Nouveau signalement reçu | Administrateurs |
| Signalement affecté | Agents du service concerné et auteur |
| Rapport transmis | Administrateurs |
| Travaux autorisés | Agents du service concerné et auteur |
| Signalement résolu | Auteur et citoyens ayant soutenu |

#### Objets perdus et trouvés

1. Un objet perdu exige un nom, une description et un lieu.
2. Un objet retrouvé est enregistré par la mairie avec un lieu de dépôt obligatoire (par exemple commissariat ou mairie annexe).
3. Les annonces sont visibles de tous les citoyens ; aucune donnée personnelle (nom sur des papiers, numéro) n'est affichée publiquement.
4. La recherche porte sur nom, description et lieu, sans tenir compte de la casse ni des accents.

### 7. Exigences non fonctionnelles

- Les erreurs de validation sont compréhensibles et les données saisies sont conservées.
- Aucun secret ne figure dans le dépôt, l'image ou les journaux.
- Les dates sont stockées en UTC et affichées dans le fuseau documenté, au format français.
- L'interface reste lisible sur téléphone (la photo peut être prise directement depuis l'appareil) et respecte un contraste suffisant (niveau AA).
- Deux acteurs qui traitent en même temps le même signalement ne doivent pas produire deux transitions contradictoires.
- Les photos sont exposées par des URLs temporaires ; le cache des tableaux de bord est invalidé lors des mutations.
- Les données personnelles affichées publiquement sont minimales (pas d'email d'auteur, pas d'identité dans les objets trouvés).

### 8. Contraintes architecturales

- Les contrôleurs restent minces et ne portent ni règle de transition ni règle de périmètre.
- Les Form Requests assurent la validation de forme ; les Policies assurent l'autorisation par rôle, par propriété et par service.
- Masquer un bouton dans une vue ne constitue jamais un contrôle d'accès.
- Les règles métier sont regroupées dans des services ou actions applicatives.
- Le statut d'un signalement n'est jamais modifié par un `update` direct : il passe par l'action de transition.
- Les dépendances sont reçues par constructeur et résolues par le conteneur Laravel.
- L'accès direct au conteneur depuis le domaine applicatif est interdit.
- Les vues Blade ne contiennent ni requête Eloquent ni règle métier.
- La recherche et la détection de proximité reposent sur des requêtes explicites et testables.
- Les paramètres métier (rayon, quota, seuils) passent par `config/signalcivique.php` ; `env()` n'est appelé que dans les fichiers de configuration.
- Les environnements local, test, staging et production sont séparés par configuration.
- Les changements de schéma sont exclusivement réalisés par migrations.

### 9. Organisation attendue

L'arborescence Laravel standard est conservée. Les ajouts expriment les responsabilités sans transformer le framework en architecture artificielle.

| Zone | Responsabilité |
|---|---|
| `app/Http/Controllers` | Orchestration HTTP et réponses, un espace par rôle |
| `app/Http/Requests` | Validation de forme |
| `app/Policies` | Autorisation par rôle, par propriété et par service |
| `app/Models` | Modèles Eloquent, relations et casts |
| `app/Enums` | Statuts, rôles, priorités, statuts d'objet |
| `app/Data` | Objets de transfert immuables si leur utilité est démontrée |
| `app/Actions` ou `app/Services` | Cas d'usage : créer, affecter, inspecter, autoriser, résoudre, soutenir |
| `app/Geo` | Calcul de distance et recherche de proximité |
| `app/Search` | Recherche insensible à la casse et aux accents |
| `app/Contracts` | Ports nécessaires à une dépendance interchangeable |
| `app/Exceptions` | Échecs métier explicites |
| `app/Media` | Téléversement, suppression, URLs temporaires des photos |
| `app/Observers`, `Events`, `Listeners`, `Notifications` | Réactions au cycle de vie et notifications |
| `database/migrations`, `factories`, `seeders` | Schéma et données contrôlées |
| `resources/views` | Présentation Blade issue de la maquette |
| `tests/Unit`, `tests/Feature` | Tests isolés et tests applicatifs |
| `docker`, `compose` | Construction et orchestration locale |
| `docs/devlogs` | Journal par incrément et décisions |

### 10. Modèle de données

L'étudiant produit un diagramme de classes et un schéma relationnel avant de coder les relations. Il justifie les types SQL, index, clés étrangères, règles de suppression et contraintes d'unicité. Le schéma évolue uniquement par migrations.

**Décisions attendues**

1. **Machine à états** : enum PHP avec méthode de transitions, table de transitions ou package dédié ; retenir la solution la plus simple qui protège réellement les règles.
2. **Accès aux données** : comparer Eloquent direct, Query Object et Repository.
3. **Coordonnées** : deux colonnes décimales ou type spatial MySQL.
4. **Rattachement de l'agent** : colonne `service_id` sur l'utilisateur ou table de liaison.

---

## B — Incréments

### Incrément 0 — Initialisation du dépôt GitLab

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.0.0` | Un dépôt vide mais gouverné, clonable et auditable. | La Merge Request est fusionnée, le pipeline est vert et le tag `v0.0.0` pointe sur `main`. |

**Travail demandé**

- Créer le projet GitLab et un README présentant contexte, espaces, périmètre et prérequis.
- Versionner la maquette SignalCivique dans un dossier de référence (`docs/maquette`) sans l'exécuter en production.
- Créer les labels type, priorité et statut ainsi que les Issues des trois premiers incréments.
- Protéger `main` et interdire le push direct.
- Ajouter des modèles de Merge Request, Issue et DevLog.

**Contraintes techniques**

- `main` représente toujours un état livrable.
- Toute évolution passe par une branche `type/numéro-sujet`.
- Les secrets et fichiers locaux sont exclus dès le premier commit.

**Questions de découverte**

- **Q1.** Pourquoi protéger `main` avant d'écrire du code.
- **Q2.** Quelle différence entre commit, tag, release et environnement.
- **Q3.** Quels éléments rendent un commit atomique.

- **GitLab imposé** — Branche `chore/0-initialisation`. Commits suggérés : `chore(gitlab): initialise project governance` puis `docs(readme): describe project`. Merge Request obligatoire. Tag annoté `v0.0.0` après fusion.
- **Docker évolutif** — Créer seulement `docs/docker-strategy.md` avec les futures cibles local, ci et production. Aucun conteneur n'est exigé.
- **Pipeline et déploiement** — Pipeline minimal de lint Markdown ou de vérification de structure, exécuté sur la Merge Request et sur `main`.
- **DevLog obligatoire** — `docs/devlogs/v0.0.0.md` : convention de branches, protection de `main`, première difficulté rencontrée, liens vers l'Issue, la Merge Request, le pipeline et le tag.
- **Validation** — La Merge Request est fusionnée, le pipeline est vert et le tag `v0.0.0` pointe sur `main`.

---

### Incrément 1 — Socle Laravel exécutable

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.1.0` | La page d'accueil SignalCivique répond localement et les tests du framework passent. | Un clone propre peut installer, démarrer et tester le socle avec les commandes documentées. |

**Travail demandé**

- Créer le projet Laravel avec Composer et configurer `APP_NAME`.
- Reprendre la page d'accueil de la maquette (choix de l'espace) sous forme de vue Blade statique.
- Identifier les répertoires clés et décrire le cycle route, contrôleur, réponse.
- Ajouter Pint et l'outil d'analyse statique choisi.

**Contraintes techniques**

- `composer.lock` est versionné.
- `.env` n'est jamais versionné et `.env.example` ne contient aucun secret.
- La version PHP et les extensions requises sont documentées.

**Questions de découverte**

- **Q4.** Quel fichier reçoit réellement la requête HTTP.
- **Q5.** À quoi servent Artisan, Composer et les Service Providers.
- **Q6.** Pourquoi figer les dépendances directes et transitives.

- **GitLab imposé** — Branche `feat/1-bootstrap-laravel`. Commits : `build(composer): create laravel application` puis `feat(home): expose project entry page`. Tag annoté `v0.1.0`.
- **Docker évolutif** — Dockerfile de développement simple exécutant PHP et Composer, avec bind mount. Documenter la différence entre image, conteneur, volume et port.
- **Pipeline et déploiement** — Étapes : `composer validate`, `composer install`, Pint check, analyse statique, tests. Cache des dépendances sans `vendor` dans le dépôt.
- **DevLog obligatoire** — Amorçage Laravel, rôle de `public/index.php` et du lockfile, comparaison exécution native et conteneurisée.
- **Validation** — Un clone propre peut installer, démarrer et tester le socle avec les commandes documentées.

---

### Incrément 2 — Environnement applicatif et MySQL

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.2.0` | Laravel communique avec MySQL dans un environnement local reproductible. | Le pipeline établit une connexion MySQL et les commandes de diagnostic réussissent dans un clone propre. |

**Travail demandé**

- Ajouter MySQL à Docker Compose et configurer la connexion par variables d'environnement.
- Ajouter un healthcheck MySQL et une commande de diagnostic.
- Créer un environnement de test distinct.

**Contraintes techniques**

- Aucune adresse de service n'est codée en dur dans PHP.
- Les données MySQL persistent dans un volume nommé.
- La base de test est isolée de la base de développement.

**Questions de découverte**

- **Q7.** Pourquoi `depends_on` ne garantit pas que MySQL accepte déjà des connexions.
- **Q8.** Quelle différence entre configuration construite et configuration injectée.
- **Q9.** Pourquoi `config:cache` peut provoquer un comportement surprenant.

- **GitLab imposé** — Branche `feat/2-mysql-environment`. Commits : `build(docker): add mysql to compose` puis `config(database): isolate environments`. Tag `v0.2.0`.
- **Docker évolutif** — Services `app` et `db`, réseau privé, volume nommé, healthcheck. Cibles Makefile ou scripts Composer pour `up`, `down`, `logs` et `shell`.
- **Pipeline et déploiement** — Service MySQL dans le job d'intégration, avec attente explicite de la disponibilité de la base.
- **DevLog obligatoire** — Flux de configuration du fichier `.env` jusqu'à PDO ; un incident de démarrage ou de connexion et son diagnostic.
- **Validation** — Le pipeline établit une connexion MySQL et les commandes de diagnostic réussissent dans un clone propre.

---

### Incrément 3 — Schéma et modèles Eloquent

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.3.0` | Le schéma, les modèles et leurs relations représentent correctement le domaine. | Les migrations montent sur une base vide, redescendent si prévu, puis remontent dans le pipeline. |

**Travail demandé**

- Créer les migrations : rôle et service des utilisateurs, `services`, `categories`, `reports`, `report_supports`, `inspection_reports`, `report_status_changes`, `lost_items`.
- Créer les modèles avec relations et relations inverses.
- Définir enums PHP (statut, rôle, priorité), casts, `fillable` ou `guarded` et conventions de dates.
- Produire le diagramme de classes et le schéma relationnel.

**Contraintes techniques**

- Clés étrangères, index et contraintes d'unicité sont justifiés (référence unique, soutien unique par utilisateur et signalement).
- Services et catégories se désactivent, ils ne se suppriment pas s'ils sont référencés.
- Une migration fusionnée n'est pas réécrite pour corriger un environnement partagé.
- Le champ `role` n'est jamais assignable en masse.

**Questions de découverte**

- **Q10.** Pourquoi une relation Eloquent n'est pas la même chose qu'une clé étrangère.
- **Q11.** Quel compromis entre deux colonnes décimales et un type spatial pour les coordonnées.
- **Q12.** Quel compromis entre enum SQL, chaîne contrainte et enum PHP.

- **GitLab imposé** — Branche `feat/3-report-schema`. Commits séparés pour migrations, modèles et documentation du modèle. Tag `v0.3.0`.
- **Docker évolutif** — Commande reproductible `migrate:fresh`. Aucune donnée MySQL dans l'image.
- **Pipeline et déploiement** — `migrate:fresh` dans le job d'intégration ; journal de migration publié en artefact seulement en cas d'échec.
- **DevLog obligatoire** — Justification des types, index, relations un-à-plusieurs, casts et stratégie de suppression ; diagrammes versionnés.
- **Validation** — Les migrations montent sur une base vide, redescendent si prévu, puis remontent dans le pipeline.

---

### Incrément 4 — Jeu de données reproductible

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.4.0` | Une base réaliste est générée sans saisie manuelle. | Une seule commande reconstruit une base cohérente et les relations se vérifient par tests. |

**Travail demandé**

- Seeders des six services, des huit catégories et de leurs services suggérés.
- Factories : un compte par rôle de démonstration (dont un agent par service), signalements dans chacun des six statuts, soutiens, rapports d'inspection, objets perdus et retrouvés.
- Reprendre les scénarios de la maquette comme jeu de démonstration : lampadaire éteint avec rapport à valider, nid-de-poule en intervention, branche tombée affectée, banc résolu.
- Cas limites : deux signalements à 90 m et à 110 m l'un de l'autre, un signalement sans GPS, un objet retrouvé avec lieu de dépôt.

**Contraintes techniques**

- Les données de test sont déterministes lorsque le scénario l'exige.
- Aucun secret ni donnée personnelle réelle ; les noms sont fictifs.
- Factories et seeders gardent des responsabilités distinctes.
- Les états impossibles (un signalement « en intervention » sans autorisation ni service) ne sont pas générables.

**Questions de découverte**

- **Q13.** Pourquoi les factories sont utiles aux tests au-delà du seeding.
- **Q14.** Quand rendre un jeu aléatoire déterministe.
- **Q15.** Comment éviter des scénarios impossibles produits par Faker.

- **GitLab imposé** — Branche `feat/4-seed-demo-data`. Commits : `test(factories): model valid states` et `feat(seed): development catalog`. Tag `v0.4.0`.
- **Docker évolutif** — La commande de bootstrap local enchaîne migration et seed explicitement. Le seed de développement n'est jamais lancé automatiquement en production.
- **Pipeline et déploiement** — Le pipeline fabrique ses propres données avec factories ; aucun artefact de base de données n'est réutilisé entre pipelines.
- **DevLog obligatoire** — Factory, state, seeder, idempotence ; deux cas limites rendus testables par les données générées.
- **Validation** — Une seule commande reconstruit une base cohérente et les relations se vérifient par tests.

---

### Incrément 5 — Authentification, rôles et périmètre de service

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.5.0` | Chaque rôle n'accède qu'à ce qui le concerne, l'agent uniquement à son service. | Une matrice de tests rôle par action confirme les accès autorisés et les refus 403. |

**Travail demandé**

- Inscription, connexion et déconnexion avec le starter kit retenu ; remplacer le sélecteur « Changer d'acteur » de la maquette par une vraie authentification.
- L'inscription crée toujours un citoyen ; l'attribution des rôles agent (avec son service) et administrateur se fait par un administrateur.
- Créer les Policies (signalement, service, utilisateur, objet) et les middlewares nécessaires ; rediriger chaque rôle vers son espace.
- Écrire la matrice d'autorisations de la section A-4 sous forme de tests.

**Contraintes techniques**

- Toute autorisation est vérifiée côté serveur, jamais seulement par l'affichage.
- Le rôle et le service ne peuvent pas être modifiés par un formulaire d'inscription ou de profil.
- Les mots de passe sont hachés et les sessions configurées par environnement.

**Questions de découverte**

- **Q16.** Quelle différence entre authentification et autorisation.
- **Q17.** Pourquoi masquer un bouton ne protège pas une route, et comment un agent pourrait atteindre le signalement d'un autre service.
- **Q18.** Quel risque crée l'assignation de masse sur un champ de rôle.

- **GitLab imposé** — Branche `feat/5-auth-roles`. Commits séparés pour authentification, policies et tests d'autorisation. Tag `v0.5.0`.
- **Docker évolutif** — Aucune évolution structurelle. Vérifier que `APP_KEY` est injecté comme secret et non versionné.
- **Pipeline et déploiement** — La matrice de tests d'autorisation rejoint la Quality Gate ; le pipeline échoue si un rôle obtient un accès interdit.
- **DevLog obligatoire** — Tableau rôle par action avec le test associé ; choix du starter kit et alternative rejetée ; traitement du périmètre par service.
- **Validation** — Une matrice de tests rôle par action confirme les accès autorisés et les refus 403.

---

### Incrément 6 — Création d'un signalement et frontière applicative

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.6.0` | Un citoyen crée un signalement valide ; les entrées invalides sont refusées avec des messages utiles. | Le service de création est testable sans requête HTTP et les dix règles de création sont couvertes. |

**Travail demandé**

- Créer le Form Request de création : formats, ensembles autorisés, longueurs, photo, coordonnées.
- Créer l'objet immuable `CreateReportData` et l'action `CreateReport` ; générer la référence `SIG-AAAA-NNNN`.
- Appliquer les règles de création ; conserver anciennes valeurs, compteur de caractères et erreurs dans Blade comme dans la maquette.
- Définir les exceptions métier (quota dépassé, catégorie inactive, position hors zone).

**Contraintes techniques**

- La validation de forme ne décide pas des règles métier (quota, catégorie active).
- Aucun objet `Request` n'entre dans une action métier.
- Les coordonnées sont converties une seule fois selon une convention documentée.
- Une exception métier ne dépend pas du texte affiché à l'utilisateur.

**Questions de découverte**

- **Q19.** Pourquoi toutes les règles ne doivent pas être placées dans un Form Request.
- **Q20.** Quelle différence entre validation syntaxique et invariant métier.
- **Q21.** Quand un DTO est utile et quand il ajoute seulement du bruit.

- **GitLab imposé** — Branche `feat/6-create-report`. Commits séparés pour Form Request, objet de données, action et tests. Tag `v0.6.0`.
- **Docker évolutif** — Vérifier que le fuseau du conteneur est cohérent avec la convention applicative.
- **Pipeline et déploiement** — Feature tests de validation et tests unitaires de conversion des objets de données dans la Quality Gate.
- **DevLog obligatoire** — Classement des règles entre forme, autorisation et métier ; passage HTTP, données validées, objet applicatif.
- **Validation** — Le service de création est testable sans requête HTTP et les dix règles de création sont couvertes.

---

### Incrément 7 — Machine à états : affectation, inspection, autorisation, résolution

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.7.0` | Le parcours à trois acteurs est gouverné par des transitions explicites et historisées. | Chaque transition autorisée ou interdite du tableau A-6 est couverte par un test, pour chaque rôle concerné. |

**Travail demandé**

- Encapsuler les transitions dans une action `TransitionReport` s'appuyant sur l'enum de statut.
- Implémenter les cinq cas d'usage : affecter, démarrer l'inspection, transmettre le rapport, autoriser les travaux ou demander un complément, marquer résolu.
- Vérifier rôle, périmètre de service, transition, motif obligatoire et service actif ; écrire l'historique dans la même transaction.
- Créer le résolveur de service suggéré à partir de la catégorie (`SuggestedServiceResolver`).

**Contraintes techniques**

- Aucun `update` direct du statut hors de l'action de transition.
- Le contrôleur ne connaît ni les transitions ni le service suggéré.
- L'ordre des contrôles est justifié : autorisation, périmètre, transition, motif.
- Le comportement d'une transition répétée est documenté (idempotence ou refus).

**Questions de découverte**

- **Q22.** Pourquoi un champ statut librement modifiable est dangereux.
- **Q23.** Quel compromis entre enum avec méthode de transitions, table de transitions et package dédié.
- **Q24.** Quel principe SOLID est visible dans la séparation entre résolveur, action et policy.

- **GitLab imposé** — Branche `feat/7-report-state-machine`. Un commit par groupe cohérent : enum et transitions, historique, résolveur de service, tests. Tag `v0.7.0`.
- **Docker évolutif** — Aucune évolution requise. Les tests métier doivent tourner dans le conteneur `app`.
- **Pipeline et déploiement** — Séparer les suites unit et integration si leur coût diffère ; publier un rapport JUnit exploitable par GitLab.
- **DevLog obligatoire** — Diagramme d'états ; chaque transition associée à un test et à un résultat ; une responsabilité déplacée hors du contrôleur.
- **Validation** — Chaque transition autorisée ou interdite est couverte par un test, pour chaque rôle concerné.

---

### Incrément 8 — Soutiens, proximité et priorité

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.8.0` | Le bouton « Moi aussi » fonctionne et le système suggère de soutenir un signalement proche plutôt que d'en créer un doublon. | Les tests distinguent proche, trop loin, autre catégorie, signalement résolu, absence de GPS et soutien répété. |

**Travail demandé**

- Implémenter le soutien et son retrait avec compteur.
- Créer la requête de recherche des signalements non résolus de même catégorie dans le rayon configuré.
- Choisir Eloquent direct, Query Object ou Repository et documenter le choix ; définir un Contract seulement s'il est justifié.
- Calculer le score et la priorité affichée ; exposer les paramètres dans `config/signalcivique.php` ; configurer les bindings dans un Service Provider.

**Contraintes techniques**

- Pas de façade globale ni de Service Locator dans les classes applicatives.
- La requête de proximité utilise un pré-filtre indexable (rectangle englobant) puis un calcul de distance précis, et est couverte par un test d'intégration MySQL.
- Le calcul de priorité est une fonction pure testable sans base.

**Questions de découverte**

- **Q25.** Comment calculer la distance entre deux points GPS et quelle précision est suffisante à cent mètres.
- **Q26.** Pourquoi un rectangle englobant accélère la recherche avant le calcul exact.
- **Q27.** Que réalise réellement le conteneur lors de l'autowiring.

- **GitLab imposé** — Branche `feat/8-support-and-proximity`. Commits : `feat(support): add report supports`, `feat(geo): detect nearby open reports`, `feat(priority): compute priority score`, `config(container): bind proximity finder`. Tag `v0.8.0`.
- **Docker évolutif** — Aucune évolution requise. Utiliser MySQL pour le test d'intégration dépendant du comportement SQL réel.
- **Pipeline et déploiement** — Job `integration` avec MySQL ; les tests unitaires restent sans base.
- **DevLog obligatoire** — Comparaison des trois stratégies d'accès aux données ; Dependency Inversion, binding et autowiring sur le cas réel ; justification du rayon et du score.
- **Validation** — Les tests distinguent proche, trop loin, autre catégorie, signalement résolu, absence de GPS et soutien répété.

---

### Incrément 9 — Interface web des trois espaces

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.9.0` | Les trois espaces de la maquette fonctionnent avec de vraies données. | Tous les parcours peuvent être démontrés et les réponses 403, 404 et 405 sont correctes. |

**Travail demandé**

- Routes nommées et route model binding ; contrôleurs minces et vues Blade avec layout et menu par rôle.
- **Espace citoyen** : tableau de bord, formulaire de nouveau signalement (catégories en tuiles, photo, position GPS), liste avec « Moi aussi », chronologie de suivi, notifications.
- **Espace agent** : « Mes interventions » avec les trois indicateurs, dossier dépliable et étapes inspection, rapport, intervention.
- **Espace administrateur** : boîte de réception avec filtres, affectation avec service suggéré présélectionné, validation des rapports, répartition par domaine, pipeline, gestion des services.
- Recherche globale limitée au périmètre de chaque rôle.
- Reprendre la charte de la maquette : fond crème, vert sauge et orange doux, contraste AA, badges de statut et de priorité.

**Contraintes techniques**

- Aucune requête Eloquent dans Blade.
- Protection CSRF sur toute mutation ; verbes HTTP conformes à l'intention.
- Messages flash sans information sensible ; pas d'email d'auteur affiché publiquement.
- Les ressources externes (polices, icônes) suivent la décision documentée à la section A-3.

**Questions de découverte**

- **Q28.** Quelle différence entre erreur de validation, conflit métier, refus d'accès et ressource absente.
- **Q29.** Pourquoi utiliser des routes nommées et le route model binding.
- **Q30.** Quand une redirection POST/Redirect/GET est utile.

- **GitLab imposé** — Branche `feat/9-web-spaces`. Commits par verticale fonctionnelle (citoyen, agent, administrateur) plutôt que par type de fichier. Tag `v0.9.0`.
- **Docker évolutif** — Ajouter un service web dédié si l'image `app` utilise PHP-FPM. Documenter ports, réseau interne et exposition publique.
- **Pipeline et déploiement** — Feature tests HTTP dans la Quality Gate ; captures ou traces de scénarios en artefacts de courte durée si utile.
- **DevLog obligatoire** — Une requête complète tracée de la route à la vue ; gestion des statuts HTTP et du CSRF ; écarts assumés entre maquette et application réelle.
- **Validation** — Tous les parcours peuvent être démontrés et les réponses 403, 404 et 405 sont correctes.

---

### Incrément 10 — Objets perdus et trouvés

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.10.0` | Les citoyens déclarent et recherchent des objets ; la mairie enregistre les objets retrouvés avec leur lieu de dépôt. | Les règles du module sont couvertes et la recherche ignore casse et accents. |

**Travail demandé**

- Modèle, migration, policies et pages du module (recherche, grille d'annonces, formulaire « Signaler un objet perdu »).
- Enregistrement par la mairie d'un objet retrouvé avec lieu de dépôt obligatoire et affichage « Voir le lieu de dépôt ».
- Recherche par mot clé sur nom, description et lieu, avec compteur de résultats.
- Contrôle du contenu affiché : aucune donnée personnelle dans les annonces publiques.

**Contraintes techniques**

- La recherche est un composant réutilisable (`app/Search`) partagé avec la recherche des signalements.
- Les annonces ne sont pas supprimées par leur auteur sans trace.
- La photo d'un objet est facultative et suit les mêmes contraintes de validation que celles des signalements.

**Questions de découverte**

- **Q31.** Comment obtenir une recherche insensible à la casse et aux accents avec MySQL, et à quel coût.
- **Q32.** Quelles données d'une annonce peuvent être publiques sans exposer une personne.
- **Q33.** Pourquoi réutiliser un composant de recherche plutôt que dupliquer la requête.

- **GitLab imposé** — Branche `feat/10-lost-and-found`. Commits : `feat(items): add lost and found model`, `feat(search): add accent-insensitive search`, `feat(items): register found items`. Tag `v0.10.0`.
- **Docker évolutif** — Aucune évolution requise ; vérifier le jeu de caractères et la collation de la base.
- **Pipeline et déploiement** — Tests de recherche (accents, casse, résultats vides) dans la Quality Gate.
- **DevLog obligatoire** — Choix de collation ou de stratégie de recherche ; règle de confidentialité et test associé.
- **Validation** — Les règles du module sont couvertes et la recherche ignore casse et accents.

---

### Incrément 11 — Stratégie de tests et qualité

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.11.0` | La non-régression est automatisée et mesurable. | Les Quality Gates sont obligatoires et les scénarios critiques sont automatisés. |

**Travail demandé**

- Compléter les tests Unit et Feature selon une pyramide justifiée.
- Couvrir les scénarios d'acceptation, les refus par rôle et par service, et les erreurs métier.
- Configurer couverture, Pint et analyse statique ; définir un seuil de couverture raisonnable et progressif.

**Contraintes techniques**

- Les tests sont indépendants, reproductibles et lisibles.
- Pas de test qui dépend de l'ordre d'exécution.
- Les données sont créées par factories ou builders.

**Questions de découverte**

- **Q34.** Qu'est-ce qui rend un test unitaire plutôt qu'un test d'intégration.
- **Q35.** Pourquoi cent pour cent de couverture ne garantit pas la qualité.
- **Q36.** Quels tests apportent la meilleure protection contre une régression métier.

- **GitLab imposé** — Branche `test/11-complete-quality-strategy`. Commits par famille de scénarios et configuration qualité. Tag `v0.11.0`.
- **Docker évolutif** — Cible `test` identique pour poste local et pipeline ; éviter qu'un bind mount masque les dépendances installées dans l'image CI.
- **Pipeline et déploiement** — Stages `validate`, `quality`, `test`, `integration`. Rapports JUnit et couverture exposés dans GitLab. La Merge Request est bloquée si un job requis échoue.
- **DevLog obligatoire** — Pyramide retenue et doublures utilisées ; analyse d'une régression que la suite aurait détectée.
- **Validation** — Les Quality Gates sont obligatoires et les scénarios critiques sont automatisés.

---

### Incrément 12 — Transaction et concurrence

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.12.0` | Deux traitements simultanés incompatibles ne peuvent pas aboutir tous les deux. | Un scénario simultané démontre qu'une seule affectation est retenue, qu'un soutien n'est compté qu'une fois et que deux références ne sont jamais identiques. |

**Travail demandé**

- Identifier les fenêtres de course : deux administrateurs affectent le même signalement, un rapport est transmis deux fois, un citoyen soutient deux fois en parallèle, deux signalements reçoivent la même référence.
- Encapsuler l'opération critique dans une transaction avec verrouillage de la ligne du signalement ou contrôle de version.
- Appuyer l'unicité des soutiens et des références sur des contraintes de base, pas seulement sur une vérification préalable.
- Créer un test ou scénario reproductible de concurrence et un retour utilisateur clair pour le perdant.

**Contraintes techniques**

- La solution ne repose pas uniquement sur une lecture avant écriture.
- Les limites du verrouillage retenu sont documentées.
- Le traitement des deadlocks ou reprises est explicite.

**Questions de découverte**

- **Q37.** Pourquoi une transaction seule ne supprime pas nécessairement la course.
- **Q38.** Quelle donnée sert de point de verrouillage stable et pourquoi.
- **Q39.** Comment générer une référence séquentielle par année sans doublon sous charge.

- **GitLab imposé** — Branche `fix/12-prevent-concurrent-transitions`. Commits : `test(workflow): reproduce transition race` puis `fix(workflow): lock report during transition`. Tag `v0.12.0`.
- **Docker évolutif** — Configurer MySQL avec le moteur et le niveau d'isolation documentés ; le scénario concurrent tourne avec la même famille de base qu'en production.
- **Pipeline et déploiement** — Job de test de concurrence, éventuellement non parallèle avec lui-même ; journaux conservés en artefact en cas d'échec.
- **DevLog obligatoire** — Chronologie de la course ; transaction, isolation, verrou, deadlock et stratégie de reprise.
- **Validation** — Un scénario simultané démontre qu'une seule affectation est retenue, qu'un soutien n'est compté qu'une fois et que deux références ne sont jamais identiques.

---

### Incrément 13 — Photos, notifications, événements et cache

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.13.0` | Les photos sont stockées dans MinIO, chaque acteur concerné est notifié après chaque changement et les tableaux de bord sont servis depuis Redis. | Photos, notification unique après commit, cache hit et invalidation sont prouvés par des tests. |

**Travail demandé**

- Ajouter la gestion des photos de signalement ; comparer disque local, BLOB MySQL et MinIO ; retenir MinIO avec un disque Laravel dédié.
- Valider type MIME réel, taille et nombre de fichiers ; supprimer une photo sans laisser d'objet orphelin.
- Créer des scopes locaux composables : signalements ouverts, par service, par catégorie, en attente de rapport.
- Créer `ReportStatusChanged` publié après commit à partir d'un Observer, avec des Listeners : `NotifyConcernedUsers` (selon le tableau de la section A-6) et `InvalidateDashboardCache`.
- Mettre en cache les indicateurs des tableaux de bord dans Redis avec TTL et invalidation après toute mutation.

**Contraintes techniques**

- Le contrôleur lit `config('signalcivique…')` et jamais `env()`.
- MinIO n'est pas un répertoire public anonyme : les photos passent par URL temporaire ou flux autorisé.
- Le cache contient des données, jamais une URL signée au-delà de sa validité.
- Observer, Event et Listener n'hébergent pas les règles métier principales.
- Les Listeners sont idempotents : une transition produit une seule notification par destinataire.

**Questions de découverte**

- **Q40.** Quels avantages et limites présentent disque local, BLOB MySQL et MinIO pour la sauvegarde et la montée en charge.
- **Q41.** Quelle différence entre scope local, scope global et méthode de relation.
- **Q42.** Pourquoi un événement envoyé avant la validation de la transaction peut annoncer une opération finalement annulée.

- **GitLab imposé** — Branche `feat/13-media-events-cache`. Commits suggérés : `feat(media): add photo model`, `build(minio): add object storage`, `feat(media): upload validated photos`, `feat(events): dispatch status changes after commit`, `feat(notifications): notify concerned users`, `perf(dashboard): cache indicators`. La Merge Request contient la matrice de décision de stockage, les tests, le DevLog et les preuves MinIO et Redis. Tag `v0.13.0`.
- **Docker évolutif** — Ajouter MinIO et Redis à Docker Compose (volumes nommés, healthchecks, réseau privé), une commande reproductible créant le bucket et sa politique, et distinguer l'endpoint interne de l'URL publique. Les photos restent hors de l'image et du dépôt.
- **Pipeline et déploiement** — MySQL, MinIO et Redis démarrés dans le job d'intégration avec vérification de santé ; bucket de test isolé par pipeline et nettoyé même après échec ; aucune clé MinIO dans les logs ou artefacts.
- **DevLog obligatoire** — Comparaison des trois stockages ; scopes locaux et globaux, Observer, Event, Listener, dispatch après commit, Redis, TTL et invalidation ; échec partiel MySQL et MinIO et compensation retenue ; preuves du cache hit et de l'invalidation.
- **Validation** — Photos, notification unique après commit, cache hit et invalidation sont prouvés par des tests.

---

### Incrément 14 — Déploiement continu du code

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.14.0` | Le commit validé est déployé automatiquement en staging depuis le code source. | Un commit fusionné est déployé en staging, testé puis restaurable par procédure documentée. |

**Travail demandé**

- Préparer un serveur de staging avec runtime, dépendances et configuration sécurisée.
- Déployer l'archive ou le checkout du commit validé ; installer les dépendances de production ; exécuter migrations et caches Laravel.
- Ajouter healthcheck, journal de déploiement et procédure de rollback.

**Contraintes techniques**

- Le déploiement utilise l'identifiant exact du commit.
- Les secrets sont des variables GitLab protégées et masquées.
- Le job de production futur restera manuel et protégé.
- Les migrations sont compatibles avec un déploiement sans perte.

**Questions de découverte**

- **Q43.** Pourquoi `composer install` est utilisé et non `composer update`.
- **Q44.** Quelle différence entre artefact de pipeline et workspace du runner.
- **Q45.** Dans quel ordre exécuter maintenance, migrations, caches et redémarrage.

- **GitLab imposé** — Branche `ci/14-deploy-source-to-staging`. Commits séparés pour pipeline, script de déploiement et runbook. Tag `v0.14.0` et Environment GitLab `staging`.
- **Docker évolutif** — L'environnement local reste inchangé ; documenter le décalage possible entre runtime serveur et runtime conteneurisé.
- **Pipeline et déploiement** — Pipeline : `validate`, `quality`, `test`, `package`, `deploy staging`, `smoke`. Déploiement seulement depuis `main` après succès des Quality Gates. Job `rollback` manuel et smoke test HTTP obligatoire.
- **DevLog obligatoire** — Graphe du pipeline, preuve d'environnement, temps de reprise ; sécurité des variables et panne simulée.
- **Validation** — Un commit fusionné est déployé en staging, testé puis restaurable par procédure documentée.

---

### Incrément 15 — Image immuable et registre GitLab

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v0.15.0` | Une image de production testée est publiée puis déployée sans reconstruction. | Le digest testé est celui du conteneur déployé et un rollback vers le digest précédent est démontré. |

**Travail demandé**

- Créer un Dockerfile multi stage avec dépendances de production, exécuté par un utilisateur non root.
- Publier l'image dans GitLab Container Registry avec SHA et version.
- Déployer en staging exactement le digest validé puis exécuter un smoke test.

**Contraintes techniques**

- Aucun secret dans les layers.
- Image minimale, healthcheck et politique de logs documentés.
- `latest` n'est jamais l'unique référence de déploiement.
- *Build once, deploy many.*

**Questions de découverte**

- **Q46.** Quelle différence entre tag d'image mutable et digest immuable.
- **Q47.** Pourquoi copier `composer.lock` avant le code améliore le cache.
- **Q48.** Que doit contenir une image et que doit fournir l'environnement.

- **GitLab imposé** — Branche `ci/15-publish-immutable-image`. Commits : `build(docker): add production stages` puis `ci(registry): publish and deploy digest`. Tag `v0.15.0`.
- **Docker évolutif** — Stages Composer, assets si nécessaires, runtime PHP et serveur ; `.dockerignore`, utilisateur dédié, permissions minimales ; fichier Compose de production ou manifeste équivalent.
- **Pipeline et déploiement** — Jobs : image build, image scan si disponible, image push, deploy staging, smoke. Promotion en production par job manuel protégé utilisant le même digest ; rollback par redéploiement du digest précédent.
- **DevLog obligatoire** — Comparaison entre déploiement du code et déploiement de l'image ; taille, layers, cache, sécurité, digest et rollback.
- **Validation** — Le digest testé est celui du conteneur déployé et un rollback vers le digest précédent est démontré.

---

### Incrément 16 — Release finale

| Version cible | Résultat observable | Condition de passage |
|---|---|---|
| `v1.0.0` | La version stable est documentée, traçable, déployable et démontrable. | La release `v1.0.0` est reproductible depuis un clone et toutes les preuves demandées sont disponibles. |

**Travail demandé**

- Exécuter tous les scénarios d'acceptation.
- Finaliser README, architecture, exploitation, sécurité et décisions ; consolider le CHANGELOG et publier la GitLab Release.
- Réaliser une démonstration du parcours complet (signalement, affectation, inspection, rapport, autorisation, intervention, résolution), du module d'objets, du pipeline et des deux modes de déploiement.

**Contraintes techniques**

- Aucun correctif direct sur `main`.
- Le tag final est créé depuis le commit validé.
- Les preuves sont accessibles sans exposer de secret.

**Questions de découverte**

- **Q49.** Quels choix seraient conservés ou modifiés pour une deuxième version.
- **Q50.** Quelle dette technique demeure et quel risque porte-t-elle.
- **Q51.** Comment prouver qu'un binaire déployé correspond à une source auditée.

- **GitLab imposé** — Branche `release/1.0.0`. Commits finaux limités à documentation, corrections bloquantes et version. Tag annoté `v1.0.0` et Release avec notes générées puis relues.
- **Docker évolutif** — Figer les images par digest et conserver les versions utiles ; documenter sauvegarde, restauration et rotation des journaux.
- **Pipeline et déploiement** — Pipeline du tag : Quality Gates, image, publication, déploiement staging et approbation production manuelle et protégée, avec smoke test et rollback.
- **DevLog obligatoire** — Synthèse finale reliant les seize apprentissages ; métriques, incidents, arbitrages, dette et plan de suite.
- **Validation** — La release `v1.0.0` est reproductible depuis un clone et toutes les preuves demandées sont disponibles.

---

## C — Stratégie GitLab imposée

| Élément | Convention |
|---|---|
| Branche stable | `main` protégée, sans push direct |
| Branche de travail | `feat/n-sujet`, `fix/n-sujet`, `ci/n-sujet`, `docs/n-sujet` |
| Merge Request | Liée à une Issue, petite, relue et pipeline vert |
| Fusion | Squash autorisé selon convention d'équipe, suppression de la branche |
| Hotfix | Branche `fix` depuis `main`, même Quality Gate, nouveau patch tag |

**Commits**

- Format Conventional Commits : `type(portée): description`.
- Un commit correspond à une intention testable et réversible.
- Les commits de formatage massif sont séparés des changements fonctionnels.
- Les messages tels que « update », « fix bug » ou « travail » sont refusés.

**Tags et releases** — Chaque incrément fusionné reçoit un tag annoté. Les versions 0.x matérialisent la progression pédagogique. La version 1.0.0 correspond au périmètre accepté. Toute correction après release incrémente le patch.

**Definition of Done de toute Merge Request**

- [ ] Issue et critères d'acceptation renseignés.
- [ ] Code, tests et documentation synchronisés.
- [ ] Pipeline vert et absence de secret.
- [ ] DevLog de l'incrément présent.
- [ ] Review checklist complétée.
- [ ] Tag créé uniquement après fusion sur `main`.

---

## D — Stratégie Docker évolutive

| Jalon | Évolution | Intention pédagogique |
|---|---|---|
| v0.1.0 | Image PHP Composer de développement | Comprendre image, conteneur et bind mount |
| v0.2.0 | Compose app, MySQL, réseau, volume, healthcheck | Rendre l'environnement reproductible |
| v0.3.0 à v0.11.0 | Commandes migrate, seed, test et qualité | Aligner poste local et CI |
| v0.12.0 | Configuration MySQL réaliste pour concurrence | Tester le comportement transactionnel |
| v0.13.0 | MinIO, Redis, bucket | Ajouter stockage objet et cache |
| v0.14.0 | Le déploiement du code reste volontairement distinct | Observer les limites du runtime serveur |
| v0.15.0 | Dockerfile multi stage de production et Registry | Construire un artefact immuable |
| v1.0.0 | Promotion par digest, rollback et exploitation | Garantir la traçabilité |

**Règles permanentes**

- Aucun secret n'est copié dans l'image.
- Les données et les photos sont externes aux conteneurs applicatifs.
- Le processus de production n'est pas root.
- Les images ont un tag SHA et, pour les releases, un tag sémantique.
- Les commandes de développement et de CI utilisent les mêmes scripts de projet.
- Le healthcheck vérifie un état utile (base joignable) et non la simple existence d'un processus.

---

## E — Pipeline et déploiement

| Stage | Responsabilité | Déclenchement |
|---|---|---|
| `validate` | Composer validate, contrôles de structure et sécurité basique | Toutes branches et Merge Requests |
| `quality` | Pint check et analyse statique | Toutes Merge Requests |
| `test` | Tests unitaires et Feature avec rapports | Toutes Merge Requests |
| `integration` | MySQL, puis MinIO et Redis à partir de v0.13.0 | Toutes Merge Requests |
| `package` | Archive de code puis image OCI selon le jalon | `main` et tags |
| `deploy staging` | Déployer automatiquement l'artefact validé | `main` |
| `smoke` | Vérifier santé et parcours minimal (accueil, connexion, liste des signalements) | Après déploiement |
| `deploy production` | Promouvoir l'artefact déjà testé | Tag stable et approbation manuelle |
| `rollback` | Redéployer la version précédente | Action manuelle protégée |

**Déploiement du code** — Le pipeline transfère le code ou un artefact source vers le serveur, installe les dépendances de production, prépare les caches Laravel, applique les migrations et redémarre le service. Cette stratégie met en évidence la dépendance au runtime du serveur.

**Déploiement par image** — Le pipeline construit une image une seule fois, la teste, la publie dans le registre puis déploie son digest. La production promeut exactement le même artefact que le staging. La configuration et les secrets restent externes.

> **Règle de promotion** — Une étape de production ne reconstruit jamais l'application. Elle promeut un artefact déjà testé.

---

## F — DevLog obligatoire

Un fichier Markdown par version dans `docs/devlogs`, nommé avec le tag, par exemple `v0.8.0.md`.

| Rubrique | Contenu attendu |
|---|---|
| Objectif | Problème traité et résultat observable |
| Concepts | Notions rencontrées et définition dans le contexte du projet |
| Choix | Décision, alternatives, avantages et limites |
| Implémentation | Éléments essentiels sans recopier tout le code |
| Problèmes | Symptôme, hypothèses, diagnostic, correction et preuve |
| Tests | Scénarios, résultats et limites |
| GitLab | Issue, Merge Request, pipeline, commits et tag |
| Docker | Évolution de l'environnement et commandes de vérification |
| Déploiement | Artefact, environnement, smoke test et rollback si applicable |
| Bilan | Dette, amélioration et apprentissage personnel |

**Critères de qualité**

- Le DevLog explique les décisions plutôt que de décrire une liste de fichiers.
- Les captures sont accompagnées d'une interprétation.
- Un échec réel et sa résolution sont décrits honnêtement.
- Les liens et identifiants rendent les preuves vérifiables.
- Le vocabulaire technique est utilisé avec précision.

---

## G — Scénarios d'acceptation

| N° | Scénario | Résultat attendu |
|---|---|---|
| 1 | Signalement valide avec photo et lieu | Création au statut « Signalement reçu », référence unique générée, administrateurs notifiés |
| 2 | Catégorie inactive, photo absente ou position hors zone | Refus |
| 3 | Titre ou description invalides | Erreurs affichées, données conservées, aucune insertion |
| 4 | Sixième signalement du même citoyen dans la journée | Refus métier |
| 5 | Signalement à moins de 100 m d'un signalement non résolu de même catégorie | Suggestion de soutien ; création possible après confirmation explicite |
| 6 | Signalement sans GPS, ou à plus de 100 m, ou existant résolu | Aucune suggestion |
| 7 | Un même citoyen clique deux fois sur « Moi aussi » | Un seul soutien compté |
| 8 | Un citoyen tente d'affecter ou d'autoriser | Réponse 403 |
| 9 | L'administrateur affecte un signalement | Service suggéré présélectionné, historique enregistré, agents du service et auteur notifiés |
| 10 | Affectation à un service différent du suggéré sans motif | Refus |
| 11 | Un agent tente d'ouvrir le signalement d'un autre service | Refus, même avec l'identifiant exact |
| 12 | L'agent démarre l'inspection puis transmet un rapport vide | Refus du rapport vide ; rapport valide accepté et administrateurs notifiés |
| 13 | Transition interdite (par exemple « reçu » vers « résolu ») | Refus métier |
| 14 | L'administrateur autorise les travaux | Statut « Intervention en cours », auteur et date d'autorisation enregistrés, agent et citoyen notifiés |
| 15 | L'administrateur renvoie un rapport sans motif | Refus ; avec motif, retour à « Inspection en cours » |
| 16 | L'agent marque résolu | Statut « Résolu », auteur et soutiens notifiés |
| 17 | Identifiant inexistant ; verbe HTTP non autorisé | 404 ; 405 avec méthodes permises |
| 18 | Deux administrateurs affectent en même temps le même signalement | Une seule affectation retenue, l'autre reçoit un conflit |
| 19 | Photo valide, puis fichier interdit ou trop volumineux | Objet MinIO et métadonnées créés ; refus sans objet orphelin |
| 20 | Objet perdu déclaré, objet retrouvé enregistré, recherche avec accents et casse différents | Annonces trouvées, lieu de dépôt affiché, aucune donnée personnelle publique |
| 21 | Changement de statut validé | Notifications exécutées une seule fois par destinataire après commit |
| 22 | Second affichage du tableau de bord, puis transition | Indicateurs servis depuis le cache, puis cache invalidé |
| 23 | Déploiement staging par code, puis par digest | Smoke test vert et version traçable ; digest testé égal au digest exécuté |
| 24 | Rollback | Retour à la version précédente vérifié |

> **Preuve attendue** — Chaque scénario est associé à un test automatisé lorsque cela est pertinent. Les scénarios de déploiement sont prouvés par les jobs GitLab, l'état de l'environnement, un smoke test et le DevLog.

---

## H — Livrables

- Dépôt GitLab complet avec Issues, Merge Requests, branches supprimées après fusion et tags annotés.
- Code source Laravel, `composer.lock` et fichiers de configuration non sensibles.
- Maquette de référence versionnée dans `docs/maquette`.
- Migrations, factories, seeders et diagrammes (classes, relationnel, états).
- Service MinIO, bucket reproductible, cache Redis et tests des photos.
- Tests et rapports de qualité, dont la matrice d'autorisation par rôle et par service.
- Dockerfile de développement puis Dockerfile multi stage de production.
- Fichiers Compose et scripts d'exploitation.
- Pipeline GitLab CI/CD fonctionnel.
- Environnement de staging et procédure de production.
- DevLog de chaque incrément.
- `README`, `ARCHITECTURE.md`, `DEPLOYMENT.md`, `SECURITY.md` et `CHANGELOG.md`.
- Release GitLab `v1.0.0` et image publiée dans le Container Registry.

**Documents d'architecture à produire**

- Cycle d'une requête Laravel.
- Diagramme de classes et schéma relationnel.
- Diagramme d'états du signalement et matrice des transitions par rôle.
- Décisions d'accès aux données et d'injection.
- Matrice de décision sur le stockage des photos.
- Diagramme expliquant scopes, Observer, Events, Listeners et notifications.
- Séquence de traitement d'un signalement à trois acteurs et mécanisme de concurrence.
- Architecture des conteneurs.
- Graphe du pipeline et flux de promotion des artefacts.

---

## I — Évaluation

| Axe | Poids | Indicateurs |
|---|---|---|
| Fonctionnel et règles métier | 25 % | Signalement, workflow à trois acteurs, objets perdus et trouvés, notifications |
| Architecture Laravel | 20 % | Responsabilités, rôles, policies et périmètre de service, injection, lisibilité |
| Données et concurrence | 15 % | Migrations, requête de proximité, transaction, verrouillage |
| Tests et qualité | 15 % | Pertinence, reproductibilité, Quality Gates |
| GitLab et versionnement | 10 % | Commits, MR, tags, releases, traçabilité |
| Docker et CI/CD | 10 % | Évolution, image, déploiements, rollback |
| DevLogs et justification | 5 % | Analyse, précision, preuves |

**Conditions éliminatoires techniques**

- Secrets versionnés ou inclus dans une image.
- Contrôle d'accès réalisé uniquement en masquant des éléments dans les vues, ou périmètre de service non vérifié côté serveur.
- Statut d'un signalement modifiable par un `update` direct contournant l'action de transition.
- Règles métier uniquement dans un contrôleur ou une vue.
- Push direct sur `main` pour contourner une Merge Request.
- Tags ne pointant pas sur les commits annoncés.
- Pipeline ou déploiement simulé sans preuve reproductible.

**Bonus après v1.0.0**

- Planification des inspections avec un calendrier réel (la maquette en montre un décoratif).
- Confirmation de la résolution par le citoyen, réouverture, rejet et doublons.
- Restitution d'un objet et rapprochement automatique entre objets perdus et retrouvés.
- API JSON versionnée et documentation OpenAPI.
- Notifications par email, SMS ou WhatsApp, envoyées de façon asynchrone avec queue.
- Carte interactive des signalements et carte de chaleur par quartier.
- Interface en français et en wolof.
- Observabilité avec logs structurés, métriques et traces.
- Déploiement blue-green ou canary ; analyse de vulnérabilités, SBOM et signature d'image.

---

## J — Questions de synthèse

- **Q52.** Décrire le trajet complet d'un signalement, de sa création à sa résolution, en nommant l'acteur de chaque étape.
- **Q53.** Distinguer validation HTTP, autorisation par rôle, autorisation par service, invariant métier et contrainte de base.
- **Q54.** Expliquer pourquoi le contrôleur ne doit décider ni des transitions ni du périmètre de l'agent.
- **Q55.** Justifier l'usage ou l'absence d'un Repository avec Eloquent.
- **Q56.** Comparer stockage local, BLOB MySQL et stockage objet MinIO pour les photos.
- **Q57.** Expliquer le cycle de vie du cache des tableaux de bord et la différence entre TTL et invalidation explicite.
- **Q58.** Distinguer scope local, scope global, Observer, Event et Listener sur des exemples du projet.
- **Q59.** Expliquer comment un paramètre comme le rayon de proximité traverse `.env` et `config/signalcivique.php`.
- **Q60.** Expliquer comment le conteneur Laravel applique l'inversion de contrôle.
- **Q61.** Justifier la formule de proximité et son pré-filtre sur quatre exemples de distances.
- **Q62.** Expliquer pourquoi une transaction seule peut être insuffisante pour deux affectations simultanées.
- **Q63.** Comparer test unitaire, Feature test et test d'intégration MySQL.
- **Q64.** Comparer déploiement du code et déploiement d'une image.
- **Q65.** Prouver la correspondance entre commit, tag, image et version déployée.
- **Q66.** Présenter une dette technique et le prochain incrément qui la réduirait.

> **Résultat attendu** — Un étudiant ayant terminé le parcours doit être capable de reprendre une application Laravel existante, de localiser chaque responsabilité, d'ajouter un cas d'usage testé et de le livrer par une chaîne automatisée sans dégrader la traçabilité.