(function(exports, underscore){
    "use strict";

    /**
     * @class hoon
     * @static
     */

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

})(typeof exports === "undefined" ? window.hoon = {} : exports,
   typeof require === "undefined" ? _ : require("underscore"));
