# plantjs

## About
planTs is a lightweight typescript based framework for creating restful apis.  
The objective is to have a small driverless and expressive application that can run.  
It uses ideas of declarative programming and concepts you may know from angular2.
You can declare a @Application class (comparable to NgModules) and inject there the
components with the endpoints and other dependencies and middlewares.  
The main part is implemented via the typescript decorators (unfortunately this is 
still declared as an experimental feature and may change in future. 
Currently its working with typescript 2.8.1. If the new ECMA-Scipt version will also support
decorators it could also work with plain js)
