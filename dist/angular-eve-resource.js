angular.module('com.dailymotion.ngEveResource', [
    'ngResource'
]);

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
                    }
                }
            }

            Resource = $resource(url, paramDefaults, actions, options);

            toJSON = Resource.prototype.toJSON;

            Resource.prototype.toJSON = function() {
                var data = toJSON.call(this);

                angular.forEach(data, function(value, key) {
                    data[key] = key.charAt(0) == '_' ? undefined : toJsonReplacer(key, value);
                });

                return data;
            };

            return Resource;
        };
    });
