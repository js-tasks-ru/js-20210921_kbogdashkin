/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }

  if (!size) {
    return '';
  }

  let lastStr = '';
  let lastStrCount = 0;
  const result = [];

  string.split('').forEach(char => {
    const isNewChar = char !== lastStr;

    if (
      isNewChar ||
      lastStrCount !== size
    ) {
      result.push(char);

      if (!isNewChar) {
        lastStrCount++;
      }
    }

    if (isNewChar) {
      lastStrCount = 1;
      lastStr = char;
    }
  });

  return result.join('');
}
