function copyFields(from, to) {
  var keys = Object.keys(from);

  for (var n = 0; n < keys.length; n++) {
    var key = keys[n];
    to[key] = from[key];
  }
}

function ownConstructor(p) {
  return p.constructor !== Object.prototype.constructor && p.constructor;
}

function prototype(p) {
  p = p || {};

  var ownCtor = ownConstructor(p);

  var derive =
    ownCtor
      ? function own() {
          function constructor(args) {
            ownCtor.apply(this, args);
          }

          constructor.prototype = p;
          constructor.prototype.constructor = derive;

          var o = new constructor(arguments);
          return o;
        }
      : function derive(derived) {
          function constructor() {}
          constructor.prototype = p;
          constructor.prototype.constructor = derive;

          var o = new constructor();

          if (derived) {
            copyFields(derived, o);
          }

          return o;
        }

  derive.prototype = p;
  p.constructor.derive;

  return derive;
}

module.exports = prototype;

module.exports.extending = function(p, extension) {
  function constructor() {}
  constructor.prototype = p.prototype;
  var object = new constructor();
  copyFields(extension, object);

  var ownCtor = ownConstructor(p.prototype);

  return prototype(object);
};
