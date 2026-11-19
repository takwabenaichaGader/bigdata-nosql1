'use strict';
// Banque de questions privée au serveur : ne jamais copier ce fichier dans public/.
// Couverture : support « Partif deja vue.pdf », 53 pages, cours NoSQL (2026–2027).
const sections = [
  {id:'fondements', title:'01 — Comprendre les relations', subtitle:'SQL, collections et identifiants', color:'indigo'},
  {id:'modeliser', title:'02 — Choisir une modélisation', subtitle:'Embedding ou Referencing', color:'teal'},
  {id:'interroger', title:'03 — Retrouver les bons avis', subtitle:'Requêtes, tri et index', color:'amber'},
  {id:'fiabiliser', title:'04 — Construire une solution fiable', subtitle:'Intégrité et décisions', color:'blue'}
];
const questions = [
  { id:'q01', section:'fondements', type:'single', points:1, minutes:1.5,
    tag:'Compréhension · SQL', visual:'sql-join.svg',
    title:'Quel est le rôle d’une jointure SQL ?',
    context:'Une université conserve ses étudiants et ses inscriptions dans deux tables distinctes.',
    prompt:'Quelle affirmation décrit correctement une jointure relationnelle ?',
    options:[
      {id:'a',text:'Elle rapproche des lignes de plusieurs tables selon une condition de correspondance.'},
      {id:'b',text:'Elle supprime automatiquement les identifiants communs.'},
      {id:'c',text:'Elle remplace toutes les tables par une collection de documents JSON.'},
      {id:'d',text:'Elle impose que toutes les données soient sur un seul serveur.'}
    ], answer:'a', hint:'Pensez à la colonne qui relie une inscription à son étudiant.',
    explanation:'En SQL, JOIN permet d’associer des lignes selon une condition (souvent une clé primaire et une clé étrangère). Cela ne suppose ni MongoDB ni un serveur unique.',
    expected:'Relier les lignes de tables selon une condition de jointure.', source:'Pages 2 et 6 du cours.'
  },
  { id:'q02', section:'fondements', type:'multi', points:2, minutes:2,
    tag:'Analyse · NoSQL', visual:'relation-1n.svg',
    title:'Un produit et ses avis : quelles affirmations sont justes ?',
    context:'Un catalogue contient le produit _id: 101 ; trois avis différents comportent chacun productId: 101.',
    prompt:'Sélectionnez toutes les affirmations exactes.',
    options:[
      {id:'a',text:'Les trois avis peuvent être des documents autonomes de la collection reviews.'},
      {id:'b',text:'productId: 101 constitue une référence logique au produit _id: 101.'},
      {id:'c',text:'MongoDB crée automatiquement une contrainte de clé étrangère entre ces champs.'},
      {id:'d',text:'Une relation 1:N peut être représentée sans intégrer tous les avis dans le produit.'}
    ], answer:['a','b','d'], hint:'Distinguez la relation logique et la vérification automatique d’une clé étrangère.',
    explanation:'Le Referencing stocke les avis dans une collection séparée. productId lie logiquement les documents, mais MongoDB ne crée pas automatiquement une contrainte référentielle comme une FK SQL.',
    expected:'A, B et D.', source:'Pages 45–47 du cours.'
  },
  { id:'q03', section:'fondements', type:'short', points:1, minutes:1.5,
    tag:'Pratique · Vocabulaire', visual:'relation-1n.svg',
    title:'Identifier le champ de référence',
    context:'Le produit possède _id: 101 ; un avis indique { _id: 501, productId: 101, rating: 5 }.',
    prompt:'Écrivez uniquement le nom du champ qui relie cet avis au produit.',
    placeholder:'Nom du champ…', answer:['productId'], hint:'Il contient la même valeur que le _id du produit, mais ce n’est pas le _id de l’avis.',
    explanation:'productId porte l’identifiant du produit concerné. Le _id de l’avis identifie l’avis lui-même.',
    expected:'productId', source:'Page 46 du cours.'
  },
  { id:'q04', section:'modeliser', type:'single', points:1, minutes:1.5,
    tag:'Application · Embedding', visual:'embedding.svg',
    title:'Où stocker la mémoire et le disque d’un ordinateur ?',
    context:'Chaque fiche produit est presque toujours consultée avec ses caractéristiques techniques fixes.',
    prompt:'Quel modèle est le plus naturel pour specs: { ram: 32, ssd: 1000 } ?',
    options:[
      {id:'a',text:'Intégrer specs dans le document product (Embedding).'},
      {id:'b',text:'Créer une collection indépendante par caractéristique.'},
      {id:'c',text:'Stocker les caractéristiques dans un avis client.'},
      {id:'d',text:'Copier systématiquement specs dans toutes les commandes.'}
    ], answer:'a', hint:'Les données petites, bornées et lues avec leur parent sont de bonnes candidates à l’imbrication.',
    explanation:'Les spécifications bornées et fréquemment lues avec le produit peuvent être imbriquées dans le même document : une lecture restitue la fiche complète.',
    expected:'Embedding de specs dans le produit.', source:'Page 45 du cours.'
  },
  { id:'q05', section:'modeliser', type:'multi', points:2, minutes:2,
    tag:'Analyse · Referencing', visual:'referencing.svg',
    title:'Pourquoi conserver les avis à part ?',
    context:'Un produit populaire peut recevoir des dizaines de milliers d’avis, ajoutés quotidiennement et affichés dix par dix.',
    prompt:'Quelles raisons justifient une collection reviews séparée ?',
    options:[
      {id:'a',text:'Éviter un tableau d’avis qui grandit sans limite dans le produit.'},
      {id:'b',text:'Filtrer, trier et paginer les avis indépendamment de la fiche produit.'},
      {id:'c',text:'Garantir automatiquement l’intégrité référentielle sans logique applicative.'},
      {id:'d',text:'Faciliter les ajouts d’avis sans faire grossir le document produit.'}
    ], answer:['a','b','d'], hint:'Demandez-vous quelles données croissent sans borne et sont consultées séparément.',
    explanation:'La forte cardinalité et la pagination des avis justifient souvent le Referencing. Leur lien doit néanmoins être contrôlé par l’application.',
    expected:'A, B et D.', source:'Pages 46–47 du cours.'
  },
  { id:'q06', section:'modeliser', type:'written', points:3, minutes:4,
    tag:'Argumentation · 3 critères', visual:'embedding-versus-referencing.svg',
    title:'Deux données, deux décisions de modélisation',
    context:'La plateforme commercialise des ordinateurs. Chaque ordinateur possède des caractéristiques fixes (RAM, SSD) et peut recevoir un nombre croissant d’avis clients.',
    prompt:'En deux ou trois phrases, indiquez où stocker specs et où stocker les avis. Justifiez votre choix pour chaque cas.',
    placeholder:'Je placerais specs… En revanche, les avis… car…', hint:'Pensez à la taille de la sous-structure, à sa croissance et à sa fréquence de consultation.',
    criteria:[
      {label:'Specs dans le document produit (imbrication)',patterns:['\\b(specs|ram|ssd|caracteristiqu|sp[eé]cification)[a-z]*\\b[\\s\\S]{0,100}\\b(integr|imbriqu|embed|m[eê]me document|produit|products)\\b','\\b(integr|imbriqu|embed|produit|products)\\b[\\s\\S]{0,100}\\b(specs|ram|ssd|caracteristiqu)']},
      {label:'Avis dans une collection distincte',patterns:['\\b(avis|reviews?)\\b[\\s\\S]{0,100}\\b(separ|distinct|reference|collection)\\b','\\b(collection|separ|distinct|reference)\\b[\\s\\S]{0,100}\\b(avis|reviews?)\\b']},
      {label:'Justification par la croissance ou les accès',patterns:['\\b(croiss|augment|nombreux|volumineux|illimit|pagination|pagin|independan|tri|filtr|petit|born|ensemble|lire avec)']}
    ], explanation:'Modèle attendu : specs est petit, borné et lu avec le produit → Embedding ; les avis sont potentiellement nombreux, évoluent seuls et sont paginés → Referencing.',
    expected:'Imbriquer specs dans products ; conserver les avis dans reviews, liés par productId ; justifier par taille, croissance et accès.', source:'Pages 45–47 du cours.'
  },
  { id:'q07', section:'interroger', type:'single', points:1, minutes:1.5,
    tag:'Lecture · MongoDB', visual:'referencing.svg',
    title:'Retrouver les avis du produit 101',
    context:'Les avis sont enregistrés dans la collection reviews avec un champ productId.',
    prompt:'Quelle commande récupère les avis du produit 101 ?',
    options:[
      {id:'a',text:'db.reviews.find({ productId: 101 })'},
      {id:'b',text:'db.products.find({ _id: 501 })'},
      {id:'c',text:'db.reviews.find({ _id: 101 })'},
      {id:'d',text:'db.reviews.deleteMany({ productId: 101 })'}
    ], answer:'a', hint:'La recherche doit cibler reviews et le champ qui porte l’identifiant du produit.',
    explanation:'find({productId:101}) filtre la collection des avis sur leur référence au produit. Le _id des avis est indépendant.',
    expected:'db.reviews.find({ productId: 101 })', source:'Page 46 du cours.'
  },
  { id:'q08', section:'interroger', type:'single', points:1, minutes:1.5,
    tag:'Tri · MongoDB', visual:'avis-chronologie.svg',
    title:'Afficher les avis les plus récents',
    context:'Chaque avis possède un champ createdAt contenant sa date de création.',
    prompt:'Quel tri affiche les avis du plus récent au plus ancien ?',
    options:[
      {id:'a',text:'.sort({ createdAt: -1 })'},
      {id:'b',text:'.sort({ createdAt: 1 })'},
      {id:'c',text:'.skip({ createdAt: -1 })'},
      {id:'d',text:'.sort({ rating: 1 })'}
    ], answer:'a', hint:'−1 signifie décroissant ; sur des dates, cela place les plus récentes en premier.',
    explanation:'Un tri descendant sur la date (createdAt: -1) présente d’abord les avis récents.',
    expected:'.sort({ createdAt: -1 })', source:'Page 46 et notions de tri page 49.'
  },
  { id:'q09', section:'interroger', type:'single', points:1, minutes:1.5,
    tag:'Performance · Index', visual:'index.svg',
    title:'Quel index correspond à la requête dominante ?',
    context:'On consulte régulièrement les dix derniers avis d’un produit donné.',
    prompt:'Quel index composé aide à filtrer sur productId puis à trier les dates décroissantes ?',
    options:[
      {id:'a',text:'db.reviews.createIndex({ productId: 1, createdAt: -1 })'},
      {id:'b',text:'db.reviews.createIndex({ createdAt: 1 })'},
      {id:'c',text:'db.products.createIndex({ price: 1 })'},
      {id:'d',text:'db.reviews.createIndex({ rating: -1, text: 1 })'}
    ], answer:'a', hint:'Dans un index composé, l’ordre des champs suit ici « filtre d’égalité → tri ».',
    explanation:'L’index {productId:1,createdAt:-1} regroupe les avis par produit et permet de les parcourir dans l’ordre décroissant des dates (selon le plan choisi).',
    expected:'{ productId: 1, createdAt: -1 }', source:'Pages 52–53, application au Referencing page 46.'
  },
  { id:'q10', section:'interroger', type:'code', points:3, minutes:4,
    tag:'Écriture · Requête', visual:'avis-chronologie.svg',
    title:'Écrire la requête complète',
    context:'Dans reviews, chaque document possède productId et createdAt.',
    prompt:'Écrivez une requête mongosh qui affiche au maximum les 10 avis les plus récents du produit 101.',
    placeholder:'db.reviews.find({ ... })\n  .sort({ ... })\n  .limit(...)',
    hint:'Il faut filtrer sur productId, trier sur createdAt et limiter à 10.',
    criteria:[
      {label:'Bonne collection et find()',patterns:['db\\s*\\.\\s*reviews\\s*\\.\\s*find\\s*\\(']},
      {label:'Filtre productId = 101',patterns:['productid\\s*:\\s*101\\b','["\']productid["\']\\s*:\\s*101\\b']},
      {label:'Tri createdAt décroissant',patterns:['\\.\\s*sort\\s*\\(\\s*\\{[^}]*createdat\\s*:\\s*-1','\\.\\s*sort\\s*\\(\\s*\\{[^}]*["\']createdat["\']\\s*:\\s*-1']},
      {label:'Limite à 10',patterns:['\\.\\s*limit\\s*\\(\\s*10\\s*\\)']}
    ], explanation:'On combine une recherche par référence, un tri décroissant et une limite. Les critères sont évalués sans exécuter le code soumis.',
    expected:'db.reviews.find({ productId: 101 }).sort({ createdAt: -1 }).limit(10)', source:'Pages 46, 49 et 51 du cours.'
  },
  { id:'q11', section:'fiabiliser', type:'written', points:2, minutes:3,
    tag:'Esprit critique · Intégrité', visual:'relation-1n.svg',
    title:'Une référence est-elle une clé étrangère ?',
    context:'Un développeur ajoute dans reviews un avis avec productId: 999, mais aucun produit _id: 999 n’existe.',
    prompt:'Expliquez le risque et proposez au moins une vérification réalisable par l’application.',
    placeholder:'Le risque est… L’application devrait…',
    hint:'Demandez-vous si MongoDB rejette automatiquement cette insertion comme le ferait une contrainte SQL FOREIGN KEY.',
    criteria:[
      {label:'Absence de contrôle référentiel automatique',patterns:['(pas|sans|aucun|absence|ne .{0,30}pas)[\\s\\S]{0,70}(cl[eé] [eé]trang[eè]re|integrit|v[eé]rifi|contr[oô]le|garanti)','(orphelin|inexistant|n.existe pas|non valide|r[eé]f[eé]rence incorrecte)']},
      {label:'Contrôle d’existence du produit avant insertion',patterns:['(v[eé]rifi|contr[oô]l|test|recherch|find|exist|valid)[\\s\\S]{0,90}(produit|products|_id|productid)','(produit|products)[\\s\\S]{0,70}(exist|valid|avant|pr[eé]alabl)']}
    ], explanation:'Un champ productId n’impose pas une contrainte FOREIGN KEY. Il faut contrôler l’existence du produit, et concevoir les mises à jour/suppressions pour éviter des références orphelines.',
    expected:'Risque d’avis orphelin ; vérification préalable de l’existence du produit et règles applicatives de suppression.', source:'Page 46 du cours.'
  },
  { id:'q12', section:'fiabiliser', type:'multi', points:2, minutes:2.5,
    tag:'Synthèse · Décision', visual:'embedding-versus-referencing.svg',
    title:'Valider une architecture de catalogue',
    context:'Le catalogue évolue, les avis sont nombreux et le site doit rester fluide. Plusieurs décisions d’architecture sont proposées.',
    prompt:'Quelles décisions sont cohérentes avec les usages étudiés ?',
    options:[
      {id:'a',text:'Imbriquer specs, dont les valeurs sont bornées et généralement lues avec le produit.'},
      {id:'b',text:'Conserver les avis dans reviews avec productId et vérifier leur cohérence.'},
      {id:'c',text:'Insérer tous les avis sans limite dans un tableau unique du produit pour toujours tout charger.'},
      {id:'d',text:'Indexer les champs réellement utilisés dans les filtres et les tris fréquents.'}
    ], answer:['a','b','d'], hint:'Combinez fréquence de lecture, cardinalité, intégrité et coût des index.',
    explanation:'Embedding des spécifications, Referencing des avis et index ciblés correspondent aux accès attendus. Le tableau illimité d’avis n’est pas une bonne stratégie par défaut.',
    expected:'A, B et D.', source:'Pages 45–47 et 52–53 du cours.'
  }
];
module.exports={sections,questions,durationMinutes:30,maxPoints:questions.reduce((s,q)=>s+q.points,0)};
