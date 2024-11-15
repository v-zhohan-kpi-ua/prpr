import { DocumentType } from "../documents";
import { BaseNumber } from "./base";

function parseNumberToObject(number: string): BaseNumber {
  const parsed = number.split("/");

  if (parsed.length !== 3)
    throw new Error(
      `Number should contain 3 components (type, year, id). Found only ${parsed.length} components.`
    );

  const [type, year, id] = parsed;

  if (Object.values(DocumentType).includes(type as DocumentType) === false)
    throw new Error(`Invalid document type: ${type}`);

  return {
    type: type as DocumentType,
    year: parseInt(year),
    id,
  };
}

export { parseNumberToObject };
