/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const parts = path.split('.');

  return function (obj) {
    if (!path) {
      return obj;
    }

    for (const property of parts) {
      if (obj === undefined) {
        break;
      }

      obj = obj[property];
    }
    return obj;
  };
}
