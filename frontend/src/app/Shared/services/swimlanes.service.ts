import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ICreateSwimlane, ISwimlane, IUpdateSwimlaneOrder } from '../models/swimlane.model';
import { Observable } from 'rxjs';
import { IDeleteResponse, IIdResponse, IResponse, IUpdateResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class SwimlanesService {

  constructor() { }

  http = inject(HttpClient);
  
  createSwimlane(swimlane: ICreateSwimlane) : Observable<IIdResponse>{
    return this.http.post<IIdResponse>('api/swimlane', swimlane);
  }

  deleteSwimlane(swimlaneId: number, boardId: number) : Observable<IDeleteResponse>{
    // pass both the swimlaneId and the boardId to the backend
    return this.http.delete<IDeleteResponse>(`api/swimlane/${swimlaneId}?boardId=${boardId}`);
  }

  editSwimlane(swimlane: ICreateSwimlane, swimlaneId : number) : Observable<IUpdateResponse>{
    return this.http.patch<IUpdateResponse>(`api/swimlane/${swimlaneId}`, swimlane);
  }

  updateSwimlanesOrder(swimlanes: IUpdateSwimlaneOrder[]): Observable<IResponse> {
    return this.http.patch<IResponse>('api/swimlane/order', swimlanes);
  }
}
