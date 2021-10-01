/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function (obj) {
    if (!path) {
      return obj;
    }
    const parts = path.split('.');
    for (let i = 0; i < parts.length; ++i) {
      if (!obj) {
        return obj;
      }

      const property = parts[i];

      obj = obj[property];
    }
    return obj;
  };
}
