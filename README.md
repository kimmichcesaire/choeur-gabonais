# Chœur Gabonais de France

Site web de l'association Chœur Gabonais de France (CGDF) — présentation, événements, galerie médias, candidature en ligne et espace d'administration.

**Site en production : [choeurgabonaisdefrance.fr](https://choeurgabonaisdefrance.fr)**

## Stack technique

- **Frontend** — React 18 + TypeScript + Vite, routage avec React Router, état global avec Zustand
- **Base de données** — [Supabase](https://supabase.com) (PostgreSQL managé, authentification, stockage de fichiers)
- **Emails transactionnels** — [Resend](https://resend.com), déclenchés via des Supabase Edge Functions (`supabase/functions/`)
- **Hébergement** — [Cloudflare Workers](https://developers.cloudflare.com/workers/) (assets statiques + routage SPA)
- **Analytics** — Cloudflare Web Analytics (sans cookies, sans données personnelles)

> Le dossier `apps/backend` (NestJS) fait partie du projet mais n'est **pas déployé en production** — les formulaires du site appellent directement les Supabase Edge Functions. Il reste disponible pour du développement local ou une éventuelle migration future.

## Structure du monorepo

```
apps/
  frontend/    → site React (déployé sur Cloudflare Workers)
  backend/     → API NestJS (non déployée actuellement)
packages/
  shared/      → types et utilitaires partagés entre frontend et backend
supabase/
  functions/   → Edge Functions (submit-contact, submit-application)
```

## Démarrage en local

Prérequis : Node.js 20+, un compte Supabase, un compte Resend (pour les emails).

```bash
npm install
```

Copier les fichiers d'environnement d'exemple et remplir les vraies valeurs :

```bash
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```

Lancer le frontend seul (suffisant pour la majorité des besoins, les formulaires appellent Supabase directement) :

```bash
npm run frontend
```

Lancer frontend + backend NestJS en parallèle :

```bash
npm run dev
```

Le frontend est servi sur `http://localhost:5173`.

## Déploiement

- **Frontend** : déploiement automatique sur Cloudflare Workers à chaque `git push` sur `main`.
- **Edge Functions Supabase** : ne se redéploient pas automatiquement, il faut la CLI Supabase :
  ```bash
  npx supabase functions deploy submit-contact
  npx supabase functions deploy submit-application
  ```
- **Domaine** : `choeurgabonaisdefrance.fr`, DNS géré chez Cloudflare, nom de domaine enregistré chez OVH.

## Maintenance

Une Issue GitHub s'ouvre automatiquement tous les trimestres (`.github/workflows/maintenance-reminder.yml`) avec une checklist : dépendances à mettre à jour, quotas des services gratuits à vérifier, site et formulaires à tester.

Un ping quotidien (`.github/workflows/supabase-keepalive.yml`) maintient le projet Supabase actif pour éviter la mise en pause automatique du plan gratuit.

## Licence

Projet privé, propriété du Chœur Gabonais de France.
