/*global describe,before,it,expect,after */

var promiseMe = require("../index.js");

describe("promise-me basics", function() {
    it("changes a callback to then", function() {
        expect(
            promiseMe.convert("a(function(err, value){ console.log(value); })")
        ).toEqual("a().then(function (value) {\n    console.log(value);\n});");
    });
});
