import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput, MatInputModule } from '@angular/material/input';
import { BoardService } from '../../../../Shared/services/board.service';
import { CommonModule } from '@angular/common';
import { IBoard } from '../../../../Shared/models/board.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-board',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButton, CommonModule, MatIconModule],
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.scss'
})
export class AddBoardComponent {
  private readonly boardService = inject(BoardService);
  dialogRef = inject(MatDialogRef);
  data:IBoard = inject(MAT_DIALOG_DATA)

  fb = new FormBuilder();
  addBoardForm = this.fb.group({
    name: [this.data?.name , [Validators.required]],
  });

  closeDialog() {
    this.dialogRef.close();
  }

  createBoard() {
    if(this.addBoardForm.invalid) {
      return;
    }

    this.boardService.createBoard({name : this.addBoardForm.value.name || ''}).subscribe((board : IBoard) => {
      this.dialogRef.close(board);
    });
  }

  updateBoard() {
    if(this.addBoardForm.invalid) {
      return;
    }

    const updatedBoard: IBoard = {
      ...this.data,
      name: this.addBoardForm.value.name || this.data.name
    }

    this.boardService.updateBoard(updatedBoard).subscribe((board: IBoard) => {
      this.dialogRef.close(board);
    });
  }
}
