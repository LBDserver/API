import { PermissionType } from "../interfaces/consolidInterface";
declare function validateTTL(data: any): Promise<void>;
declare function queryRawTTL(data: any, query: any): Promise<any>;
declare function hasPermission(url: string, permission: PermissionType): Promise<boolean>;
export { validateTTL, queryRawTTL, hasPermission };
