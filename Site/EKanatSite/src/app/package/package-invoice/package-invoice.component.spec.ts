import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageInvoiceComponent } from './package-invoice.component';

describe('PackageInvoiceComponent', () => {
  let component: PackageInvoiceComponent;
  let fixture: ComponentFixture<PackageInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
