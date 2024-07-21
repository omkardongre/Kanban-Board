import { Component, inject, OnInit } from '@angular/core';
import { BoardService } from '../../../Shared/services/board.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IBoard } from '../../../Shared/models/board.model';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SwimlanesService } from '../../../Shared/services/swimlanes.service';
import { ICreateSwimlane, ISwimlane, IUpdateSwimlaneOrder } from '../../../Shared/models/swimlane.model';
import { CommonModule } from '@angular/common';
import { ICard, ICreateCard, IUpdateCardOrder } from '../../../Shared/models/card.model';
import { IDeleteResponse, IIdResponse, IResponse, IUpdateResponse } from '../../../Shared/models/response.model';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../components/add-card/add-card.component';
import { CardService } from '../../../Shared/services/card.service';
import { EditCardComponent } from '../components/edit-card/edit-card.component';
import { EditSwimlaneComponent } from '../components/edit-swimlane/edit-swimlane.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../Shared/ui/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatButtonModule, ReactiveFormsModule, MatInputModule, MatIconModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  isLoading: boolean = false;

  private readonly boardService = inject(BoardService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly swimlaneService = inject(SwimlanesService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly matDialog = inject(MatDialog);
  private readonly cardService = inject(CardService);
  private snackBar = inject(MatSnackBar);


  board!: IBoard;

  swimlaneForm = this.fb.group({
    name: ['', Validators.required]
  });

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.boardService.getBoardById(id).subscribe({
        next: (board: IBoard) => {
          this.board = board;
          this.sortSwimlanes();
        },
        error: (error) => {
          console.error('Error fetching board:', error);
        }
      });
    });
  }

  dragSwimlane(event: CdkDragDrop<any, any, any>) {
    this.isLoading = true;
    const updatedSwimlanes = JSON.parse(JSON.stringify(this.board.swimlanes));

    moveItemInArray(updatedSwimlanes, event.previousIndex, event.currentIndex);
    updatedSwimlanes.forEach((swimlane: ISwimlane, index: number) => {
      swimlane.order = index;
    });

    this.updateSwimlanesOrder(updatedSwimlanes);
  }

  updateSwimlanesOrder(updatedSwimlanes: ISwimlane[]) {
    const updatedSwimlaneOrders: IUpdateSwimlaneOrder[] = updatedSwimlanes.map(swimlane => ({
      id: swimlane.id,
      order: swimlane.order
    }));

    this.swimlaneService.updateSwimlanesOrder(updatedSwimlaneOrders).subscribe(
      (response) => {
        this.board.swimlanes = updatedSwimlanes;
        // this.sortSwimlanes();
        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to update swimlanes order', error);
        this.showErrorMessage('Failed to update swimlanes. Please try again.');
        this.isLoading = false;
      }
    );
  }

  sortSwimlanes() {
    this.board.swimlanes.sort((a, b) => a.order - b.order);
    this.board.swimlanes.forEach(swimlane => {
      if (swimlane.cards) {
        swimlane.cards.sort((a, b) => a.order - b.order);
      }
    });
  }

  dragCard(event: CdkDragDrop<any, any, any>) {
    this.isLoading = true;

    if (event.previousContainer === event.container) {
      const updatedCards: ICard[] = JSON.parse(JSON.stringify(event.container.data.cards));
      moveItemInArray(updatedCards, event.previousIndex, event.currentIndex);
      updatedCards.forEach((card: ICard, index: number) => {
        card.order = index;
      });
      this.updateCardsOrder(updatedCards, event.container.data.cards);
    } else {
      const updatedPreviousCards: ICard[] = JSON.parse(JSON.stringify(event.previousContainer.data.cards));
      const updatedCurrentCards: ICard[] = JSON.parse(JSON.stringify(event.container.data.cards));
      const card = updatedPreviousCards[event.previousIndex];

      transferArrayItem(
        updatedPreviousCards,
        updatedCurrentCards,
        event.previousIndex,
        event.currentIndex
      );

      updatedPreviousCards.forEach((card: ICard, index: number) => {
        card.order = index;
      });
      updatedCurrentCards.forEach((card: ICard, index: number) => {
        card.order = index;
      });

      this.updateCardsOrder(updatedPreviousCards, event.previousContainer.data.cards);

      this.moveCardToSwimlane(event.container.data.id, card.id);
      this.updateCardsOrder(updatedCurrentCards, event.container.data.cards);

    }
  }

  moveCardToSwimlane(swimlaneId: number, cardId: number) {
    this.cardService.moveCardToSwimlane(cardId, swimlaneId).subscribe({
      next: (response: IUpdateResponse) => {
        if (response.affected === 0) {
          return;
        }
      },
      error: (error: Error) => {
        console.error('Failed to move card to swimlane:', error);
      }
    });
  }

  updateCardsOrder(updatedCards: ICard[], originalCards: ICard[]) {
    const updatedCardOrders: IUpdateCardOrder[] = updatedCards.map(card => ({
      id: card.id,
      order: card.order
    }));

    this.cardService.updateCardsOrder(updatedCardOrders).subscribe({
      next: (response: IResponse) => {
        originalCards.length = 0;
        originalCards.push(...updatedCards);
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Failed to update cards order', error);
        this.showErrorMessage('Failed to update cards. Please try again.');
        this.isLoading = false;
      }
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }


  addSwimlane() {
    if (this.swimlaneForm.valid) {
      const swimlane: ICreateSwimlane = {
        name: this.swimlaneForm.value.name!,
        order: this.board.swimlanes.length || 0,
        boardId: this.board.id
      };
      this.swimlaneService.createSwimlane(swimlane).subscribe({
        next: (response: IIdResponse) => {
          const createdSwimlane: ISwimlane = {
            id: response.id,
            name: swimlane.name,
            order: swimlane.order,
            cards: []
          };

          this.board!.swimlanes.push(createdSwimlane);
          this.swimlaneForm.reset();
        },
        error: (error) => {
          console.error('Error creating swimlane:', error);
        }
      });
    }
  }

  deleteSwimlane(swimlane: ISwimlane) {

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this swimlane?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.swimlaneService.deleteSwimlane(swimlane.id, this.board.id).subscribe({
          next: (deletedSwimlane: IDeleteResponse) => {
            if (deletedSwimlane.affected === 0) {
              return;
            }

            this.board.swimlanes = this.board.swimlanes.filter(s => s.id !== swimlane.id);
          },
          error: (error) => {
            console.error('Error deleting swimlane:', error);
          }
        })
      } else {
        console.log('The delete operation was cancelled');
      }
    });
  }

  editSwimlane(swimlane: ISwimlane) {
    const dialogRef = this.matDialog.open(EditSwimlaneComponent, {
      data: {
        name: swimlane.name
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      const editedSwimlane: ICreateSwimlane = {
        name: result.name,
        order: swimlane.order,
        boardId: this.board.id
      }

      this.editSwimlaneHelper(editedSwimlane, swimlane);
    })
  }

  addCard(swimlane: ISwimlane) {
    const dialogRef = this.matDialog.open(AddCardComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      const createCard: ICreateCard = {
        name: result.name,
        content: result.content,
        order: swimlane.cards?.length || 0,
        swimlaneId: swimlane.id,
      }

      this.cardService.createCard(createCard).subscribe({
        next: (card: ICard) => {
          if (swimlane.cards === undefined) {
            swimlane.cards = [];
          }
          swimlane.cards.push(card);
        },
        error: (error) => {
          console.error('Error creating card:', error);
        }
      })
    })
  }

  deleteCard(cardId: number, swimlane: ISwimlane) {

    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this card?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cardService.deleteCard(cardId).subscribe({
          next: (deletedCard: IDeleteResponse) => {
            if (deletedCard.affected === 0) {
              return;
            }
            swimlane.cards = swimlane.cards.filter(c => c.id !== cardId);
          },
          error: (error) => {
            console.error('Error deleting card:', error);
          }
        });
      } else {
        console.log('The delete operation was cancelled');
      }
    });
  }

  editCard(card: ICard, swimlaneId: number) {
    const dialogRef = this.matDialog.open(EditCardComponent, {
      data: {
        name: card.name,
        content: card.content
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }
      const editedCard: ICreateCard = {
        name: result.name,
        content: result.content,
        order: card.order,
        swimlaneId: swimlaneId,
      }

      this.cardService.editCard(editedCard, card.id).subscribe({
        next: (response: IUpdateResponse) => {
          if (response.affected === 0) {
            return;
          }
          const swimlane = this.board.swimlanes.find(s => s.id === swimlaneId)!;
          const cardIndex = swimlane.cards.findIndex(c => c.id === card.id);
          swimlane.cards[cardIndex].name = result.name;
          swimlane.cards[cardIndex].content = result.content;
        },
        error: (error) => {
          console.error('Error updating card:', error);
        }
      });
    })
  }

  editSwimlaneHelper(editedSwimlane: ICreateSwimlane, swimlane: ISwimlane) {
    this.swimlaneService.editSwimlane(editedSwimlane, swimlane.id).subscribe({
      next: (response: IUpdateResponse) => {
        if (response.affected === 0) {
          return;
        }
        swimlane.name = editedSwimlane.name;
      },
      error: (error) => {
        console.error('Error updating swimlane:', error);
      }
    })
  }
}


