# Commt Example App (MoiChat) NodeJS Service

This app built as an example to guide how to use Commt NodeSDK in NodeJS projects.
You will see some function calls from Commt NodeSDK and Commt initialization.

Furthermore you can see how to integrate and use Webhook routes in this example app.

## Current Routes
| Route        | Method | Description | Is Webhook |
|---------------|:------:|-----|:-----:|-----------:|
| /user/login |  POST | User login route |        NO |
| /user/      |  GET |  Get all users route |        NO |
| /room/create-room |  POST |  Create room webhook route |        YES |
| /room/create-room |  GET |  Webhook health check route |        YES |
| /room |  GET |  Get all rooms route | NO |
| /chat/save-message |  POST |  Store message in DB route |        YES |
| /chat/save-message |  GET  |  Webhook health check route |        YES |
| /chat/      |  GET |  Get messages and loadMore messages route |  NO |

## Download Installation
Run the command below to download the example app in you local and run

```
git clone https://github.com/commt/moi-chat-service.git
cd moi-chat-service
yarn
```

- Run `yarn start` for production server
- Run `yarn dev` for development server

## License
[MIT](https://github.com/commt/moi-chat-service/blob/main/LICENSE)