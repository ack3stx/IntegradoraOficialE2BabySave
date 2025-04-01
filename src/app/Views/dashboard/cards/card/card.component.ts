import { Component,EventEmitter,inject,Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import { faPen} from '@fortawesome/free-solid-svg-icons';
import {faCircle as faRegular} from '@fortawesome/free-regular-svg-icons';
import {faCircle as faSolid} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MonitorService } from '../../../../core/services/monitores/monitor.service';
import { Observable } from 'rxjs';
import { MonitorModel } from '../../../../core/models/monitor.model';


@Component({
  selector: 'app-card',
  imports: [FontAwesomeModule,CommonModule,RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  monitorService = inject(MonitorService);
  faTrash = faTrash;
  faPen=faPen;
  faCircle=faRegular;
  fasolid = faSolid;
  router = inject(Router);

  estadoBocina = true;

  @Input() item:any;
  @Output() monitorDeleted = new EventEmitter<number>();


 /*  navigateToLive(){
    this.router.navigate(['/live', this.item.id]);
  } */

    datosMongo(item:MonitorModel)
    {
      console.log("ID del monitor seleccionado:", item.id);
      this.monitorService.datosMongo(item.id).subscribe({
        next: (data) => {
          console.log("datos enviados a mongo");
          this.router.navigate(['/live', item.id]);
        },
        error: (err) => {
          console.error("Error al obtener datos de MongoDB:", err);
        }
      });
    }

  GuardarMonitor(item:any){
    console.log(item.id)
    const id = localStorage.setItem('id_monitor',item.id);
  }

  updateMonitor(id: number): void {
    this.router.navigate(['monitor/editar', id]);
  }

  deleteMonitor(id: number): void{
    this.monitorService.deleteMonitor(id).subscribe({ 
      next: (data) => {
        console.log("eliminado")
        this.monitorDeleted.emit(id);

      },
      error: (error) => {
        console.log('Error completo:', error);
      }
    }) 
  }
}
