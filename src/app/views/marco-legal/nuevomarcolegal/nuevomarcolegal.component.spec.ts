import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevomarcolegalComponent } from './nuevomarcolegal.component';

describe('NuevomarcolegalComponent', () => {
  let component: NuevomarcolegalComponent;
  let fixture: ComponentFixture<NuevomarcolegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevomarcolegalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevomarcolegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
