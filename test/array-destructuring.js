"use strict"

const t = require("thallium")
const {check} = require("../test-util")

t.test("`array-destructuring`", () => {
    t.test("warns when in `var`", () => check({
        includeFeatures: ["array-destructuring"],
        code: "var [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    }))

    t.test("warns when in `let`", () => check({
        includeFeatures: ["array-destructuring"],
        code: "let [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    }))

    t.test("warns when in `const`", () => check({
        includeFeatures: ["array-destructuring"],
        code: "const [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    }))

    t.test("warns when in assignment", () => check({
        includeFeatures: ["array-destructuring"],
        code: "[a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    }))

    t.test("allows normal arrays", () => check({
        includeFeatures: ["array-destructuring"],
        code: "[a, b]",
        errors: [],
    }))

    t.test("in modules", () => {
        t.test("warns when in `var`", () => check({
            includeFeatures: ["array-destructuring"],
            isModule: true,
            code: "var [a, b] = c",
            errors: [
                "Unexpected array destructuring pattern",
            ],
        }))

        t.test("warns when in `let`", () => check({
            includeFeatures: ["array-destructuring"],
            isModule: true,
            code: "let [a, b] = c",
            errors: [
                "Unexpected array destructuring pattern",
            ],
        }))

        t.test("warns when in `const`", () => check({
            includeFeatures: ["array-destructuring"],
            isModule: true,
            code: "const [a, b] = c",
            errors: [
                "Unexpected array destructuring pattern",
            ],
        }))

        t.test("warns when in assignment", () => check({
            includeFeatures: ["array-destructuring"],
            isModule: true,
            code: "[a, b] = c",
            errors: [
                "Unexpected array destructuring pattern",
            ],
        }))

        t.test("allows normal arrays", () => check({
            includeFeatures: ["array-destructuring"],
            isModule: true,
            code: "[a, b]",
            errors: [],
        }))
    })
})
