# TP : construire sa première chaîne CI/CD avec GitHub Actions

**Module** M354 Virtualisation et Cloud Computing · **Durée** 1 h 30, en binôme
**Prérequis** un compte GitHub par étudiant, Git, Node.js 22

## Objectifs

- Automatiser la vérification de chaque changement (intégration continue).
- Publier automatiquement l'application sur GitHub Pages (livraison continue).
- Observer un pipeline qui bloque un bug avant la production.

## Partie 1 : prise en main (15 min)

1. Créer un dépôt à partir de ce projet (bouton **Use this template**, ou fork), le cloner.
2. `npm ci`, puis `npm run dev` et ouvrir `http://localhost:5173`.
3. `npm run test:cov` : lire le tableau de couverture.

**Question 1.** Où l'application affiche-t-elle sa version ? Pourquoi est-ce utile en production ?

## Partie 2 : votre premier workflow (25 min)

1. Supprimer `.github/workflows/ci-cd.yml`.
2. Créer `.github/workflows/ci.yml` qui, sur `push` et `pull_request` :
   - installe Node 22 avec `actions/setup-node` ;
   - exécute `npm ci`, `npm run lint` puis `npm test`.
3. Pousser et suivre l'exécution dans l'onglet **Actions**.

**Question 2.** Combien de temps dure le pipeline ? Quelle étape est la plus longue ? Proposez une optimisation (indice : l'option `cache: npm`).

## Partie 3 : casser volontairement (15 min)

1. Settings → Rules : rendre votre job obligatoire avant tout merge sur `main`.
2. Créer une branche, appliquer `git apply demo/bug-filtre-date.patch`, pousser, ouvrir une Pull Request.

**Question 3.** Que se passe-t-il ? Comparez le coût d'un bug trouvé ici et d'un bug trouvé par un utilisateur.

## Partie 4 : déployer (25 min)

1. Settings → Pages → Source : **GitHub Actions**.
2. Ajouter à votre workflow un job `deploy` (`needs` sur vos tests, uniquement sur `main`) qui lance `npm run build` puis utilise `actions/upload-pages-artifact` et `actions/deploy-pages`.
3. Ajouter un **Required reviewer** à l'environnement `github-pages`, puis merger une Pull Request et approuver le déploiement.

**Question 4.** Quelle est la différence entre livraison continue et déploiement continu ? Que faut-il changer dans vos réglages pour passer de l'une à l'autre ?

## Partie 5 : pour aller plus loin (10 min)

- Ajouter une matrice Node 22 / 24 sur le job de tests.
- Comparer votre workflow avec `.github/workflows/ci-cd.yml` : quelles phases DevOps manquent encore au vôtre ?

**Question 5.** Pourquoi le pipeline complet construit-il le site une seule fois, puis réutilise ce même build pour l'image Docker, la release et le déploiement ?

## Livrable

Lien du dépôt, capture d'un pipeline rouge (partie 3), capture d'un déploiement réussi (partie 4), réponses aux 5 questions.
