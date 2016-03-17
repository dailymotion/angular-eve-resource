angular.module('com.dailymotion.ngEveResource')
    .service('eve', function () {
        function obj (key, comp, val) {
            var o = {};
            if (arguments.length === 3) {
                (o[key] = {})[comp] = val;
            } else  {
                o[key] = comp;
            }
            return o;
        }

        function prepareArgs () {
            var args = angular.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
            return args.map(function (arg) {
                if (angular.isFunction(arg)) {
                    return arg();
                }
                return arg;
            }).filter(function (arg) {
                return !!arg;
            });
        }

        function simplify (conds, key) {
            var newCond = [];

            angular.forEach(conds, function (cond) {
                if (cond[key]) {
                    newCond = [].concat(newCond, simplify(cond[key], key));
                } else {
                    newCond.push(cond);
                }
            });

            return newCond;
        }

        function isDefined (val) {
            if (angular.isUndefined(val)) {
                return false;
            }
            if (angular.isString(val)) {
                return val.length > 0;
            }
            return true;
        }

        function regexValue (val, match) {
            if (angular.isFunction(match)) {
                return match(val);
            } else if (match === 'pre') {
                return [
                    '.*?',
                    val,
                ].join('');
            } else if (match === 'post') {
                return [
                    val,
                    '.*?',
                ].join('');
            } else if (match === 'wrap') {
                return [
                    '.*?',
                    val,
                    '.*?',
                ].join('');
            }
            return val;
        }

        function regex (key, val, match) {
            if (isDefined(key) && val) {
                return obj(key, '$regex', regexValue(val, match));
            }
        }

        function numComparison (comp) {
            return function (key, num) {
                if (angular.isNumber(num)) {
                    return obj(key, comp, num);
                }
            };
        }

        this.query = {
            $and: function () {
                var cond = simplify(prepareArgs.apply(null, arguments), '$and');
                return cond.length > 1 ? obj('$and', cond) : cond[0];
            },
            $or: function () {
                var cond = simplify(prepareArgs.apply(null, arguments), '$or');
                return cond.length > 1 ? obj('$or', cond) : cond[0];
            },
            $eq: function (key, val) {
                if (isDefined(key) && isDefined(val)) {
                    return obj(key, val);
                }
            },
            $ne: function (key, val) {
                if (isDefined(key) && isDefined(val)) {
                    return obj(key, '$ne', val);
                }
            },
            $in: function (key, val) {
                if (isDefined(key) && angular.isArray(val)) {
                    return obj(key, '$in', val);
                }
            },
            $nin: function (key, val) {
                if (isDefined(key) && angular.isArray(val)) {
                    return obj(key, '$nin', val);
                }
            },
            // deprecated alias. Use $regex.
            $like: regex,
            $regex: regex,
            $gt: numComparison('$gt'),
            $gte: numComparison('$gte'),
            $lt: numComparison('$lt'),
            $lte: numComparison('$lte'),
        };
    });
