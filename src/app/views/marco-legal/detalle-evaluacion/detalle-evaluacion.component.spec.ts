import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleEvaluacionComponent } from './detalle-evaluacion.component';

describe('DetalleEvaluacionComponent', () => {
  let component: DetalleEvaluacionComponent;
  let fixture: ComponentFixture<DetalleEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleEvaluacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
