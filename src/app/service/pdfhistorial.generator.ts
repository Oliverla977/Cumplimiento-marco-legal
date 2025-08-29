import jsPDF from 'jspdf';

interface EvaluacionHistorial {
  id_evaluacion: number;
  marco_legal: string;
  fecha: string;
  usuario: string;
  porcentaje_cumplimiento: string;
}

interface DatosEmpresa {
  idEmpresaSeleccionada: number | null;
  nombreEmpresa: string;
  sectorEmpresa: string;
  evaluaciones: EvaluacionHistorial[];
}

export function generarHistorialEvaluacionesPDF(datosEmpresa: DatosEmpresa): void {
  const doc = new jsPDF();
  
  // Configuración de colores
  const colorPrimario: [number, number, number] = [34, 139, 170]; // Azul océano
  const colorSecundario: [number, number, number] = [44, 62, 80]; // Azul oscuro
  const colorExito: [number, number, number] = [39, 174, 96]; // Verde
  const colorAdvertencia: [number, number, number] = [243, 156, 18]; // Naranja
  const colorError: [number, number, number] = [231, 76, 60]; // Rojo
  const colorInfo: [number, number, number] = [52, 152, 219]; // Azul claro
  
  // Función para obtener color según porcentaje
  function obtenerColorPorcentaje(porcentaje: number): [number, number, number] {
    if (porcentaje <= 40) return colorError;
    if (porcentaje <= 60) return colorAdvertencia;
    if (porcentaje <= 80) return colorInfo;
    return colorExito;
  }

  // Función para obtener nivel de madurez
  function obtenerNivel(porcentaje: number): string {
    if (porcentaje <= 20) return "Principiante";
    if (porcentaje <= 40) return "Parcial";
    if (porcentaje <= 60) return "Intermedio";
    if (porcentaje <= 80) return "Avanzado";
    return "Consolidado";
  }

  // Encabezado principal
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 210, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('HISTORIAL DE EVALUACIONES DE CUMPLIMIENTO', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte de Evolución Normativa', 105, 25, { align: 'center' });

  // Información de la empresa
  let yPosition = 50;
  doc.setTextColor(...colorSecundario);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN DE LA EMPRESA', 20, yPosition);

  yPosition += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const infoEmpresa = [
    ['Empresa:', datosEmpresa.nombreEmpresa || 'No especificado'],
    ['Sector:', datosEmpresa.sectorEmpresa || 'No especificado'],
    ['ID Empresa:', datosEmpresa.idEmpresaSeleccionada?.toString() || 'No especificado'],
    ['Total de Evaluaciones:', datosEmpresa.evaluaciones.length.toString()],
    ['Fecha de Reporte:', new Date().toLocaleDateString('es-ES')]
  ];

  infoEmpresa.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Resumen estadístico
  if (datosEmpresa.evaluaciones.length > 0) {
    const porcentajes = datosEmpresa.evaluaciones.map(e => parseFloat(e.porcentaje_cumplimiento));
    const promedioGeneral = porcentajes.reduce((a, b) => a + b, 0) / porcentajes.length;
    const mejorEvaluacion = Math.max(...porcentajes);
    const peorEvaluacion = Math.min(...porcentajes);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN ESTADÍSTICO', 20, yPosition);
    yPosition += 15;

    // Caja de resumen
    doc.setFillColor(248, 249, 250);
    doc.rect(15, yPosition - 5, 180, 30, 'F');
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(1);
    doc.rect(15, yPosition - 5, 180, 30, 'S');

    doc.setTextColor(...colorSecundario);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const estadisticasResumen = [
      ['Promedio General de Cumplimiento:', `${promedioGeneral.toFixed(2)}% (${obtenerNivel(promedioGeneral)})`],
      ['Mejor Evaluación:', `${mejorEvaluacion.toFixed(2)}%`],
      ['Evaluación Más Baja:', `${peorEvaluacion.toFixed(2)}%`]
    ];

    let tempY = yPosition + 5;
    estadisticasResumen.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 25, tempY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 120, tempY);
      tempY += 7;
    });

    yPosition += 40;
  }

  // Historial de evaluaciones
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('HISTORIAL DETALLADO DE EVALUACIONES', 20, yPosition);
  yPosition += 15;

  if (datosEmpresa.evaluaciones.length === 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('No se encontraron evaluaciones para esta empresa.', 20, yPosition);
  } else {
    // Encabezados de tabla
    const headers = ['ID', 'Marco Legal', 'Fecha', 'Auditor', 'Cumplimiento', 'Nivel'];
    const colWidths = [20, 40, 30, 35, 30, 35];
    const startX = 10;
    
    // Fondo del encabezado
    doc.setFillColor(...colorPrimario);
    doc.rect(startX, yPosition - 3, colWidths.reduce((a, b) => a + b), 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    let currentX = startX;
    headers.forEach((header, index) => {
      doc.text(header, currentX + 2, yPosition + 5);
      currentX += colWidths[index];
    });

    yPosition += 15;

    // Ordenar evaluaciones por fecha (más reciente primero)
    const evaluacionesOrdenadas = [...datosEmpresa.evaluaciones].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    // Filas de datos
    evaluacionesOrdenadas.forEach((evaluacion, rowIndex) => {
      const porcentaje = parseFloat(evaluacion.porcentaje_cumplimiento);
      const colorFila = obtenerColorPorcentaje(porcentaje);
      
      // Verificar si necesitamos una nueva página
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 30;
        
        // Repetir encabezado en nueva página
        doc.setFillColor(...colorPrimario);
        doc.rect(startX, yPosition - 3, colWidths.reduce((a, b) => a + b), 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        
        let headerX = startX;
        headers.forEach((header, index) => {
          doc.text(header, headerX + 2, yPosition + 5);
          headerX += colWidths[index];
        });
        yPosition += 15;
      }

      // Fondo alternado para filas
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(startX, yPosition - 2, colWidths.reduce((a, b) => a + b), 10, 'F');
      }

      // Contenido de la fila
      doc.setTextColor(...colorSecundario);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      const rowData = [
        evaluacion.id_evaluacion.toString(),
        evaluacion.marco_legal.length > 15 ? evaluacion.marco_legal.substring(0, 12) + '...' : evaluacion.marco_legal,
        new Date(evaluacion.fecha).toLocaleDateString('es-ES'),
        evaluacion.usuario.length > 12 ? evaluacion.usuario.substring(0, 9) + '...' : evaluacion.usuario,
        `${porcentaje.toFixed(1)}%`,
        obtenerNivel(porcentaje)
      ];

      currentX = startX;
      rowData.forEach((data, colIndex) => {
        if (colIndex === 4) { // Columna de porcentaje
          doc.setTextColor(...colorFila);
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setTextColor(...colorSecundario);
          doc.setFont('helvetica', 'normal');
        }
        doc.text(data, currentX + 2, yPosition + 5);
        currentX += colWidths[colIndex];
      });

      yPosition += 12;
    });

    // Tendencia (si hay más de una evaluación)
    // if (datosEmpresa.evaluaciones.length > 1) {
    //   yPosition += 15;
      
    //   if (yPosition > 250) {
    //     doc.addPage();
    //     yPosition = 30;
    //   }

    //   doc.setTextColor(...colorSecundario);
    //   doc.setFontSize(14);
    //   doc.setFont('helvetica', 'bold');
    //   doc.text('ANÁLISIS DE TENDENCIA', 20, yPosition);
    //   yPosition += 10;

    //   const primeraEvaluacion = parseFloat(evaluacionesOrdenadas[evaluacionesOrdenadas.length - 1].porcentaje_cumplimiento);
    //   const ultimaEvaluacion = parseFloat(evaluacionesOrdenadas[0].porcentaje_cumplimiento);
    //   const diferencia = ultimaEvaluacion - primeraEvaluacion;

    //   let tendenciaTexto = '';
    //   let tendenciaColor: [number, number, number] = colorInfo;

    //   if (diferencia > 5) {
    //     tendenciaTexto = `📈 Tendencia positiva: Mejora del ${diferencia.toFixed(2)}% desde la primera evaluación.`;
    //     tendenciaColor = colorExito;
    //   } else if (diferencia < -5) {
    //     tendenciaTexto = `📉 Tendencia negativa: Disminución del ${Math.abs(diferencia).toFixed(2)}% desde la primera evaluación.`;
    //     tendenciaColor = colorError;
    //   } else {
    //     tendenciaTexto = `➡️ Tendencia estable: Variación mínima del ${Math.abs(diferencia).toFixed(2)}% desde la primera evaluación.`;
    //     tendenciaColor = colorAdvertencia;
    //   }

    //   doc.setFillColor(...tendenciaColor);
    //   doc.rect(15, yPosition, 180, 15, 'F');
    //   doc.setTextColor(255, 255, 255);
    //   doc.setFontSize(10);
    //   doc.setFont('helvetica', 'bold');
    //   doc.text(tendenciaTexto, 105, yPosition + 9, { align: 'center' });
    // }
  }

  // Pie de página
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado el ${new Date().toLocaleString('es-ES')}`, 20, 285);
  doc.text(`Página 1 de 1`, 170, 285);

  // Guardar el PDF
  const nombreArchivo = `Historial_Evaluaciones_${datosEmpresa.nombreEmpresa || 'Empresa'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nombreArchivo);
}

// Función principal para usar en tu componente
export function descargarHistorialEvaluaciones(
  evaluaciones: any[],
  idEmpresaSeleccionada: number | null,
  nombreEmpresa: string,
  sectorEmpresa: string
): void {
  try {
    const datosEmpresa: DatosEmpresa = {
      idEmpresaSeleccionada,
      nombreEmpresa,
      sectorEmpresa,
      evaluaciones
    };
    
    generarHistorialEvaluacionesPDF(datosEmpresa);
    console.log('Historial de evaluaciones PDF generado exitosamente');
  } catch (error) {
    console.error('Error al generar el historial PDF:', error);
  }
}
