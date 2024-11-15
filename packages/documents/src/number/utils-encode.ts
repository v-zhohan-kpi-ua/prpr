import { BaseNumber } from "./base";

function encodeNumber(params: BaseNumber): string {
  const { id, year, type } = params;

  return `${type}/${year}/${id}`;
}

export { encodeNumber };
