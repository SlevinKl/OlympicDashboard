import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input({ required: true }) inputTitle!: string;
  @Input({ required: true }) inputValue!: number;
}
