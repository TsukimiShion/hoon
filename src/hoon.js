(function(exports, underscore){
    "use strict";

    /**
     * @class hoon
     * @static
     */

    /* global _: false */

    exports.extract = function(obj, extract){
        /**
         * Extract object's properties and return the new object.
         *
         * @method extract
         * @param {Object} obj
         * @param {Function} extract
         * @return {Object}
         * @example
         *     // ex1
         *     var obj = { 0:0, 1:1, 2:2, 3:3 };
         *     var ret = hoon.extract(obj, function(val, key){
         *         return (key % 2) == 0;
         *     });
         *     console.log(ret); // { 0:0, 2:2 }
         *     console.log(obj); // { 0:0, 1:1, 2:2, 3:3 };
         *
         * @example
         *     // ex2
         *     var obj = { 0:0, 1:1, 2:2, 3:3 };
         *     var ret = hoon.extract(obj, function(val){
         *         return val < 2;
         *     });
         *     console.log(ret); // { 0:0, 1:1 }
         *     console.log(obj); // { 0:0, 1:1, 2:2, 3:3 };
         *
         * @example
         *     // ex3
         *     var obj = { 0:0, 1:1, 2:2, 3:3 };
         *     var ret = hoon.extract(obj, function(val){
         *         return val > 3;
         *     });
         *     console.log(ret); // {}
         *     console.log(obj); // { 0:0, 1:1, 2:2, 3:3 };
         *
         */
        var ret = {};
        underscore.each(obj, function(val, key){
            if (extract(val, key)){
                ret[key] = val;
            }
        });
        return ret;
    };

    exports.fmap = function(obj, fmap){
        /**
         * Extract object's properties, convert and return the new object.
         *
         * **fmap = filter + map**
         *
         * @method fmap
         * @param {Object} obj
         * @param {Function} fmap
         * @return {Object}
         * @example
         *     // ex1
         *     var obj = { 0:0, 1:1, 2:2, 3:3 };
         *     var ret = hoon.fmap(obj, function(val, key){
         *         if ((key % 2) === 1){
         *             return [key, key * val];
         *         }
         *     });
         *     console.log(ret); // { 1:1, 3:9 }
         *     console.log(obj); // { 0:0, 1:1, 2:2, 3:3 };
         *
         * @example
         *     // ex2
         *     var obj = { 0:0, 1:1, 2:2, 3:3 };
         *     var ret = hoon.fmap(obj, function(val){
         *         if (val > 3){
         *             return [key, val];
         *         }
         *     });
         *     console.log(ret); // {}
         *     console.log(obj); // { 0:0, 1:1, 2:2, 3:3 };
         *
         * @example
         *     // ex3
         *     var obj = {};
         *     var ret = hoon.fmap(obj, function(val, key){
         *         if (val > 3){
         *             return [key, val];
         *         }
         *     });
         *     console.log(ret); // {}
         *     console.log(obj); // {}
         */
        var ret = {};
        underscore.each(obj, function(val, key){
            var item = fmap(val, key);
            if (item instanceof Array){
                ret[item[0]] = item[1];
            }
        });
        return ret;
    };

    exports.padding = function(str, len, char, flag){
        /**
         * Pad a string with given characters.
         *
         * @method padding
         * @param {String} str A padded string.
         * @param {integer} len The max length of the return value.
         * @param {String} char
         * @param {Boolean} [flag=false] If flag is true, str is padded to the rigtht, else left.
         * @return {String}
         * @example
         *     // ex1
         *     var ret = hoon.padding("5", 3, "0");
         *     console.log(ret); // "005"
         *
         * @example
         *     // ex2
         *     var ret = hoon.padding("hello", 13, "<*>", true);
         *     console.log(ret); // "hello<*><*>"
         */
        var n = Math.floor((len - str.length) / char.length);
        if (n < 1){
            return str;
        } else {
            var p = "";
            for (var i=0; i<n; i++){
                p += char;
            }
            if (flag){
                return str + p;
            } else {
                return p + str;
            }
        }
    };
    
    exports.extend = function(){
        /**
         * Union sources's properties and return the new object.
         * Unlike [underscore's extend](http://underscorejs.org/#extend),
         * the first argument is not changed.
         *
         * @method extend
         * @param {Object} *sources This method is passed the arbitary number of objects as arguments.
         * It's in-order, so the last source will override properties of the same name in previous arguments.
         * @return {Object}
         * @example
         *     // ex1
         *     var s1 = {0:0, 1:1, 2:2};
         *     var s2 = {1:3, 2:5, 3:3, 4:4};
         *     var s3 = {2:7, 5:8};
         *     var ret = hoon.extend(s1, s2, s3);
         *     console.log(ret); // {0:0, 1:3, 2:7, 3:3, 4:4, 5:8}
         *     console.log(s1); // {0:0, 1:1, 2:2}
         *     console.log(s2); // {1:3, 2:5, 3:3, 4:4}
         *     console.log(s3); // {2:7, 5:8}
         *
         * @example
         *     // ex2
         *     console.log(hoon.extend()); // {}
         */
        function push(val, key){
            ret[key] = val;
        }

        var ret = {};
        var len = arguments.length;
        for (var i=0; i<len; i++){
            underscore.each(arguments[i], push);
        }
        return ret;
    };

    exports.templates = function(obj){
        /**
         * The helper method of [underscore's template](http://underscorejs.org/#template).
         *
         * @method templates
         * @param {Object} obj
         * @return {Object}
         * @example
         *     // ex1
         *     var ret = hoon.templates({
         *         hello: "Hello, <%= name %>.",
         *         date, "<%= month %>/<%= day %>",
         *     });
         *     console.log(ret.hello({name: "John"})); // Hello, John.
         *     console.log(ret.date({month: 10, day: 12})); // 10/12
         *
         * @example
         *     // ex2
         *     var ret = hoon.templates({}); // {}
         */
        var A = {};
        underscore.each(obj, function(val, key){
            A[key] = underscore.template(val);
        });
        return A;
    };

    exports.clone = function(obj){
        /**
         * Return the pseudo deep clone of the argument.
         *
         * @method clone
         * @param {Object} obj obj must be comprise of the following objects.
         * - literal number(ex: 1)
         * - literal string(ex: "hello")
         * - undefined, null, NaN
         * - true, false
         * - Boolean, Number, String, RegExp, Date, Array, Object
         *
         * @return {Object} The deep clone of the argument.
         * @example
         *     // ex1
         *     var obj = {0:{1:1}};
         *     var ret = hoon.clone(obj);
         *     console.log(obj); // {0:{1:1}};
         *     console.log(ret); // {0:{1:1}};
         *     ret[0][1] = 3;
         *     console.log(obj); // {0:{1:1}};
         *     console.log(ret); // {0:{1:3}};
         *
         */
        var self = this;
        if (underscore.isUndefined(obj)){
            return obj;
        } else if (underscore.isNaN(obj)){
            return obj;
        } else if (underscore.isNull(obj)){
            return obj;
        } else if (obj instanceof Boolean){
            return new Boolean(obj);
        } else if (obj instanceof Number){
            return new Number(obj);
        } else if (obj instanceof String){
            return new String(obj);
        } else if (obj instanceof RegExp){
            return new RegExp(obj);
        } else if (obj instanceof Date){
            return new Date(obj);
        } else if (obj instanceof Array){
            return obj.map(function(elem){
                return self.clone(elem);
            });
        } else if (obj instanceof Object){
            var obj2 = {};
            for (var key in obj){
                obj2[key] = self.clone(obj[key]);
            }
            return obj2;
        } else {
            return obj;
        }
    };

    exports.applyConstructor = function(Constructor, args){
        /**
         * create an instance of **Constructor** with a given arguments provided as an array.
         *
         * @method applyConstructor
         * @param {Function} Constructor A constructor function.
         * @param {Array} args
         *
         * @return {Constructor} An instance of **Constructor**.
         * @example
         *     function Foo(name, age){
         *         this.name = name;
         *         this.age = age;
         *     }
         *     var foo = hoon.applyConstructor(Foo, ["John", 20]); // new Foo("John", 20);
         *
         */
        function construct(args){
            Constructor.apply(this, args);
        }

        construct.prototype = Constructor.prototype;

        return new construct(args);
    };

    exports.makeObject = function(keys, values){
        /**
         * create an objects.
         *
         * @method makeObject
         * @param {String|Array of String} keys
         * @param {Anything} values
         *
         * @return {Object}
         * @example
         *     var keys = "name";
         *     var values = "John";
         *     console.log(hoon.makeObject(keys, values)); // { name: "John" }
         *     keys = ["name", "age"];
         *     values = ["John", 20];
         *     console.log(hoon.makeObject(keys, values)); // { name: "John", age: 20 }
         *     var values = "John";
         *     console.log(hoon.makeObject(keys, values)); // { name: "John", age: "John" }
         *     var values = [["John", 20]];
         *     console.log(hoon.makeObject(keys, values)); // { name: ["John", 20], age: ["John", 20] }
         */
        var ret = {};
        if (underscore.isArray(keys)){
            if (underscore.isArray(values)){
                ret = underscore.object(keys, values);
            } else {
                keys.forEach(function(key){
                    ret[key] = values;
                });
            }
        } else if (underscore.isString(keys)){
            ret[keys] = values;
        }
        return ret;
    };

    exports.json = new function(){
        /**
         * [JSON](http://www.json.org/) does not consider the following elements.
         * - NaN
         * - undefined
         * - RegExp object
         * 
         * We expect typically ``` JSON.parse(JSON.stringify(A)) ``` is equal to ``` A ``` , but the following code does not work as expected.
         * ```javascript
         * JSON.parse(JSON.stringify(undefined)); // SyntaxError
         * JSON.parse(JSON.stringify(NaN)); // null
         * JSON.parse(JSON.stringify(/ab/)); // {}
         * JSON.parse(JSON.stringify({name: undefined})); // {}
         * ```
         * So the goal of hoon.json is that ``` hoon.json.parse(hoon.json.stringify(A)) ``` is equal to ``` A ``` , that is,
         * ```javascript
         * hoon.json.parse(hoon.json.stringify(undefined)); // undefined
         * hoon.json.parse(hoon.json.stringify(NaN)); // NaN
         * hoon.json.parse(hoon.json.stringify(/ab/)); // /ab/
         * hoon.json.parse(hoon.json.stringify(0)); // 0
         * hoon.json.parse(hoon.json.stringify("undefined")); // "undefined"
         * hoon.json.parse(hoon.json.stringify({0: NaN, 1: undefined, 2: /ab/, 3: "undefined"})); // {0: NaN, 1: undefined, 2: /ab/, 3: "undefined"}
         * ```
         *
         * @class json
         * @static
         * @namespace hoon
         */
        var re_pattern = /^\/.+\/$/;
        var UNDEFIEND = {};
        this.parse = function(text){
            /**
             *
             *
             * @method parse
             * @param {String|null} text
             * @example
             *     hoon.json.parse(hoon.json.stringify(undefined)); // undefined
             *     hoon.json.parse(hoon.json.stringify(NaN)); // NaN
             *     hoon.json.parse(hoon.json.stringify(/ab/)); // /ab/
             *     hoon.json.parse(hoon.json.stringify(0)); // 0
             *     hoon.json.parse(hoon.json.stringify("undefined")); // "undefined"
             *     hoon.json.parse(hoon.json.stringify({0: NaN, 1: undefined, 2: /ab/, 3: "undefined"})); // {0: NaN, 1: undefined, 2: /ab/, 3: "undefined"}
             */

            function convert_undefined(ret){
                if (ret === UNDEFIEND){
                    return undefined;
                } else if (underscore.isArray(ret)){
                    return ret.map(function(val){
                        return convert_undefined(val);
                    });
                } else if (underscore.isRegExp(ret)){
                    return ret;
                } else if (underscore.isObject(ret)){
                    return exports.fmap(ret, function(val, key){
                        return [key, convert_undefined(val)];
                    });
                } else {
                    return ret;
                }
            }

            var ret = JSON.parse(text, function(key, val){
                if (val === "undefined"){
                    return UNDEFIEND;
                } else if (val === "NaN"){
                    return NaN;
                } else if (re_pattern.test(val)){
                    return new RegExp(val.slice(1, -1));
                } else if (underscore.isString(val)){
                    return JSON.parse(val);
                }
                return val;
            });
            return convert_undefined(ret);
        };

        this.stringify = function(value){
            /**
             *
             * @method stringify
             * @param {String|null} value
             * @return {String}
             * @example
             *     hoon.json.parse(hoon.json.stringify(undefined)); // undefined
             *     hoon.json.parse(hoon.json.stringify(NaN)); // NaN
             *     hoon.json.parse(hoon.json.stringify(/ab/)); // /ab/
             *     hoon.json.parse(hoon.json.stringify(0)); // 0
             *     hoon.json.parse(hoon.json.stringify("undefined")); // "undefined"
             *     hoon.json.parse(hoon.json.stringify({0: NaN, 1: undefined, 2: /ab/, 3: "undefined"})); // {0: NaN, 1: undefined, 2: /ab/, 3: "undefined"}
             */
            return JSON.stringify(value, function(key, val){
                if (underscore.isUndefined(val)){
                    return "undefined";
                } else if (underscore.isNaN(val)){
                    return "NaN";
                } else if (underscore.isRegExp(val)){
                    return val.toString();
                } else if (underscore.isString(val)){
                    return JSON.stringify(val);
                }
                // return JSON.stringify(val);
                return val;
            });
        };
    };

    function WebStorage(webstorage){
        /**
         * The Base Class of hoon.localStorage and hoon.sessionStorage.
         * You cannot access this class.
         *
         * This class extends the [Storage Interface](http://dev.w3.org/html5/webstorage/#the-storage-interface).
         * In the Storage interface, you must typically use the JSON object for parsing and serializing. On the other hand, in this class you don't have to use the JSON object. This class internally parses and serializes data using the hoon.json object.
         *
         * Additionally, this class provides **get**, **set** and **remove** methods for operating multiple keys.
         *
         * @class WebStorage
         * @constructor
         * @namespace hoon
         * @param {localStorage|sessionStorage} webstorage
         */
        var self = this;
        this.getItem = function(key){
            /**
             * return the current value associated with the given key.
             * If the given key does not exist in the list associated with the object 
             * then this method must return null.
             *
             * > Warning: The following methods must be used together.
             * > - WebStorage.set()
             * > - WebStorage.get()
             * > - WebStorage.setItem()
             * > - WebStorage.getItem()
             * > 
             * > For example, the following code doesn't work as expected.
             * > ```javascript
             * > localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             * > Otherwise, the following code works as expected.
             * > ```javascript
             * > hoon.localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             *
             * @method getItem
             * @param {String} key
             * @return the current value associated with the given key.
             * @example
             *     hoon.localStorage.setItem("obj", {
             *         name: "John",
             *         number: 1,
             *     });
             *     var obj = hoon.localStorage.getItem("obj");
             *     console.log();
             */
            return exports.json.parse(webstorage.getItem(key));
        };

        this.setItem = function(key, val){
            /**
             * > Warning: The following methods must be used together.
             * > - WebStorage.set()
             * > - WebStorage.get()
             * > - WebStorage.setItem()
             * > - WebStorage.getItem()
             * > 
             * > For example, the following code doesn't work as expected.
             * > ```javascript
             * > localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             * > Otherwise, the following code works as expected.
             * > ```javascript
             * > hoon.localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             * 
             * @method setItem
             * @return undefined
             * @param {String} key
             * @param val
             * @example
             *     hoon.localStorage.setItem("obj", {
             *         name: "John",
             *         number: 1,
             *     });
             *     var obj = hoon.localStorage.getItem("obj");
             *     console.log();
             */
            return webstorage.setItem(key, exports.json.stringify(val));
        };

        this.removeItem = function(key){
            /**
             * This method is equivalent to ``` webstorage.removeItem(key) ``` .
             * @method removeItem
             * @param {String} key
             * @example
             *     hoon.localStorage.setItem("name", "John");
             *     hoon.localStorage.removeItem("name");
             */
            return webstorage.removeItem(key);
        };

        this.clear = function(){
            /**
             * This method is equivalent to ``` webstorage.clear() ``` .
             * @method clear
             * @example
             *     hoon.localStorage.setItem("name", "John");
             *     hoon.localStorage.clear();
             */
            return webstorage.clear();
        };

        this.key = function(n){
            /**
             * This method is equivalent to ``` webstorage.key(n) ``` .
             * @method key
             * @param {Integer} n
             * @example
             *     hoon.clear();
             *     hoon.localStorage.setItem("name", "John");
             *     console.log(hoon.localStorage.key(0)); // "name"
             */
            return webstorage.key(n);
        };

        this.set = function(key, val){
            /**
             * > Warning: The following methods must be used together.
             * > - WebStorage.set()
             * > - WebStorage.get()
             * > - WebStorage.setItem()
             * > - WebStorage.getItem()
             * > 
             * > For example, the following code doesn't work as expected.
             * > ```javascript
             * > localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             * > Otherwise, the following code works as expected.
             * > ```javascript
             * > hoon.localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             * 
             * @method set
             * @example
             *     // equivalent to hoon.localStorage.setItem("name", "John");
             *     hoon.localStorage.set("name", "John");
             *
             *     hoon.localStorage.set({
             *         name: "John",
             *         number: 1,
             *     });
             */
            var len = arguments.length;
            if (len === 1){
                underscore.each(key, function(val, key){
                    self.setItem(key, val);
                });
            } else if (len === 2){
                self.setItem(key, val);
            }
        };

        this.get = function(keys){
            /**
             * > Warning: The following methods must be used together.
             * > - WebStorage.set()
             * > - WebStorage.get()
             * > - WebStorage.setItem()
             * > - WebStorage.getItem()
             * > 
             * > For example, the following code doesn't work as expected.
             * > ```javascript
             * > localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             * > Otherwise, the following code works as expected.
             * > ```javascript
             * > hoon.localStorage.setItem("name", "John");
             * > var name = hoon.localStorage.getItem("name", "John");
             * > ```
             * 
             * @method get
             * @param {null|Array of String|String} keys
             * @example
             *     hoon.localStorage.set({ name: "John", id: -1 });
             *     // equivalent to hoon.localStorage.getItem("name");
             *     hoon.localStorage.get("name"); // "John"
             *     hoon.localStorage.get(["name", "id"]); // { name: "John", id: -1 }
             *     hoon.localStorage.get(); // { name: "John", id: -1 }
             *     // equivalent to hoon.localStorage.get();
             *     hoon.localStorage.get(null); // { name: "John", id: -1 }
             */

            /* jshint eqnull: true */
            var ret = {};
            if (keys == null){
                var num = webstorage.length;
                for (var i=0; i<num; i++){
                    var key = webstorage.key(i);
                    ret[key] = self.getItem(key);
                }
                return ret;
            } else if (underscore.isArray(keys)){
                keys.forEach(function(key){
                    ret[key] = self.getItem(key);
                });
                return ret;
            } else if (underscore.isString(keys)){
                return self.getItem(keys);
            }
        };

        this.remove = function(keys){
            /**
             * 
             * @method remove
             * @param {null|Array of String|String} keys
             * @example
             *     hoon.localStorage.remove("name"); // equivalent to localStorage.removeItem("name");
             *     hoon.localStorage.remove(["name", "id"]);
             *     hoon.localStorage.remove(); // equivalent to localStorage.clear();
             *     hoon.localStorage.remove(null); // equivalent to localStorage.clear();
             */

            /* jshint eqnull: true */
            if (keys == null){
                webstorage.clear();
            } else if (underscore.isArray(keys)){
                keys.forEach(function(key){
                    webstorage.removeItem(key);
                });
            } else if (underscore.isString(keys)){
                webstorage.removeItem(keys);
            }
        };
    }
    if(typeof(Storage) !== "undefined") {
        exports.localStorage = new WebStorage(localStorage);
        exports.sessionStorage = new WebStorage(sessionStorage);
    }

})(typeof exports === "undefined" ? window.hoon = {} : exports,
   typeof require === "undefined" ? _ : require("underscore"));
