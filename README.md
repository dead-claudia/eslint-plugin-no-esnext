# eslint-plugin-no-esnext

[![Build Status](https://travis-ci.org/isiahmeadows/eslint-plugin-no-esnext.svg?branch=master)](https://travis-ci.org/isiahmeadows/eslint-plugin-no-esnext)

Ban constructs not supported by a particular ES version, while still allowing ES `import`/`export`. It's a lot like setting `parserOptions.ecmaVersion`, but without stopping you from using `import`/`export`. This is very useful if you use Rollup, target legacy browsers, and don't feel like using Babel, Bublé, or the like.

### Installation

1. Install it via npm or Yarn.

    ```
    npm install isiahmeadows/eslint-plugin-no-esnext
    yarn add github:isiahmeadows/eslint-plugin-no-esnext
    ```

2. Add `no-esnext` to your ESLint plugins.

    ```js
    plugins: ["no-esnext"],
    ```

3. Add `no-esnext/no-esnext` to your rules, replacing `5` here (the default supported version) with whatever ECMAScript version you wish to limit yourself to.

    ```js
    rules: {
        "no-esnext/no-esnext": ["error", 5],
    },
    ```

    The following ECMAScript versions are supported, with their appropriate names:

    - ES3: `3`
    - ES5: `5`
    - ES6: `6` or `2015`
    - ES7: `7` or `2016`
    - ES8: `8` or `2017`
    - ES9: `9` or `2018`
    - ES10: `10` or `2019`

And you're good to go.

### Contributing

Code is in `index.js` here in the root, and `test.js` has all the tests. I use [Thallium](https://github.com/isiahmeadows/thallium/tree/v0.3.12/docs) for the test runner and [Clean Assert](https://github.com/isiahmeadows/clean-assert) for the assertions. This is all linted with ESLint + my personal config.

- To get set up for the first time, just run `npm install`
- To lint, run `npm run lint`
- To lint and run tests, run `npm test`

### License

The following license (ISC License), unless otherwise stated:

Copyright (c) 2018 and later, Isiah Meadows &lt;me@isiahmeadows.com&gt;.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
