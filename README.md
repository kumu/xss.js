xss.js
======

Simple whitelist-based html sanitizer inspired by the `SanitizationFilter`
in GitHub's [html-pipeline][1] library. Works in node (through [cheerio][2])
and in the browser (through [jquery][3]).

```
xss('<a href="#" onclick="doevil">click me</a>')
// => <a href="#">click me</a>

xss.url("javascript:doevil")
// => ""
```

# API

```
// Returns sanitized html
xss(html[, options])

// Returns sanitized url
xss.url(url[, options])
```

# Options

The library comes with a very sensible set of defaults. You can override the
defaults by editing `xss.defaults`, or you can pass options inline to any call.

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

See `lib/xss.js` for the default set of allowed elements, attributes, and
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

[1]: https://github.com/jch/html-pipeline
[2]: https://github.com/MatthewMueller/cheerio
[3]: https://github.com/jquery/jquery
