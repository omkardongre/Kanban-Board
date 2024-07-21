import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  name: string;
  content: string;
}

@Component({
  selector: 'app-edit-card',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-card.component.html',
  styleUrl: './edit-card.component.scss'
})

export class EditCardComponent {

  private dialogRef = inject(MatDialogRef<EditCardComponent>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  fb = new FormBuilder();
  editCardForm = this.fb.group({
    name: [this.data.name, Validators.required],
    content: [this.data.content, Validators.required],
  });

  onSubmit() {
    if (this.editCardForm.valid) {
      this.dialogRef.close(this.editCardForm.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
