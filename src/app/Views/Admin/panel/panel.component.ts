import { Component, OnInit , OnDestroy } from '@angular/core';

@Component({
  selector: 'app-panel',
  imports: [],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit, OnDestroy {

  currentTime: Date = new Date();
  private timeInterval: any; 

  constructor() { }

  ngOnInit(): void {

    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  get formattedTime(): string {
    return this.currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  get formattedDate(): string {
    return this.currentTime.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }





}
