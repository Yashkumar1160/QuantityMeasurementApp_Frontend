import { QuantityResponse } from './../../models/quantity.models';
import { QuantityService } from './../../services/quantity';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass, NavbarComponent, DatePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {

  filterBy:  string = 'all';       // default: show all
  filterVal: string = 'Compare';

  operationOptions = ['Compare', 'Convert', 'Add', 'Subtract', 'Divide'];
  typeOptions      = ['Length', 'Weight', 'Volume', 'Temperature'];

  rows:      QuantityResponse[] = [];
  loading:   boolean = false;
  loadError: boolean = false;

  constructor(private svc: QuantityService, private router: Router) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  onFilterByChange(): void {
    if      (this.filterBy === 'operation') this.filterVal = 'Compare';
    else if (this.filterBy === 'type')      this.filterVal = 'Length';
    else                                    this.filterVal = '';
  }

  loadHistory(): void {
    this.loading   = true;
    this.loadError = false;
    this.rows      = [];

    let call;
    if      (this.filterBy === 'all')       call = this.svc.getAll();
    else if (this.filterBy === 'operation') call = this.svc.getByOperation(this.filterVal || 'Compare');
    else if (this.filterBy === 'type')      call = this.svc.getByType(this.filterVal || 'Length');
    else                                    call = this.svc.getErrored();

    call.subscribe({
      next:  data => { this.loading = false; this.rows = data; },
      error: ()   => { this.loading = false; this.loadError = true; },
    });
  }

  // Format Input 1
  input1(r: QuantityResponse): string {
    return r.isError ? '—' : `${r.thisValue} ${r.thisUnit ?? ''}`;
  }

  // Format Input 2
  input2(r: QuantityResponse): string {
    if (!r.thatValue && !r.thatUnit) return '—';
    return r.isError ? '—' : `${r.thatValue} ${r.thatUnit ?? ''}`;
  }

  // Format Result — FIX: now shows unit
  result(r: QuantityResponse): string {
    if (r.isError) return r.errorMessage ?? 'Error';
    if (r.resultString) return r.resultString;   // for Compare (true/false)
    return `${r.resultValue} ${r.resultUnit ?? ''}`;
  }

  measureType(r: QuantityResponse): string {
    return r.thisMeasurementType ?? r.thatMeasurementType ?? '—';
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}