---
titre: Ajouter une rubrique
categorie: dev
appareil: Repo GitHub FDUBX/au_chalet
public: adultes
duree: 10 min
materiel:
  - Un accès au repo GitHub FDUBX/au_chalet
  - Claude Code ou un éditeur de code
avertissements:
  - "Modifier les trois fichiers dans le même commit : une rubrique présente dans le CMS mais absente du code fait échouer le build dès qu’une fiche l’utilise."
  - "Ne pas créer la rubrique uniquement depuis le CMS : il ne met à jour que .pages.yml."
etapes:
  - texte: "Ouvrir la page /icones/ du site et choisir une icône et une couleur (tone)."
  - texte: "Si l’icône manque : la copier sur lucide.dev (contenu intérieur du SVG) et l’ajouter dans src/data/icons.ts sous un nouveau nom."
  - texte: "Dans src/data/rubriques.ts, ajouter le nom court (slug) dans RUBRIQUE_SLUGS, juste avant urgences."
  - texte: "Toujours dans src/data/rubriques.ts, ajouter l’entrée de la rubrique dans RUBRIQUES : libellé, sous-titre, icône, couleur."
  - texte: "Dans .pages.yml, ajouter la rubrique dans la liste du champ categorie (même slug, même libellé)."
  - texte: "Faire un seul commit avec les trois fichiers, puis pousser sur main."
  - texte: "Vérifier dans Cloudflare Pages que le build est passé, puis que la rubrique apparaît sur l’accueil."
date: 2026-10-18
---

### Le plus rapide : demander à Claude Code

Dans le repo, une phrase suffit, la procédure est décrite dans `CLAUDE.md` :

```text
Ajoute une rubrique « Salle de bain » avec l’icône bath et le ton slate.
```

### Exemple : rubrique « Salle de bain »

`src/data/rubriques.ts`

```ts
export const RUBRIQUE_SLUGS = [
  'cuisine', 'chauffage', 'reseau', 'exterieur', 'voitures', 'dev',
  'salle-de-bain',
  'urgences',
] as const;

// dans RUBRIQUES :
'salle-de-bain': { slug: 'salle-de-bain', label: 'Salle de bain',
  sub: 'Douche, ventilation', icon: 'bath', tone: 'slate' },
```

`.pages.yml`, sous `categorie` → `options` → `values`

```yaml
- name: salle-de-bain
  label: Salle de bain
```

`src/data/icons.ts`, uniquement si l’icône n’existe pas encore

```ts
bath: '<path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/>',
```

### Repères

- Couleurs possibles : `wood`, `red`, `slate`, `sapin`, `stone`. `alert` est réservé à Urgences.
- L’ordre de `RUBRIQUE_SLUGS` est l’ordre d’affichage sur l’accueil.
- La grille d’accueil est sur deux colonnes : un nombre pair de rubriques évite une case seule.
