# Errity - Simple JavaScript Error Wrapper

Errity lets you catch errors without using try-catch blocks, making your code flatter and more readable. With built-in support for default error handlers and retry mechanisms, Errity provides a solution for error management in both synchronous and asynchronous functions.
## Navigation
- [How to use?](#how-to-use)
  - [Simple case](#simple-case)
  - [More](#more)
- [Available configuration properties and methods](#available-configuration-properties-and-methods)
- [Examples](#examples)
- [Links](#links)

## How to use?
### Simple case
1. Import the errity function
```javascript
import { errity } from errity;
// or
const { errity } = require('errity');
// or
const { errity } = new Errity();
```
2. Wrap your function with errity
```javascript
const brokenFunction = errity(() => {
  // your code
});
```
3. Add a second argument, a function that will be called on error
```javascript
const brokenFunction = errity(
  () => {
    // your code
  },
  (err) => console.log(err.message)
);
```
### More
You can set a default error handler which will be triggered for all wrapped functions that don't have their own error handler
```javascript
const { errity } = new Errity({
  defaultErrorCb: (err) => console.log(err.message),
});

const brokenFunction = errity(() => {
  // your code
});
```

Second argument can be function or object
```javascript
const brokenFunction = errity(() => {
  // your code
}, {
  onError: (err) => console.log(err.message),
});
```
## Available configuration properties and methods
- retryCount - the number of retry attempts when an error occurs (works with both synchronous and asynchronous functions)
- retryDelay - the delay between retry attempts when an error occurs
- onRetryError - a function triggered on retry errors (if retryCount is 5, this function will be called 4 times)
- onError - a function triggered on error (if retryCount is 5, this function will be called once after 4 onRetryError calls)

## Examples

### Here's how you wrote the code before:
```javascript
const getData = async () => {
  try {
    const response = await fetch("https://getsomedata.com");
    const responseData = await response.json();

    if (responseData.isDisabled) {
      navigate('/example-page');
    }
    setState(responseData)
  } catch (error) {
    showNotify(error.message)
  }
};
```
Block in block in block... It's ugly! Make it more flat.
```javascript
const getData = errity(
  async () => {
    const response = await fetch("https://getsomedata.com");
    const responseData = await response.json();

    if (responseData.isDisabled) {
      navigate("/example-page");
    }
    setState(responseData);
  },
  (error) => showNotify(error.message)
);
```
Or if you set a default error function, you can remove the second (catch) argument:
```javascript
const getData = errity(
  async () => {
    const response = await fetch("https://getsomedata.com");
    const responseData = await response.json();

    if (responseData.isDisabled) {
      navigate("/example-page");
    }
    setState(responseData);
  }
);
```

## Links
[GitHub](https://github.com/arkpow1/errity), [npm](https://www.npmjs.com/package/errity)    

