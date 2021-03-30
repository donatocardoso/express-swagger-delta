"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = exports.SwaggerProps = exports.Specification = exports.Layout = exports.Information = exports.ServerConfig = exports.AnyObject = exports.FormatRoute = void 0;
//@ts-check
const cli_color_1 = __importDefault(require("cli-color"));
const express_1 = __importDefault(require("express"));
const SwaggerUi = __importStar(require("swagger-ui-express"));
class FormatRoute {
    constructor(route) {
        this.express = route;
        this.swagger = route;
    }
}
exports.FormatRoute = FormatRoute;
class AnyObject {
}
exports.AnyObject = AnyObject;
class ServerConfig {
    constructor() {
        this.url = '';
    }
}
exports.ServerConfig = ServerConfig;
class Information {
    constructor() {
        this.name = '';
        this.title = '';
        this.version = '';
        this.description = '';
    }
}
exports.Information = Information;
class Layout {
}
exports.Layout = Layout;
class Specification {
    constructor() {
        this.openapi = '3.0.0';
        this.info = new Information();
        this.servers = [];
        this.components = new AnyObject();
        this.paths = new AnyObject();
    }
}
exports.Specification = Specification;
class SwaggerProps {
    constructor() {
        this.layout = new Layout();
        this.specification = new Specification();
    }
}
exports.SwaggerProps = SwaggerProps;
class Server {
    constructor() {
        this.NODE_ENV = '';
        this.BASE_HOST = '';
        this.BASE_PATH = '';
        this.PORT = 0;
        this.app = express_1.default();
        this.routers = express_1.default.Router();
        this.swaggerProps = new SwaggerProps();
        this.routers.route('/').get((req, res) => {
            const name = this.swaggerProps.specification.info.name.toUpperCase();
            res.status(200).json({
                StatusCode: 200,
                Date: new Date(),
                Message: `${name}: OK! - process.env.NODE_ENV: ${this.NODE_ENV}`,
            });
        });
    }
    addRoute(route) {
        // Express
        const { handler, path, method } = route;
        const formatedRoute = this._formatRoute(path.toString());
        const router = express_1.default.Router();
        if (this.middleware) {
            router.use(this.middleware);
        }
        if (this.authMiddleware && route.auth) {
            router.use(this.authMiddleware);
        }
        switch (method.toLowerCase()) {
            case 'get':
                router.route(formatedRoute.express).get(handler);
                break;
            case 'post':
                router.route(formatedRoute.express).post(handler);
                break;
            case 'put':
                router.route(formatedRoute.express).put(handler);
                break;
            case 'delete':
                router.route(formatedRoute.express).delete(handler);
                break;
        }
        this.routers.bind(router);
        // Swagger
        let routeConfig = {
            tags: route.tags,
            summary: route.summary,
        };
        if (route.responses)
            Object.assign(routeConfig, {
                responses: route.responses,
            });
        if (route.security)
            Object.assign(routeConfig, {
                security: route.security,
            });
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
        const routeDocs = this.BASE_PATH + '/documentation';
        const swaggerSetup = SwaggerUi.setup(this.swaggerProps.specification, this.swaggerProps.layout);
        this.app
            .use(this.BASE_PATH, this.routers)
            .use(routeDocs, SwaggerUi.serve, swaggerSetup)
            .listen(this.PORT, () => {
            var _name = `\n ${this.swaggerProps.specification.info.name.toUpperCase()} `;
            var _description = `\n ${this.swaggerProps.specification.info.description} `;
            var _environment = `\n process.env.NODE_ENV: ${this.NODE_ENV} `;
            var _baseRoute = `\n Base Route: http://${this.BASE_HOST}:${this.PORT}${this.BASE_PATH} `;
            var _docsRoute = `\n Docs Route: http://${this.BASE_HOST}:${this.PORT}${this.BASE_PATH}/docs `;
            var message = `\n${_name} ${_description} ${_environment} ${_baseRoute} ${_docsRoute}`;
            console.log(cli_color_1.default.bgWhite(cli_color_1.default.black(message.replace(/([^\s][^\n]{1,75})/g, '$1 \n'))));
            console.log('');
        });
        return true;
    }
    _formatRoute(route) {
        let pathKeys = route.split('/');
        let formatRoute = new FormatRoute(route);
        if (route.includes(':')) {
            formatRoute.express = route;
            for (let i = 0; i < pathKeys.length; i++) {
                if (pathKeys[i].includes(':'))
                    pathKeys[i] = pathKeys[i].replace(':', '{') + '}';
            }
            formatRoute.swagger = pathKeys.join('/');
        }
        else if (route.includes('{') && route.includes('}')) {
            formatRoute.swagger = route;
            for (let i = 0; i < pathKeys.length; i++) {
                pathKeys[i] = pathKeys[i].replace('{', ':').replace('}', '');
            }
            formatRoute.express = pathKeys.join('/');
        }
        return formatRoute;
    }
    _showMessage(msg) {
        console.log('');
        console.log('ExpressSwagger.Server diz: ');
        console.log('');
        console.log(msg);
        console.log('');
        return false;
    }
}
exports.Server = Server;
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