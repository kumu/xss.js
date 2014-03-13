var expect = require("chai").expect;
var xss = require("..");

describe("xss()", function() {
  function html(given, expected) {
    if (arguments.length == 1) expected = given;
    return function() { expect(xss(given), given).to.eql(expected); };
  }

  function url(given, expected) {
    if (arguments.length == 1) expected = given;
    return function() { expect(xss.url(given), given).to.eql(expected); };
  }

  describe("strips", function() {
    it("<script>", html('<script>doevil</script>', ''));
    it("<style>", html('<style>doevil</style>', ''));
    it("<iframe>", html('<iframe></iframe>', ''));
    it("[id]", html('<img id="one">', '<img>'));
    it("[class]", html('<img class="one">', '<img>'));
    it("[style]", html('<img style="test">', '<img>'));
    it("[on*]", html('<img onclick="doevil">', '<img>'));
    it("[data-*]", html('<img data-test="test">', '<img>'));
    it("uncontained <li>", html('<div><li></li></div>', '<div></div>'));
    it("uncontained <thead>", html('<thead></thead>', ''));
    it("uncontained <tbody>", html('<tbody></tbody>', ''));
    it("uncontained <tfoot>", html('<tfoot></tfoot>', ''));
    it("uncontained <tr>", html('<tr></tr>', ''));
    it("uncontained <td>", html('<td></td>', ''));
    it("uncontained <th>", html('<th></th>', ''));
  });

  // TODO: Add remaining elements
  describe("permits", function() {
    it("<a>", html('<a>one</a>'));
    it("<a href>", html('<a href="#">one</a>'));
    it("<aside>", html('<aside></aside>'));
    it("<br>", html('<br>'));
    it("<li (ul)>", html('<ul><li>one</li></ul>'));
    it("<li (ol)>", html('<ol><li>one</li></ol>'));
    it("<hr>", html('<hr>'));
    it("<table>", html('<table><tbody><tr><th></th></tr><tr><td></td></tr></tbody></table>'));

    // Decided against allowing these for now.
    // it("<iframe>", html('<iframe></iframe>'));
    // it("[data-*]", html('<img data-test="test">'));
    // it("[data-*] (empty)", html('<img data-test>', '<img data-test="">'));
  });

  describe(".url()", function() {
    // We're using a whitelist so we only need a few sanity checks
    // to make sure nothing evil is passing through.
    describe("strips", function() {
      it("javascript:", url("javascript:doevil", ""));
    });

    describe("permits", function() {
      it("http",      url('http://'));
      it("https",     url('https://'));
      it("mailto",    url('mailto:'));
      it("local",     url('#local'));
      it("relative",  url('/relative'));
    });
  });

  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // TODO: Add test for each attach, possibly as a general xss test suite driver
  describe("attacks", function() {
    it("malformed img", html('<IMG """><SCRIPT>alert("XSS")</SCRIPT>"', '<img>"'));
    it("malformed on*", html('<IMG SRC= onmouseover="alert(\'xxs\')">', '<img src="">'));
    it(" &#14; javascript:", html('<a href=" &#14; javascript:doevil"></a>', '<a href=""></a>'));
    it("&#106;", html('<a href="&#106;&#97;"></a>', '<a href=""></a>'));
  });
});

describe("sanitizeAttributes()", function() {
  // Issue #1
  it("handles undefined attributes", function() {
    expect(function() {
      var $el = [{tagName: "div", attributes: {"0": undefined}}];
      xss._sanitizeAttributes($el, xss.defaults);
    }).to.not.throw();
  });

  // Issue #2
  // TODO: Add sinon-chai and use spies instead if we need to do any additional
  // callback tests.
  it("only iterates on own properties", function() {
    var attrRemoved = false;
    function AttrMap() {}; AttrMap.prototype.fail = function() {};
    var $el = [{tagName: "div", attributes: new AttrMap()}];
    $el.removeAttr = function() { attrRemoved = true; };
    var options = {attributes: {all: /$^/}}; // match nothing, force removal
    xss._sanitizeAttributes($el, options);
    expect(attrRemoved).to.eql(false);
  });
});

describe("getAttributeName()", function() {
  describe("with numeric index (jquery/browser)", function() {
    var attributes = {"0": {name: "class", "1": undefined}};

    it("returns name", function() {
      expect(xss._getAttributeName(attributes, 0)).to.eql("class");
      expect(xss._getAttributeName(attributes, "0")).to.eql("class");
    });

    // Issue #1
    it("handles undefined attributes", function() {
      expect(xss._getAttributeName(attributes, "1")).to.eql(undefined);
    });
  });

  describe("with named index (node/cheerio)", function() {
    var attributes = {"class": {name: "class"}};

    it("returns name", function() {
      expect(xss._getAttributeName(attributes, "class")).to.eql("class");
    });
  });
});
