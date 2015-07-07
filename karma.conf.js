module.exports = function (config) {
    config.set({
        files : [
            // vendor libs
            'bower_components/angular/angular.js',
            'bower_components/angular-resource/angular-resource.js',

            // dev dependencies
            'bower_components/angular-mocks/angular-mocks.js',

            // source code
            'src/**/*.module.js',
            'src/**/*.js',

            // test-cases
            'tests/unit/**/*.spec.js'
        ],

        frameworks: [ 'jasmine' ],

        singleRun: true,

        browsers : [ 'PhantomJS' ],

        preprocessors: {
            'src/**/*.js': [ 'coverage' ]
        },

        reporters: [
            'progress',
            'coverage'
        ],

        coverageReporter: {
            type: 'lcov',
            dir: 'coverage',
            subdir: '.'
        }
    });
};
