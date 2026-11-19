# Guide de l’enseignante — Évaluation relations et jointures MongoDB

**Formation :** Licence IoT 1 GLSI · **Matière :** Big Data · **Durée :** 30 min · **Barème :** /20.

## Cadrage pédagogique

Le PDF joint comprend les jointures relationnelles comme prérequis (p. 2, 6) puis traite de l'organisation des documents (p. 42–44), de l'Embedding et du Referencing (p. 45–47) ainsi que des requêtes et de l'indexation (p. 48–53). Le quiz se concentre sur le fil conducteur produit–avis, sans demander aux étudiants de connaître l'opérateur `$lookup` qui n'est pas présenté dans ce support.

## Plan du quiz et critères

| N° | Sujet | Type | Points | Objectif | Support |
|---|---|---|---:|---|---|
| 1 | Jointure SQL | QCM simple | 1 | Comprendre la correspondance entre tables | p. 6 |
| 2 | Relation produit–avis | QCM multiple | 2 | Identifier une relation logique 1:N | p. 46 |
| 3 | `productId` | Réponse courte | 1 | Nommer un champ de référence | p. 46 |
| 4 | `specs` | QCM simple | 1 | Choisir Embedding | p. 45 |
| 5 | Avis volumineux | QCM multiple | 2 | Choisir Referencing | p. 46–47 |
| 6 | Justification | Réponse argumentée | 3 | Comparer les deux modèles | p. 45–47 |
| 7 | `find` ciblé | QCM simple | 1 | Filtrer dans `reviews` | p. 46 |
| 8 | `createdAt:-1` | QCM simple | 1 | Trier par date descendante | p. 49 |
| 9 | Index composé | QCM simple | 1 | Filtrage + tri | p. 52–53 |
| 10 | Requête complète | Code rédigé | 3 | Filtrer, trier, limiter | p. 46, 49, 51 |
| 11 | Intégrité référentielle | Réponse argumentée | 2 | Comprendre absence FK automatique | p. 46 |
| 12 | Synthèse du modèle | QCM multiple | 2 | Valider une architecture raisonnée | p. 45–47, 52–53 |

**Total : 20 points.** Les QCM multiples donnent un crédit partiel calculé avec pénalisation des mauvaises cases. Les réponses libres sont évaluées à partir de critères explicites, visibles après correction ; les formulations alternatives peuvent être vérifiées par l'enseignante.

## Déroulement recommandé

1. **2 min** — expliquer qu'il s'agit d'une évaluation formative avec correction immédiate.
2. **23 min** — travail autonome sur les 12 questions ; les étudiants peuvent consulter les indices.
3. **5 min** — consulter le bilan et discuter de l'intégrité des références et du compromis Embedding/Referencing.

Le minuteur du site reste fixé à **30 min**, pour permettre une autonomie complète ; la répartition proposée ci-dessus est indicative.

## Conseils pour exploiter les résultats

Les étudiants peuvent exporter un CSV. Dans un usage pédagogique volontaire, leur demander de déposer le fichier sur l'espace de cours utilisé par la promotion. Aucune centralisation des résultats n'est intégrée au serveur, conformément à une utilisation formative et légère.

**Pour un contrôle officiel :** prévoir une authentification, une base de données persistante, un temps contrôlé côté serveur et un examen des réponses libres par l'enseignante.
