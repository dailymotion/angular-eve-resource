;(function (angular, window, document, undefined) {
    'use strict';

angular.module('com.dailymotion.ngEveResource', [
    'ngResource'
]);

angular.module('com.dailymotion.ngEveResource')
    .service('eve', function () {
        function prepareArgs () {
            var args = Array.prototype.slice.call(arguments);
            return args.map(function (arg) {
                if (angular.isFunction(arg)) {
                    return arg();
                }
                return arg;
            }).filter(function (arg) {
                return !!arg;
            });
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
                if (angular.isDefined(key) && angular.isDefined(val)) {
                    o = {};
                    o[key] = val;
                    return o;
                }
            },
            $like: function (key, val) {
                var o;
                if (angular.isDefined(key) && val) {
                    o = {};
                    o[key] = {
                        $regex: val
                    };
                    return o;
                }
            },
        };
    })
angular.module('com.dailymotion.ngEveResource')
    .factory('eveResource', function($resource) {
        return function(url, paramDefaults, actions, options, toJsonReplacer) {
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

            return Resource;
        };
    });

}(this.angular, this, this.document));
