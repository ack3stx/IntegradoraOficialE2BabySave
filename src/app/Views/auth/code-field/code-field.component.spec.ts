import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeFieldComponent } from './code-field.component';

describe('CodeFieldComponent', () => {
  let component: CodeFieldComponent;
  let fixture: ComponentFixture<CodeFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
