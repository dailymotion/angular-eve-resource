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
but only proxies its default `toJSON` function in order to remove eve's read-only properties
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
(most commonly added to augment to resource during de-serialization)
which need to be omitted or modified in any way prior to object serialization
(using either `angular.toJson` or `JSON.stringify` directly).

```js
myApp.factory('Notes', function(eveResource) {
  return eveResource('/notes/:id', null, {
    update: {
      method: 'PUT'
    }
  }, null, function(key, value) {
    if (key == 'selected') {
      return undefined;
    }
    return value;
  });
});
```
