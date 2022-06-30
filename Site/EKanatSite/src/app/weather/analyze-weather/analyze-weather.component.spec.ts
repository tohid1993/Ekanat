import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeWeatherComponent } from './analyze-weather.component';

describe('AnalyzeWeatherComponent', () => {
  let component: AnalyzeWeatherComponent;
  let fixture: ComponentFixture<AnalyzeWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyzeWeatherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
