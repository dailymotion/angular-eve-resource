angular.module('com.dailymotion.ngEveResource')
    .value('eveCfg', {
        'dateformat': 'YYYY-MM-DDTHH:mm:ss[Z]'
    })
    .factory('eveResource', function ($window, $resource, eveCfg) {
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

            function format (time, fmt) {
                return $window.moment && $window.moment.utc ? $window.moment.utc(time).format(fmt || eveCfg.dateformat) : time;
            }

            Resource.prototype.formatUpdated = function (fmt) {
                return format(this._updated, fmt);
            };

            Resource.prototype.formatCreated = function (fmt) {
                return format(this._created, fmt);
            };

            return Resource;
        };
    });
