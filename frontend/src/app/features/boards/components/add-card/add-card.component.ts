import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss'
})

export class AddCardComponent {

  private dialogRef = inject(MatDialogRef<AddCardComponent>)
  fb = new FormBuilder();
  addCardForm = this.fb.group({
    name: ['', Validators.required],
    content: ['', Validators.required],
  });

  onSubmit() {
    if (this.addCardForm.valid) {
      this.dialogRef.close(this.addCardForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }  
}
