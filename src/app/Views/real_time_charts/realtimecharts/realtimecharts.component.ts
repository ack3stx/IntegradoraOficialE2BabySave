import { Component, OnInit, NgZone, inject } from '@angular/core';
import { RealtimechartsService } from '../../../core/services/real_time_charts/realtimecharts.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Pusher from 'pusher-js';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-realtimecharts',
  imports: [HttpClientModule,CommonModule,FormsModule],
  templateUrl: './realtimecharts.component.html',
  styleUrl: './realtimecharts.component.css'
})
export class RealtimechartsComponent implements OnInit {
  data_sensor: any[] = [];
  charts = inject(RealtimechartsService);

  constructor(private realtimechartsService: RealtimechartsService, private zone: NgZone) { }

  ngOnInit() {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('f19492c9cd3edadca29d', {
      cluster: 'us2'
    });

    var channel = pusher.subscribe('sensor-websocket');
    channel.bind('sensor-data', (data: any) => {
        this.data_sensor = data.data;
      console.log(data);
    });

    this.getSensorData();
    this.charts.createChart();
  }

  getSensorData() {
    this.realtimechartsService.getSensorData().subscribe((data: any) => {
      this.data_sensor = data.data;
    });
  }
}
