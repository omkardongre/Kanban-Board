import { inject, Injectable } from '@angular/core';
import { ICard, ICreateCard, IUpdateCardOrder } from '../models/card.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDeleteResponse, IResponse, IUpdateResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  deleteCard(cardId: number) : Observable<IDeleteResponse> {
    return this.http.delete<IDeleteResponse>(`/api/card/${cardId}`);
  }
  http = inject(HttpClient);

  editCard(editedCard: ICreateCard, cardId: number): Observable<IUpdateResponse> {
    return this.http.patch<IUpdateResponse>(`/api/card/${cardId}`, editedCard);
  }

  createCard(createCard: ICreateCard): Observable<ICard> {
    return this.http.post<ICard>('/api/card', createCard);
  }

  updateCardsOrder(updatedCards: IUpdateCardOrder[]): Observable<IResponse> {
    return this.http.patch<IResponse>('/api/card/order', updatedCards);
  }

  moveCardToSwimlane(cardId: number, swimlaneId: number): Observable<IUpdateResponse> {
    return this.http.patch<IUpdateResponse>(`/api/card/${cardId}/swimlane/${swimlaneId}`, {});
  }
}
