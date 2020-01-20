import * as SwaggerUi from 'swagger-ui-express';
import { Express, Router } from 'express';
import { IExpressSwagger, ISwaggerProps, ISpecification, IInformation, IServer, IAnyObject, IBaseRoute } from "./interfaces";
export declare class AnyObject implements IAnyObject {
    [key: string]: object;
}
export declare class Server implements IServer {
    url: string;
    constructor();
}
export declare class Information implements IInformation {
    name: string;
    title: string;
    version: string;
    description: string;
    constructor();
}
export declare class Layout implements SwaggerUi.SwaggerUiOptions {
}
export declare class Specification implements ISpecification {
    openapi: string;
    info: IInformation;
    servers: IServer[];
    components: IAnyObject;
    paths: IAnyObject;
    constructor();
}
export declare class SwaggerProps implements ISwaggerProps {
    layout: SwaggerUi.SwaggerUiOptions;
    specification: ISpecification;
    constructor();
}
export declare class ExpressSwagger implements IExpressSwagger {
    NODE_ENV: string;
    BASE_HOST: string;
    BASE_PATH: string;
    PORT: number;
    serverApp: Express;
    serverRouter: Router;
    swaggerProps: ISwaggerProps;
    constructor();
    addRoute(route: IBaseRoute, serverMiddleware: (req: any, res: any, callback: Function) => Function): void;
    setSwaggerProps(props: ISwaggerProps): void;
    listen(): boolean;
    showMessage(msg: string): boolean;
}
//# sourceMappingURL=index.d.ts.map