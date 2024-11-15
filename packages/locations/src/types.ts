import { z } from 'zod';
import { locationSchema } from './parse';

type Location = z.infer<typeof locationSchema>;
type LocationWithFullName = Location & {
  full_name: { uk: string; en: string };
};
type LocationType = Location['type'];

export { Location, LocationWithFullName, LocationType };
