import { locationsRaw } from "./parse";
import { Location, LocationType } from "./types";

function getParents(
  data: Location[],
  child: Location,
  filterOutThisTypes: LocationType[] = [],
  parents: Location[] = []
): Location[] {
  const parent = data.find((v) => v.id === child.parent);

  if (!parent) {
    return parents;
  }

  return getParents(
    data,
    parent,
    filterOutThisTypes,
    filterOutThisTypes.includes(parent.type) ? parents : [...parents, parent]
  );
}

function getFullName(
  entity: Location,
  locales: ("uk" | "en")[] = ["uk", "en"],
  data: Location[] = locationsRaw
) {
  const parents = getParents(data, entity);

  const parentsFullNameByLocale = locales.reduce(
    (acc, locale) => {
      acc[locale] = parents
        .map((v) => v.public_name[locale])
        .join(", ")
        .trim();
      return acc;
    },
    {} as Record<(typeof locales)[number], string>
  );

  const parentsFullName = locales.reduce(
    (acc, locale) => {
      const fullName = parentsFullNameByLocale[locale];
      acc[locale] =
        fullName === ""
          ? entity.public_name[locale]
          : `${entity.public_name[locale]} (${fullName})`;
      return acc;
    },
    {} as Record<(typeof locales)[number], string>
  );

  return parentsFullName;
}

function findAllChildrenByParent(
  data: Location[],
  parent: Location
): Location[] {
  let allChildren: Location[] = [];

  function findChildren(parent: Location) {
    const children = data.filter((v) => v.parent === parent.id);
    allChildren = allChildren.concat(children);
    children.forEach((child) => {
      findChildren(child);
    });
  }

  findChildren(parent);
  return allChildren;
}

export { getParents, getFullName, findAllChildrenByParent };
