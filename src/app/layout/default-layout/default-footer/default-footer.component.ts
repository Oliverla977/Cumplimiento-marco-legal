import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss']
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
  //obtener el año actual
  get currentYear(): number {
    return new Date().getFullYear();
  }
  year = this.currentYear;
}
