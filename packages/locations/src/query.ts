import { locationsRaw } from "./parse";
import { Location } from "./types";

function getAll(data = locationsRaw) {
  return data;
}

function getById<T extends Location>(
  id: string,
  data: T[] = locationsRaw as T[]
) {
  const result = data.find((v) => v.id === id);

  return result ? { ...result } : result;
}

function getByName<T extends Location>(
  {
    name,
    limit = 10,
  }: {
    name: string | string[];
    limit?: number;
  },
  data: T[] = locationsRaw as T[]
) {
  let result: T[] = [];

  if (!Array.isArray(name)) {
    result = data.filter(
      (v) =>
        v.name["uk"].toLowerCase().includes(name.toLowerCase()) ||
        v.name["en"].toLowerCase().includes(name.toLowerCase())
    );
  } else {
    result = data.filter((v) =>
      name.some(
        (n) =>
          v.name["uk"].toLowerCase().includes(n.toLowerCase()) ||
          v.name["en"].toLowerCase().includes(n.toLowerCase())
      )
    );
  }

  result = result.slice(0, limit);

  return result;
}

export { getAll, getById, getByName };
