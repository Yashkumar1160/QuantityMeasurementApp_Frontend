import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { UNITS, OPERATIONS } from '../../models/quantity.models';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ResultBoxComponent } from '../../components/result-box/result-box.component';
import { TypeUnitSelectComponent } from '../../components/type-unit-select/type-unit-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { QuantityService } from './../../services/quantity';
import { AuthService } from '../../services/auth';
import { MEASUREMENT_TYPES } from '../../models/quantity.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,
    NavbarComponent, SidebarComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  activeSection = 'home';
  measurementTypes = MEASUREMENT_TYPES;

  // ---- HOME STATS ----
  stats: Record<string, number> = { total: 0, compare: 0, convert: 0, add: 0, subtract: 0, divide: 0 };

  // ---- MEASUREMENT ENGINE STATE ----
  selectedType = '';
  val1: number | null = null;
  val2: number | null = null;
  unit1 = '';
  unit2 = '';
  targetUnit = '';
  
  isLoading = false;
  resultMessage = '';
  resultVisible = false;
  isError = false;

  constructor(
    private svc: QuantityService, 
    private auth: AuthService, 
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Handle Query Parameters for deep-linking
    this.route.queryParams.subscribe(params => {
      const section = params['section'];
      if (section) {
        this.activeSection = section;
        this.resetForm();
      }
    });

    // 2. Load stats if logged in
    if (this.auth.isLoggedIn()) {
      this.loadStats();
    }
  }

  onSectionChange(section: string): void {
    this.activeSection = section;
    this.resetForm();
    if (section === 'home') this.loadStats();
  }

  unitsFor(type: string): string[] {
    return UNITS[type] || [];
  }

  selectType(type: string): void {
    this.selectedType = type;
    this.unit1 = this.unitsFor(type)[0] || '';
    this.unit2 = this.unitsFor(type)[0] || '';
    this.targetUnit = this.unitsFor(type)[0] || '';
    this.resetResults();
  }

  resetForm(): void {
    this.val1 = null;
    this.val2 = null;
    this.resetResults();
  }

  resetResults(): void {
    this.resultVisible = false;
    this.resultMessage = '';
    this.isError = false;
    this.isLoading = false;
  }

  // ==================== UI HELPERS ====================
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'Length': '📏',
      'Weight': '⚖️',
      'Volume': '🧪',
      'Temperature': '🌡️'
    };
    return icons[type] || '📦';
  }

  getOpTitle(): string {
    const titles: Record<string, string> = {
      'compare': 'Compare Quantities',
      'convert': 'Unit Conversion',
      'add': 'Addition',
      'subtract': 'Subtraction',
      'divide': 'Division'
    };
    return titles[this.activeSection] || 'Operation';
  }

  getOpDesc(): string {
    const descs: Record<string, string> = {
      'compare': 'Check if values are greater, lesser or equal.',
      'convert': 'Instantly change units for a single value.',
      'add': 'Find the sum of two measurements.',
      'subtract': 'Find the difference between two measurements.',
      'divide': 'Calculate the ratio or divide quantities.'
    };
    return descs[this.activeSection] || 'Perform calculation';
  }

  getOpEmoji(): string {
    const emojis: Record<string, string> = {
      'compare': '🔍',
      'add': '➕',
      'subtract': '➖',
      'divide': '➗'
    };
    return emojis[this.activeSection] || '⚡';
  }

  // ==================== ENGINE EXECUTION ====================
  executeEngineOp(): void {
    if (!this.selectedType || this.val1 === null) return;
    
    this.isLoading = true;
    this.resultVisible = false;

    const op = this.activeSection;
    
    // 1. Prepare DTOs
    const dto1 = { value: +this.val1, unitName: this.unit1, measurementType: this.selectedType };
    const dto2 = { value: +(this.val2 || 0), unitName: this.unit2, measurementType: this.selectedType };

    // 2. Route to Service
    let stream;
    if (op === 'compare') {
      stream = this.svc.compare({ thisQuantityDTO: dto1, thatQuantityDTO: dto2 });
    } else if (op === 'convert') {
      stream = this.svc.convert({ thisQuantityDTO: dto1, targetUnit: this.unit2 });
    } else if (op === 'add') {
      stream = this.svc.add({ thisQuantityDTO: dto1, thatQuantityDTO: dto2, targetUnit: this.targetUnit });
    } else if (op === 'subtract') {
      stream = this.svc.subtract({ thisQuantityDTO: dto1, thatQuantityDTO: dto2, targetUnit: this.targetUnit });
    } else if (op === 'divide') {
      stream = this.svc.divide({ thisQuantityDTO: dto1, thatQuantityDTO: dto2 });
    } else {
      this.isLoading = false;
      return;
    }

    stream.subscribe({
      next: data => {
        this.isLoading = false;
        this.resultVisible = true;
        this.isError = data.isError;
        
        if (data.isError) {
          this.resultMessage = data.errorMessage || 'Unknown error occurred.';
        } else {
          // Format result based on op
          if (op === 'compare') this.resultMessage = data.resultString || 'Comparison successful.';
          else if (op === 'divide') this.resultMessage = `Ratio: ${data.resultValue}`;
          else this.resultMessage = `${data.resultValue} ${data.resultUnit || ''}`;
        }
        this.cdr.detectChanges();
      },
      error: err => {
        this.isLoading = false;
        this.resultVisible = true;
        this.isError = true;
        this.resultMessage = `Connection failed: ${err.message}`;
        this.cdr.detectChanges();
      }
    });
  }

  loadStats(): void {
    const calls = OPERATIONS.map(op =>
      this.svc.getCount(op).pipe(
        catchError(() => of(0))
      )
    );

    forkJoin(calls).subscribe({
      next: counts => {
        OPERATIONS.forEach((op, i) => {
          this.stats[op.toLowerCase()] = counts[i] as number;
        });
        this.stats['total'] = (counts as number[]).reduce((sum, c) => sum + c, 0);
        this.cdr.detectChanges();
      },
      error: () => {
        this.stats = { total: 0, compare: 0, convert: 0, add: 0, subtract: 0, divide: 0 };
        this.cdr.detectChanges();
      }
    });
  }
}