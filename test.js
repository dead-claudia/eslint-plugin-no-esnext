"use strict"

const t = require("thallium")
const assert = require("clean-assert")
const index = require("./index")

t.test("eslint-plugin-no-esnext", () => {
    t.test("fixme()", () => {
        // FIXME: do something real.
        assert.equal(index.fixme(1, 2), 3)
    })
})
