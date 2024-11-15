import { NextRequest } from 'next/server';
import {
  filterByOnRaw,
  getByName,
  type LocationType,
  transformToWithFullNameOnRaw,
} from '@prpr/locations';

const locationsWithVo = filterByOnRaw({
  regions: ['vo'],
});

const locationsWithVoAndFullNames =
  transformToWithFullNameOnRaw(locationsWithVo);

const searchableTypes: LocationType[] = [
  'CAPITAL_CITY',
  'CITY',
  'SETTLEMENT',
  'URBAN',
  'VILLAGE',
];

const searchableLocations = locationsWithVoAndFullNames.filter((v) => {
  return searchableTypes.includes(v.type);
});

export enum GetSearchResults {
  FULL = 'all',
  ONLY_TO_FIND_ID_BY_FULL_NAME = 'srchid',
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('q');
  const limit = Number(searchParams.get('limit') ?? 10);

  const type = searchParams.get('t') ?? GetSearchResults.FULL;

  // Don't return all locations in such case
  if (query === null || query.trim() === '') return Response.json([]);

  const queryAsArray = query.split(' ');

  const result = getByName(
    {
      name: queryAsArray,
      limit: Number.isNaN(limit) ? undefined : limit,
    },
    searchableLocations,
  );

  if (type === GetSearchResults.FULL) return Response.json(result);

  if (type === GetSearchResults.ONLY_TO_FIND_ID_BY_FULL_NAME)
    return Response.json(
      result.map((v) => {
        const { id, full_name } = v;

        return { id, full_name };
      }),
    );
}
