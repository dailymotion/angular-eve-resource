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
    });
