/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size !== 'number') return string;

  let result = '';
  let lastSymbol = '';
  let count = 0;

  for (let symbol of string) {
    if (symbol === lastSymbol) {
      count++;
    } else {
      lastSymbol = symbol;
      count = 1;
    }

    if (count <= size) {
      result += symbol;
    }
  }

  return result;
}
