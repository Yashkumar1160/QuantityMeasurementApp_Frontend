import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultBoxComponent } from './result-box.component';

describe('ResultBoxComponent', () => {
  let component: ResultBoxComponent;
  let fixture: ComponentFixture<ResultBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultBoxComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
