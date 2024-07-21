export interface IDeleteResponse {
    raw : [],
    affected : number
}

export interface IUpdateResponse {
    raw : [],
    affected : number,
    generatedMaps : [],
}

export interface IResponse {
    message : string
}

export interface IIdResponse {
    id: number;
}
