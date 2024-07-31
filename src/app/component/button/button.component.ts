import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  // 
  @Input() color!: string ;
  @Input() text: string = '';
 // @Input() indexNumber: number | string='default'
  @Output() btnClick = new EventEmitter();

  onClick() {
    this.btnClick.emit();
  }
}
