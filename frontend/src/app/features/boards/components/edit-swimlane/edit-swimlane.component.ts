import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-edit-swimlane',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-swimlane.component.html',
  styleUrl: './edit-swimlane.component.scss'
})
export class EditSwimlaneComponent {

  private dialogRef = inject(MatDialogRef<EditSwimlaneComponent>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  fb = new FormBuilder();
  editSwimlaneForm = this.fb.group({
    name: [this.data.name, Validators.required],
  });

  onSubmit() {
    if (this.editSwimlaneForm.valid) {
      this.dialogRef.close(this.editSwimlaneForm.value);
    }
  }
  onCancel() {
    this.dialogRef.close();
  }
}
