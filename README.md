xss.js (simple-xss)
======

Simple whitelist-based html sanitizer inspired by the `SanitizationFilter`
in GitHub's [html-pipeline][html-pipeline] library.

Works in node (through [cheerio][cheerio]) and in the browser
(through [jquery][jquery]), and weighs in ~ 5kb unminimized.

# API

```
var xss = require("simple-xss");
xss(html[, options]);     // Returns sanitized html
xss.url(url[, options]);  // Returns sanitized url
```

In the browser, just include [jquery][jquery] and [xss.js](dist):

```
<script src="path/to/jquery.js" type="text/javascript"></script>
<script src="path/to/xss.js" type="text/javascript"></script>
```

# Options

The library comes with a sensible set of defaults. You can override them
through `xss.defaults` or simply pass the options inline.

```
# Simplified example that only permits <a>, <em> and <strong> elements.
# Titles are permitted on all elements and links can also include href.
# Only absolute http(s) links are permitted.
xss.defaults = {
  elements: ["a", "em", "strong"],

  attributes: {
    "a": ["href"],
    "all": ["title"]
  },

  protocols: /^(http|https)/i
};
```

See [lib/xss.js][source] for the default set of allowed elements, attributes, and
supported protocols.

# Contributing

Want to contribute? Great! Open an issue if you've found a bug, and pull
requests are always welcome.

```
git clone https://github.com/kumu/xss.js && cd xss.js
npm install -g mocha
npm install
make test   # run tests within console / cheerio
make testb  # run tests within browser / jquery
```

Now that you're up and running go ahead and hack away.  The full library
is defined in `lib/xss.js`.

[source]: https://github.com/kumu/xss.js/blob/master/lib/xss.js
[dist]: https://github.com/kumu/xss.js/blob/master/dist/xss.js
[html-pipeline]: https://github.com/jch/html-pipeline
[cheerio]: https://github.com/MatthewMueller/cheerio
[jquery]: https://github.com/jquery/jquery
