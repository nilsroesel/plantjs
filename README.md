# skeiðjs

## About
skeidjs is a lightweight typescript based framework for creating restful apis.  
The objective is to have a small driverless and expressive application that can run.  
It uses ideas of declarative programming and concepts you may know from angular2.
You can declare a @Application class (comparable to NgModules) and inject there the
components with the endpoints and other dependencies and middlewares.  
The main part is implemented via the typescript decorators (unfortunately this is 
still declared as an experimental feature and may change in future. 
Currently its working with typescript 2.8.1. If the new ECMA-script version will also support
decorators it could also work with plain js)


## Functionality notes
[See full doc at](https://nilsroesel.github.io/skeidjs/)

### Middleware evaluation
The evaluation of middleware function goes as it follows:
- First: the application scoped middleware
- Second: the module scoped middleware
- Third: the component scoped middleware
- Fourth: the endpoint scoped middleware  
- The middleware follows the order, given in the array.  
- The last chain is the endpoint function 
- An endpoint/middleware function has three parameters (request, response, next?);
- The next() function will break the current execution of the current function and start the next one

### Routes
- The basic route scheme is:
/$applicationRoute/$moduleRoute/$componentRoute/$endpointRoute
- you can define a param in a route like `/:foo`  
and access it via `request.params.foo`
#### Route Typing
you can directly define a typed route param with the pattern `:param#type`  
`/:id#number` an non digit route would return a 404. 
The available types are:
- number  
- hex
- alpha (=> [a-zA-Z])

### Decorator driven
Everything is decorator driven. The framework is not supposed to run an application like
the "express.use().listen(x)". You decorate the main component with @Application and execute
the driver without setting the app up manually. That also means its not supposed to be compatible 
with vanilla node-js, as long as ecma script doesnt provide decorators.  
You are also able to gather components into modules and import the modules into your app, to have a nice clean structural approach. 

#### Note!
Set in your tsconfig.json
```json
{  
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
    
}
```
### Visit the playground.ts to see a working example
[playground.ts](https://github.com/nilsroesel/skeidjs/blob/master/src/playground.ts)


   

 
