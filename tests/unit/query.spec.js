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

    it('should build query $ne', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$ne('asdf', undefined)).toBeUndefined();
        expect(qw.$ne('asdf', "")).toBeUndefined();
        expect(qw.$ne('asdf', 123)).toEqual({
            'asdf': {
                $ne: 123
            }
        });
    }));

    it('should build query $gt', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$gt('asdf', undefined)).toBeUndefined();
        expect(qw.$gt('asdf', "")).toBeUndefined();
        expect(qw.$gt('asdf', 123)).toEqual({
            'asdf': {
                $gt: 123
            }
        });
    }));

    it('should build query $gte', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$gte('asdf', undefined)).toBeUndefined();
        expect(qw.$gte('asdf', "")).toBeUndefined();
        expect(qw.$gte('asdf', 123)).toEqual({
            'asdf': {
                $gte: 123
            }
        });
    }));

    it('should build query $lt', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$lt('asdf', undefined)).toBeUndefined();
        expect(qw.$lt('asdf', "")).toBeUndefined();
        expect(qw.$lt('asdf', 123)).toEqual({
            'asdf': {
                $lt: 123
            }
        });
    }));

    it('should build query $lte', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$lte('asdf', undefined)).toBeUndefined();
        expect(qw.$lte('asdf', "")).toBeUndefined();
        expect(qw.$lte('asdf', 123)).toEqual({
            'asdf': {
                $lte: 123
            }
        });
    }));

    it('should build query $in', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$in('asdf', undefined)).toBeUndefined();
        expect(qw.$in('asdf', "")).toBeUndefined();
        expect(qw.$in('asdf', [1, 2, 3])).toEqual({
            'asdf': {
                $in: [1, 2, 3]
            }
        });
    }));

    it('should build query $nin', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$nin('asdf', undefined)).toBeUndefined();
        expect(qw.$nin('asdf', "")).toBeUndefined();
        expect(qw.$nin('asdf', [1, 2, 3])).toEqual({
            'asdf': {
                $nin: [1, 2, 3]
            }
        });
    }));

    it('should build query $regex', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$regex('asdf', undefined)).toBeUndefined();
        expect(qw.$regex('asdf', null)).toBeUndefined();
        expect(qw.$regex('asdf', "")).toBeUndefined();
        expect(qw.$regex('asdf', 123)).toEqual({
            'asdf': {
                $regex: 123
            }
        });

        expect(qw.$regex('asdf', undefined, 'wrap')).toBeUndefined();
        expect(qw.$regex('asdf', null, 'wrap')).toBeUndefined();
        expect(qw.$regex('asdf', "", 'wrap')).toBeUndefined();
        expect(qw.$regex('asdf', 123, 'wrap')).toEqual({
            'asdf': {
                $regex: '.*?123.*?'
            }
        });
        expect(qw.$regex('asdf', 123, 'pre')).toEqual({
            'asdf': {
                $regex: '.*?123'
            }
        });
        expect(qw.$regex('asdf', 123, 'post')).toEqual({
            'asdf': {
                $regex: '123.*?'
            }
        });

        function myFn (val) {
            return val + val;
        }
        expect(qw.$regex('asdf', 123, myFn)).toEqual({
            'asdf': {
                $regex: 123 * 2
            }
        });
        expect(qw.$regex('asdf', '123', myFn)).toEqual({
            'asdf': {
                $regex: '123123'
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

    it('should simplify query', inject(function (eve) {
        var qw = eve.query;

        expect(qw.$and(
            qw.$and(
                qw.$and(
                    qw.$eq('asdf', 1),
                    qw.$eq('asdf', 2)
                ),
                qw.$eq('asdf', 3)
            ),
            qw.$and(
                qw.$eq('asdf', 4),
                qw.$eq('asdf', 5)
            ),
            qw.$or(
                qw.$eq('asdf', 6),
                qw.$eq('asdf', 7),
                qw.$or(
                    qw.$eq('asdf', 8),
                    qw.$eq('asdf', 9)
                )
            )
        )).toEqual({
            $and: [
                {'asdf': 1},
                {'asdf': 2},
                {'asdf': 3},
                {'asdf': 4},
                {'asdf': 5},
                {
                    $or: [
                        {'asdf': 6},
                        {'asdf': 7},
                        {'asdf': 8},
                        {'asdf': 9}
                    ]
                }
            ]
        });
    }));
});
