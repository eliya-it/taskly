declare module "sequelize-mock" {
  import { Sequelize } from "sequelize";

  export class SequelizeMock extends Sequelize {
    constructor();
    define(modelName: string, attributes: any, options?: any): any;
  }

  export default SequelizeMock;
}
