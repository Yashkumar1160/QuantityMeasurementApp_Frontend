import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { UNITS, OPERATIONS } from '../../models/quantity.models';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ResultBoxComponent } from '../../components/result-box/result-box.component';
import { TypeUnitSelectComponent } from '../../components/type-unit-select/type-unit-select.component';
import { QuantityService } from './../../services/quantity';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule, NgFor, NgIf, NgClass,
    NavbarComponent, SidebarComponent,
    ResultBoxComponent, TypeUnitSelectComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  activeSection = 'home';

  // ---- HOME STATS ----
  stats: Record<string, number> = { total: 0, compare: 0, convert: 0, add: 0, subtract: 0, divide: 0 };

  // ---- COMPARE ----
  cmpType = ''; cmpUnit1 = ''; cmpUnit2 = '';
  cmpVal1 = ''; cmpVal2 = '';
  cmpLoading = false; cmpResult = ''; cmpError = false; cmpVisible = false;
  cmpTypeErr = ''; cmpVal1Err = ''; cmpUnit1Err = ''; cmpVal2Err = ''; cmpUnit2Err = '';

  // ---- CONVERT ----
  convType = ''; convFrom = ''; convTo = ''; convVal = '';
  convLoading = false; convResult = ''; convError = false; convVisible = false;
  convValErr = ''; convTypeErr = ''; convFromErr = ''; convToErr = '';

  // ---- ADD ----
  addType = ''; addUnit1 = ''; addUnit2 = ''; addTarget = '';
  addVal1 = ''; addVal2 = '';
  addLoading = false; addResult = ''; addError = false; addVisible = false;
  addTypeErr = ''; addVal1Err = ''; addUnit1Err = ''; addVal2Err = ''; addUnit2Err = ''; addTargetErr = '';

  // ---- SUBTRACT ----
  subType = ''; subUnit1 = ''; subUnit2 = ''; subTarget = '';
  subVal1 = ''; subVal2 = '';
  subLoading = false; subResult = ''; subError = false; subVisible = false;
  subTypeErr = ''; subVal1Err = ''; subUnit1Err = ''; subVal2Err = ''; subUnit2Err = ''; subTargetErr = '';

  // ---- DIVIDE ----
  divType = ''; divUnit1 = ''; divUnit2 = '';
  divVal1 = ''; divVal2 = '';
  divLoading = false; divResult = ''; divError = false; divVisible = false;
  divTypeErr = ''; divVal1Err = ''; divUnit1Err = ''; divVal2Err = ''; divUnit2Err = '';

  constructor(private svc: QuantityService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  // Called by sidebar when user clicks a section
  onSectionChange(section: string): void {
    this.activeSection = section;
    if (section === 'home') this.loadStats();
  }

  // Returns units array for a given type — used in templates
  unitsFor(type: string): string[] {
    return UNITS[type] || [];
  }

  // ==================== HOME STATS ====================
  // FIX: Use forkJoin so all 5 API calls complete before calculating total.
  // The old code fired 5 parallel calls and recalculated total inside each
  // callback — meaning early callbacks saw zeros for operations not yet done,
  // so the total was always wrong on first load.
  loadStats(): void {
    const calls = OPERATIONS.map(op =>
      this.svc.getCount(op).pipe(
        catchError(() => of(0))   // if any call fails, treat it as 0
      )
    );

    forkJoin(calls).subscribe(counts => {
      OPERATIONS.forEach((op, i) => {
        this.stats[op.toLowerCase()] = counts[i] as number;
      });
      this.stats['total'] = (counts as number[]).reduce((sum, c) => sum + c, 0);
    });
  }

  // ==================== COMPARE ====================
  handleCompare(): void {
    this.cmpTypeErr = ''; this.cmpVal1Err = ''; this.cmpUnit1Err = '';
    this.cmpVal2Err = ''; this.cmpUnit2Err = '';
    let ok = true;
    if (!this.cmpType)  { this.cmpTypeErr  = 'Select a type';  ok = false; }
    if (!this.cmpVal1)  { this.cmpVal1Err  = 'Enter a value';  ok = false; }
    if (!this.cmpUnit1) { this.cmpUnit1Err = 'Select a unit';  ok = false; }
    if (!this.cmpVal2)  { this.cmpVal2Err  = 'Enter a value';  ok = false; }
    if (!this.cmpUnit2) { this.cmpUnit2Err = 'Select a unit';  ok = false; }
    if (!ok) return;

    this.cmpLoading = true; this.cmpVisible = false;
    this.svc.compare({
      thisQuantityDTO: { value: +this.cmpVal1, unitName: this.cmpUnit1, measurementType: this.cmpType },
      thatQuantityDTO: { value: +this.cmpVal2, unitName: this.cmpUnit2, measurementType: this.cmpType },
    }).subscribe({
      next: data => {
        this.cmpLoading = false; this.cmpVisible = true;
        this.cmpError  = data.isError;
        this.cmpResult = data.isError ? (data.errorMessage ?? 'Error') : (data.resultString ?? '');
      },
      error: (err: Error) => {
        this.cmpLoading = false; this.cmpVisible = true;
        this.cmpError = true; this.cmpResult = err.message;
      },
    });
  }

  // ==================== CONVERT ====================
  handleConvert(): void {
    this.convValErr = ''; this.convTypeErr = ''; this.convFromErr = ''; this.convToErr = '';
    let ok = true;
    if (!this.convVal)  { this.convValErr  = 'Enter a value';    ok = false; }
    if (!this.convType) { this.convTypeErr = 'Select a type';    ok = false; }
    if (!this.convFrom) { this.convFromErr = 'Select from unit'; ok = false; }
    if (!this.convTo)   { this.convToErr   = 'Select to unit';   ok = false; }
    if (!ok) return;

    this.convLoading = true; this.convVisible = false;
    this.svc.convert({
      thisQuantityDTO: { value: +this.convVal, unitName: this.convFrom, measurementType: this.convType },
      targetUnit: this.convTo,
    }).subscribe({
      next: data => {
        this.convLoading = false; this.convVisible = true;
        this.convError  = data.isError;
        this.convResult = data.isError
          ? (data.errorMessage ?? 'Error')
          : `${data.resultValue} ${data.resultUnit ?? ''}`;
      },
      error: (err: Error) => {
        this.convLoading = false; this.convVisible = true;
        this.convError = true; this.convResult = err.message;
      },
    });
  }

  onConvTypeChange(type: string): void {
    this.convType = type;
    this.convFrom = '';
    this.convTo   = '';
  }

  // ==================== ADD ====================
  handleAdd(): void {
    this.addTypeErr = ''; this.addVal1Err = ''; this.addUnit1Err = '';
    this.addVal2Err = ''; this.addUnit2Err = ''; this.addTargetErr = '';
    let ok = true;
    if (!this.addType)   { this.addTypeErr   = 'Select a type';      ok = false; }
    if (!this.addVal1)   { this.addVal1Err   = 'Enter a value';      ok = false; }
    if (!this.addUnit1)  { this.addUnit1Err  = 'Select a unit';      ok = false; }
    if (!this.addVal2)   { this.addVal2Err   = 'Enter a value';      ok = false; }
    if (!this.addUnit2)  { this.addUnit2Err  = 'Select a unit';      ok = false; }
    if (!this.addTarget) { this.addTargetErr = 'Select result unit'; ok = false; }
    if (!ok) return;

    this.addLoading = true; this.addVisible = false;
    this.svc.add({
      thisQuantityDTO: { value: +this.addVal1, unitName: this.addUnit1, measurementType: this.addType },
      thatQuantityDTO: { value: +this.addVal2, unitName: this.addUnit2, measurementType: this.addType },
      targetUnit: this.addTarget,
    }).subscribe({
      next: data => {
        this.addLoading = false; this.addVisible = true;
        this.addError  = data.isError;
        this.addResult = data.isError
          ? (data.errorMessage ?? 'Error')
          : `${data.resultValue} ${data.resultUnit ?? ''}`;
      },
      error: (err: Error) => {
        this.addLoading = false; this.addVisible = true;
        this.addError = true; this.addResult = err.message;
      },
    });
  }

  // ==================== SUBTRACT ====================
  handleSubtract(): void {
    this.subTypeErr = ''; this.subVal1Err = ''; this.subUnit1Err = '';
    this.subVal2Err = ''; this.subUnit2Err = ''; this.subTargetErr = '';
    let ok = true;
    if (!this.subType)   { this.subTypeErr   = 'Select a type';      ok = false; }
    if (!this.subVal1)   { this.subVal1Err   = 'Enter a value';      ok = false; }
    if (!this.subUnit1)  { this.subUnit1Err  = 'Select a unit';      ok = false; }
    if (!this.subVal2)   { this.subVal2Err   = 'Enter a value';      ok = false; }
    if (!this.subUnit2)  { this.subUnit2Err  = 'Select a unit';      ok = false; }
    if (!this.subTarget) { this.subTargetErr = 'Select result unit'; ok = false; }
    if (!ok) return;

    this.subLoading = true; this.subVisible = false;
    this.svc.subtract({
      thisQuantityDTO: { value: +this.subVal1, unitName: this.subUnit1, measurementType: this.subType },
      thatQuantityDTO: { value: +this.subVal2, unitName: this.subUnit2, measurementType: this.subType },
      targetUnit: this.subTarget,
    }).subscribe({
      next: data => {
        this.subLoading = false; this.subVisible = true;
        this.subError  = data.isError;
        this.subResult = data.isError
          ? (data.errorMessage ?? 'Error')
          : `${data.resultValue} ${data.resultUnit ?? ''}`;
      },
      error: (err: Error) => {
        this.subLoading = false; this.subVisible = true;
        this.subError = true; this.subResult = err.message;
      },
    });
  }

  // ==================== DIVIDE ====================
  handleDivide(): void {
    this.divTypeErr = ''; this.divVal1Err = ''; this.divUnit1Err = '';
    this.divVal2Err = ''; this.divUnit2Err = '';
    let ok = true;
    if (!this.divType)  { this.divTypeErr  = 'Select a type'; ok = false; }
    if (!this.divVal1)  { this.divVal1Err  = 'Enter a value'; ok = false; }
    if (!this.divUnit1) { this.divUnit1Err = 'Select a unit'; ok = false; }
    if (!this.divVal2)  { this.divVal2Err  = 'Enter a value'; ok = false; }
    if (!this.divUnit2) { this.divUnit2Err = 'Select a unit'; ok = false; }
    if (!ok) return;

    this.divLoading = true; this.divVisible = false;
    this.svc.divide({
      thisQuantityDTO: { value: +this.divVal1, unitName: this.divUnit1, measurementType: this.divType },
      thatQuantityDTO: { value: +this.divVal2, unitName: this.divUnit2, measurementType: this.divType },
    }).subscribe({
      next: data => {
        this.divLoading = false; this.divVisible = true;
        this.divError  = data.isError;
        this.divResult = data.isError ? (data.errorMessage ?? 'Error') : `${data.resultValue}`;
      },
      error: (err: Error) => {
        this.divLoading = false; this.divVisible = true;
        this.divError = true; this.divResult = err.message;
      },
    });
  }
}