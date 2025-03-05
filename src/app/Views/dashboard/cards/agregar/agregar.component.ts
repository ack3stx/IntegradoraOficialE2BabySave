import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-agregar',
  imports: [CommonModule,FontAwesomeModule,RouterModule],
  templateUrl: './agregar.component.html',
  styleUrl: './agregar.component.css'
})
export class AgregarComponent {

  faPlus = faPlus;
}
