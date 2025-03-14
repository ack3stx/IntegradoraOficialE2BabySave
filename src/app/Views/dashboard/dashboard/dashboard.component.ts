import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../cards/card/card.component';
import { AgregarComponent } from '../cards/agregar/agregar.component';
import { MonitorService } from '../../../core/services/monitores/monitor.service';
import { MonitorModel } from '../../../core/models/monitor.model';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent,CommonModule,AgregarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit
{

  monitores : MonitorModel[]=[];
  
  constructor(public monitorService:MonitorService) {}

  ngOnInit(): void {
    this.showMonitores();
  }

 
  showMonitores(){
    this.monitorService.getMonitores().subscribe({ 
      next: (data) => {
        this.monitores = data
      },
      error: (e) => {
        console.log(e);
      }
    }) 
  }

}
