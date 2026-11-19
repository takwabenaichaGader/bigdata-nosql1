# ISIMA — Évaluation interactive Big Data

**Licence IoT 1 GLSI · Université de Monastir · 2026–2027**  
**Enseignante : [Dr. Ing. Takwa BEN AÏCHA GADER](https://www.doyoubuzz.com/takwa-ben-aicha-gder)**

Application Web pédagogique **frontend + backend** prête à publier depuis un dépôt GitHub. L'évaluation est formative, dure **30 minutes** et comprend **12 questions pour 20 points** : choix unique, choix multiples, réponses courtes, argumentations et écriture d'une requête MongoDB.

## 1. Aperçu fonctionnel

- Page d'accueil institutionnelle avec logos ISIMA et Université de Monastir.
- 4 blocs de compétences ; 12 questions liées aux diapositives du support de cours.
- 1 illustration d'accueil créée spécifiquement et **7 diagrammes vectoriels SVG** dessinés pour les explications.
- Indices facultatifs ; réponse soumise une fois ; correction **sur place** et note partielle pour certains exercices.
- Timer de 30 minutes, progression, navigation libre, état conservé dans `localStorage` lors d'un rechargement.
- Bilan final détaillé, export CSV individuel et impression navigateur.
- Correction par **API serveur**, aucune bonne réponse n'est embarquée dans le frontend.
- **Aucune collecte ni stockage serveur** du nom ou des réponses : le bilan est conservé uniquement dans le navigateur de l'étudiant.

## 2. Démarrage local

**Prérequis : Node.js 20 ou version plus récente.** Aucune dépendance npm externe.

```bash
npm install
npm start
```

Ouvrir **http://localhost:3000** dans le navigateur. `npm run dev` relance le serveur automatiquement pendant le développement.

Tests :

```bash
npm test
```

Points de contrôle :

- `http://localhost:3000/api/health` — état du serveur
- `http://localhost:3000/api/quiz` — banque publique sans corrigé
- `POST /api/grade` — corrige une question avec `{"questionId":"q01","answer":"a"}`

## 3. Déploiement depuis GitHub avec Render (frontend + backend)

**Pourquoi pas GitHub Pages seul ?** GitHub Pages héberge uniquement les fichiers statiques : il n'exécute pas le backend Node.js nécessaire à la correction côté serveur. Le parcours ci-dessous utilise **GitHub comme dépôt** et **Render comme hébergeur** d'une seule application full-stack.

1. Sur GitHub, créer un nouveau dépôt, par exemple `isima-bigdata-evaluation`. Choisir de préférence **Private** : les bonnes réponses sont dans le code serveur du dépôt.
2. Décompresser l'archive, puis charger **tous les fichiers de ce dossier** à la racine du dépôt. Ne pas placer le dossier englobant lui-même comme un sous-dossier du dépôt.
3. Dans [Render Dashboard](https://dashboard.render.com/), sélectionner **New > Web Service** et connecter le compte GitHub.
4. Choisir le dépôt, puis la configuration Node : **Build Command** `npm install --omit=dev` et **Start Command** `npm start`. Le fichier `render.yaml` peut également être utilisé pour un Blueprint.
5. Choisir le plan adapté à l'utilisation et lancer le déploiement. Render fournira une adresse `https://...onrender.com` à transmettre aux étudiants.
6. Visiter `/api/health` à cette adresse, puis tester une question et sa correction.

Le serveur écoute automatiquement sur `process.env.PORT` et sur `0.0.0.0`, conformément aux contraintes d'hébergement. Les pushes vers la branche connectée redéploient le site.

**Attention au plan Render gratuit :** il peut mettre l'instance en sommeil après 15 minutes sans requête. Effectuez un premier accès avant la séance pour éviter le délai de réveil et choisissez une offre sans veille si la disponibilité doit être garantie.

Références de déploiement :
- https://render.com/docs/deploy-node-express-app
- https://render.com/docs/web-services
- https://render.com/docs/your-first-deploy
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## 4. Organisation des fichiers

```text
public/
  index.html              Interface HTML accessible
  styles.css              Direction artistique, desktop et mobile
  app.js                  Navigation, minuteur, état, export du bilan
  assets/
    logo-isima.png         Logo fourni par l'enseignante
    logo-universite-monastir.png
    hero-relations.png     Illustration originale générée
    *.svg                  Sept schémas vectoriels pédagogiques
src/
  question-bank.js        Questions, bonnes réponses et explications (privé serveur)
  grader.js               Moteur de correction déterministe
server.js                 Serveur HTTP Node.js (static + endpoints)
render.yaml               Déploiement Render depuis GitHub
.github/workflows/tests.yml   Tests automatisés GitHub Actions
tests/grading.test.js     Tests de correction
make_diagrams.py          Générateur des schémas SVG
GUIDE_ENSEIGNANTE.md      Justification pédagogique et barème
PROMPT_REUTILISABLE.md    Cahier des charges réutilisable
```

## 5. Périmètre scientifique

Les questions sont ancrées dans le cours joint « **Partif deja vue.pdf** » : les pages 6 et 45–47 expliquent respectivement le rôle des jointures relationnelles et la gestion des relations MongoDB (*Embedding* / *Referencing*). Les pages 49–53 permettent de travailler les requêtes, tris et index associés. Le langage d'agrégation `$lookup` **n'est pas au programme évalué ici**, car il ne figure pas dans la partie transmise.

## 6. Limites et confidentialité

- **Évaluation formative, non certifiante** : pas de comptes, pas de base de résultats, pas de garantie anti-triche.
- Les données de réponses sont dans `localStorage` et restent modifiables localement : ne pas considérer le CSV comme un procès-verbal inviolable.
- La notation des textes est fondée sur des **critères reconnus automatiquement** et peut ne pas reconnaître une paraphrase pourtant correcte. Une validation enseignante reste possible.
- Les réponses corrigées sont envoyées au backend, mais **ne sont pas enregistrées** par le serveur ; les noms restent côté navigateur.
- Les **fichiers sources d'un dépôt public** sont accessibles : utiliser un dépôt privé si la confidentialité des corrigés est importante.
- Le minuteur s'appuie sur le navigateur et sur son horloge ; un contrôle officiel nécessite authentification, base de données et temps vérifié côté serveur.

---

© ISIMA — usage pédagogique. Logos institutionnels fournis par l'enseignante.
