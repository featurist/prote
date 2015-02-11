require("chai").should();
var prototype = require('..');

describe("prototypes", function() {
  it("can create a prototype", function() {
    var a = {
      base: "base",
      overridden: "a"
    };

    var p = prototype(a);

    var b = p({
      overridden: "b",
      derived: "derived"
    });

    b.base.should.equal("base");
    b.overridden.should.equal("b");
    b.derived.should.equal("derived");

    Object.getPrototypeOf(b).should.equal(a);
  });

  it("properties are shared between derived objects", function() {
    var array = [ 1, 2, 3 ];
    var a = prototype({
      array: array
    });

    var b = a();
    var c = a();

    b.array.should.equal(array);
    c.array.should.equal(array);
    b.should.not.equal(c);
  });

  it("prototype can extend another prototype", function() {
    var array = [ 1, 2, 3 ];

    var a = prototype({
      a: true,
      name: "a"
    });

    var b = prototype.extending(a, {
      b: true,
      name: "b"
    });

    var objectA = a();
    var objectB = b();

    objectA.a.should.equal(true);
    objectA.name.should.equal("a");
    (objectA instanceof a).should.equal(true);
    objectB.a.should.equal(true);
    objectB.b.should.equal(true);
    objectB.name.should.equal("b");
    (objectB instanceof a).should.equal(true);
    (objectB instanceof b).should.equal(true);
  });

  it("prototype object defaults to empty object, if not given", function() {
    var a = prototype();
    a.prototype.a = "a";
    var b = a();
    b.a.should.equal("a");
  });

  it("prototype can extend another constructor", function() {
    var a = prototype.extending(Array, {
      a: "a"
    });
    var b = a();

    b.push("item 1");
    (b instanceof a).should.equal(true);
    (b instanceof Array).should.equal(true);
    b.a.should.equal("a");
    b.length.should.equal(1);
    b[0].should.equal("item 1");
  });

  it("a prototype can be extended after creation", function() {
    var a = prototype({
      a: "a"
    });
    a.prototype.b = "b";
    var c = a({
      c: "c"
    });

    c.a.should.equal("a");
    c.b.should.equal("b");
    c.c.should.equal("c");
  });

  it("prototype is a function", function() {
    (prototype instanceof Function).should.equal(true);
  });

  it("prototype.extending is a function", function() {
    (prototype.extending instanceof Function).should.equal(true);
  });

  it('can declare a constructor', function () {
    var a = prototype({
      constructor: function (value) {
        this.a = value;
        this.b = value;
      }
    });

    var objectA = a('a');
    objectA.a.should.equal('a');
    objectA.b.should.equal('a');
  });

  it('extending prototype uses base constructor', function () {
    var a = prototype({
      constructor: function (value) {
        this.value = value;
      }
    });

    var b = prototype.extending(a, {
      b: 'b'
    });

    var objectB = b('b');
    objectB.value.should.equal('b');
    objectB.b.should.equal('b');
  });

  it("can call its own constructor", function() {
    var a = prototype({
      create: function(value) {
        var self = this;
        return self.constructor({
          value: value
        });
      },
      isA: true
    });

    var b = prototype.extending(a, {
      isB: true
    });

    var x = a();
    x.isA.should.be.true;
    createdByA = x.create("a");
    createdByA.value.should.equal("a");
    createdByA.isA.should.be.true;

    var y = b();
    y.isA.should.be.true;
    y.isB.should.be.true;
    createdByB = y.create("b");
    createdByB.value.should.equal("b");
    createdByB.isA.should.be.true;

    createdByB.isB.should.be.true;
  });
});
