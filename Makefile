all: Flux.js

lib/Dispatcher.js: src/Dispatcher.js
	mkdir -p lib
	./node_modules/.bin/jsx --harmony src/Dispatcher.js > lib/Dispatcher.js

lib/invariant.js: src/invariant.js
	mkdir -p lib
	sed -e 's/__DEV__/false/g' src/invariant.js > lib/invariant.js

Flux.js: lib/Dispatcher.js lib/invariant.js
	./node_modules/.bin/browserify index.js -s Flux -o Flux.js

clean:
	rm -rf lib
	rm -f Flux.js
