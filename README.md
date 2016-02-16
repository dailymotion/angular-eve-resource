# angular-eve-resource

*Wrapper around ngResource made for the [Python Eve REST API Framework](http://python-eve.org/)*

[![Build Status](https://travis-ci.org/dailymotion/angular-eve-resource.svg?branch=master)](https://travis-ci.org/dailymotion/angular-eve-resource)
[![Code Climate](https://codeclimate.com/github/dailymotion/angular-eve-resource/badges/gpa.svg)](https://codeclimate.com/github/dailymotion/angular-eve-resource)
[![Test Coverage](https://codeclimate.com/github/dailymotion/angular-eve-resource/badges/coverage.svg)](https://codeclimate.com/github/dailymotion/angular-eve-resource/coverage)

## Table of Contents

- [Getting Started](#getting-started)
  - [Quick Start](#quick-start)
  - [Basic Setup](#basic-setup)
  - [Example](#example)
- [Advanced Usage](#advanced-usage)
  - [JSON Replacer](#json-replacer)
  - [Datetime formatter](#Datetime formatter)

## Getting Started

### Quick Start

The easiest way to install the `eveResource` module is via [Bower](http://bower.io/):

```shell
bower install dailymotion/angular-eve-resource --save
```

Two other options are available:

- [Download the latest release](https://github.com/dailymotion/angular-eve-resource/archive/master.zip).
- Clone the repo: `git clone https://github.com/dailymotion/angular-eve-resource.git`.

You can then include `angular-eve-resource` after its dependencies;  

[angular](https://github.com/angular/bower-angular),  
[angular-resource](https://github.com/angular/bower-angular-resource)  

```html
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-resource/angular-resource.js"></script>
<script src="bower_components/angular-eve-resource/dist/angular-eve-resource.js"></script>
```

### Basic Setup

1. Include the required libraries
2. Ensure that you inject `eveResource` into your app by adding it to the dependency list.

```js
angular.module('myApp', ['com.dailymotion.ngEveResource']);
```

### Example

Currently, `eveResource` mimics `$resource`'s [api interface](https://docs.angularjs.org/api/ngResource/service/$resource) `function(url, paramDefaults, actions, options)`
but proxies its default `toJSON` function in order to remove eve's read-only properties
(marked by an underscore (i.e. `_`) prefix) so that these are not sent along with the payload body for `$http` requests.

```js
myApp
  .factory('CreditCard', function(eveResource) {
    return eveResource('/user/:userId/card/:cardId', {
      userId:123,
      cardId:'@id'
    }, {
      charge: {
        method:'POST',
        params:{
          charge: true
        }
      }
    });
  })
  .factory('User', function(eveResource) {
    return eveResource('/user/:userId', {
      userId:'@id'
    });
  });
```

# Advanced Usage

### JSON Replacer

`eveResource` accepts one additional argument over and above what `$resource` takes,
which serves as a custom replacement function for any additional object properties
(most commonly added to augment the resource during de-serialization)
which need to be omitted or modified in any way prior to object serialization
(using either `angular.toJson` or `JSON.stringify` directly).  

The `toJsonReplacer` function will be passed 2 arguments `(propertyName, value)`
and is expected to return a value that will be set as the replacement of the Object's key in question.
It is highly recommended to return the value as-is if it is to be treated as unchanged
and `undefined` if it must be entirely removed from the request body payload.
This process of elimination can also be achieved in the `requestTransform`
to mirror any fields added in the `responseTransform`.  

However, this function will only be called if the key does not start with an underscore,
otherwise the key-value pair will be removed regardless and the provided function will not fire.

```js
myApp.factory('Notes', function(eveResource) {
  return eveResource('/notes/:id', null, {
    update: {
      method: 'PATCH'
    }
  }, null, function replacer(key, value) {
    if (key == 'selected') {
      return undefined;
    }
    return value;
  });
});
```

**NOTE:** `eveResource` allows the optional 4th `options` parameter of `$resource` to be skipped entirely,
so that the more common use-case `function toJsonReplacer(key, value) {}` can be passed in instead of it.

### Datetime formatter

The datetime formatter is used to format the eve resource's `_created` and the `_updated` fields. It depends on [moment.js 1.5.0+](http://momentjs.com/) to handle formatting. If moment.js is not available, the datetime will not be formatted.

Please look at [moment.js string formatter](http://momentjs.com/docs/#/parsing/string-format/) for how to manipulate the datetime.

#### Override the default format
The default dateformat can be overridden setting the eveResourceProvider `init` method.

```js
myApp.config(function(eveResourceProvider) {
    eveResourceProvider.init({
        // Formatter definition: http://momentjs.com/docs/#/parsing/string-format/
        dateformat: 'YYYY-MM-DDTHH:mm:ss[Z]'
    });
});
```

#### Override an instance

Pass the format string as the first parameter:

```js
    myNotes.get({
        _id: '...'
    }, function (note) {
        // Formatter definition: http://momentjs.com/docs/#/parsing/string-format/
        console.log(note.formatCreated('YYYY-MM-DDTHH:mm:ss[Z]'));
    });
```
