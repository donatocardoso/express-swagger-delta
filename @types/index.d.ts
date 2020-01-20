/// <reference types="node" />

declare module '@donatocardoso/express-swagger' {
  import color from 'cli-color';
  import * as SwaggerUi from 'swagger-ui-express';
  import express, { Express, Router } from 'express';

  export class AnyObject implements IAnyObject {
    [key: string]: object;
  }

  export class ServerConfig implements IServerConfig {
    public url: string;

    constructor();
  }

  export class Information implements IInformation {
    public name: string;
    public title: string;
    public version: string;
    public description: string;
  }

  export class Layout implements SwaggerUi.SwaggerUiOptions {
  }

  export class Specification implements ISpecification {
    public openapi: string;
    public info: IInformation;
    public servers: IServerConfig[];
    public components: IAnyObject;
    public paths: IAnyObject;
  }

  export class SwaggerProps implements ISwaggerProps {
    public layout: SwaggerUi.SwaggerUiOptions;
    public specification: ISpecification;
  }

  export class Server implements IServer {
    public NODE_ENV: string;
    public BASE_HOST: string;
    public BASE_PATH: string;
    public PORT: number;

    public serverApp: Express;
    public serverRouter: Router;
    public swaggerProps: ISwaggerProps;

    public addRoute(route: IBaseRoute, serverMiddleware: (req: any, res: any, callback: Function) => Function): void;
    public setSwaggerProps(props: ISwaggerProps): void;
    public listen(): void;

    private showMessage(msg: string): boolean;
  }
}
