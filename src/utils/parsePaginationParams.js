const parseNumber = (value, defaultValue) => {
  if (typeof value !== 'string') {
    return defaultValue;
  }
  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }
  return parsedNumber;
};
export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  return {
    page: parseNumber(page, 1),
    perPage: parseNumber(perPage, 5),
  };
};
