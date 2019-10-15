// snippet.js

/** Class of a snippet of a code. */
class Snippet {
  /**
   * @constructor
   * @param {any} fileName - file name.
   * @param {any} code - code.
   * @param {any} numTags - number of tags.
   * @param {any} tags - all tags.
   */
  constructor(fileName, code, ...tags) {
    this.name = fileName;
    this.code = code;
    this.tags = tags;
    this.lines = code.split(/\r\n|\r|\n/).length;
  }
  /**
   * @function
   * @name myFunction
   * @param {any} tagCheck - check tag.
   * @return {boolean} boolean
   */
  hasTag(tagCheck) {
    if (this.tags.hasOwnProperty(tagCheck)) {
      if (Object.prototype.hasOwnProperty.call(this.tags, tagCheck)) {
        return true;
      }
    } else {
      return false;
    }
  }
}

module.exports = {
  Snippet: Snippet,
};

// module export=
// (property) export=: {
//     [x: string]: any;
//     Snitppet: typeof Snippet;
// }
