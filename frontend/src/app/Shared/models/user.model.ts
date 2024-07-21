export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister extends ILogin {
    firstName: string;
    lastName: string;
}

export interface ILoginResponse {
    accessToken: string;
    name: string;
}

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

