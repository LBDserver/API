import { IAgent } from '../interfaces/consolidInterface';
declare function aclTemplate(stakeholders: Array<IAgent>): Promise<string>;
declare function stakeholderTemplate(stakeholders: Array<IAgent>): Promise<string>;
export { aclTemplate, stakeholderTemplate };
