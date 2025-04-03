import { Component,EventEmitter,inject,Input, Output,OnInit, NgZone } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import { faPen} from '@fortawesome/free-solid-svg-icons';
import {faCircle as faRegular} from '@fortawesome/free-regular-svg-icons';
import {faCircle as faSolid} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MonitorService } from '../../../../core/services/monitores/monitor.service';
import { Observable, Subject } from 'rxjs';
import { MonitorModel } from '../../../../core/models/monitor.model';
import Pusher from 'pusher-js';
import { StatusbocinaService } from '../../../../core/services/statusBocina/statusbocina.service';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-card',
  imports: [FontAwesomeModule,CommonModule,RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{
  monitorService = inject(MonitorService);
  faTrash = faTrash;
  faPen=faPen;
  faPowerOff=faPowerOff;
  faCircle=faRegular;
  fasolid = faSolid;
  router = inject(Router);
  private estado = inject(StatusbocinaService)
  private off =0;

  id_monitor!:number;
  id_user!:number;
  estadoBocina!:boolean;
  //ESTADO BOCINA

  ngOnInit(): void 
  {
    this.estado.getStatus().subscribe(data => {
      console.log("llego mateo");
      this.estadoBocina = data.estado
      this.id_monitor = data.id_monitor
      this.id_user = data.id_user
      console.log(this.estadoBocina,this.id_monitor,this.id_user)
    });
  }


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

  offBocina(off:number,event:Event)
    {
      event.stopPropagation();
      console.log("ya se ba mateo");
      this.estado.apagarBocina(off).subscribe({
        next: (data) => {
          console.log("ya se apago");
        },
        error: (err) => {
          console.error("Error al obtener datos de MongoDB:", err);
        }
      });
    }
}
