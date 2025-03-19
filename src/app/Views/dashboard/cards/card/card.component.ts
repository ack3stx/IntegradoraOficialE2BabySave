import { Component,Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import { faPen} from '@fortawesome/free-solid-svg-icons';
import {faCircle as faRegular} from '@fortawesome/free-regular-svg-icons';
import {faCircle as faSolid} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [FontAwesomeModule,CommonModule,RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  
  faTrash = faTrash;
  faPen=faPen;
  faCircle=faRegular;
  fasolid = faSolid;

  estadoBocina = true;

  @Input() item:any;

  constructor(private router: Router) { }

  navigateToLive(){
    this.router.navigate(['/live', this.item.id]);
  }

  GuardarMonitor(item:any){
    console.log(item.id)
    const id = localStorage.setItem('id_monitor',item.id);
  }
}
