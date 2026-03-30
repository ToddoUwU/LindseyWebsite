import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryDialogComponent } from './inquiry-dialog';

describe('InquiryDialog', () => {
  let component: InquiryDialogComponent;
  let fixture: ComponentFixture<InquiryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquiryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
