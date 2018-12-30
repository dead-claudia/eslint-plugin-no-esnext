"use strict"

/**
 * An ESLint rule used within this project to ban ES stuff, while still allowing
 * ES `import`/`export`.
 *
 * This does *not* overlap with existing built-in rules like `comma-dangle` for
 * preventing trailing function commas.
 */

/* eslint-disable no-nested-ternary, max-len */
const selectors = {
    Program: [
        5, node => node.body.length && node.body[0] === "Literal" &&
            node.body[0].value === "use strict",
        "Useless `\"use strict\"` declaration",
    ],

    Super: [6, "Unexpected `super` reference"],
    ArrowFunctionExpression: [6, "Unexpected arrow function"],
    YieldExpression: [6, "Unexpected `yield`"],
    TemplateLiteral: [6, "Unexpected template literal"],
    TaggedTemplateLiteral: [6, "Unexpected tagged template literal"],
    ObjectPattern: [6, "Unexpected object destructuring pattern"],
    ArrayPattern: [6, "Unexpected array destructuring pattern"],
    ClassExpression: [6, "Unexpected class expression"],
    ClassDeclaration: [6, "Unexpected class declaration"],
    MetaProperty: [6, "Unexpected meta property"],
    SpreadElement: [9, "Unexpected spread element"],
    RestElement: [9, "Unexpected rest element"],
    RestProperty: [9, "Unexpected rest element"],
    ExperimentalRestProperty: [9, "Unexpected rest element"],
    // Unnecessary - you can't `await` outside an `async` function
    // AwaitExpression: [9, "Unexpected `await`"],

    FunctionExpression: [
        [6, node => !node.async && node.generator, "Unexpected generator expression"],
        [8, node => node.async, "Unexpected async function expression"],
        [9, node => node.async && node.generator, "Unexpected async generator expression"],
    ],

    FunctionDeclaration: [
        [6, node => !node.async && node.generator, "Unexpected generator declaration"],
        [8, node => node.async, "Unexpected async function declaration"],
        [9, node => node.async, "Unexpected async generator declaration"],
    ],

    VariableDeclaration: [
        6, node => node.kind !== "var",
        node => `Unexpected \`${node.kind}\` declaration`,
    ],

    Property: [
        [5, node => node.kind !== "init", "Unexpected accessor property"],
        [
            5, node => node.key.type === "Identifier" && isReservedES3(node.key.value),
            "Unexpected accessor property",
        ],
        [6, node => node.method, "Unexpected method property"],
        [6, node => node.shorthand, "Unexpected shorthand property"],
        [6, node => node.computed, "Unexpected computed property"],
    ],

    BinaryExpression: [
        [7, node => node.operator === "**", "Unexpected exponentiation operator"],
    ],

    AssignmentExpression: [
        [7, node => node.operator === "**=", "Unexpected exponentiation assignment"],
    ],

    CatchClause: [
        [10, node => node.param == null, "Unexpected catch binding omission"],
    ],

    TemplateElement: [
        [9, node => node.cooked == null, "Unexpected template literal"],
    ],

    Literal: [
        [6, ({regex}) => regex != null && regex.flags.includes("u"), "Unexpected regexp /u flag"],
        [9, ({regex}) => regex != null && regex.flags.includes("s"), "Unexpected regexp /s flag"],
        [9, ({regex}) => regex != null && /\(\?<[=!]/.test(regex.pattern), "Unexpected regexp lookbehind"],
        [9, ({regex}) => regex != null && /\(\?<[^>]>/.test(regex.pattern), "Unexpected named regexp capture"],
        [9, ({regex}) => regex != null && /\\p{[^}]}/.test(regex.pattern), "Unexpected Unicode property escape"],
    ],
}
/* eslint-enable no-nested-ternary, max-len */

const ruleMeta = {
    type: "problem",
    docs: {
        description: "Ban ES Next stuff by version",
    },
    schema: {
        type: "array",
        minItems: 1,
        maxItems: 1,
        items: [
            {
                enum: [
                    /* ES3 */ 3,
                    /* ES5 */ 5,
                    /* ES6 */ 6, 2015,
                    /* ES7 */ 7, 2016,
                    /* ES8 */ 8, 2017,
                    /* ES9 */ 9, 2018,
                    /* ES10 */ 10, 2019,
                ],
            },
        ],
    },
}

function isReservedES3(name) {
    switch (name.length) {
    case 2:
        return name === "do" || name === "if" || name === "in"

    case 3:
        return name === "for" || name === "int" || name === "new" ||
            name === "try" || name === "var"

    case 4:
        return name === "byte" || name === "case" || name === "char" ||
            name === "else" || name === "enum" || name === "goto" ||
            name === "long" || name === "null" || name === "this" ||
            name === "true" || name === "void" || name === "with"

    case 5:
        return name === "break" || name === "catch" || name === "class" ||
            name === "const" || name === "false" || name === "final" ||
            name === "float" || name === "short" || name === "super" ||
            name === "throw" || name === "while"

    case 6:
        return name === "delete" || name === "double" || name === "export" ||
            name === "import" || name === "native" || name === "public" ||
            name === "return" || name === "static" || name === "switch" ||
            name === "throws" || name === "typeof"

    case 7:
        return name === "boolean" || name === "default" || name === "extends" ||
            name === "finally" || name === "package" || name === "private"

    case 8:
        return name === "abstract" || name === "continue" ||
            name === "debugger" || name === "function" || name === "volatile"

    case 9:
        return name === "interface" || name === "protected" ||
            name === "transient"

    case 10:
        return name === "implements" || name === "instanceof"

    case 12:
        return name === "synchronized"

    default:
        return false
    }
}

class SelectorProxyHandler {
    constructor(context) {
        const version = context.options[0]

        this.context = context
        if (context.parserOptions.sourceType === "module" && version < 6) {
            this.version = 6
        } else {
            this.version = version >= 2015 ? version - 2009 : version
        }
    }

    getOwnPropertyDescriptor(target, key) {
        if (!Object.prototype.hasOwnProperty.call(target, key)) return undefined
        return {
            configurable: true, enumerable: true, writable: true,
            value: this.get(target, key),
        }
    }

    get(target, key, receiver) {
        return node => {
            let list = Reflect.get(target, key, receiver)

            if (!Array.isArray(list[0])) list = [list]
            for (const [min, cond, message = cond] of list) {
                if (this.version >= min) continue
                if (message !== cond && !cond(node, this.context)) continue
                this.context.report({
                    node,
                    message: typeof message === "function"
                        ? message(node, this.context)
                        : message,
                })
                break
            }
        }
    }
}

module.exports = {
    rules: {
        "no-esnext": {
            meta: ruleMeta,
            create: context =>
                new Proxy(selectors, new SelectorProxyHandler(context)),
        },
    },
}
