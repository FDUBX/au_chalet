import type { IconName } from './icons';

export type Tone = 'wood' | 'red' | 'slate' | 'sapin' | 'stone' | 'alert';

export interface Rubrique {
  slug: RubriqueSlug;
  label: string;
  sub: string;
  icon: IconName;
  tone: Tone;
}

/**
 * Ordre d'affichage = ordre de ce tableau. Garder synchronisé avec .pages.yml
 * (champ `categorie`). Procédure d'ajout : voir CLAUDE.md › « Ajouter une rubrique ».
 */
export const RUBRIQUE_SLUGS = ['cuisine', 'chauffage', 'reseau', 'exterieur', 'voitures', 'dev', 'urgences'] as const;
export type RubriqueSlug = (typeof RUBRIQUE_SLUGS)[number];

export const RUBRIQUES: Record<RubriqueSlug, Rubrique> = {
  cuisine:   { slug: 'cuisine',   label: 'Cuisine',   sub: 'Appareils, entretien',   icon: 'coffee', tone: 'wood' },
  chauffage: { slug: 'chauffage', label: 'Chauffage', sub: 'Poêle, radiateurs',      icon: 'flame',  tone: 'red' },
  reseau:    { slug: 'reseau',    label: 'Réseau',    sub: 'Box, Wi-Fi, télé',       icon: 'wifi',   tone: 'slate' },
  exterieur: { slug: 'exterieur', label: 'Extérieur', sub: 'Jardin, portail, neige', icon: 'tree',   tone: 'sapin' },
  voitures:  { slug: 'voitures',  label: 'Voitures',  sub: 'Entretien, pneus',       icon: 'car',    tone: 'stone' },
  dev:       { slug: 'dev',       label: 'Dev',       sub: 'Faire évoluer le site',  icon: 'code',   tone: 'slate' },
  urgences:  { slug: 'urgences',  label: 'Urgences',  sub: 'Eau, électricité, gaz',  icon: 'alert',  tone: 'alert' },
};

/** Rubriques affichées dans la grille d'accueil (Urgences a sa propre carte). */
export const GRID_RUBRIQUES = RUBRIQUE_SLUGS.filter((s) => s !== 'urgences').map((s) => RUBRIQUES[s]);
