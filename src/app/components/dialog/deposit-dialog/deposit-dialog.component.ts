import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-deposit-dialog',
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose
    ],
    templateUrl: './deposit-dialog.component.html',
    styleUrl: './deposit-dialog.component.scss',
    standalone: true,
})
export class DepositDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DepositDialogComponent>);
  readonly data = inject<number>(MAT_DIALOG_DATA);
  readonly deposit = model(this.data);

  cancel(): void {
    this.dialogRef.close();
  }
}
