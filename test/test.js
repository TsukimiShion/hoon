(function(){
    "use strict";
    function run_test(assert, hoon, underscore){
        /* global suite: false, test: false, localStorage: false, sessionStorage: false */
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

        suite("applyConstructor", function(){
            test("normal", function(){
                function Foo(name, age){
                    this.name = name;
                    this.age = age;
                }

                var foo = hoon.applyConstructor(Foo, ["John", 20]);
                assert.ok(foo instanceof Foo);
                assert.equal(foo.name, "John");
                assert.equal(foo.age, 20);
            });
        });

        suite("makeObject", function(){
            test("normal", function(){
                assert.ok(underscore.isEqual(hoon.makeObject("name", "John"), {name: "John"}));
                assert.ok(underscore.isEqual(hoon.makeObject(["name", "age"], ["John", 20]), {name: "John", age: 20}));
                assert.ok(underscore.isEqual(hoon.makeObject(["name", "age"], 20), {name: 20, age: 20}));
            });
        });

        suite("json.stringify", function(){
            test("NaN", function(){
                assert.equal(hoon.json.stringify("NaN"), '"\\"NaN\\""', "OK");
                assert.equal(hoon.json.stringify(NaN), '"NaN"', "OK");
            });
            test("undefined", function(){
                assert.equal(hoon.json.stringify("undefined"), '"\\"undefined\\""', "OK");
                assert.equal(hoon.json.stringify(undefined), '"undefined"', "OK");
            });
            test("RegExp", function(){
                assert.equal(hoon.json.stringify("/ab/"), '"\\"/ab/\\""', "OK");
                assert.equal(hoon.json.stringify(/ab/), '"/ab/"', "OK");
            });
        });
        suite("json.parse", function(){
            test("NaN", function(){
                assert.equal(hoon.json.parse('"\\"NaN\\""'), "NaN", "OK");
                assert.ok(underscore.isNaN(hoon.json.parse('"NaN"')), "OK");
            });
            test("undefined", function(){
                assert.equal(hoon.json.parse('"\\"undefined\\""'), "undefined", "OK");
                assert.equal(hoon.json.parse('"undefined"'), undefined, "OK");
            });
            test("RegExp", function(){
                assert.equal(hoon.json.parse('"\\"/ab/\\""'), "/ab/", "OK");
                var re = hoon.json.parse('"/ab/"');
                assert.ok(underscore.isRegExp(re), "OK");
                assert.equal(re.source, "ab", "OK");
            });
        });
        suite("json.parse stringify", function(){
            test("NaN", function(){
                assert.ok(underscore.isNaN(hoon.json.parse(hoon.json.stringify(NaN))), "OK");
                assert.equal(hoon.json.parse(hoon.json.stringify("NaN")), "NaN", "OK");
            });
            test("undefined", function(){
                assert.ok(underscore.isUndefined(hoon.json.parse(hoon.json.stringify(undefined))), "OK");
                assert.equal(hoon.json.parse(hoon.json.stringify("undefined")), "undefined", "OK");
            });
            test("RegExp", function(){
                var re = hoon.json.parse(hoon.json.stringify(/ab/));
                assert.ok(underscore.isRegExp(re), "OK");
                assert.equal(re.source, "ab", "OK");
                assert.equal(hoon.json.parse(hoon.json.stringify("/ab/")), "/ab/", "OK");
            });
            test("String", function(){
                assert.equal(hoon.json.parse(hoon.json.stringify("Hello World")), "Hello World", "OK");
            });
            test("Number", function(){
                assert.equal(hoon.json.parse(hoon.json.stringify(-1)), -1, "OK");
                assert.equal(hoon.json.parse(hoon.json.stringify("-1")), "-1", "OK");
            });
            test("null", function(){
                assert.ok(underscore.isNull(hoon.json.parse(hoon.json.stringify(null))), "OK");
                assert.equal(hoon.json.parse(hoon.json.stringify("null")), "null", "OK");
            });
        });

        if (typeof(Storage) !== "undefined"){
            suite("localStorage.getItem", function(){
                test("getItem normal", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", "John");
                    assert.equal(hoon.localStorage.getItem("name"), "John", "OK");
                });
                test("getItem Number", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", -1);
                    assert.equal(hoon.localStorage.getItem("name"), -1, "OK");
                    hoon.localStorage.setItem("name", "-1");
                    assert.equal(hoon.localStorage.getItem("name"), "-1", "OK");
                });
                test("getItem Object", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", {id: 3});
                    assert.ok(underscore.isEqual(hoon.localStorage.getItem("name"), {id: 3}), "OK");
                });
                test("getItem Array", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", [1, 3]);
                    assert.ok(underscore.isEqual(hoon.localStorage.getItem("name"), [1, 3]), "OK");
                });
                test("getItem null", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", null);
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", "null");
                    assert.equal(hoon.localStorage.getItem("name"), "null", "OK");
                });
                test("getItem undefined", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", undefined);
                    assert.equal(hoon.localStorage.getItem("name"), undefined, "OK");
                    hoon.localStorage.setItem("name", "undefined");
                    assert.equal(hoon.localStorage.getItem("name"), "undefined", "OK");
                });
                test("getItem object.undefined", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", {name: undefined});
                    assert.ok(underscore.isEqual(hoon.localStorage.getItem("name"), {name:undefined}), "OK");
                });
                test("getItem NaN", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", NaN);
                    assert.ok(underscore.isNaN(hoon.localStorage.getItem("name")), "OK");
                    hoon.localStorage.setItem("name", "NaN");
                    assert.equal(hoon.localStorage.getItem("name"), "NaN", "OK");
                });
                test("getItem RegExp", function(){
                    localStorage.clear();
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                    hoon.localStorage.setItem("name", /ab/);
                    assert.ok(underscore.isRegExp(hoon.localStorage.getItem("name")), "OK");
                    hoon.localStorage.setItem("name", "/ab/");
                    assert.equal(hoon.localStorage.getItem("name"), "/ab/", "OK");
                });
            });
            suite("localStorage.removeItem", function(){
                test("removeItem normal", function(){
                    localStorage.clear();
                    localStorage.setItem("name", "John");
                    assert.equal(localStorage.getItem("name"), "John", "OK");
                    hoon.localStorage.removeItem("name");
                    assert.equal(hoon.localStorage.getItem("name"), null, "OK");
                });
            });
            suite("localStorage.clear", function(){
                test("clear normal", function(){
                    localStorage.setItem("name", "John");
                    assert.equal(localStorage.getItem("name"), "John", "OK");
                    hoon.localStorage.clear();
                    assert.equal(localStorage.length, 0, "OK");
                });
            });
            suite("localStorage.key", function(){
                test("key normal", function(){
                    localStorage.clear();
                    localStorage.setItem("name", "John");
                    assert.equal(hoon.localStorage.key(0), "name", "OK");
                    assert.equal(hoon.localStorage.key(1), null, "OK");
                    hoon.localStorage.clear();
                });
            });
            suite("localStorage.get", function(){
                test("get string", function(){
                    localStorage.clear();
                    hoon.localStorage.set("name", "John");
                    assert.equal(hoon.localStorage.get("name"), "John", "OK");
                    hoon.localStorage.clear();
                });
                test("get array", function(){
                    localStorage.clear();
                    hoon.localStorage.set({name: "John", id: 3});
                    assert.ok(underscore.isEqual(hoon.localStorage.get(["name", "id"]), {name: "John", id: 3}), "OK");
                    hoon.localStorage.clear();
                });
                test("get no argument", function(){
                    localStorage.clear();
                    hoon.localStorage.set({name: "John", id: 3});
                    assert.ok(underscore.isEqual(hoon.localStorage.get(), {name: "John", id: 3}), "OK");
                    hoon.localStorage.clear();
                });
                test("get null", function(){
                    localStorage.clear();
                    hoon.localStorage.set({name: "John", id: 3});
                    assert.ok(underscore.isEqual(hoon.localStorage.get(null), {name: "John", id: 3}), "OK");
                    hoon.localStorage.clear();
                });
                test("get null empty", function(){
                    localStorage.clear();
                    assert.ok(underscore.isEqual(hoon.localStorage.get(null), {}), "OK");
                    hoon.localStorage.clear();
                });
            });
            suite("localStorage.remove", function(){
                test("remove string", function(){
                    localStorage.clear();
                    hoon.localStorage.set("name", "John");
                    assert.equal(hoon.localStorage.get("name"), "John", "OK");
                    hoon.localStorage.remove("name");
                    assert.equal(hoon.localStorage.get("name"), null, "OK");
                    localStorage.clear();
                });
                test("remove array", function(){
                    localStorage.clear();
                    hoon.localStorage.set({name: "John", id: 3});
                    hoon.localStorage.remove(["name", "id"]);
                    assert.equal(hoon.localStorage.get("name"), null, "OK");
                    localStorage.clear();
                });
                test("remove null", function(){
                    localStorage.clear();
                    hoon.localStorage.set("name", "John");
                    assert.equal(hoon.localStorage.get("name"), "John", "OK");
                    hoon.localStorage.remove(null);
                    assert.equal(hoon.localStorage.get("name"), null, "OK");
                    localStorage.clear();
                });
                test("remove no argument", function(){
                    localStorage.clear();
                    hoon.localStorage.set("name", "John");
                    assert.equal(hoon.localStorage.get("name"), "John", "OK");
                    hoon.localStorage.remove();
                    assert.equal(hoon.localStorage.get("name"), null, "OK");
                    localStorage.clear();
                });
            });
        }
        
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
