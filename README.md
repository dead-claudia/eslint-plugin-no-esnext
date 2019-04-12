# eslint-plugin-no-esnext

[![Build Status](https://travis-ci.org/isiahmeadows/eslint-plugin-no-esnext.svg?branch=master)](https://travis-ci.org/isiahmeadows/eslint-plugin-no-esnext)

Ban constructs not supported by a particular ES version, while still allowing ES `import`/`export`. It's a lot like setting `parserOptions.ecmaVersion`, but without stopping you from using `import`/`export`. This is very useful if you use Rollup, target legacy browsers, and don't feel like using Babel, Bublé, or the like. It's also useful if you just want to ban certain features for stylistic reasons.

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
        "no-esnext/no-esnext": ["error", {
            "ecmaVersion": 5,

            // Specify normally-included features to remove. This defaults to
            // `excludeFeatures: [modules]` when
            // `config.parserOptions.sourceType === "module"`, but that value is
            // *not* retained if you override it.
            // Note that some feature depend on others (like
            // `tagged-template-literal` on `template-literal`)
            "excludeFeatures": [...],

            // Specify additional features to add.
            // This includes features that would otherwise not exist, and it
            // takes precedence over `excludeFeatures`
            "includeFeatures": [...],
        }],
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

Note: it's recommended to set this to be an error rather than a warning, so you don't mistakenly accept commits containing invalid syntax.

### Why not just use no-restricted-syntax?

Well, chances are, you're almost certainly going to make mistakes with that for one - it took me quite a bit of reading and other stuff just to put together this feature list. Do you *really* want to put forth that much effort anyways?

Also, that won't really work for everything:

- Two of the ES2018 regexp additions, named regexp captures and negative lookbehind, require a very complicated regexp that although you *could* do it in a selector, it'd get unwieldy *very* quickly.
- The reserved keyword checking of ES3 object properties would result in a *very* long regexp, one that's literally almost 400 characters long. (I actually counted this.) Do you *really* want that to work?
- You can't auto-fix anything using `no-restricted-syntax`. That's something I'd like to include in this later on.

### Other rule overlap

This does share some overlap with native ESLint features, but it tries to keep it to a minimum. Here's some other rules you may wish to address depending on your supported targets:

- [`quote-props`](https://eslint.org/docs/rules/quote-props), specifically its `keywords: true` option. You should almost certainly set that option if you enable `reserved-keyword-property` here.
- [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand), specifically its `"never"` option. If you've got it set to `"object-shorthand": ["error", "never"]`, you should instead disable that rule altogether and use this rule. It's a little more fine-grained.

### Contributing

Code is in `index.js` here in the root, and `test.js` has all the tests. I use [Thallium](https://github.com/isiahmeadows/thallium/tree/v0.3.12/docs) for the test runner and [Clean Assert](https://github.com/isiahmeadows/clean-assert) for the assertions. This is all linted with ESLint + my personal config.

- To get set up for the first time, just run `npm install`
- To lint, run `npm run lint`
- To lint and run tests, run `npm test`

### TODOs

- Write some tests (see [#1](https://github.com/isiahmeadows/eslint-plugin-no-esnext/issues/1))
- Introduce support for `eslint --fix` for the following features:
    - `arrow-function` - This is basically a superset of the opposite of ESLint's own [`prefer-arrow-callback`](https://eslint.org/docs/rules/prefer-arrow-callback), but I also need to not auto-fix ones that bind `this`/`arguments`/etc.
    - `async-await` - For the simple case where all `await`s are top-level, I'd like to translate this to the appropriate chain of `new Promise(...)` + `.then(...)` calls.
    - `exponentiation` - If the global `Math` isn't shadowed, this should just replace it with `Math.pow(lhs, rhs)`.
    - `let-const` - These should be naïvely replaced with `var` unless one of the following is true:
        - The variable is assigned to and it's declared with `const` (in which the message should also change).
        - The variable is declared in a function and an identically named variable is used in a callback anywhere in that function.
        - The variable is declared in a function and shadows an identically named parent variable.
        - The variable is declared in a loop and is used directly in a callback.
    - `method-property` - This is basically the method side of the `"never"` option of ESLint's own [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand).
    - `object-destructuring` - For the simple case of a single property being destructured, this should be auto-fixed to the appropriate non-destructured variant.
    - `object-rest-spread` - Once rules implementing global checks are added, I could have this delegate to `Object.assign(...)` where possible/practical.
    - `optional-catch-binding` - It should just replace it with `_`, adding extra underscores as necessary to ensure it's never used.
    - `regexp-dot-all` - This just fixes `.` to be `[^\s\S]`. Note that this should be applied in tandem with `regexp-unicode`'s fix.
    - `regexp-unicode` - Where possible, this should use [regexpu-core](https://github.com/mathiasbynens/regexpu-core) to normalize and fix it.
    - `reserved-keyword-property` - This should just replace the key with a string literal key of the same value.
    - `shorthand-property` - This is basically the shorthand property side of the `"never"` option of ESLint's own [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand).
    - `template-literal` - This is basically the opposite of ESLint's own [`prefer-template`](https://eslint.org/docs/rules/prefer-template)
- Introduce semicolon- and comma-sensitive rules like for trailing commas (ES5+-only in objects and arrays, ES2018+-only in functions) and omitted `;` after `do ... while (...)` (required pre-ES6 due to spec bug).
- Create a built-in config that enables everything with a few extra options to include ESLint builtins like [`quote-props`](https://eslint.org/docs/rules/quote-props).
    - This would also allow toggling the version used.
    - This would only kick in rules that matter, preferring to make it a parse error instead.
- Support Browserslist and use things like [kangax/compat-table](https://github.com/kangax/compat-table) and the [Can I Use DB](https://caniuse.com/) to build a support table for various features, so you can just do `"no-esnext/no-esnext": "error"` with an appropriate `.browserslistrc` that you may already have for other things (like Autoprefixer).
- Add support for restricting various global usage appropriately, too, with the ability to specify exceptions as necessary.

### License

The following license (ISC License), unless otherwise stated:

Copyright (c) 2018 and later, Isiah Meadows &lt;me@isiahmeadows.com&gt;.

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
