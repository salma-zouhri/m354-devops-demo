# Mise en place (une seule fois, environ 30 minutes)

Tout est gratuit avec un dépôt **public**. Il faut deux comptes GitHub : celui qui possède le dépôt, et celui du binôme pour les approbations.

## 1. Créer le dépôt

1. Créer un dépôt public `m354-devops-demo`, vide.
2. Dans ce dossier :

   ```bash
   git init -b main
   git add -A
   git commit -m "chore: initialisation du projet"
   git remote add origin https://github.com/<compte>/m354-devops-demo.git
   git push -u origin main
   ```

3. **Settings → Collaborators** : inviter le compte du binôme.

## 2. Droits des workflows

**Settings → Actions → General → Workflow permissions** : choisir **Read and write permissions**. Nécessaire pour créer les releases et les issues automatiques.

## 3. GitHub Pages (Deploy)

1. **Settings → Pages → Build and deployment → Source** : **GitHub Actions**.
2. **Settings → Environments → github-pages** (créé à l'étape précédente) :
   - **Required reviewers** : ajouter le binôme. C'est la porte d'approbation.
   - Laisser la règle de branche `main`.
3. **Settings → Secrets and variables → Actions → Variables → New repository variable** :
   - Nom `PROD_URL`, valeur `https://<compte>.github.io/m354-devops-demo/` (avec le `/` final).

## 4. Protection de `main` (Test)

**Settings → Rules → Rulesets → New branch ruleset**, cible `main` :

- **Require a pull request before merging**, 1 approbation.
- **Require status checks to pass**, ajouter : `Qualité (lint, types, format)`, `Tests (Node 22)`, `Tests (Node 24)`, `Sécurité (secrets + dépendances)`, `Build + e2e + image Docker`.
  Les noms n'apparaissent qu'après un premier run du pipeline : revenir ici après l'étape 1.
- **Block force pushes**.

## 5. Tableau Kanban (Plan)

1. Onglet **Projects** du dépôt → **New project** → modèle **Board** → nom « M354 démo ».
2. Dans le projet, **Workflows** : activer **Auto-add to project** (filtre `is:issue`) et vérifier que **Item closed** et **Pull request merged** déplacent la carte en **Done**.
3. Créer l'issue #1 avec le modèle **Nouvelle fonctionnalité** :
   - Titre : `[Feature] Afficher la salle de chaque exposé`
   - User story : `En tant qu'étudiant, je veux voir la salle de chaque exposé, afin de savoir où aller.`
   - Critères : `- [ ] Chaque carte affiche la salle` et `- [ ] Un test automatisé vérifie l'affichage de la salle`

## 6. Premier déploiement

1. **Actions → CI/CD → Run workflow** sur `main`.
2. Approuver le déploiement quand le job attend (**Review deployments**).
3. Ouvrir `PROD_URL` : l'application affiche `v1.0.1`, sans les salles.

## 7. Préparer les éléments du tournage

Voir `docs/TOURNAGE.md`, section « Avant d'enregistrer ». En résumé : une PR `demo/bug` déjà rouge, une issue automatique déjà créée, et une version précédente disponible pour le rollback.

## En cas de problème

| Symptôme                                     | Cause probable et solution                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `release` échoue : `Resource not accessible` | Étape 2 oubliée (droits en écriture des workflows).                                              |
| `deploy` échoue : `Pages site not found`     | Étape 3.1 : la source de Pages n'est pas « GitHub Actions ».                                     |
| `smoke` attend puis échoue                   | `PROD_URL` absente ou sans le `/` final.                                                         |
| Push GHCR refusé                             | Le nom du dépôt contient des majuscules : le pipeline les convertit, vérifier le nom du package. |
| Pas de bouton « Approve » sur la PR          | On ne peut pas approuver sa propre PR : c'est le compte du binôme qui approuve.                  |
