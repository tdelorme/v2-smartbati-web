import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from "../components/card/card.component";

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

  constructor(private router: Router) {}

  public navigate(component: string) {
    this.router.navigate([`/${component}`])
  }

}
