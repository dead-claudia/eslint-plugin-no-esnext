"use strict"

const assert = require("clean-assert")
const rule = require("./index").rules["no-esnext"]
const {Linter} = require("eslint")

exports.check = ({
    code, isModule, errors,
    ecmaVersion, excludeFeatures, includeFeatures,
}) => {
    errors = errors.map(error =>
        typeof error === "string" ? {message: error} : error
    )
    const linter = new Linter()

    linter.defineRule("no-esnext", rule)

    // Use the most recent ECMAScript version available.
    const parserOptions = {ecmaVersion: 2019}
    const options = {ecmaVersion: ecmaVersion || 2019}

    if (isModule) parserOptions.sourceType = "module"
    if (excludeFeatures) options.excludeFeatures = excludeFeatures
    if (includeFeatures) options.includeFeatures = includeFeatures

    const messages = linter.verify(code, {
        parserOptions,
        rules: {
            "no-esnext": ["error", options],
        },
    }, {
        filename: "test.js",
    })

    assert.equal(messages, errors.map((error, i) => {
        if (typeof error === "string") error = {message: error}
        const message = messages[i]
        const result = {}

        for (const key of Object.keys(messages[i])) {
            result[key] = key in error ? error[key] : message[key]
        }

        return result
    }))
}
