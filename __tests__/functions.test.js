const { Errity, errity } = require("../index");

const LOOPS = 500;

// Вспомогательная функция для создания errity с кастомной ошибкой
const createErrity = (errorCb) => {
  const { errity } = new Errity({
    defaultErrorCb: errorCb,
  });
  return errity;
};

describe("Sync functions tests:", () => {
  // Тест с использованием кастомного обработчика ошибок
  test("All functions with custom error cb", () => {
    let errorCount = 0;

    const testSync = createErrity(() => errorCount++)((value, hasError) => {
      if (hasError) {
        throw new Error(value + " error");
      }
    });

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, i % 2 === 0);
    }

    expect(errorCount).toBe(LOOPS / 2);
  });

  // Тест с использованием дефолтного обработчика ошибок, без кастомного
  test("All functions without custom error cb", () => {
    let errorCount = 0;

    const { errity } = new Errity({
      defaultErrorCb: () => errorCount++,
    });

    const testSync = errity((value, hasError) => {
      if (hasError) {
        throw new Error(value + " error");
      }
    });

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, i % 2 === 0);
    }

    expect(errorCount).toBe(LOOPS / 2);
  });

  // Тест с использованием дефолтного обработчика ошибок
  test("All functions with default error cb", () => {
    let errorCount = 0;

    const { errity } = new Errity({
      defaultErrorCb: () => errorCount++,
    });

    const testSync = errity((value, hasError) => {
      if (hasError) {
        throw new Error(value + " error");
      }
    });

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, i % 2 === 0);
    }

    expect(errorCount).toBe(LOOPS / 2);
  });

  // Тест поведения при отсутствии ошибок
  test("No errors should not trigger error callback", () => {
    let errorCount = 0;

    const testSync = createErrity(() => errorCount++)((value, hasError) => {
      if (hasError) {
        throw new Error(value + " error");
      }
    });

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, false); // Ошибки не возникают
    }

    expect(errorCount).toBe(0); // Ошибок не должно быть
  });

  // Тест передачи данных из функции в обработчик ошибок
  test("Error data should be passed to error callback", () => {
    const errorData = [];

    const errity = createErrity((err) => errorData.push(err.message));

    const testSync = errity((value, hasError) => {
      if (hasError) {
        throw new Error(value + " error");
      }
    });

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, i % 2 === 0);
    }

    expect(errorData.length).toBe(LOOPS / 2);
    for (let i = 0; i < LOOPS / 2; i++) {
      expect(errorData[i]).toBe(2 * i + " error");
    }
  });

  // Тест кастомного обработчика ошибок с повторными попытками
  test("Custom error cb with retries", () => {
    let errorCount = 0;

    const testSync = createErrity(() => errorCount++)(
      (value, hasError) => {
        if (hasError) {
          throw new Error(value + " error");
        }
      },
      { retryCount: 3 }
    );

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, i % 2 === 0);
    }

    expect(errorCount).toBe(LOOPS / 2);
  });

  // Тест дефолтного обработчика ошибок с повторными попытками
  test("Default error cb with retries", () => {
    let errorCount = 0;

    const { errity } = new Errity({
      defaultErrorCb: () => errorCount++,
    });

    const testSync = errity(
      (value, hasError) => {
        if (hasError) {
          throw new Error(value + " error");
        }
      },
      { retryCount: 3 }
    );

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, i % 2 === 0);
    }

    expect(errorCount).toBe(LOOPS / 2);
  });

  // Тест обработки различных типов ошибок
  test("Handling different error types", () => {
    let errorCount = 0;
    const errorMessages = [];

    const testSync = createErrity((err) => {
      errorCount++;
      errorMessages.push(err.message);
    })((value, hasError) => {
      if (hasError) {
        if (value % 2 === 0) {
          throw new Error(value + " error");
        } else {
          throw value + " error";
        }
      }
    });

    for (let i = 0; i < LOOPS; i++) {
      testSync(i, i % 2 === 0);
    }

    expect(errorCount).toBe(LOOPS / 2);
    for (let i = 0; i < LOOPS / 2; i++) {
      if ((2 * i) % 2 === 0) {
        expect(errorMessages[i]).toBe(2 * i + " error");
      } else {
        expect(errorMessages[i]).toBe("2" + i + " error");
      }
    }
  });
});

describe("Sync functions with custom error cb or not", () => {
  // Тест с чередованием кастомного и дефолтного обработчиков ошибок
  test("Half functions with custom error cb, half without", () => {
    let defaultCount = 0;
    let customCount = 0;

    const { errity } = new Errity({
      defaultErrorCb: () => {},
    });

    for (let i = 0; i < LOOPS; i++) {
      const testSync = errity(
        (value) => {
          throw new Error(value + " error");
        },
        i % 2 === 0 ? () => defaultCount++ : () => customCount++
      );

      testSync(i);
    }

    expect(defaultCount).toBe(LOOPS / 2);
    expect(customCount).toBe(LOOPS / 2);
  });
});

describe("Additional tests for Errity", () => {
  // Тест обработки ошибок для асинхронных функций
  test("Async functions with error handling", async () => {
    let errorCount = 0;

    const { errity } = new Errity({
      defaultErrorCb: () => errorCount++,
    });

    const testAsync = errity(async (value, hasError) => {
      if (hasError) {
        throw new Error(value + " async error");
      }
    });

    const promises = [];
    for (let i = 0; i < LOOPS; i++) {
      promises.push(testAsync(i, i % 2 === 0));
    }
    await Promise.all(promises);

    expect(errorCount).toBe(LOOPS / 2);
  });

  // Тест асинхронных функций с кастомным обработчиком ошибок и повторными попытками
  test("Async functions with custom error cb and retries", async () => {
    let retryErrorCount = 0;
    let errorCount = 0;
    const RETRY_COUNT = 500;

    const testAsync = errity(
      async () => {
        throw new Error(value + " async error");
      },
      {
        retryCount: RETRY_COUNT,
        onRetryError: () => retryErrorCount++,
        onError: () => errorCount++,
      }
    );

    await testAsync();

    expect(errorCount).toBe(1);
    expect(retryErrorCount).toBe(499);
  });

  // Тест передачи данных из асинхронной функции в обработчик ошибок
  test("Async error data should be passed to error callback", async () => {
    const errorData = [];
    const errity = createErrity((err) => errorData.push(err.message));

    const testAsync = errity(async (value, hasError) => {
      if (hasError) {
        throw new Error(value + " async error");
      }
    });

    const promises = [];
    for (let i = 0; i < LOOPS; i++) {
      promises.push(testAsync(i, i % 2 === 0));
    }
    await Promise.all(promises);

    expect(errorData.length).toBe(LOOPS / 2);
    for (let i = 0; i < LOOPS / 2; i++) {
      expect(errorData[i]).toBe(2 * i + " async error");
    }
  });

  // Тест поведения при ошибках в асинхронных функциях без повторных попыток
  test("Async functions without retries", async () => {
    let errorCount = 0;

    const testAsync = errity(
      async () => {
        throw new Error("");
      },
      { onError: () => errorCount++ }
    );

    const promises = [];
    for (let i = 0; i < LOOPS; i++) {
      promises.push(testAsync());
    }
    await Promise.all(promises);

    expect(errorCount).toBe(LOOPS);
  });

  test("Check logger implement", () => {
    const { logs } = new Errity({ logger: true });
    expect(logs).toEqual([]);
  });

  test("Check undefined logger", () => {
    const { logs } = new Errity();
    expect(logs).toBeUndefined();
  });

  test("Check five errors in logs", () => {
    const { logs, errity } = new Errity({ logger: true });
    for (let i = 0; i < 5; i++) {
      errity(() => {
        throw Error();
      })();
    }

    expect(logs).toHaveLength(5);
  });
});
