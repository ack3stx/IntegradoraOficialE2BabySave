import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMonitorsComponent } from './delete-monitors.component';

describe('DeleteMonitorsComponent', () => {
  let component: DeleteMonitorsComponent;
  let fixture: ComponentFixture<DeleteMonitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMonitorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
