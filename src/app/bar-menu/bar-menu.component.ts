import { Component } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-bar-menu',
  standalone: true,
  imports: [MatToolbarModule, MatIconButton, MatIcon, RouterLink],
  templateUrl: './bar-menu.component.html',
  styleUrl: './bar-menu.component.scss'
})
export class BarMenuComponent {

  constructor(private authService: AuthService) {}

  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public logout() {
    this.authService.logout();
  }
}
