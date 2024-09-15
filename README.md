# ReceiptProcessor

To run this application, clone the repository.

Build the docker file:
```
docker build -t receiptprocessor .
```

Run the application:
```
docker run -p 8080:8080 receiptprocessor
```

## Uploading a receipt:

You can utilize curl/postman/etc. to upload the receipts in JSON format only.

Example receipts can be found in tst/resources.

To upload a receipt using curl and a JSON file:
```
$ curl -d @tst/resources/simple-receipt.json http://localhost:8080/receipts/process -X POST
{
  "id": "25e08913cc4020d2b552a6ac8a73eacd320f1a29145e2f7c1a68a152960df019"
}
```

## Getting receipt points:
Copy the id you received from the upload command and supply in the curl command:
```
$ curl -k http://localhost:8080/receipts/jq5994209925e08913cc4020d2b552a6ac8a73eacd320f1a29145e2f7c1a68a152960df019/points
{
  "points":75
}
```

### To change the port the application listens on inside the Docker container:
Find and edit the .env file.  Change the line PORT=8080 to whatever port you want
it to listen on.

NOTE: If you change the port you need to reflect that in the docker run command.

For example if you change the port to 3000, you would need to re-build the Docker application and run the application using the new port:
```
docker run -p 8080:3000 receiptprocessor
```
