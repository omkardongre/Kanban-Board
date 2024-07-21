import { ISwimlane } from "./swimlane.model";
import { IUser } from "./user.model";

export interface IBoard {
    id: number;
    name: string;
    users : IUser[];
    swimlanes : ISwimlane[];
}

export interface ICreateBoard {
    name: string;
}
