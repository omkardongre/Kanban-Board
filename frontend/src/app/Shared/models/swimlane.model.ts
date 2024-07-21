import { IBoard} from "./board.model";
import { ICard } from "./card.model";

export interface ISwimlane {
    id : number;
    name: string;
    order: number;
    cards: ICard[];
}

export interface ICreateSwimlane {
    name: string;
    order: number;
    boardId: number;
}


export interface IUpdateSwimlaneOrder {
    id: number;
    order: number;
}