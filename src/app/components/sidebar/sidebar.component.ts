import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input()  activeSection: string = 'home';
  @Output() sectionChange = new EventEmitter<string>();

  constructor(private router: Router) {}

  select(section: string): void {
    this.sectionChange.emit(section);
  }

  goHistory(): void {
    this.router.navigate(['/history']);
  }
}