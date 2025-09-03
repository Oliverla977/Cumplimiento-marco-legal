import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-nivel-madurez',
  imports: [CommonModule],
  templateUrl: './nivel-madurez.component.html',
  styleUrl: './nivel-madurez.component.scss'
})
export class NivelMadurezComponent {

  constructor() { }

  // Función para obtener el color según el porcentaje
  getColor(porcentaje: number): string {
    if (porcentaje >= 0 && porcentaje <= 20) {
      return 'danger';        // Nivel 1 - Principiante: Rojo
    }
    if (porcentaje >= 21 && porcentaje <= 40) {
      return 'warning';       // Nivel 2 - Parcial: Naranja/Amarillo
    }
    if (porcentaje >= 41 && porcentaje <= 60) {
      return 'info';        // Nivel 3 - Intermedio: Azul o color intermedio
    }
    if (porcentaje >= 61 && porcentaje <= 80) {
      return 'primary';       // Nivel 4 - Avanzado: Azul primario
    }
    if (porcentaje >= 81 && porcentaje <= 100) {
      return 'success';       // Nivel 5 - Consolidado: Verde
    }
    return 'secondary';
  }

  // Datos de los niveles de madurez
  nivelesMaturez = [
    {
      nivel: 1,
      nombre: 'Principiante',
      rango: '0% - 20%',
      porcentaje: 10,
      icono: 'fas fa-exclamation-triangle',
      descripcion: 'La organización cumple con pocos o ningún artículo de la normativa. No existen mecanismos formales para garantizar el cumplimiento legal.'
    },
    {
      nivel: 2,
      nombre: 'Parcial',
      rango: '21% - 40%',
      porcentaje: 30,
      icono: 'fas fa-clock',
      descripcion: 'Se cumple únicamente con los artículos básicos o mínimos exigidos, pero de manera aislada y sin cobertura integral.'
    },
    {
      nivel: 3,
      nombre: 'Intermedio',
      rango: '41% - 60%',
      porcentaje: 50,
      icono: 'fas fa-balance-scale',
      descripcion: 'La organización cumple con una parte considerable de los artículos de la ley, pero aún existen brechas significativas que limitan la eficacia del cumplimiento.'
    },
    {
      nivel: 4,
      nombre: 'Avanzado',
      rango: '61% - 80%',
      porcentaje: 70,
      icono: 'fas fa-chart-line',
      descripcion: 'Se cumple con la mayoría de los artículos normativos. La organización ha implementado mecanismos de seguimiento y mejora continua para asegurar el cumplimiento.'
    },
    {
      nivel: 5,
      nombre: 'Consolidado',
      rango: '81% - 100%',
      porcentaje: 90,
      icono: 'fas fa-trophy',
      descripcion: 'La organización cumple con la totalidad o casi totalidad de los artículos de la ley o estándar. El cumplimiento se encuentra documentado, supervisado y alineado con las mejores prácticas legales y técnicas.'
    }
  ];

}
