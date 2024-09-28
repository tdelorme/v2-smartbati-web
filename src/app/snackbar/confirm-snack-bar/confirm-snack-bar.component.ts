import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-snack-bar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './confirm-snack-bar.component.html',
  styleUrl: './confirm-snack-bar.component.scss'
})
export class ConfirmSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
