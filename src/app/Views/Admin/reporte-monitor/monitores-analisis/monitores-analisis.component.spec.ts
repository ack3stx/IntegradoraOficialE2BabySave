import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoresAnalisisComponent } from './monitores-analisis.component';

describe('MonitoresAnalisisComponent', () => {
  let component: MonitoresAnalisisComponent;
  let fixture: ComponentFixture<MonitoresAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoresAnalisisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoresAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
