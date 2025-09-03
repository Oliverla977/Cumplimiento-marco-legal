import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private toastr: ToastrService) { }

  // Notificación de éxito
  showSuccess(message: string, title: string = 'Éxito'): void {
    this.toastr.success(message, title, {
      timeOut: 3000,
      extendedTimeOut: 1000,
    });
  }

  // Notificación de error
  showError(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      timeOut: 5000,
      extendedTimeOut: 2000,
    });
  }

  // Notificación de advertencia
  showWarning(message: string, title: string = 'Advertencia'): void {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      extendedTimeOut: 1500,
    });
  }

  // Notificación informativa
  showInfo(message: string, title: string = 'Información'): void {
    this.toastr.info(message, title, {
      timeOut: 3000,
      extendedTimeOut: 1000,
    });
  }

  // Métodos específicos para tu sistema de auditorías
  showAuditSaved(auditName: string): void {
    this.showSuccess(
      `La auditoría "${auditName}" se ha guardado exitosamente.`,
      'Auditoría Guardada'
    );
  }

  showComplianceResult(level: string, percentage: number): void {
    if (percentage >= 81) {
      this.showSuccess(
        `Nivel de madurez: ${level} (${percentage}%)`,
        'Excelente Cumplimiento'
      );
    } else if (percentage >= 61) {
      this.showInfo(
        `Nivel de madurez: ${level} (${percentage}%)`,
        'Buen Cumplimiento'
      );
    } else if (percentage >= 21) {
      this.showWarning(
        `Nivel de madurez: ${level} (${percentage}%). Considere mejoras.`,
        'Cumplimiento Parcial'
      );
    } else {
      this.showError(
        `Nivel de madurez: ${level} (${percentage}%). Se requieren acciones inmediatas.`,
        'Cumplimiento Insuficiente'
      );
    }
  }

  // Limpiar todas las notificaciones
  clear(): void {
    this.toastr.clear();
  }
  
}
