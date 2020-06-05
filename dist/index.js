"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_color_1 = __importDefault(require("cli-color"));
const SwaggerUi = __importStar(require("swagger-ui-express"));
const express_1 = __importDefault(require("express"));
class FormatRoute {
    constructor() {
        this.express = "";
        this.swagger = "";
    }
}
class AnyObject {
}
class ServerConfig {
    constructor() {
        this.url = "";
    }
}
class Information {
    constructor() {
        this.name = "";
        this.title = "";
        this.version = "";
        this.description = "";
    }
}
class Layout {
}
class Specification {
    constructor() {
        this.openapi = "3.0.0";
        this.info = new Information();
        this.servers = [];
        this.components = new AnyObject();
        this.paths = new AnyObject();
    }
}
class SwaggerProps {
    constructor() {
        this.layout = new Layout();
        this.specification = new Specification();
    }
}
class Server {
    constructor() {
        this.NODE_ENV = "";
        this.BASE_HOST = "";
        this.BASE_PATH = "";
        this.PORT = 0;
        this.app = express_1.default();
        this.router = express_1.default.Router();
        this.middleware = () => function () { };
        this.swaggerProps = new SwaggerProps();
        this.router.route("/").get((req, res) => res.status(200).json({
            StatusCode: 200,
            Message: `${this.swaggerProps.specification.info.name.toUpperCase()}: OK! - process.env.NODE_ENV: ${this.NODE_ENV}`,
        }));
    }
    addRoute(route) {
        const serverMiddleware = this.middleware;
        const formatedRoute = this._formatRoute(route.path.toString());
        if (route.method === "GET") {
            this.router.route(formatedRoute.express).get(function (req, res) {
                serverMiddleware(req, res, route.handler);
            });
        }
        else if (route.method === "POST") {
            this.router.route(formatedRoute.express).post(function (req, res) {
                serverMiddleware(req, res, route.handler);
            });
        }
        else if (route.method === "PUT") {
            this.router.route(formatedRoute.express).put(function (req, res) {
                serverMiddleware(req, res, route.handler);
            });
        }
        else if (route.method === "DELETE") {
            this.router.route(formatedRoute.express).delete(function (req, res) {
                serverMiddleware(req, res, route.handler);
            });
        }
        let routeConfig = {
            tags: route.tags,
            summary: route.summary,
            responses: route.responses,
        };
        if (route.parameters)
            Object.assign(routeConfig, {
                parameters: route.parameters,
            });
        if (route.requestBody)
            Object.assign(routeConfig, {
                requestBody: route.requestBody,
            });
        if (this.swaggerProps.specification.paths[formatedRoute.swagger]) {
            Object.assign(this.swaggerProps.specification.paths[formatedRoute.swagger], {
                [route.method.toLowerCase()]: routeConfig,
            });
        }
        else {
            this.swaggerProps.specification.paths[formatedRoute.swagger] = {
                [route.method.toLowerCase()]: routeConfig,
            };
        }
    }
    setSwaggerProps(props) {
        Object.assign(this.swaggerProps.layout, props.layout);
        Object.assign(this.swaggerProps.specification, props.specification);
    }
    listen() {
        if (!this.NODE_ENV)
            return this._showMessage('A propriedade "NODE_ENV" não foi inicializada');
        if (!this.BASE_HOST)
            return this._showMessage('A propriedade "BASE_HOST" não foi inicializada');
        if (!this.PORT)
            return this._showMessage('A propriedade "PORT" não foi inicializada');
        const routeDocs = this.BASE_PATH + "/docs";
        const swaggerSetup = SwaggerUi.setup(this.swaggerProps.specification, this.swaggerProps.layout);
        this.app
            .use(this.BASE_PATH, this.router)
            .use(routeDocs, SwaggerUi.serve, swaggerSetup)
            .listen(this.PORT, () => {
            var _name = `\n ${this.swaggerProps.specification.info.name.toUpperCase()} `;
            var _description = `\n ${this.swaggerProps.specification.info.description} `;
            var _environment = `\n process.env.NODE_ENV: ${this.NODE_ENV} `;
            var _baseRoute = `\n Base Route: http://${this.BASE_HOST}:${this.PORT}${this.BASE_PATH} `;
            var _docsRoute = `\n Docs Route: http://${this.BASE_HOST}:${this.PORT}${this.BASE_PATH}/docs `;
            var message = `\n${_name} ${_description} ${_environment} ${_baseRoute} ${_docsRoute}`;
            console.log(cli_color_1.default.bgWhite(cli_color_1.default.black(message.replace(/([^\s][^\n]{1,75})/g, "$1 \n"))));
            console.log("");
        });
        return true;
    }
    _formatRoute(route) {
        let pathKeys = route.split("/");
        let formatRoute = new FormatRoute();
        if (route.includes(":")) {
            formatRoute.express = route;
            for (let i = 0; i < pathKeys.length; i++) {
                if (pathKeys[i].includes(":"))
                    pathKeys[i] = pathKeys[i].replace(":", "{") + "}";
            }
            formatRoute.swagger = pathKeys.join("/");
        }
        else if (route.includes("{") && route.includes("}")) {
            formatRoute.swagger = route;
            for (let i = 0; i < pathKeys.length; i++) {
                pathKeys[i] = pathKeys[i].replace("{", ":").replace("}", "");
            }
            formatRoute.express = pathKeys.join("/");
        }
        return formatRoute;
    }
    _showMessage(msg) {
        console.log("");
        console.log("ExpressSwagger.Server diz: ");
        console.log("");
        console.log(msg);
        console.log("");
        return false;
    }
}
exports.default = {
    AnyObject: AnyObject,
    ServerConfig: ServerConfig,
    Information: Information,
    Layout: Layout,
    Specification: Specification,
    SwaggerProps: SwaggerProps,
    Server: new Server(),
};
//# sourceMappingURL=index.js.map