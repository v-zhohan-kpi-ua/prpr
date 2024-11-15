import { locationsRaw, regions as regionsFromParse } from "./parse";
import { Location, LocationType, LocationWithFullName } from "./types";
import { findAllChildrenByParent, getFullName } from "./utils";

const filterByOnRaw = ({
  types,
  regions = [],
}: {
  types?: LocationType[];
  regions: (keyof typeof regionsFromParse)[];
}) => {
  let result: Location[] = locationsRaw;

  if (regions.includes("vo")) {
    result = [
      regionsFromParse.vo,
      ...findAllChildrenByParent(locationsRaw, regionsFromParse.vo),
    ];
  }

  if (types) {
    result = result.filter((v) => types.includes(v.type));
  }

  return result;
};

const transformToWithFullNameOnRaw = (
  locations: Location[]
): LocationWithFullName[] => {
  return locations.map((v) => {
    return {
      ...v,
      full_name: {
        ...getFullName(v, ["uk", "en"], locations),
      },
    };
  });
};

export { filterByOnRaw, transformToWithFullNameOnRaw };
