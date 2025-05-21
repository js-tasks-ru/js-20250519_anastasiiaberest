/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {


  const sorted = [...arr].sort((a, b) => {
    return param === 'desc' ?
      b.localeCompare(a, ['ru', 'en'], { sensitivity: 'variant', caseFirst: 'upper' }) :
      a.localeCompare(b, ['ru', 'en'], { sensitivity: 'variant', caseFirst: 'upper' });
  });

  return sorted;
}
