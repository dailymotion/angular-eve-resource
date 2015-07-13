describe('eveResource', function() {
    var Resource;

    beforeEach(module('com.dailymotion.ngEveResource'));

    it('should correctly serialize the data toJSON', inject(function(eveResource) {
        var User = eveResource('/user/:userId', {
            userId:'@id'
        }), user = new User({
            hai: 'hello world!',
            _kthx: 'bai'
        });

        expect(angular.toJson(user)).toBe('{"hai":"hello world!"}');
    }));

    it('should respect the optional 4th param as replacerFn if not an Object', inject(function(eveResource) {
        var Notes = eveResource('/notes/:id', null, {
            update: {
                method: 'PATCH'
            }
        }, function (key, value) {
            if (key == 'selected') {
                return undefined;
            }
            return value;
        }), note = new Notes({
            selected: false,
            _id: '123'
        });

        expect(angular.toJson(note)).toBe('{}');
    }));

    it('should check if the object resource is new or if it already exists in the database', inject(function(eveResource) {
        var CreditCard = eveResource('/user/:userId/card/:cardId', {
            userId:123,
            cardId:'@id'
        }, {
            charge: {
                method:'POST',
                params:{
                    charge: true
                }
            }
        }), creditCard = new CreditCard();

        expect(creditCard.exists()).toEqual(false);
    }));
});
