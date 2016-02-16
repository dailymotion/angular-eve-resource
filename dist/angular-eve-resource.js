;(function (angular, window, document, undefined) {
    'use strict';

angular.module('com.dailymotion.ngEveResource', [
    'ngResource'
]);

angular.module('com.dailymotion.ngEveResource')
    .service('eve', function () {
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

        function isDefined (val) {
            if (angular.isUndefined(val)) {
                return false;
            }
            if (angular.isString(val)) {
                return val.length > 0;
            }
            return true;
        }

        this.query = {
            $and: function () {
                var cond = prepareArgs.apply(null, arguments);
                return cond.length > 1 ? {
                    $and: cond,
                } : cond[0];
            },
            $or: function () {
                var cond = prepareArgs.apply(null, arguments);
                return cond.length > 1 ? {
                    $or: cond,
                } : cond[0];
            },
            $eq: function (key, val) {
                var o;
                if (isDefined(key) && isDefined(val)) {
                    o = {};
                    o[key] = val;
                    return o;
                }
            },
            $like: function (key, val) {
                var o;
                if (isDefined(key) && val) {
                    o = {};
                    o[key] = {
                        $regex: val
                    };
                    return o;
                }
            },
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
