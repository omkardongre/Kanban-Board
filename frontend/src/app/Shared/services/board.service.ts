import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IBoard, ICreateBoard } from '../models/board.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  http = inject(HttpClient);
  
  createBoard(createBoard: ICreateBoard): Observable<IBoard> { 
    return this.http.post<IBoard>('/api/board', createBoard);
  }

  updateBoard(board: IBoard): Observable<IBoard> {
    const updateBoard: ICreateBoard = {
      name: board.name
    };

    return this.http.patch<IBoard>(`/api/board/${board.id}`, updateBoard);
  }

  getBoards(): Observable<IBoard[]> {
    return this.http.get<IBoard[]>('/api/board');
  }

  deleteBoard(board: IBoard): Observable<void> {
    return this.http.delete<void>(`/api/board/${board.id}`);
  }

  getBoardById(id: number): Observable<IBoard> {
    return this.http.get<IBoard>(`/api/board/${id}`);
  }
}
