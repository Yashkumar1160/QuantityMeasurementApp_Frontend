import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-result-box',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './result-box.component.html',
  styleUrls: ['./result-box.component.css'],
})
export class ResultBoxComponent {
  @Input() label:   string  = 'Result';
  @Input() message: string  = '';
  @Input() isError: boolean = false;
  @Input() visible: boolean = false;
}