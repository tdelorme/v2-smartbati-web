import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingInvoicesComponent } from './waiting-invoices.component';

describe('WaitingInvoicesComponent', () => {
  let component: WaitingInvoicesComponent;
  let fixture: ComponentFixture<WaitingInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
