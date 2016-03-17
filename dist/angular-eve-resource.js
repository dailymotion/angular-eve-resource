;(function (angular, window, document, undefined) {
    'use strict';

angular.module('com.dailymotion.ngEveResource', [
    'ngResource'
]);

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

angular.module('com.dailymotion.ngEveResource')
    .provider('eveResource', function () {
        var cfg = {
            'dateformat': 'YYYY-MM-DDTHH:mm:ss[Z]'
        };

        this.init = function (config) {
            angular.merge(cfg, config);
        };

        this.$get = ['$window', '$resource', function ($window, $resource) {
            function format (time, fmt) {
                return $window.moment && $window.moment.utc ? $window.moment.utc(time).format(fmt || cfg.dateformat) : time;
            }

            function formatUpdated (fmt) {
                return format(this._updated, fmt);
            }

            function formatCreated (fmt) {
                return format(this._created, fmt);
            }

            return function (url, paramDefaults, actions, options, toJsonReplacer) {
                var Resource,
                    toJSON;

                if (!angular.isFunction(toJsonReplacer)) {
                    if (angular.isFunction(options)) {
                        toJsonReplacer = options;
                        options = {};
                    } else {
                        toJsonReplacer = function(key, value) {
                            return value;
                        };
                    }
                }

                Resource = $resource(url, paramDefaults, actions, options);

                toJSON = Resource.prototype.toJSON;

                Resource.prototype.toJSON = function() {
                    var data = toJSON.call(this);

                    angular.forEach(data, function(value, key) {
                        data[key] = key.charAt(0) === '_' ? undefined : toJsonReplacer(key, value);
                    });

                    return data;
                };

                Resource.prototype.exists = function() {
                    return !!this._id;
                };

                Resource.prototype.formatUpdated = formatUpdated;
                Resource.prototype.formatCreated = formatCreated;

                return Resource;
            };
        }];
    });

}(this.angular, this, this.document));
