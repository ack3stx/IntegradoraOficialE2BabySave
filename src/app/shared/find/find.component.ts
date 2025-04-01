import { Component, Input , Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-find',
  imports: [FormsModule],
  templateUrl: './find.component.html',
  styleUrl: './find.component.css'
})
export class FindComponent {

  @Input() placeholder: string = 'Buscar...';
  @Input() ariaLabel: string = 'Buscar';
  @Output() searchChange = new EventEmitter<string>();

  searchTerm: string = '';

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

}
