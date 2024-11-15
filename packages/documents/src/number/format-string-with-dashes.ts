function formatStringWithDashes(str: string, chunkSize = 5) {
  const regex = new RegExp(`(.{${chunkSize}})`, "g");

  if (str.length % chunkSize === 0) {
    return str.replace(regex, "$1-").slice(0, -1);
  } else {
    return str.replace(regex, "$1-");
  }
}

export { formatStringWithDashes };
