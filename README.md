# angular-eve-resource

AngularJS Resource Adapter for the Python Eve REST API Framework

Currently proxies $resource and overrides its toJSON() function
to remove eve's read-only properties (marked by an underscore (i.e. `_`) prefix).
