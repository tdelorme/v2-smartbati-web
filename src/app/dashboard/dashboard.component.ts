import { Component } from '@angular/core';
import { DevisComponent } from "../devis/devis.component";
import { FactureComponent } from "../facture/facture.component";
import { TypeBilling } from '../shared/model/billing.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DevisComponent, FactureComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  PAID = TypeBilling.PAID;
  INVOICE = TypeBilling.INVOICE;
}
