import { Component, OnInit, inject } from '@angular/core';
import { BoardService } from '../../../Shared/services/board.service';
import { IBoard } from '../../../Shared/models/board.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; // Import MatCardModule
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddBoardComponent } from '../components/add-board/add-board.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})

export class ListComponent implements OnInit{

  private readonly dialog = inject(MatDialog);
  private  boardService = inject(BoardService);
  boards: IBoard[] = [];

  ngOnInit() {
    this.boardService.getBoards().subscribe((boards: IBoard[]) => {
      this.boards = boards;
    })
  }

  openNewBoardFlow() {
    this.dialog.open(AddBoardComponent, {
      width: '400px',
    }).afterClosed().subscribe((board: IBoard) => {
      if(board) {
        this.boards.push(board);
      }
    })
  }

  openEditBoardFlow(board: IBoard) {
    this.dialog.open(AddBoardComponent, {
      width: '400px',
      data: board
    }).afterClosed().subscribe((board: IBoard) => {
      if(board) {
        const index = this.boards.findIndex(b => b.id === board.id);
        this.boards[index] = board;
      }
    })
  }

  onDeleteBoard(board: IBoard) {
    this.boardService.deleteBoard(board).subscribe(() => {
      this.boards = this.boards.filter(b => b.id !== board.id);
    });
  }
}
