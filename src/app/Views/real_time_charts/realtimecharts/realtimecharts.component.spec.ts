import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimechartsComponent } from './realtimecharts.component';

describe('RealtimechartsComponent', () => {
  let component: RealtimechartsComponent;
  let fixture: ComponentFixture<RealtimechartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealtimechartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealtimechartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
