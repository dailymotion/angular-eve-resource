angular.module('com.dailymotion.ngEveResource', [
    'ngResource'
]);

angular.module('com.dailymotion.ngEveResource')
    .factory('eveResource', function($resource) {
        return function(url, paramDefaults, actions, options, toJsonReplacer) {
            var Resource,
                toJSON;

            if (angular.isFunction(options)) {
                toJsonReplacer = options;
                options = {};
            }

            Resource = $resource(url, paramDefaults, actions, options);

            toJSON = Resource.prototype.toJSON;

            Resource.prototype.toJSON = function() {
                var data = toJSON.call(this);

                angular.forEach(data, function(value, key) {
                    if (key.charAt(0) === '_') {
                        data[key] = undefined;
                    }

                    data[key] = toJsonReplacer(key, value);
                });

                return data;
            };

            return Resource;
        };
    });
