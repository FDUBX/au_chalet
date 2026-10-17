import { getCollection, type CollectionEntry } from 'astro:content';
import { RUBRIQUES, type RubriqueSlug } from '../data/rubriques';

export type Procedure = CollectionEntry<'procedures'>;

const collator = new Intl.Collator('fr', { sensitivity: 'base' });

/** Toutes les procédures, triées par titre. */
export async function getProcedures(): Promise<Procedure[]> {
  const all = await getCollection('procedures');
  return all.sort((a, b) => collator.compare(a.data.titre, b.data.titre));
}

/** Les plus récentes (champ `date`), puis par titre. */
export function byRecent(list: Procedure[]): Procedure[] {
  return [...list].sort((a, b) => {
    const da = a.data.date?.getTime() ?? 0;
    const db = b.data.date?.getTime() ?? 0;
    return db - da || collator.compare(a.data.titre, b.data.titre);
  });
}

export function inRubrique(list: Procedure[], slug: RubriqueSlug): Procedure[] {
  return list.filter((p) => p.data.categorie === slug);
}

/** Procédures visibles dans la vue enfants : « Tout le monde », hors urgences. */
export function forKids(list: Procedure[]): Procedure[] {
  return list.filter((p) => p.data.public === 'tous' && p.data.categorie !== 'urgences');
}

export const procedureUrl = (p: Procedure) => `/p/${p.id}/`;
export const rubriqueUrl = (slug: RubriqueSlug) => `/rubriques/${slug}/`;
export const rubriqueOf = (p: Procedure) => RUBRIQUES[p.data.categorie];

export function plural(n: number, one: string, many: string) {
  if (n === 0) return `Aucune ${one}`;
  return `${n} ${n > 1 ? many : one}`;
}
