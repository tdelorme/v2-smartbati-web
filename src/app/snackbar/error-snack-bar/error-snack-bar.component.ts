import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
 selector: 'app-error-snack-bar',
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  templateUrl: './error-snack-bar.component.html',
  styleUrl: './error-snack-bar.component.scss'
})
export class ErrorSnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
