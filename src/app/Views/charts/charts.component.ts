import { Component, inject, OnInit } from '@angular/core';
import { ChartsServiceService } from '../../core/services/charts/charts-service.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {
  charts = inject(ChartsServiceService); 
  ngOnInit(): void {
    this.charts.createChart();
  }

 


}
