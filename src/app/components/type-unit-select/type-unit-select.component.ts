import { NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UNITS, MEASUREMENT_TYPES } from '../../models/quantity.models';

@Component({
  selector: 'app-type-unit-select',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule],
  templateUrl: './type-unit-select.component.html',
  styleUrls: ['./type-unit-select.component.css'],
})
export class TypeUnitSelectComponent implements OnChanges {
  @Input()  typeLabel: string = 'Measurement Type';
  @Input()  unitLabel: string = 'Unit';

  @Input()  selectedType: string = '';
  @Output() selectedTypeChange = new EventEmitter<string>();

  @Input()  selectedUnit: string = '';
  @Output() selectedUnitChange = new EventEmitter<string>();

  @Input() typeError: string = '';
  @Input() unitError: string = '';

  measurementTypes = MEASUREMENT_TYPES;
  units: string[] = [];

  ngOnChanges(): void {
    this.units = UNITS[this.selectedType] || [];
  }

  onTypeChange(type: string): void {
    this.selectedTypeChange.emit(type);
    // reset unit when type changes
    this.selectedUnitChange.emit('');   
  }

  onUnitChange(unit: string): void {
    this.selectedUnitChange.emit(unit);
  }
}