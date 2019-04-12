"use strict"

const {feature, it} = require("../test-util")

feature("`array-destructuring`", () => {
    it("warns when it detects array destructuring in `var`", {
        includeFeatures: ["array-destructuring"],
        code: "var [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("warns when it detects array destructuring in `let`", {
        includeFeatures: ["array-destructuring"],
        code: "let [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("warns when it detects array destructuring in `const`", {
        includeFeatures: ["array-destructuring"],
        code: "const [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("warns when it detects array destructuring in assignment", {
        includeFeatures: ["array-destructuring"],
        code: "[a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("allows normal arrays", {
        includeFeatures: ["array-destructuring"],
        code: "[a, b]",
        errors: [],
    })

    it("warns when it detects array destructuring in `var` in modules", {
        includeFeatures: ["array-destructuring"],
        isModule: true,
        code: "var [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("warns when it detects array destructuring in `let` in modules", {
        includeFeatures: ["array-destructuring"],
        isModule: true,
        code: "let [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("warns when it detects array destructuring in `const` in modules", {
        includeFeatures: ["array-destructuring"],
        isModule: true,
        code: "const [a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("warns when it detects array destructuring in assignment in modules", {
        includeFeatures: ["array-destructuring"],
        isModule: true,
        code: "[a, b] = c",
        errors: [
            "Unexpected array destructuring pattern",
        ],
    })

    it("allows normal arrays in modules", {
        includeFeatures: ["array-destructuring"],
        isModule: true,
        code: "[a, b]",
        errors: [],
    })
})
