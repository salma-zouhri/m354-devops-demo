# Commentaire live de la vidéo de démo

La vidéo est muette et dure 9 minutes. Ce texte se dit **en direct**, par-dessus, chapitre par chapitre.

**Répartition.** Mohamed dit **ce qu'on voit** (l'action). Salma dit **pourquoi c'est du DevOps** (le concept). Celui qui ne parle pas surveille l'écran et met en pause (barre d'espace) si le commentaire prend du retard.

**Comment se caler.** Ne suivez pas un chronomètre : suivez les **repères visuels**. Chaque chapitre commence par une carte de titre ; chaque réplique est déclenchée par ce qui apparaît à l'écran (colonne « Repère »). Les phrases en **gras** sont les phrases clés : si vous manquez de temps, ne dites qu'elles.

---

## Avant de lancer la vidéo (slide 33, 20 secondes)

**Mohamed** : On a enregistré la démo pour ne pas dépendre du réseau, mais on va la commenter en direct. Vous allez suivre une seule fonctionnalité, de l'idée jusqu'à la production. **Une fonctionnalité, huit phases, huit outils.**

**Salma** : Et un détail à surveiller tout au long : la petite version en bas de la page. C'est elle qui nous dira, à la fin, ce qui tourne vraiment en production.

_[Lancer la vidéo.]_

---

## 00:00 · Carte d'ouverture

| Repère                     | Qui     | À dire                                                                                                                                   |
| -------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Site en production en fond | Mohamed | Voici l'application en production aujourd'hui : le planning des exposés de ce module. Notre mission : ajouter la salle de chaque exposé. |

## 00:08 · Phase 1 : Plan

| Repère                              | Qui     | À dire                                                                                                                                                                               |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tableau Kanban à l'écran            | Mohamed | Tout commence ici, sur GitHub Projects : un tableau avec ce qu'il reste à faire, ce qui est en cours, et ce qui est terminé.                                                         |
| L'issue #1 s'ouvre                  | Mohamed | Notre besoin est écrit comme une user story : « en tant qu'étudiant, je veux voir la salle de chaque exposé ».                                                                       |
| Zoom sur les critères d'acceptation | Salma   | **Regardez le deuxième critère : « un test automatisé vérifie l'affichage de la salle ». Ce critère va devenir du code dans une minute.** C'est ce qui relie le besoin à la qualité. |
| La carte glisse vers In progress    | Mohamed | On la passe en cours. Tout le monde dans l'équipe sait qui travaille sur quoi.                                                                                                       |

_Si vous avez du temps_ (Salma) : Dans une boucle DevOps, le backlog n'est pas rempli que par des demandes. Vous verrez à la fin que la production elle-même y ajoute des tâches.

## 00:55 · Phase 2 : Code

| Repère                                   | Qui     | À dire                                                                                                                                                                                                     |
| ---------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git switch -c feat/salle`               | Mohamed | On crée une branche courte, juste pour cette fonctionnalité.                                                                                                                                               |
| Le diff s'affiche dans VS Code           | Mohamed | Le changement est petit : un champ « salle » dans les données, son affichage dans la carte…                                                                                                                |
| Zoom sur le nouveau test                 | Salma   | **… et un nouveau test. C'est notre critère d'acceptation, transformé en code.**                                                                                                                           |
| Le site local montre les salles          | Mohamed | On vérifie en local : les salles apparaissent.                                                                                                                                                             |
| `npm test` vert                          | Mohamed | Et les tests passent sur ma machine.                                                                                                                                                                       |
| La Pull Request se crée avec `Closes #1` | Salma   | Mais « ça marche sur ma machine » ne suffit pas. On ouvre une Pull Request. **Ces deux mots, « Closes #1 », relient le code au besoin : l'issue se fermera toute seule quand le code sera en production.** |

_Si vous avez du temps_ (Salma) : La Pull Request impose aussi une relecture : personne ne pousse directement sur la branche principale, même pas nous.

## 02:05 · Phase 3 : Build

| Repère                           | Qui     | À dire                                                                                                                                                                                                                            |
| -------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Les checks démarrent sous la PR  | Mohamed | Personne n'a rien lancé : la Pull Request a déclenché le pipeline toute seule.                                                                                                                                                    |
| Le graphe des jobs (badge ×16)   | Salma   | Voici la chaîne CI/CD. Remarquez que les tests et la sécurité tournent **en parallèle** : on gagne du temps. La vidéo est accélérée ici, le vrai pipeline dure quelques minutes.                                                  |
| Sortie de Vite et `version.json` | Mohamed | Le build produit le site, et grave dedans la version et le commit.                                                                                                                                                                |
| `docker build` réussi            | Salma   | **Puis ce même build est emballé dans une image Docker. Un seul build, qu'on va tester, publier et déployer : build once, deploy many.** C'est aussi le lien avec notre module : le conteneur, c'est de la virtualisation légère. |

## 03:05 · Phase 4 : Test

| Repère                                | Qui     | À dire                                                                                                                                                                                                            |
| ------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Jobs Qualité, Tests, Sécurité dépliés | Mohamed | Lint, types, formatage, tests sur deux versions de Node, couverture à 100 %, recherche de secrets, failles des dépendances, test du parcours utilisateur dans un vrai navigateur, scan de l'image. Tout est vert. |
| « All checks have passed »            | Salma   | Mais un pipeline vert ne prouve pas grand-chose. Ce qui compte, c'est ce qu'il fait quand le code est faux.                                                                                                       |
| Carte « Et si le code était faux ? »  | Salma   | Alors on a préparé une deuxième Pull Request, avec un bug volontaire dans le filtre par date.                                                                                                                     |
| Croix rouge sur Tests                 | Mohamed | Le lint passe, le code est « propre »… mais trois tests échouent.                                                                                                                                                 |
| Zoom sur **Merging is blocked**       | Salma   | **Et le bouton Merge est bloqué. Ce bug n'atteindra jamais la production. Il a été trouvé en une minute, par une machine, et pas par un utilisateur.**                                                            |

_Pause conseillée sur le bouton bloqué (2 secondes de silence) : c'est le moment fort de la démo._

## 04:20 · Phase 5 : Release

| Repère                          | Qui     | À dire                                                                                                                                                                                                       |
| ------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Approve par le compte du binôme | Salma   | Retour à la bonne Pull Request. Je la relis et je l'approuve depuis mon compte.                                                                                                                              |
| Merge confirmé                  | Mohamed | On fusionne dans la branche principale. Le pipeline repart, cette fois avec les étapes de livraison.                                                                                                         |
| Page **Releases** : `v1.0.N`    | Mohamed | Une release est créée automatiquement, avec ses notes de version générées à partir des Pull Requests, et le site en pièce jointe.                                                                            |
| Page **Packages** : 3 tags      | Salma   | Et l'image est publiée sur le registre de GitHub, avec sa version et le commit. **On ne reconstruit rien : c'est exactement l'image qui vient d'être testée. Et une version publiée ne change plus jamais.** |

## 05:15 · Phase 6 : Deploy

| Repère                             | Qui     | À dire                                                                                                                                                                                           |
| ---------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Bandeau « Waiting for review »     | Mohamed | Le pipeline s'arrête : il attend une validation avant la production.                                                                                                                             |
| **Approve and deploy**             | Salma   | **C'est la porte d'approbation. Un humain valide : c'est de la livraison continue. Sans cette porte, ce serait du déploiement continu**, et on n'aurait rien à changer d'autre dans le pipeline. |
| Le job passe au vert, URL affichée | Mohamed | Déployé sur GitHub Pages. Aucune commande tapée à la main.                                                                                                                                       |

## 06:10 · Phase 7 : Operate

| Repère                                | Qui     | À dire                                                                                                                                                        |
| ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Smoke test « 2 passed »               | Mohamed | Le pipeline ne se contente pas de déployer : il vérifie que la nouvelle version répond vraiment, et rejoue le parcours utilisateur sur le site en production. |
| Site en production, zoom sur le badge | Salma   | **Et voilà le badge dont on vous parlait : nouvelle version, et le commit exact de notre Pull Request.** Les salles sont là.                                  |
| Carte #1 dans Done                    | Mohamed | Et l'issue #1 s'est fermée toute seule. Du besoin à la production, tout est tracé.                                                                            |
| Workflow Rollback, saisie de version  | Salma   | Maintenant, imaginons que cette version pose problème. Que fait-on ?                                                                                          |
| Le site revient à l'ancienne version  | Mohamed | Un clic, et la version précédente est redéployée en une minute, sans rien reconstruire.                                                                       |
| Retour à la bonne version (×16)       | Salma   | **C'est le temps de restauration, une des quatre métriques DORA. Ici : environ une minute.** Puis on revient à la nouvelle version de la même façon.          |

## 07:30 · Phase 8 : Monitor

| Repère                                        | Qui     | À dire                                                                                                                                                                                             |
| --------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Liste des exécutions « schedule »             | Mohamed | Toutes les trente minutes, une sonde vérifie la production, même quand personne ne regarde.                                                                                                        |
| Tableau : code 200, temps de réponse, version | Mohamed | Code HTTP, temps de réponse, version en ligne : tout est mesuré.                                                                                                                                   |
| L'issue créée par `github-actions`            | Salma   | Et si quelque chose ne va pas ? Regardez l'auteur de cette issue : **ce n'est pas nous, c'est la machine.** Hier, on a simulé une panne : la sonde l'a détectée et a ouvert un ticket toute seule. |
| L'issue dans la colonne Todo                  | Salma   | **Et ce ticket arrive où ? Dans le backlog, à la phase Plan. Ce qu'on observe en production redevient du travail planifié. La boucle est bouclée.**                                                |

## 08:45 · Carte de fin

| Repère                                      | Qui     | À dire                                                                                                                                                |
| ------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| « 8 phases, 8 outils, 0 commande manuelle » | Mohamed | De l'idée à la production : huit phases, huit outils, et aucune commande tapée à la main en production.                                               |
| Délai de mise en production                 | Mohamed | **Temps total entre notre commit et la production vérifiée : [lire le chiffre]. C'est notre délai de mise en production, la deuxième métrique DORA.** |

_[Arrêter la vidéo, revenir au PowerPoint, slide 34.]_

---

## Si quelque chose se passe mal

| Situation                                        | Que faire                                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| La vidéo est en avance sur le commentaire        | Barre d'espace, finir la phrase clé, relancer.                                           |
| Vous avez pris du retard global                  | Ne dites plus que les phrases en gras jusqu'à la fin du chapitre.                        |
| Un mot technique vous échappe                    | Décrivez ce qu'on voit (« ici, le pipeline s'arrête et attend ») : c'est toujours juste. |
| La vidéo ne se lance pas                         | Copie sur clé USB ; sinon, commentez les captures des slides 31 à 33 avec ce même texte. |
| Le professeur pose une question pendant la vidéo | Pause, répondre en deux phrases, relancer.                                               |
