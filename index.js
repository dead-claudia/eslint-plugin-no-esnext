"use strict"

/**
 * An ESLint rule used within this project to ban ES stuff, while still allowing
 * ES `import`/`export`.
 */

const {features, versionBlacklist} = require("./features")

const ruleMeta = {
    type: "problem",
    docs: {
        description: "Restrict certain ECMAScript features",
    },
    schema: {
        type: "array",
        minItems: 1,
        maxItems: 1,
        items: [
            {
                type: "object",
                required: ["ecmaVersion"],
                minProperties: 1,
                maxProperties: 3,
                properties: {
                    ecmaVersion: {
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
                    excludeFeatures: {
                        type: "array",
                        uniqueItems: true,
                        additionalItems: {
                            enum: Object.keys(features),
                        },
                    },
                    includeFeatures: {
                        type: "array",
                        uniqueItems: true,
                        additionalItems: {
                            enum: Object.keys(features),
                        },
                    },
                },
            },
        ],
    },
}

function update(set, func) {
    const result = new Set(set)

    set.forEach(value => func(result, value))
    return result
}

function extractBlacklist(options, isModule) {
    const {
        ecmaVersion,
        excludeFeatures = isModule ? ["modules"] : [],
        includeFeatures = [],
    } = options

    let blacklist = new Set()

    if (ecmaVersion != null) {
        const version = ecmaVersion >= 6 && ecmaVersion < 2015
            ? ecmaVersion + 2009
            : ecmaVersion

        for (const feature of versionBlacklist[version]) {
            blacklist.add(feature)
        }
    }

    for (const feature of excludeFeatures) blacklist.delete(feature)
    for (const feature of includeFeatures) blacklist.add(feature)

    blacklist = update(blacklist, (result, name) => {
        const selectors = features[name]

        if (selectors.extends != null) {
            for (const key of selectors.extends) result.add(key)
        }
    })

    blacklist = update(blacklist, (result, name) => {
        const selectors = features[name]

        if (selectors.supercedes != null) {
            for (const key of selectors.supercedes) result.delete(key)
        }
    })

    return blacklist
}

function buildTestMap(blacklist) {
    const data = new Map()

    for (const name of blacklist) {
        const feature = features[name]

        for (const selector of Object.keys(feature)) {
            if (selector === "extends" || selector === "supercedes") continue
            let tests = data.get(selector)

            if (tests == null) data.set(selector, tests = [])
            tests.push(feature[selector])
        }
    }

    return data
}

function runTests(context, tests) {
    return node => {
        for (const test of tests) {
            const result = typeof test === "function" ? test(node) : test

            if (result == null) continue
            if (typeof result === "string") {
                context.report({node, message: result})
            } else {
                context.report(Object.assign({node}, result))
            }
        }
    }
}

module.exports = {
    rules: {
        "no-esnext": {
            meta: ruleMeta,
            create: context => {
                const blacklist = extractBlacklist(
                    context.options[0],
                    context.parserOptions.sourceType === "module"
                )

                const testMap = buildTestMap(blacklist)
                const result = {}

                for (const [type, tests] of testMap) {
                    result[type] = runTests(context, tests)
                }

                return result
            },
        },
    },
}
