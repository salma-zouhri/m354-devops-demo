# Guide de tournage de la vidéo de démo

La vidéo est **muette** : le commentaire est fait en direct pendant l'exposé (voir `COMMENTAIRE_LIVE.md`). Elle doit donc être lisible sans son : actions lentes, éléments importants agrandis, et **une carte de titre au début de chaque phase** pour que les commentateurs se repèrent.

**Durée cible après montage : 9 minutes.** Créneau dans l'exposé : 10 minutes, la minute restante sert aux pauses.

---

## Avant d'enregistrer (la veille)

### Préparer le dépôt

Le dépôt doit être en place (`SETUP.md`) avec au moins **deux versions déjà déployées** (par exemple `v1.0.1` et `v1.0.2` : relancer le workflow CI/CD une deuxième fois suffit). La version précédente servira au rollback.

| À préparer                         | Comment                                                                                                                                         | Pourquoi                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| PR rouge `demo/bug`                | `git switch -c demo/bug main`, `git apply demo/bug-filtre-date.patch`, commit, push, ouvrir la PR « Démo : filtre par date ». Attendre l'échec. | Montrer un merge bloqué sans attendre en direct |
| Issue créée par la machine         | Mettre temporairement `PROD_URL` sur `https://example.invalid/`, lancer **Actions → Monitor → Run workflow**, puis remettre la bonne URL.       | Montrer la boucle qui revient au Plan           |
| Issue #1 en colonne Todo           | Voir `SETUP.md`, étape 5                                                                                                                        | Point de départ de la démo                      |
| Branche `feat/salle` **non** créée | Elle sera créée pendant l'enregistrement                                                                                                        | Montrer la phase Code en vrai                   |

### Préparer l'écran

- Résolution **1920 × 1080**, zoom du navigateur à **125 %**, zoom de VS Code à 1 ou 2 crans, police du terminal à 18 pt.
- Navigateur avec un profil propre : pas de favoris, pas d'extensions visibles, notifications coupées.
- GitHub en anglais (les libellés cités dans ce guide sont en anglais).
- Onglets ouverts dans cet ordre : **Projects**, **Pull requests**, **Actions**, **Releases**, **Packages**, **site en production**.
- Mode Ne pas déranger sur l'ordinateur.

### Outils d'enregistrement et de montage

- Enregistrement : **OBS Studio** (gratuit), 1080p, 30 images/s, une prise par chapitre.
- Montage : **Shotcut**, **DaVinci Resolve** ou **CapCut** (gratuits).
- Export : MP4, H.264, 1080p.

---

## Règles de montage

1. **Carte de titre de 3 secondes** au début de chaque chapitre : fond bleu nuit `#064259`, texte crème `#F1EAE0`, par exemple « Phase 4 · Test · ESLint, Vitest, Playwright, Grype ». Mêmes couleurs que les slides.
2. **Les attentes sont accélérées** (×8 ou ×16) avec un petit badge « ×8 » en coin, pour rester honnête sur la durée réelle.
3. **Zoom** (×1,5 à ×2) sur les éléments clés : bouton Merge bloqué, badge de version, tableau du monitoring.
4. Le curseur bouge lentement. Après chaque clic important, **laisser 2 secondes** à l'écran.
5. Pas de musique, ou très basse : les commentateurs parlent par-dessus.
6. Ajouter les chapitres dans le lecteur si possible (VLC lit les chapitres MKV) ; sinon, les cartes de titre suffisent.

---

## Plan de tournage, chapitre par chapitre

Les minutages sont ceux de la vidéo **après montage**.

### 00:00 → 00:08 · Carte d'ouverture

- Texte : « Démo · Une fonctionnalité, 8 phases, 8 outils ».
- En fond, capture du site en production (version actuelle, sans les salles).

### 00:08 → 00:55 · Chapitre 1 : Plan (GitHub Issues + Projects)

| #   | Action à l'écran                                           | À bien montrer                                      |
| --- | ---------------------------------------------------------- | --------------------------------------------------- |
| 1.1 | Carte « Phase 1 · Plan · GitHub Projects »                 |                                                     |
| 1.2 | Onglet **Projects** : le tableau Todo / In progress / Done | Les colonnes                                        |
| 1.3 | Ouvrir l'issue #1                                          | **User story** et **critères d'acceptation** (zoom) |
| 1.4 | La glisser de **Todo** vers **In progress**                | Le déplacement                                      |
| 1.5 | S'assigner l'issue (Assignees)                             |                                                     |

### 00:55 → 02:05 · Chapitre 2 : Code (VS Code, Git, Pull Request)

| #   | Action à l'écran                                                                                                                        | À bien montrer                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 2.1 | Carte « Phase 2 · Code · Git, VS Code, Pull Request »                                                                                   |                                    |
| 2.2 | Terminal VS Code : `git switch -c feat/salle`                                                                                           | Le nom de branche                  |
| 2.3 | `git apply demo/feature-salle.patch`, puis vue **Source Control** de VS Code : diff de `src/data.ts`, `src/App.tsx`, `src/App.test.tsx` | **Le nouveau test** (zoom)         |
| 2.4 | `npm run dev`, navigateur sur `localhost:5173` : les salles s'affichent (accéléré)                                                      | Une carte avec « Salle : Amphi A » |
| 2.5 | `npm test` (accéléré) : tous les tests verts                                                                                            | « 15 passed »                      |
| 2.6 | `git commit -am "feat: affiche la salle de chaque exposé (#1)"` puis `git push -u origin feat/salle`                                    |                                    |
| 2.7 | GitHub : **Compare & pull request**. Le modèle s'affiche : compléter `Closes #1`, cocher la checklist, **Create pull request**          | `Closes #1` (zoom)                 |

### 02:05 → 03:05 · Chapitre 3 : Build (Vite + Docker)

| #   | Action à l'écran                                                                                          | À bien montrer                        |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 3.1 | Carte « Phase 3 · Build · Vite, Docker »                                                                  |                                       |
| 3.2 | Bas de la PR : les checks démarrent tout seuls                                                            | « Some checks haven't completed yet » |
| 3.3 | Clic sur un check → page du run : **le graphe des jobs** (accéléré ×16 jusqu'au vert)                     | Les jobs en parallèle                 |
| 3.4 | Ouvrir le job **Build + e2e + image Docker** → étape **Build Vite** : la sortie de Vite et `version.json` | Le numéro de version et le commit     |
| 3.5 | Même job → étape **Image Docker** : `docker build` réussi                                                 |                                       |

### 03:05 → 04:20 · Chapitre 4 : Test (dont le bug bloqué)

| #   | Action à l'écran                                                                                                                       | À bien montrer                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 4.1 | Carte « Phase 4 · Test · ESLint, Vitest, Playwright, Grype »                                                                           |                                           |
| 4.2 | Même run : déplier **Qualité**, **Tests (Node 22)** (couverture 100 %), **Sécurité**, puis étapes **Playwright** et **Grype** du build | Les coches vertes, la couverture          |
| 4.3 | Retour sur la PR : **All checks have passed**                                                                                          |                                           |
| 4.4 | Carte intermédiaire « Et si le code était faux ? »                                                                                     |                                           |
| 4.5 | Ouvrir la PR **demo/bug** préparée : checks rouges                                                                                     | La croix rouge sur **Tests**              |
| 4.6 | Cliquer **Details** sur Tests : le log liste les 3 tests en échec (« filtre par date »…)                                               | L'assertion qui échoue (zoom)             |
| 4.7 | Revenir en bas de la PR : **Merging is blocked**, bouton grisé                                                                         | **Le bouton Merge bloqué** (zoom ×2, 3 s) |

### 04:20 → 05:15 · Chapitre 5 : Release (GHCR + GitHub Releases)

| #   | Action à l'écran                                                                      | À bien montrer               |
| --- | ------------------------------------------------------------------------------------- | ---------------------------- |
| 5.1 | Carte « Phase 5 · Release · GHCR, GitHub Releases »                                   |                              |
| 5.2 | Sur la bonne PR, le compte du binôme clique **Review changes → Approve**              | La revue approuvée           |
| 5.3 | **Merge pull request → Confirm merge**                                                |                              |
| 5.4 | Onglet Actions : le run sur `main` (accéléré jusqu'à la fin du job **Release**)       | Le job Release vert          |
| 5.5 | Onglet **Releases** : `v1.0.N`, notes générées (le titre de la PR), `dist-v1.0.N.zip` | Les notes et la pièce jointe |
| 5.6 | Onglet **Packages** : l'image et ses tags `v1.0.N`, `sha-…`, `latest`                 | Les trois tags               |

### 05:15 → 06:10 · Chapitre 6 : Deploy (GitHub Pages + approbation)

| #   | Action à l'écran                                                          | À bien montrer                           |
| --- | ------------------------------------------------------------------------- | ---------------------------------------- |
| 6.1 | Carte « Phase 6 · Deploy · GitHub Environments, GitHub Pages »            |                                          |
| 6.2 | Run sur `main` : le job **Déploiement production** est en **Waiting**     | Le bandeau « Waiting for review » (zoom) |
| 6.3 | **Review deployments** → cocher `github-pages` → **Approve and deploy**   | La porte d'approbation                   |
| 6.4 | Le job passe au vert (accéléré), l'URL de production apparaît sous le job | L'URL                                    |

### 06:10 → 07:30 · Chapitre 7 : Operate (smoke test + rollback)

| #   | Action à l'écran                                                                                       | À bien montrer                       |
| --- | ------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| 7.1 | Carte « Phase 7 · Operate · Smoke test, Rollback »                                                     |                                      |
| 7.2 | Job **Smoke test production** vert : log « OK, version en ligne » puis Playwright « 2 passed »         |                                      |
| 7.3 | Ouvrir le site en production : les salles sont là, pied de page `v1.0.N · commit …`                    | **Le badge de version** (zoom)       |
| 7.4 | Ouvrir `…/version.json`                                                                                | Le commit identique à celui de la PR |
| 7.5 | Onglet Projects : l'issue #1 est passée **toute seule** en **Done**                                    | La carte dans Done                   |
| 7.6 | Actions → **Rollback** → **Run workflow** → saisir la version précédente → approuver → vert (accéléré) | La saisie de la version              |
| 7.7 | Recharger le site : version précédente, sans les salles                                                | Le badge a changé                    |
| 7.8 | Relancer **Rollback** avec `v1.0.N` (accéléré ×16) : retour à la bonne version                         |                                      |

### 07:30 → 08:45 · Chapitre 8 : Monitor (sonde + issue automatique)

| #   | Action à l'écran                                                                                    | À bien montrer                   |
| --- | --------------------------------------------------------------------------------------------------- | -------------------------------- |
| 8.1 | Carte « Phase 8 · Monitor · Sonde planifiée, issues automatiques »                                  |                                  |
| 8.2 | Actions → **Monitor** : la liste des exécutions planifiées toutes les 30 minutes                    | Le déclencheur « schedule »      |
| 8.3 | **Run workflow**, puis ouvrir le résumé : tableau code HTTP 200, temps de réponse, version en ligne | **Le tableau** (zoom)            |
| 8.4 | Ouvrir l'issue « Alerte monitoring : production indisponible ou lente » préparée la veille          | Auteur : `github-actions` (zoom) |
| 8.5 | Onglet Projects : cette issue est dans **Todo**                                                     | La boucle revient au Plan        |

### 08:45 → 09:00 · Carte de fin

- Texte : « De l'idée à la production : 8 phases, 8 outils, 0 commande manuelle en production ».
- Deuxième ligne : le délai réel mesuré pendant le tournage (heure du commit → fin du job Smoke test), par exemple « Délai de mise en production : 12 min ».

---

## Pendant l'exposé

- Lire la vidéo dans **VLC** en plein écran, pas dans PowerPoint : la barre d'espace met en pause instantanément.
- Celui qui ne commente pas tient la télécommande ou la souris et met en pause si le commentaire prend du retard.
- Garder la vidéo **en local** sur l'ordinateur (et une copie sur clé USB) : pas de dépendance au réseau.
