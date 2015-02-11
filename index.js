function prototype(p) {
  function constructor() {}

  p = p || {};

  constructor.prototype = p;

  function derive(derived) {
    var o = new constructor();

    if (derived) {
      var keys = Object.keys(derived);

      for (var n = 0; n < keys.length; n++) {
        var key = keys[n];
        o[key] = derived[key];
      }
    }

    return o;
  }

  derive.prototype = p;
  constructor.prototype.constructor = derive;

  return derive;
}

module.exports = prototype;

module.exports.extending = function(p, obj) {
  return prototype(prototype(p.prototype)(obj));
};
