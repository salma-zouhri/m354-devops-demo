# Les 8 phases DevOps dans ce projet

Ce document suit **une seule fonctionnalité**, l'issue #1 « Afficher la salle de chaque exposé », à travers les huit phases de la boucle DevOps. Pour chaque phase : l'objectif, ce qui se trouve dans le dépôt, ce qui se passe concrètement, et comment le montrer.

```
     ┌──── DEV ────┐            ┌──── OPS ────┐
  1 Plan → 2 Code → 3 Build → 4 Test → 5 Release → 6 Deploy → 7 Operate → 8 Monitor
     ↑                                                                      │
     └──────────────── le feedback de la production redevient une tâche ────┘
```

---

## 1. Plan : décider quoi construire

**Objectif.** Transformer un besoin, ou un problème observé en production, en tâche claire et priorisée.

**Dans le dépôt.**

- `.github/ISSUE_TEMPLATE/feature.yml` : modèle de user story, avec un champ **critères d'acceptation** obligatoire.
- `.github/ISSUE_TEMPLATE/bug.yml` : modèle de bug, qui demande la version concernée.
- Un tableau **GitHub Projects** (Todo, In progress, Done), relié au dépôt.

**Ce qui se passe.** On crée l'issue #1 avec le modèle « Nouvelle fonctionnalité » :

> En tant qu'étudiant, je veux voir la salle de chaque exposé, afin de savoir où aller.
> Critères : chaque carte affiche la salle ; un test automatisé vérifie l'affichage de la salle.

L'issue arrive dans la colonne Todo, puis passe en In progress quand on commence.

**Pourquoi c'est DevOps.** Le critère d'acceptation écrit ici deviendra un test automatisé à la phase 4. Et la phase 8 crée elle-même des issues : le backlog est alimenté par la production, pas seulement par les demandes.

**Outils équivalents.** Jira, Azure Boards, GitLab Issues, Trello.

---

## 2. Code : écrire et faire relire

**Objectif.** Produire le changement en petits incréments, relus par un pair avant d'être intégrés.

**Dans le dépôt.**

- `src/` : l'application React (TypeScript).
- `demo/feature-salle.patch` : le changement de l'issue #1, prêt à appliquer pendant l'enregistrement.
- `.github/pull_request_template.md` : commence par `Closes #`, pour relier la PR à l'issue.

**Ce qui se passe.**

```bash
git switch -c feat/salle
git apply demo/feature-salle.patch   # ou taper le changement à la main
npm run dev                          # vérifier en local
npm test                             # les tests passent en local
git commit -am "feat: affiche la salle de chaque exposé (#1)"
git push -u origin feat/salle
```

Puis on ouvre la Pull Request sur GitHub, avec `Closes #1` dans la description.

**Ce que contient le changement.** Un champ `salle` dans `src/data.ts`, son affichage dans la carte (`src/App.tsx`), un style, et **un nouveau test** dans `src/App.test.tsx` : le critère d'acceptation, transformé en code.

**Pourquoi c'est DevOps.** Branche courte, petit changement, relecture obligatoire. `Closes #1` assure la traçabilité : l'issue se fermera toute seule quand le code arrivera sur `main`.

**Outils équivalents.** GitLab Merge Requests, Bitbucket, IntelliJ, pre-commit.

---

## 3. Build : fabriquer l'artefact

**Objectif.** Transformer le code source en un artefact exécutable, identique partout.

**Dans le dépôt.**

- `vite.config.ts` : build React avec chemins relatifs (`base: "./"`), pour que le même build fonctionne sur GitHub Pages, dans Docker et en local.
- `scripts/write-version.mjs` : écrit `version.json` (version, commit, environnement, date) avant le build.
- `Dockerfile` + `docker/nginx.conf` : emballe ce même `dist/` dans une image nginx **non-root**, avec un healthcheck.
- Job `build` du fichier `.github/workflows/ci-cd.yml`.

**Ce qui se passe.** Le pipeline injecte `VITE_APP_VERSION=1.0.<numéro du run>` et `VITE_GIT_SHA=<commit>`, lance `npm run build`, et conserve le dossier `dist/` comme artefact. Il construit ensuite l'image Docker **à partir de ce même dossier**.

**Pourquoi c'est DevOps.** _Build once, deploy many_ : il n'existe qu'un seul build. C'est lui qu'on teste, lui qu'on publie, lui qu'on déploie. La version et le commit sont gravés dedans : en production, le pied de page et `/version.json` disent exactement ce qui tourne.

**Outils équivalents.** Maven, Gradle, npm, Buildpacks, Bazel.

---

## 4. Test : prouver que rien ne casse

**Objectif.** Vérifier automatiquement chaque changement, avant qu'il n'atteigne `main`.

**Dans le dépôt et le pipeline, dans l'ordre (fail fast).**

| Job        | Vérification                      | Outil                                | Durée typique |
| ---------- | --------------------------------- | ------------------------------------ | ------------- |
| `quality`  | Style et erreurs                  | ESLint                               | secondes      |
| `quality`  | Types                             | TypeScript (`tsc --noEmit`)          | secondes      |
| `quality`  | Formatage                         | Prettier                             | secondes      |
| `test`     | Tests unitaires, Node 22 et 24    | Vitest + Testing Library             | < 1 min       |
| `test`     | Couverture minimale 80 %          | Vitest coverage (v8)                 | inclus        |
| `security` | Secrets dans l'historique Git     | gitleaks                             | secondes      |
| `security` | Failles connues des dépendances   | npm audit                            | secondes      |
| `build`    | Parcours utilisateur sur le build | Playwright (`e2e/smoke.spec.ts`)     | ~1 min        |
| `build`    | Vulnérabilités de l'image         | Grype                                | ~30 s         |
| `build`    | Le conteneur démarre et répond    | `docker run` + `wait-for-version.sh` | secondes      |

**Ce qui se passe quand c'est mauvais.** `demo/bug-filtre-date.patch` inverse une comparaison dans `src/filter.ts`. Trois tests échouent, le job `test` passe au rouge, et grâce à la protection de branche (voir `SETUP.md`), **le bouton Merge est bloqué**.

**Pourquoi c'est DevOps.** Shift-left : le défaut est trouvé en une minute, par une machine, avant tout utilisateur.

**Outils équivalents.** JUnit, Jest, Cypress, Selenium, SonarQube, Trivy, Snyk.

---

## 5. Release : versionner et publier

**Objectif.** Produire une version identifiée, immuable, prête à déployer.

**Dans le pipeline.** Job `release`, seulement sur `main`.

**Ce qui se passe.**

1. L'image testée au job `build` est rechargée (aucun rebuild) et poussée sur **GHCR** avec trois tags : `v1.0.N`, `sha-<commit>`, `latest`.
2. Une **GitHub Release** `v1.0.N` est créée, avec des notes générées automatiquement (liste des PR) et le fichier `dist-v1.0.N.zip` en pièce jointe.

**Pourquoi c'est DevOps.** Une version publiée ne change plus jamais. Release et Deploy sont séparés : on peut redéployer n'importe quelle version passée sans rien reconstruire (c'est ce qu'utilise le rollback, phase 7).

**Outils équivalents.** Docker Hub, Nexus, Artifactory, Harbor, semantic-release.

---

## 6. Deploy : mettre en service

**Objectif.** Installer la nouvelle version en production, automatiquement et sous contrôle.

**Dans le pipeline.** Job `deploy`, environnement `github-pages`.

**Ce qui se passe.**

1. Le job s'arrête sur **« Waiting for review »** : l'environnement exige une approbation (réglage dans `SETUP.md`).
2. Un membre du binôme clique **Review deployments → Approve**.
3. Le `dist/` de la release est publié sur GitHub Pages. L'URL de production s'affiche sur le job.

**Pourquoi c'est DevOps.** Aucune commande tapée à la main. La porte d'approbation fait de ce pipeline une **livraison continue**. Retirer le reviewer de l'environnement suffit à passer au **déploiement continu**, sans toucher au code du pipeline.

**Outils équivalents.** GitLab CI (`when: manual`), Jenkins, Argo CD, Spinnaker.

---

## 7. Operate : faire tourner la production

**Objectif.** Vérifier que le service fonctionne réellement, et savoir revenir en arrière vite.

**Dans le dépôt.**

- Job `smoke` : attend que `version.json` en production affiche le bon commit (`scripts/wait-for-version.sh`), puis rejoue le test Playwright **sur l'URL de production**.
- Workflow `.github/workflows/rollback.yml` : Actions → Rollback → Run workflow → saisir `v1.0.N`. Il télécharge le `dist.zip` de cette release et le redéploie, sans rebuild.

**Ce qui se passe.** En production, le pied de page affiche `v1.0.N · commit abc1234 · environnement : production`, et chaque carte affiche sa salle. L'issue #1 est fermée automatiquement par le merge.

**Pourquoi c'est DevOps.** On ne fait pas confiance, on vérifie. Et le temps de restauration (métrique DORA) se mesure ici : un rollback prend environ une minute.

**Outils équivalents.** Kubernetes (rollout undo), Terraform, Ansible, AWS, Azure, Render.

---

## 8. Monitor : observer et apprendre

**Objectif.** Mesurer la production en continu et transformer les problèmes en tâches.

**Dans le dépôt.**

- Workflow `.github/workflows/monitor.yml` : toutes les 30 minutes (et à la demande), mesure le code HTTP et le temps de réponse de la page et de `version.json`, affiche un tableau dans le résumé du run, et **ouvre une issue** si le site est indisponible ou répond en plus de 2 secondes.
- Job `feedback` du pipeline : si un job échoue sur `main` (build, release, déploiement ou smoke test), **une issue est créée** avec le lien vers le run.

**Ce qui se passe.** Ces issues arrivent dans le tableau GitHub Projects, colonne Todo. **On est revenus à la phase 1.**

**Pourquoi c'est DevOps.** C'est la phase qui ferme la boucle : ce qu'on observe en production redevient du travail planifié.

**Outils équivalents.** Prometheus, Grafana, Datadog, Sentry, UptimeRobot, OpenTelemetry.

---

## Les 4 métriques DORA, mesurables sur ce projet

| Métrique                     | Où la lire                                               |
| ---------------------------- | -------------------------------------------------------- |
| Fréquence de déploiement     | Onglet Actions, filtre « Déploiement production » réussi |
| Délai de mise en production  | Heure du commit → heure de fin du job `smoke`            |
| Taux d'échec des changements | Runs de `main` en échec / runs de `main`                 |
| Temps de restauration        | Durée d'un run du workflow `Rollback`                    |
