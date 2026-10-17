# Au chalet — site familial de procédures

Site statique qui regroupe les « modes d'emploi » de la maison (détartrer la machine à café,
relancer la box, couper l'eau…). Lu sur téléphone, debout devant l'appareil, par des adultes
**et des enfants**. Édité par la famille via **Pages CMS**, hébergé sur **Cloudflare Pages**,
protégé par **Cloudflare Access**.

L'esthétique est une exigence de premier rang : toute modification d'UI doit respecter la
charte ci-dessous et la maquette validée (direction « C — Chalet alpin »).

## Stack

| Brique | Choix |
|---|---|
| Framework | Astro 7 (sortie statique, content collections, `astro:assets`) |
| Contenu | Markdown + frontmatter YAML dans `src/content/procedures/` |
| Édition | Pages CMS (`.pages.yml`), collaborateurs invités par email |
| Hébergement | Cloudflare Pages, build auto sur push `main` |
| Accès | Cloudflare Access : bypass IP maison + OTP email (session 30 j) |
| Police | Nunito Variable (auto-hébergée via `@fontsource-variable/nunito`) |
| QR codes | `qrcode`, générés au build (`/etiquettes/`) |

Node ≥ 22.22 (exigé par Astro 7, voir `.nvmrc`).

## Commandes

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # sortie dans dist/
npm run preview
npm run check     # vérification TypeScript / Astro
```

## Arborescence

```
src/
  content.config.ts          # schéma Zod du modèle Procédure
  content/procedures/*.md    # une fiche = un fichier (nom = slug de l'URL /p/<slug>/)
  assets/photos/             # photos uploadées par le CMS (optimisées au build)
  data/rubriques.ts          # rubriques : libellé, icône, ton couleur (source de vérité)
  data/site.ts               # nom du site, URL du CMS, numéro d'urgence
  lib/procedures.ts          # requêtes : tri, filtres, URLs
  components/                # Icon, Media, SiteHeader, Mountains, ProcedureRow, SiteFooter
  layouts/Base.astro
  pages/
    index.astro              # accueil + recherche client
    rubriques/[slug].astro
    p/[slug].astro           # fiche procédure (étapes cochables)
    enfants.astro            # vue enfants (public = tous, hors urgences)
    etiquettes.astro         # planche A4 d'étiquettes QR ; ?p=<slug> pour une seule
  scripts/kids.ts            # bascule mode enfants (mémorisée en localStorage)
  styles/global.css          # tokens + composants
scripts/cf-access-home-ip.sh # cron Unraid : MAJ de l'Access Group avec l'IP de la box
.pages.yml                   # configuration Pages CMS
public/_headers              # en-têtes Cloudflare (noindex, cache /_astro)
```

## Modèle Procédure (frontmatter)

| Champ | Type | Notes |
|---|---|---|
| `titre` | string, requis | Commence par un verbe |
| `categorie` | enum, requis | `cuisine` `chauffage` `reseau` `exterieur` `urgences` |
| `appareil` | string | Modèle ou emplacement |
| `public` | `tous` \| `adultes` | `adultes` = masqué dans la vue enfants |
| `duree` | string | « 15 min » |
| `photo_principale` | image | Chemin relatif `../../assets/photos/xxx.jpg` |
| `materiel` | string[] | |
| `avertissements` | string[] | Encadré rouge « Attention » |
| `etapes` | `{ texte, photo? }[]`, min 1 | |
| `date` | date | Tri « Ajoutées récemment » |
| corps Markdown | | Section « Bon à savoir » (facultatif) |

Le schéma tolère `""` et `null` (valeurs que le CMS peut écrire pour un champ vidé).
**Toute modification du modèle doit être répercutée dans `content.config.ts` ET `.pages.yml`.**
Ajouter une rubrique : `src/data/rubriques.ts` + options `categorie` de `.pages.yml`.

## Charte « Chalet alpin »

- Police unique : Nunito, graisses 600 → 900. Titres en 900.
- Formes : rayons 22 px (cartes), 16 px (photos/vignettes), pilules 999 px. Pas d'ombres portées sauf boutons flottants.
- Signature : bandeau montagne (`Mountains.astro`) en bas de chaque en-tête.
- Icônes : trait 2 px, arrondies, `Icon.astro` uniquement (pas d'emoji).
- Couleurs : uniquement via les tokens de `global.css` (jamais de hex en dur dans les pages).

| Token | Clair | Sombre |
|---|---|---|
| `--bg` (lin) | `#F4EFE7` | `#141A18` |
| `--surface` | `#FFFFFF` | `#1D2522` |
| `--ink` (anthracite) | `#23292E` | `#EDE8E0` |
| `--accent` (sapin) | `#2F5D4A` | `#86C1A2` |
| `--header-bg` | `#23453A` | `#0E1613` |
| `--red` | `#B23A2E` | `#D2574A` |
| `--wood` / `--slate` | `#8A5A2B` / `#3B5466` | `#E0B887` / `#9DB8CC` |

Mode sombre **automatique** (`prefers-color-scheme`), pas de bouton. `.theme-light` force le
clair (page d'impression des étiquettes). Les rubriques utilisent les classes `tone-*`
(`--tone-bg` / `--tone-fg`).

## Règles

- Interface en français, tutoiement, phrases courtes ; textes enfants encore plus simples.
- Mobile d'abord (390 px), colonne max 560 px. Cibles tactiles ≥ 44 px. Contraste AA.
- Accessibilité : vrais `<button>`/`<a>`, `aria-label` sur les boutons-icônes, `aria-hidden` sur les icônes décoratives.
- ⚠️ **Aucun secret dans le repo** : pas de codes alarme, mots de passe Wi-Fi admin, codes portail.
  Renvoyer vers le gestionnaire de mots de passe familial.
- Site privé : `noindex` partout (meta, `_headers`, `robots.txt`).
- Le contenu actuel des fiches est un **exemple** (valeurs entre crochets à remplacer).

## Déploiement

### Cloudflare Pages
1. Workers & Pages → Create → Pages → Connect to Git → `FDUBX/au_chalet`.
2. Framework preset : Astro. Build command `npm run build`, output `dist`.
3. Variables d'environnement : `SITE_URL=https://maison.<domaine>` (QR codes) ; `NODE_VERSION=22.22.0` si `.nvmrc` n'est pas pris en compte.
4. Custom domain : `maison.<domaine>` (CNAME créé automatiquement, domaine déjà chez Cloudflare).

### Cloudflare Access (Zero Trust)
1. Access → Applications → Self-hosted : `maison.<domaine>` (+ `*.au-chalet.pages.dev` pour les previews).
2. Access Group « Maison » (inclus : IP de la box, mise à jour par `scripts/cf-access-home-ip.sh`).
3. Policy 1 — **Bypass** : groupe « Maison ».
4. Policy 2 — **Allow** : emails de la famille, login One-time PIN, session 30 jours.

### Pages CMS
1. Se connecter sur https://app.pagescms.org avec GitHub, installer la GitHub App sur `FDUBX/au_chalet`.
2. Inviter les membres de la famille comme **collaborateurs** (email, sans compte GitHub).
3. Validé : un upload écrit `../../assets/photos/<nom-aléatoire>.<ext>` dans la fiche, l'aperçu
   CMS et le build fonctionnent. Ne pas modifier `media.output` sans retester ce point.

## Backlog

- [x] Tester le CMS de bout en bout (création de fiche, photo, liste d'étapes) — validé le 2026-10-17 :
      chemins `../../assets/photos/<random>.<ext>` corrects, build OK.
- [ ] Nettoyer les photos orphelines (supprimer une fiche dans le CMS ne supprime pas ses photos).
- [ ] Champ `icone` facultatif par fiche (ex. télé ≠ icône Wi-Fi de la rubrique Réseau).
- [ ] Page procédure « version enfants » (texte agrandi, une étape par écran).
- [ ] PWA / hors-ligne (manifest + service worker) pour consultation sans réseau.
- [ ] GitHub Action de compression des photos à l'upload (poids du repo).
- [ ] Contacts utiles dans la rubrique Urgences (plombier, électricien…).
