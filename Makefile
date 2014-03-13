test:
	@mocha test/index.js -R spec

testb: browserify-tests
	@open test/browser/index.html

browserify-tests:
	@browserify test/index.js > test/browser/index.js

lint:
	@gulp lint

version:
	@gulp build && npm publish .

.PHONY: test
