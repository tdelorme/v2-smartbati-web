import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingQuoteComponent } from './waiting-quote.component';

describe('WaitingQuoteComponent', () => {
  let component: WaitingQuoteComponent;
  let fixture: ComponentFixture<WaitingQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingQuoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
