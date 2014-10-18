(function(){
    "use strict";
    function run_test(assert, hoon, underscore){
        /* global suite: false, test: false */
        suite("extract", function(){
            test("normal", function(){
                var obj = { 0:0, 1:1, 2:2, 3:3 };
                var clone = { 0:0, 1:1, 2:2, 3:3 };
                var result = hoon.extract(obj, function(val, key){
                    return (key % 2) === 0;
                });
                var expect = { 0:0, 2:2, };
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(obj, clone), "OK");
            });

            test("only val", function(){
                var obj = { 0:0, 1:1, 2:2, 3:3 };
                var clone = { 0:0, 1:1, 2:2, 3:3 };
                var result = hoon.extract(obj, function(val){
                    return val < 2;
                });
                var expect = { 0:0, 1:1, };
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(obj, clone), "OK");
            });

            test("empty result", function(){
                var obj = { 0:0, 1:1, 2:2, 3:3 };
                var clone = { 0:0, 1:1, 2:2, 3:3 };
                var result = hoon.extract(obj, function(val){
                    return val > 3;
                });
                var expect = {};
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(obj, clone), "OK");
            });

            test("empty input", function(){
                var obj = {};
                var clone = {};
                var result = hoon.extract(obj, function(val){
                    return val > 3;
                });
                var expect = {};
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(obj, clone), "OK");
            });
        });

        suite("fmap", function(){
            test("normal", function(){
                var obj = { 0:0, 1:1, 2:2, 3:3 };
                var clone = { 0:0, 1:1, 2:2, 3:3 };
                var result = hoon.fmap(obj, function(val, key){
                    if ((key % 2) === 1){
                        return [key, key * val];
                    }
                });
                var expect = { 1:1, 3:9, };
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(obj, clone), "OK");
            });

            test("empty result", function(){
                var obj = { 0:0, 1:1, 2:2, 3:3 };
                var clone = { 0:0, 1:1, 2:2, 3:3 };
                var result = hoon.extract(obj, function(val, key){
                    if (val > 3){
                        return [key, val];
                    }
                });
                var expect = {};
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(obj, clone), "OK");
            });

            test("empty input", function(){
                var obj = {};
                var clone = {};
                var result = hoon.extract(obj, function(val, key){
                    if (val > 3){
                        return [key, val];
                    }
                });
                var expect = {};
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(obj, clone), "OK");
            });
        });

        suite("padding", function(){
            test("normal", function(){
                var result = hoon.padding("5", 3, "0");
                var expect = "005";
                assert.equal(result, expect, "OK");
            });

            test("flag true", function(){
                var result = hoon.padding("0.5", 4, "0", true);
                var expect = "0.50";
                assert.equal(result, expect, "OK");
            });

            test("flag false", function(){
                var result = hoon.padding("0.5", 4, "0", false);
                var expect = "00.5";
                assert.equal(result, expect, "OK");
            });

            test("str.length === len", function(){
                var result = hoon.padding("100", 3, "0");
                var expect = "100";
                assert.equal(result, expect, "OK");
            });

            test("str.length > len", function(){
                var result = hoon.padding("100", 2, "0");
                var expect = "100";
                assert.equal(result, expect, "OK");
            });

            test("negative len", function(){
                var result = hoon.padding("100", -1, "0");
                var expect = "100";
                assert.equal(result, expect, "OK");
            });

            test("len === 0", function(){
                var result = hoon.padding("100", 0, "0");
                var expect = "100";
                assert.equal(result, expect, "OK");
            });

            test("char.length > 1", function(){
                var result = hoon.padding("100", 10, "<*>");
                var expect = "<*><*>100";
                assert.equal(result, expect, "OK");
            });
        });

        suite("extend", function(){
            test("normal", function(){
                var s1 = {0:0, 1:1, 2:2};
                var s2 = {1:3, 2:5, 3:3, 4:4};
                var s3 = {2:7, 5:8};
                var c1 = {0:0, 1:1, 2:2};
                var c2 = {1:3, 2:5, 3:3, 4:4};
                var c3 = {2:7, 5:8};
                var result = hoon.extend(s1, s2, s3);
                var expect = {0:0, 1:3, 2:7, 3:3, 4:4, 5:8};
                assert.ok(underscore.isEqual(expect, result), "OK");
                assert.ok(underscore.isEqual(c1, s1), "OK");
                assert.ok(underscore.isEqual(c2, s2), "OK");
                assert.ok(underscore.isEqual(c3, s3), "OK");
            });

            test("empty input", function(){
                var result = hoon.extend();
                var expect = {};
                assert.ok(underscore.isEqual(result, expect), "OK");
            });
        });

        suite("templates", function(){
            test("normal", function(){
                var ret = hoon.templates({
                    hello: "Hello, <%= name %>.",
                    date: "<%= month %>/<%= day %>",
                });
                assert.equal(ret.hello({name: "John"}), "Hello, John.", "OK");
                assert.equal(ret.date({month: 10, day: 12}), "10/12", "OK");
            });

            test("empty input", function(){
                assert.ok(underscore.isEqual(hoon.templates({}), {}), "OK");
            });
        });

        suite("clone", function(){
            test("normal", function(){
                var obj = [1, 2];
                var ret = hoon.clone(obj);
                ret[1] = 0;
                assert.ok(underscore.isEqual(obj, [1, 2]), "OK");
                assert.ok(underscore.isEqual(ret, [1, 0]), "OK");
                obj = {0:1};
                ret = hoon.clone(obj);
                ret[0] = 2;
                assert.ok(underscore.isEqual(obj, {0:1}), "OK");
                assert.ok(underscore.isEqual(ret, {0:2}), "OK");
            });
            test("literal", function(){
                assert.equal(hoon.clone(1), 1, "OK");
                assert.equal(hoon.clone("hello"), "hello", "OK");
            });
            test("null, undefined, NaN", function(){
                var obj = Number("hello");
                assert.ok(underscore.isNaN(obj), "OK");
                assert.equal(hoon.clone(null), null, "OK");
                assert.equal(hoon.clone(undefined), undefined, "OK");
                assert.ok(underscore.isNaN(hoon.clone(obj)), "OK");
            });
            test("true, false", function(){
                assert.ok(hoon.clone(true) === true, "OK");
                assert.ok(hoon.clone(false) === false, "OK");
            });
            test("Boolean", function(){
                var obj = new Boolean(true);
                var ret = hoon.clone(obj);
                assert.ok(ret instanceof Boolean, "OK");
                assert.ok(ret, "OK");
            });
            test("Number", function(){
                var obj = new Number(1);
                var ret = hoon.clone(obj);
                assert.ok(ret instanceof Number, "OK");
                assert.ok(Number(ret) === 1, "OK");
            });
            test("String", function(){
                var str = "hello";
                var obj = new String(str);
                var ret = hoon.clone(obj);
                assert.ok(ret instanceof String, "OK");
                assert.ok(String(ret) === str, "OK");
            });
            test("Date", function(){
                var obj = new Date();
                var ret = hoon.clone(obj);
                assert.ok(underscore.isEqual(obj, ret), "OK");
                assert.notOk(ret === obj, "OK");
            });
            test("Object", function(){
                var obj = {1:1};
                var ret = hoon.clone(obj);
                assert.ok(underscore.isEqual(obj, ret), "OK");
                assert.notOk(ret === obj, "OK");
            });
            test("Array", function(){
                var obj = [1, 2];
                var ret = hoon.clone(obj);
                assert.ok(underscore.isEqual(obj, ret), "OK");
                assert.notOk(ret === obj, "OK");
            });
        });
        
    }

    if (typeof require === "undefined"){
        $(function(){
            /* global mocha: false, chai: false, _: false, hoon: false */
            mocha.setup("tdd");
            run_test(chai.assert, hoon, _);
            mocha.run();
        });
    } else {
        run_test(require("chai").assert, require("../src/hoon.js"), require("underscore"));
    }
})();
