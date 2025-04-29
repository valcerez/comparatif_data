# 📊 Outil Comparatif de Données Publiques

Comparateur interactif open source permettant de visualiser, analyser et interpréter des données issues de jeux de données publics.

> 🧠 Pensé pour les curieux, étudiants, enseignants, journalistes, citoyens et développeurs débutants.

---

## 🚀 Fonctionnalités

- ✅ Sélection de 2 jeux de données CSV (ex: PIB, population, éducation, etc.)
- ✅ Sélection d’un pays commun aux deux jeux
- ✅ Visualisation en graphique avec **double axe Y**
- ✅ Calcul automatique de la **corrélation de Pearson**
- ✅ **Explication pédagogique** de la corrélation
- ✅ Sélection dynamique de plage d’années
- ✅ Responsive **mobile-first** (testé iPhone)
- ✅ Navigation fluide avec animations (Framer Motion)

---

## 🖼️ Aperçu

![Aperçu mobile/desktop à ajouter ici plus tard]

---

## 🏗️ Stack technique

| Élément | Techno |
|--------|--------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | React + TailwindCSS + shadcn/ui |
| Graphiques | [Recharts](https://recharts.org/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Analyse stats | Corrélation de Pearson (JS) |
| Données | CSV publics (dans `/public/datasets/`) |
| Déploiement | Vercel (gratuit) |
| Versioning | Git + GitHub |

---

## 📁 Structure du projet

```bash
/app
  page.tsx             # page principale
  /api/datasets        # API listant les datasets disponibles

/components
  DatasetSelector.tsx  # Sélection des fichiers
  ChartDisplay.tsx     # Graphique Recharts
  CorrelationInfo.tsx  # Résumé du résultat

/lib
  dataUtils.ts         # Chargement & nettoyage CSV
  statsUtils.ts        # Calcul de corrélation
  explanationUtils.ts  # Interprétation pédagogique
  datasetLabels.ts     # Noms humains des fichiers

/public/datasets/
  *.csv                # Fichiers sources publics

  📦 Installation
  git clone https://github.com/<ton_user>/outil_comparatif_data.git
cd outil_comparatif_data
npm install
npm run dev