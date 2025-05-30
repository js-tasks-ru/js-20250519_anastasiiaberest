/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const keys = path.split('.');

  return (obj) => {
    for (const value of keys) {
      if (obj.hasOwnProperty(value)) {
        obj = obj[value];
      } else {
        return;
      }
    }
    return obj;
  };

}
