describe('eve', function () {

    beforeEach(module('com.dailymotion.ngEveResource'));

    it('should build query $eq', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$eq('asdf', undefined)).toBeUndefined();
        expect(qw.$eq('asdf', "")).toBeUndefined();
        expect(qw.$eq('asdf', 123)).toEqual({
            'asdf': 123
        });
    }));

    it('should build query $like', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$like('asdf', undefined)).toBeUndefined();
        expect(qw.$like('asdf', null)).toBeUndefined();
        expect(qw.$like('asdf', "")).toBeUndefined();
        expect(qw.$like('asdf', 123)).toEqual({
            'asdf': {
                $regex: 123
            }
        });
    }));

    it('should build query $and', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$and(
            undefined,
            qw.$eq('asdf', 123)
        )).toEqual({
            'asdf': 123
        });
        expect(qw.$and(
            qw.$eq('asdf', 123),
            qw.$eq('asdf', 123)
        )).toEqual({
            $and: [
                {'asdf': 123},
                {'asdf': 123}
            ]
        });

        expect(qw.$and([
            undefined,
            qw.$eq('asdf', 123),
        ])).toEqual({
            'asdf': 123
        });
        expect(qw.$and([
            qw.$eq('asdf', 123),
            qw.$eq('asdf', 123),
        ])).toEqual({
            $and: [
                {'asdf': 123},
                {'asdf': 123}
            ]
        });
    }));

    it('should build query $or', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$or(
            undefined,
            qw.$eq('asdf', 123)
        )).toEqual({
            'asdf': 123
        });
        expect(qw.$or(
            qw.$eq('asdf', 123),
            qw.$eq('asdf', 123)
        )).toEqual({
            $or: [
                {'asdf': 123},
                {'asdf': 123}
            ]
        });

        expect(qw.$or([
            undefined,
            qw.$eq('asdf', 123),
        ])).toEqual({
            'asdf': 123
        });
        expect(qw.$or([
            qw.$eq('asdf', 123),
            qw.$eq('asdf', 123),
        ])).toEqual({
            $or: [
                {'asdf': 123},
                {'asdf': 123}
            ]
        });
    }));
});
