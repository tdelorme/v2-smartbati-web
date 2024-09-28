import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HttpClient, HttpClientModule, provideHttpClient, withJsonpSupport} from "@angular/common/http";
import {DemoModel} from "./demo.model";
import {BarMenuComponent} from "./bar-menu/bar-menu.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BatiSmart';
}
