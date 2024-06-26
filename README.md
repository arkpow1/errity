# Errity - Elegant Error Handling in JavaScript Functions

Errity lets you catch errors without using try-catch blocks, making your code flatter and more readable. With built-in support for default error handlers and retry mechanisms, Errity provides a solution for error management in both synchronous and asynchronous functions.

## Navigation

- [Installation](#installation)
- [Usage](#usage)
  - [Simple case](#simple-case)
  - [More](#more)
- [Configuration properties and methods for errity function](#configuration-properties-and-methods-for-errity-function)
- [Configuration properties and methods for Errity class](#configuration-properties-and-methods-for-errity-class)
- [Examples](#examples)
- [Links](#links)

## Installation

```shell
npm i errity
```

## Usage

### Simple case

1. Import the errity function

```javascript
import { errity } from errity;
// or
const { errity } = require('errity');
// or
import { Errity } from 'errity'; // or require
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

You can set a default error handler which will be triggered for all wrapped functions that don't have their own error handler:

```javascript
const { errity } = new Errity({
  defaultErrorCb: (err) => console.log(err.message),
});

const brokenFunction = errity(() => {
  // your code
});
```

Second argument can be function or object:

```javascript
const brokenFunction = errity(
  () => {
    // your code
  },
  {
    onError: (err) => console.log(err.message),
  }
);
```

You can get error logs using the following code:

```javascript
const { errity, logs } = new Errity({
  logger: true,
});
console.log(logs); // array of error logs
```

## Configuration properties and methods for errity function

- **retryCount** - the number of retry attempts when an error occurs (works with both synchronous and asynchronous functions)
- **retryDelay** - the delay between retry attempts when an error occurs
- **onRetryError** - a function triggered on retry errors (if retryCount is 5, this function will be called 4 times)
- **onError** - a function triggered on error (if retryCount is 5, this function will be called once after 4 onRetryError calls)

## Configuration properties and methods for Errity class

- **logger** - a property responsible for error logging
- **defaultErrorCb** - a function that will be called on error if no unique error handler is passed to the errity function

## Examples

### Here's how you wrote the code before:

```javascript
const getData = async () => {
  try {
    const response = await fetch("https://getsomedata.com");
    const responseData = await response.json();

    if (responseData.isDisabled) {
      navigate("/example-page");
    }
    setState(responseData);
  } catch (error) {
    showNotify(error.message);
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
const getData = errity(async () => {
  const response = await fetch("https://getsomedata.com");
  const responseData = await response.json();

  if (responseData.isDisabled) {
    navigate("/example-page");
  }
  setState(responseData);
});
```

## Links

[GitHub](https://github.com/arkpow1/errity), [npm](https://www.npmjs.com/package/errity)
