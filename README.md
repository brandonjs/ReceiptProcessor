# ReceiptProcessor

To run this application, clone the repository.

Build the docker file:
```aiignore
docker build -t receiptprocessor .
```

Run the application:
```aiignore
docker run -p 8080:8080 receiptprocessor
```

## Uploading a receipt:

You can utilize curl/postman/etc. to upload the receipts in JSON format only.

Example receipts can be found in tst/resources.

To upload a receipt using curl and a JSON file:
```aiignore
$ curl -d @tst/resources/simple-receipt.json http://localhost:8080/receipts/process -X POST
{
  "id": "25e08913cc4020d2b552a6ac8a73eacd320f1a29145e2f7c1a68a152960df019"
}
```

## Getting receipt points:
Copy the id you received from the upload command and supply in the curl command:
```aiignore
$ curl -k http://localhost:8080/receipts/jq5994209925e08913cc4020d2b552a6ac8a73eacd320f1a29145e2f7c1a68a152960df019/points
{
  "points":75
}
```

## Extra information
### Running tests
If you want to run the tests you would need to ensure that you have installed node and npm and the commands are available in your path.
Once done, run the command:
```aiignore
$ npm run test

> receipt_processor@1.0.0 test
> jest

 PASS  tst/utils/functions.test.ts (5.299 s)
  generate points test
    ✓ calculate points from target-receipt (10 ms)
    ✓ calculate points from mm-receipt (2 ms)
    ✓ calculate points from morning-receipt (5 ms)
    ✓ calculate points from simple-receipt (15 ms)
```
### To change the port the application listens on inside the Docker container:
Find and edit the .env file.  Change the line PORT=8080 to whatever port you want
it to listen on.

NOTE: If you change the port you need to reflect that in the docker run command.

For example if you change the port to 3000, you would need to re-build the Docker application and run the application using the new port:
```
docker run -p 8080:3000 receiptprocessor
```
