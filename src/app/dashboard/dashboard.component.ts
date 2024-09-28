import { Component } from '@angular/core';
import { WaitingInvoicesComponent } from "./waiting-invoices/waiting-invoices.component";
import { WaitingQuoteComponent } from "./waiting-quote/waiting-quote.component";
import { InvoicesComponent } from "./invoices/invoices.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WaitingInvoicesComponent, WaitingQuoteComponent, InvoicesComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
