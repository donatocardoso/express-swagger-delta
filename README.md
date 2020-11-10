<link href="main.css" rel="stylesheet"></link>

# ✅ express-swagger-delta

Fast, unopinionated, minimalist web framework for [node](http://nodejs.org).

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## 🔹 Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install express-swagger-delta
```

## 🔹 Usage

To start using the library, it is necessary to create a base configuration file, following the structure:

**Note:** Follows the same structure pattern as the [swagger.js documentation](https://swagger.io/docs/specification/basic-structure/) (openapi: 3.0.0).

```js
export const layout = {
  explorer: false,
  customfavIcon: "string",
  customCss: "string",
  customSiteTitle: "string",
};

export const specification = {
  info: {
    name: "string",
    version: "string",
    description: "string",
    title: "string",
  },
  servers: [
    {
      url: "string",
    },
  ],
  components: {
    securitySchemes: {
      name: {
        type: "string",
        name: "string",
        in: "string",
      },
    },
    schemas: {
      name: {
        type: "string",
        properties: {
          name: {
            type: "string",
            format: "string",
            description: "string",
          },
        },
      },
    },
    responses: {
      default: {
        description: "string",
        content: {
          "application/json": {
            schema: {
              $ref: "string",
            },
          },
        },
      },
    },
  },
};
```

That done, you need to configure the server, which can be done as follows:

```js
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import ExpressSwagger from "express-swagger-delta";
import { specification, layout } from "./swagger";

import Log from "./Log";
import * as Controller from "./controllers";

class Server {
  setConfigs() {
    if ((process.env.NODE_ENV + "").trim() !== "PRODUCTION")
      dotenv.config({
        path: "./homolog",
      });

    ExpressSwagger.Server.NODE_ENV = process.env.NODE_ENV;
    ExpressSwagger.Server.BASE_HOST = process.env.BASE_HOST;
    ExpressSwagger.Server.BASE_PATH = process.env.BASE_PATH;
    ExpressSwagger.Server.PORT = process.env.PORT;

    ExpressSwagger.Server.setSwaggerProps({
      layout: layout,
      specification: specification,
    });

    ExpressSwagger.Server.serverApp.use(cors());
    ExpressSwagger.Server.serverApp.use(
      bodyParser.urlencoded({ extended: true })
    );
    ExpressSwagger.Server.serverApp.use(bodyParser.json());

    ExpressSwagger.Server.serverMiddleware = this.serverMiddleware;
    ExpressSwagger.Server.authMiddleware = (req, res, next) => next(); // (optional) Auth middleware

    Controller.User.setRoutes();
    Controller.Employee.setRoutes();
  }

  serverMiddleware(req, res, callback) {
    Log.authorization(req.headers)
      .then((auth) => {
        if (auth.statusCode == 200) {
          callback(req, res)
            .then((response) => Log.addLogSuccess(req, res, response))
            .catch((error) => Log.addLogError(req, res, error));
        } else {
          return res.status(auth.statusCode).json(auth);
        }
      })
      .catch((error) => Log.addLogError(req, res, error));
  }

  listen() {
    ExpressSwagger.Server.listen();
  }
}

export default new Server();
```

To add a route to the server it is necessary to create a file for building routes by calling an option from the ExpressSwagger property and thus passing its parameters, that way the API documentation and route will already be created, see:

**Note:** The parameter object follows the same structure pattern as [swagger.js documentation](https://swagger.io/docs/specification/describing-parameters/) (openapi: 3.0.0).

```js
import Return from "./Return";
import ExpressSwagger from "express-swagger-delta";

import UserService from "./UserService";

class User {
  setRoutes() {
    ExpressSwagger.Server.addRoute({
      method: "GET",
      path: "/user",
      tags: ["User"],
      summary: "message for description",
      auth: false, // If you are using the authMiddleware and need a public route (default is true)
      responses: {
        200: {
          description: "string",
          $ref: "#/components/responses/default",
        },
        400: {
          description: "string",
          $ref: "#/components/responses/default",
        },
      },
      handler: async (req) => {
        return await UserService.get();
      },
    });
  }
}

export default new User();
```

## 🔹 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/donatocardoso">
        <img src="https://avatars.githubusercontent.com/u/28939485?v=3" width="100px;" alt=""/><br />
        <sub>🥇 <b>Donato C. Ávila</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/ThiagoOliveira001">
        <img src="https://avatars.githubusercontent.com/u/18088052?v=3" width="100px;" alt=""/><br />
        <sub><b>Thiago S. Oliveira</b></sub>
      </a>
    </td>
  </tr>
<table>

## 🔹 License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/express-swagger-delta.svg
[npm-url]: https://npmjs.org/package/express-swagger-delta
[downloads-image]: https://img.shields.io/npm/dm/express-swagger-delta.svg
[downloads-url]: https://npmjs.org/package/express-swagger-delta
