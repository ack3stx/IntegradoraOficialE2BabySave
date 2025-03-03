import { Injectable } from '@angular/core';
import Chart from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class ChartsServiceService {

  public chart: any;
  constructor() { }

   createChart() {
      this.chart = new Chart("MyChart", {
        type: 'line',
        data: {
          labels: ['0', '2', '4', '6', '8'],
          datasets: [
            {
              label: "Sensor",
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
  
    }
}
