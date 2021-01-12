import * as express from 'express'
import * as mongoose from 'mongoose'

interface ILoginRequest {
    email: string,
    password: string
}

interface IReturnUser {
    user: IUser,
    token: string
}

interface IRegisterRequest extends ILoginRequest {
    username: string
}

interface IUser {
    username: string,
    uri: string,
    email: string,
    password?: string,
    tokens: string[],
    projects: string[],
}

// when extending with other modules, integrate in the type by setting a |
interface IAuthRequest extends express.Request {
    user: IUserDocument | undefined,
    token: string | undefined,
    permissions?: string[] | undefined
}

interface IUserDocument extends mongoose.Document, IUser {
    generateAuthToken(): string;
}

export {
    IUser,
    IRegisterRequest,
    ILoginRequest,
    IReturnUser,
    IAuthRequest
}