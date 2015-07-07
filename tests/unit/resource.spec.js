describe('eveResource', function() {
    var Resource;

    beforeEach(function() {
        module('com.dailymotion.ngEveResource');
        inject(function(eveResource) {
            Resource = eveResource('http://api.dailymotion.com/videos/:id');
        });
    });

    it('should correctly serialize the data toJSON', function() {
        var resource = new Resource({
            hai: 'hello world!',
            _kthx: 'bai'
        });

        expect(angular.toJson(resource)).toBe('{"hai":"hello world!"}');
    });
});
