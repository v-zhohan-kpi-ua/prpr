import { z } from 'zod';

import raw from './static/locations.min.json';
import { Location } from './types';

const locationNameSchema = z.record(z.string());

const locationSchema = z.object({
  id: z.string(),
  parent: z.union([z.string(), z.null()]),
  type: z.enum([
    'VILLAGE',
    'DISTRICT',
    'STATE',
    'COMMUNITY',
    'CITY',
    'URBAN',
    'SETTLEMENT',
    'CAPITAL_CITY',
  ]),
  name: locationNameSchema,
  public_name: locationNameSchema,
  post_code: z.array(z.string()),
  loc: z.object({
    lat: z.union([z.number(), z.null()]),
    lon: z.union([z.number(), z.null()]),
  }),
  meta: z.object({
    osm_id: z.union([z.string(), z.null()]),
    google_maps_place_id: z.union([z.string(), z.null()]),
  }),
});

const locationsSchema = z.array(locationSchema);

const locationsRaw = locationsSchema.parse(raw) as Location[];

const regions = {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  vo: locationsRaw.find((v) => v.id === 'UA07000000000024379')!,
};

export { regions, locationsRaw, locationSchema };
