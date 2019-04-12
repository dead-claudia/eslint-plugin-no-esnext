"use strict"

const t = require("thallium")
const rule = require("./index").rules["no-esnext"]
const {RuleTester} = require("eslint")

const ruleTester = new RuleTester()
let scheduled

exports.feature = (name, body) => {
    if (body == null) {
        t.testSkip(name, () => {})
        return
    }

    t.test(name, () => {
        const tests = scheduled = []

        try {
            body()
        } finally {
            scheduled = undefined
        }

        // Let's immediately execute the block. This impromptu micro state
        // machine (with states `"init"`, `"valid"`, and `"invalid"`) is a
        // workaround until https://github.com/eslint/eslint/issues/11609 gets
        // addressed.
        let state = "init"
        const opts = {valid: [], invalid: []}
        const names = {valid: [], invalid: []}
        let currentNames, index

        for (const {
            name, code, isModule, errors,
            ecmaVersion, excludeFeatures, includeFeatures,
        } of tests) {
            const options = {ecmaVersion: ecmaVersion || 2019}
            const result = {
                code, options: [options],
                // Use the most recent ECMAScript version available.
                parserOptions: {ecmaVersion: 2019},
            }

            if (isModule) result.parserOptions.sourceType = "module"
            if (errors.length !== 0) result.errors = errors
            if (excludeFeatures) options.excludeFeatures = excludeFeatures
            if (includeFeatures) options.includeFeatures = includeFeatures
            const key = errors.length !== 0 ? "invalid" : "valid"

            opts[key].push(result)
            names[key].push(name)
        }

        RuleTester.describe = (name, body) => {
            if (state === "init") {
                state = "valid"
                body()
            } else {
                const key = state

                state = "invalid"
                t.test(name, () => {
                    currentNames = names[key]
                    index = 0
                    return body()
                })
            }
        }

        RuleTester.it = (code, body) => {
            t.test(currentNames[index++], body)
        }

        ruleTester.run("no-eslint", rule, opts)
    })
}

exports.it = (name, {
    code, isModule, errors,
    ecmaVersion, excludeFeatures, includeFeatures,
}) => {
    scheduled.push({
        name, code, isModule, errors,
        ecmaVersion, excludeFeatures, includeFeatures,
    })
}
