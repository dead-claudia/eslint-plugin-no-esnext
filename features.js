"use strict"

// Each rule an object of selector + function pairs, where each function accepts
// a node and it returns either `null`/`undefined` if no problem exists, an
// options object directly sent to `context.report`, or a string message. Note
// that `node` is automatically added, so it need not be added here. For
// convenience, a non-function is equivalent to a function returning that value.
//
// See here for more details about the return value:
// https://eslint.org/docs/developer-guide/working-with-rules#contextreport
//
// In addition to the above, each rule can feature one of these two special
// properties:
//
// - `extends`: This rule depends on another, so it should add that rule, even
//   if blocked by the user.
// - `supercedes`: This rule makes another rule redundant and/or extends it in a
//   way that makes its existing check incorrect, so it should remove that rule,
//   even if the user explicitly specifies it.

const reservedES3 = new RegExp(`^(${[
    "abstract", "boolean", "break", "byte", "case", "catch", "char", "class",
    "const", "continue", "debugger", "default", "delete", "do", "double",
    "else", "enum", "export", "extends", "false", "final", "finally", "float",
    "for", "function", "goto", "if", "implements", "import", "in", "instanceof",
    "int", "interface", "long", "native", "new", "null", "package", "private",
    "protected", "public", "return", "short", "static", "super", "switch",
    "synchronized", "this", "throw", "throws", "transient", "true", "try",
    "typeof", "var", "void", "volatile", "while", "with",
].join("|")})$`)

exports.features = {
    "array-destructuring": {
        ArrayPattern: "Unexpected array destructuring pattern",
    },

    "array-rest-spread": {
        supercedes: ["object-rest-spread"],
        SpreadElement: "Unexpected spread element",
        RestElement: "Unexpected rest element",
        ExperimentalRestProperty: "Unexpected rest element",
    },

    "arrow-function": {
        ArrowFunctionExpression: "Unexpected arrow function",
    },

    "async-await": {
        "supercedes": ["async-generators"],

        "FunctionExpression[async=true]":
            "Unexpected async function expression",

        "FunctionDeclaration[async=true]":
            "Unexpected async function declaration",

        // Unnecessary - you can't `await` outside an `async` function
        // "AwaitExpression": "Unexpected `await`",
        // "ForOfStatement[await=true]": "Unexpected `await`",
    },

    "async-generators": {
        "FunctionExpression[async=true][generator=true]":
            "Unexpected async generator expression",

        "FunctionDeclaration[async=true][generator=true]":
            "Unexpected async generator declaration",
    },

    "classes": {
        "Super": "Unexpected `super` reference",
        "ClassExpression": "Unexpected class expression",
        "ClassDeclaration": "Unexpected class declaration",
        "MetaProperty[meta.name='new'][property.name='target']":
            "Unknown meta property: `new.target`",
    },

    "computed-properties": {
        "Property[computed=true]": "Unexpected computed property",
    },

    "exponentiation": {
        "BinaryExpression[operator='**']": "Unexpected exponentiation operator",
        "AssignmentExpression[operator='**=']":
            "Unexpected exponentiation assignment",
    },

    "generators": {
        "supercedes": ["async-generators"],

        "FunctionExpression[generator=true]":
            "Unexpected generator expression",

        "FunctionDeclaration[generator=true]":
            "Unexpected generator declaration",

        // Unnecessary - you can't `yield` outside a generator
        "YieldExpression": "Unexpected `yield`",
    },

    "getter-setter": {
        "Property[kind!='init']": "Unexpected accessor property",
    },

    "let-const": {
        "VariableDeclaration[kind!='var']": ({kind}) =>
            `Unexpected \`${kind}\` declaration`,
    },

    "method-properties": {
        "Property[method=true]": "Unexpected method property",
    },

    "modules": {
        "ImportDeclaration": "Unexpected `import` declaration",
        "ExportNamedDeclaration": "Unexpected `export` declaration",
        "ExportDefaultDeclaration": "Unexpected `export` declaration",
        "ExportAllDeclaration": "Unexpected `export` declaration",
        "MetaProperty[meta.name='import'][property.name='meta']":
            "Unknown meta property: `new.target`",
    },

    "object-destructuring": {
        ObjectPattern: "Unexpected object destructuring pattern",
    },

    "object-rest-spread": {
        "ObjectExpression > SpreadElement": "Unexpected spread element",
        "ObjectPattern > RestElement": "Unexpected rest element",
        "RestProperty": "Unexpected rest element",
        "ExperimentalRestProperty": "Unexpected rest element",
    },

    "optional-catch-binding": {
        "CatchClause:not([param])": "Unexpected catch binding omission",
    },

    "raw-template-literal-extended": {
        "TemplateLiteral:not([cooked])": "Invalid template literal contents",
    },

    "regexp-dot-all": {
        "Literal[regex][regex.flags=/s/]": "Unexpected regexp /s flag",
    },

    // This complicated regexp also asserts we aren't in a regexp class when we
    // check for the offending expression. This can only see valid regexps, so
    // it can assume classes and parentheses are balanced and that classes can
    // only be nested up to a depth of 2. (If the second weren't the case, I
    // would have to write a full on parser just to check for this.
    "regexp-named-capture": {
        "Literal[regex]": ({regex}) =>
            /^([^\\\[]|\\.|\[([^\\\]]|\\.|\[([^\\\]]|\\.)*\])*\])*\(\?<[^>]>/
                .test(regex.pattern)
                ? "Unexpected named regexp capture"
                : null,
    },

    // This complicated regexp also asserts we aren't in a regexp class when we
    // check for the offending expression. This can only see valid regexps, so
    // it can assume classes and parentheses are balanced and that classes can
    // only be nested up to a depth of 2. (If the second weren't the case, I
    // would have to write a full on parser just to check for this.
    "regexp-negative-lookbehind": {
        "Literal[regex]": ({regex}) =>
            /^([^\\\[]|\\.|\[([^\\\]]|\\.|\[([^\\\]]|\\.)*\])*\])*\(\?<[=!]/
                .test(regex.pattern)
                ? "Unexpected regexp negative lookbehind"
                : null,
    },

    "regexp-unicode": {
        "Literal[regex][regex.flags=/u/]": "Unexpected regexp /u flag",
    },

    "regexp-unicode-property-escape": {
        "Literal[regex]": ({regex}) =>
            // Just ensuring this is an actual escape, rather than something
            // like `/foo\\p{0}/`, which matches the string "foo\\p".
            /(^|[^\\])(\\\\)*\\p{[^}]}/.test(regex.pattern)
                ? "Unexpected Unicode property escape"
                : null,
    },

    "reserved-keyword-properties": {
        "Property > Identifier.key": ({value}) =>
            reservedES3.test(value) ? "Unexpected keyword property" : null,
    },

    "shorthand-properties": {
        "Property[shorthand=true]": "Unexpected shorthand property",
    },

    "tagged-template-literal": {
        extends: ["template-literal"],
        TaggedTemplateLiteral: "Unexpected tagged template literal",
    },

    "template-literal": {
        supercedes: ["template-literal-extended"],
        TemplateLiteral: "Unexpected template literal",
    },
}

exports.versionBlacklist = {}

const versionBlacklist = []

function setFeatures(name, names) {
    exports.versionBlacklist[name] = versionBlacklist.slice()
    versionBlacklist.push(...names)
}

setFeatures(2019, ["optional-catch-binding"])
setFeatures(2018, [
    "object-rest-spread",
    "raw-template-literal-extended",
    "regexp-dot-all",
    "regexp-named-capture",
    "regexp-negative-lookbehind",
    "regexp-unicode-property-escape",
])
setFeatures(2017, ["async-await"])
setFeatures(2016, ["exponentiation"])
setFeatures(2015, [
    "array-destructuring",
    "array-rest-spread",
    "arrow-function",
    "classes",
    "let-const",
    "object-destructuring",
    "regexp-unicode",
    "tagged-template-literal",
    "template-literal",
    "modules",
])
setFeatures(5, [
    "getter-setter",
    "reserved-keyword-properties",
])
