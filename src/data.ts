export type Expose = {
  id: number;
  date: string; // AAAA-MM-JJ
  sujet: string;
  theme: "DevOps" | "Sécurité" | "Conteneurs" | "Cloud" | "IoT";
  salle: string;
};

export const EXPOSES: Expose[] = [
  { id: 1, date: "2026-11-11", sujet: "Culture DevOps et chaîne CI/CD", theme: "DevOps", salle: "Amphi A" },
  {
    id: 2,
    date: "2026-11-11",
    sujet: "Sécurité du cloud et responsabilité partagée",
    theme: "Sécurité",
    salle: "Amphi A",
  },
  {
    id: 3,
    date: "2026-11-25",
    sujet: "Docker : conteneurisation d'une application",
    theme: "Conteneurs",
    salle: "Salle 12",
  },
  {
    id: 4,
    date: "2026-12-02",
    sujet: "Déploiement d'une application sur une plateforme cloud",
    theme: "Cloud",
    salle: "Salle 12",
  },
  {
    id: 5,
    date: "2026-12-09",
    sujet: "Application serverless avec des fonctions",
    theme: "Cloud",
    salle: "Labo info 2",
  },
  {
    id: 6,
    date: "2026-12-16",
    sujet: "Infrastructure as Code avec Terraform",
    theme: "Cloud",
    salle: "Labo info 2",
  },
  {
    id: 7,
    date: "2026-12-23",
    sujet: "Edge et Fog Computing pour l'Internet des objets",
    theme: "IoT",
    salle: "Amphi B",
  },
  {
    id: 8,
    date: "2026-12-23",
    sujet: "Orchestration de conteneurs avec Kubernetes",
    theme: "Conteneurs",
    salle: "Amphi B",
  },
];
