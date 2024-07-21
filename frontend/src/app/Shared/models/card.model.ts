import { ISwimlane } from "./swimlane.model";
import { IUser } from "./user.model";

export interface ICard {
    id:number, 
    name: string;
    content: string;
    order: number;
    assignee : IUser,
    swimlane : ISwimlane
}

export interface ICreateCard {
    name: string;
    content: string;
    order: number;
    swimlaneId: number;
}

export interface IUpdateCardOrder {
    id: number;
    order: number;
}
