/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }

  const newObj = {};

  for (const key in obj) {
    const value = obj[key];
    newObj[value] = key;
  }

  return newObj;
}
