import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { RUBRIQUE_SLUGS } from './data/rubriques';

/**
 * Modèle « Procédure ».
 * Les fichiers sont édités via Pages CMS (voir .pages.yml) : les champs vides
 * peuvent arriver en "" ou null, d'où les préprocesseurs tolérants.
 */
const empty = (v: unknown) => (v === '' || v === null ? undefined : v);
const toList = (v: unknown) => (Array.isArray(v) ? v.filter((x) => x !== '' && x !== null) : []);

const procedures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/procedures' }),
  schema: ({ image }) => {
    const optImage = () => z.preprocess(empty, image().optional());

    return z.object({
      titre: z.string().min(1),
      categorie: z.enum(RUBRIQUE_SLUGS),
      appareil: z.preprocess(empty, z.string().optional()),
      public: z.preprocess(empty, z.enum(['tous', 'adultes']).default('tous')),
      duree: z.preprocess(empty, z.string().optional()),
      photo_principale: optImage(),
      materiel: z.preprocess(toList, z.array(z.string())),
      avertissements: z.preprocess(toList, z.array(z.string())),
      etapes: z
        .array(
          z.object({
            texte: z.string().min(1),
            photo: optImage(),
          }),
        )
        .min(1),
      date: z.preprocess(empty, z.coerce.date().optional()),
    });
  },
});

export const collections = { procedures };
