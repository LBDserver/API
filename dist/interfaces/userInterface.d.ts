interface ILoginRequest {
    email: string;
    password: string;
}
interface IReturnUser {
    user: IUser;
    token: string;
}
interface IRegisterRequest extends ILoginRequest {
    username: string;
}
interface IUser {
    username: string;
    uri: string;
    email: string;
    password?: string;
    tokens?: string[];
    projects: string[];
}
export { IUser, IRegisterRequest, ILoginRequest, IReturnUser };
