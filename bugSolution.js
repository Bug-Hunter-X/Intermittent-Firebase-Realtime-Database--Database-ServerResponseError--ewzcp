```javascript
function writeDataToDatabase(data) {
  return new Promise((resolve, reject) => {
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    function attemptWrite(retriesLeft) {
      firebase.database().ref('/myData').set(data)
        .then(resolve)
        .catch(error => {
          if (retriesLeft > 0 && error.code === 'database/server-response-error') {
            const delay = retryDelay * Math.pow(2, maxRetries - retriesLeft);
            console.warn(`Database write failed, retrying in ${delay}ms:`, error);
            setTimeout(() => attemptWrite(retriesLeft - 1), delay);
          } else {
            reject(error);
          }
        });
    }

    attemptWrite(maxRetries);
  });
}

writeDataToDatabase({ myValue: 'newValue' })
  .then(() => console.log('Data written successfully'))
  .catch(error => console.error('Database write failed after multiple retries:', error));
```