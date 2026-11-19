# ISIMA — Correction des schémas qui divulguent les réponses

## Ce qui a été corrigé

- Question 8 : disparition du code `sort({ createdAt: -1 })` de l'image **avant** la réponse.
- Audit des douze questions : sept illustrations contextualisées refaites pour ne pas révéler les choix corrects.
- Après validation : le schéma détaillé, lui, apparaît toujours, avec une explication.
- Indices pédagogiques reformulés afin de ne pas donner directement la solution.

## Mettre à jour le site Render déjà en ligne

Le lien actuel ne change pas : `https://bigdata-nosql1.onrender.com`.

### Option recommandée — GitHub Desktop (sans terminal)

1. Installez **GitHub Desktop** et connectez votre compte GitHub.
2. Dans GitHub Desktop : **File → Clone repository**, puis choisissez `takwabenaichaGader/bigdata-nosql1`.
3. Ouvrez le dossier du dépôt sur votre ordinateur.
4. Décompressez **l'archive de correction complète** et copiez tous les fichiers et dossiers **dans la racine du dépôt GitHub**, en choisissant **Remplacer** lorsque demandé. Gardez impérativement les sous-dossiers `public/assets` et `src`.
5. Dans GitHub Desktop, saisissez le commentaire de modification `Corrections des schémas sans réponses` et cliquez **Commit to main**, puis **Push origin**.
6. Render → service `bigdata-nosql1` → onglet **Deploys** : un nouveau déploiement doit apparaître automatiquement (si Auto Deploy est activé).
7. Après le statut **Live**, ouvrez votre site puis utilisez **Ctrl + Maj + R** pour forcer l'actualisation.
8. Cliquez sur « Recommencer une nouvelle tentative » pour vérifier la question 8 **avant correction**, puis validez-la pour voir le schéma explicatif.

### Option terminal (si Git est installé)

```bash
git clone https://github.com/takwabenaichaGader/bigdata-nosql1.git
cd bigdata-nosql1
# Copier par-dessus ce dossier le contenu de l'archive corrigée.
git add .
git commit -m "Fix: neutral diagrams before grading"
git push origin main
```

> Si le site ne se met pas à jour automatiquement, allez dans Render → `bigdata-nosql1` → **Manual Deploy → Deploy latest commit**.

## Vérification avant diffusion aux étudiants

Dans une nouvelle tentative, faites défiler les questions 1, 4, 5, 6, 8, 9, 10 et 12 sans répondre : aucune illustration ne doit exposer les stratégies ou requêtes correctes. Sur la question 8, les trois dates sont volontairement **dans le désordre**.

Le questionnaire est **formatif** (réponse immédiatement corrigée). Pour une évaluation notée où l'on souhaite limiter le partage des solutions entre étudiants, il faudrait un mode examen distinct avec corrections différées, sessions authentifiées et conservation centralisée des résultats.
