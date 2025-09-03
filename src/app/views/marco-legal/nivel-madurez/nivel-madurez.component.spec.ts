import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelMadurezComponent } from './nivel-madurez.component';

describe('NivelMadurezComponent', () => {
  let component: NivelMadurezComponent;
  let fixture: ComponentFixture<NivelMadurezComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NivelMadurezComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NivelMadurezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
