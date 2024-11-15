import { customAlphabet } from "nanoid";
import { formatStringWithDashes } from "./format-string-with-dashes";

type GenerateRandomHumanReadableNumberParams = {
  length?: number;
  chunkSizeDashes?: number;
  type?: "numbers" | "numbers-with-lowercase-chars";
};

const alphabetNumbersWithLowercaseChars =
  "0123456789abcdefghijklmnopqrstuvwxyz";
const alphabetNumbers = "0123456789";

const randomAlphabetNsWithLoCh = customAlphabet(
  alphabetNumbersWithLowercaseChars
);
const randomAlphabetNs = customAlphabet(alphabetNumbers);

function generateRandomHumanReadableNumber(
  params?: GenerateRandomHumanReadableNumberParams
) {
  const {
    length = 13,
    chunkSizeDashes = 5,
    type = "numbers-with-lowercase-chars",
  } = params || {};

  let number;

  if (type === "numbers") {
    number = randomAlphabetNs(length);
  }

  if (type === "numbers-with-lowercase-chars") {
    number = randomAlphabetNsWithLoCh(length);
  }

  return formatStringWithDashes(number!, chunkSizeDashes);
}

export { generateRandomHumanReadableNumber };
