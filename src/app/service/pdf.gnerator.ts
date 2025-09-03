import jsPDF from 'jspdf';

interface ResumenEvaluacion {
  id_evaluacion: number;
  empresa: string;
  marco_legal: string;
  usuario_auditor: string;
  cantidad_cumple: string;
  cantidad_no_cumple: string;
  cantidad_cumple_parcial: string;
  cantidad_no_aplica: string;
  porcentaje_cumple: string;
  porcentaje_no_cumple: string;
  porcentaje_cumple_parcial: string;
  porcentaje_no_aplica: string;
  porcentaje_cumplimiento: string;
}

export function generarInformePDF(resumen: ResumenEvaluacion): void {
  const doc = new jsPDF();
  
  // Configuración de colores
  const colorPrimario: [number, number, number] = [41, 128, 185]; // Azul
  const colorSecundario: [number, number, number] = [52, 73, 94]; // Gris oscuro
  const colorExito: [number, number, number] = [39, 174, 96]; // Verde
  const colorAdvertencia: [number, number, number] = [241, 196, 15]; // Amarillo
  const colorError: [number, number, number] = [231, 76, 60]; // Rojo
  
  // Función para obtener el nivel de madurez
  function obtenerNivelMadurez(porcentaje: number): { nivel: string; descripcion: string; color: [number, number, number] } {
    if (porcentaje <= 20) {
      return {
        nivel: "Nivel 1 - Principiante",
        descripcion: "La organización cumple con pocos o ningún artículo de la normativa.",
        color: colorError
      };
    } else if (porcentaje <= 40) {
      return {
        nivel: "Nivel 2 - Parcial",
        descripcion: "Se cumple únicamente con los artículos básicos o mínimos exigidos.",
        color: [230, 126, 34] as [number, number, number] // Naranja
      };
    } else if (porcentaje <= 60) {
      return {
        nivel: "Nivel 3 - Intermedio",
        descripcion: "La organización cumple con una parte considerable de los artículos.",
        color: colorAdvertencia
      };
    } else if (porcentaje <= 80) {
      return {
        nivel: "Nivel 4 - Avanzado",
        descripcion: "Se cumple con la mayoría de los artículos normativos.",
        color: [52, 152, 219] as [number, number, number] // Azul claro
      };
    } else {
      return {
        nivel: "Nivel 5 - Consolidado",
        descripcion: "La organización cumple con la totalidad o casi totalidad de los artículos.",
        color: colorExito
      };
    }
  }

  const porcentajeCumplimiento = parseFloat(resumen.porcentaje_cumplimiento);
  const nivelMadurez = obtenerNivelMadurez(porcentajeCumplimiento);

  // =====================
  // 1. CARTA DE PRESENTACIÓN
  // =====================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...colorSecundario);

  const fecha = new Date().toLocaleDateString('es-ES', { year: "numeric", month: "long", day: "numeric" });

  let carta = `
Guatemala, ${fecha}

Señor Gerente General
${resumen.empresa}
Presente.

Estimado/a:

Me permito presentarle el informe de evaluación de cumplimiento normativo correspondiente a la empresa bajo el marco legal "${resumen.marco_legal}". 

De acuerdo con los resultados obtenidos, la organización presenta un nivel de cumplimiento del ${resumen.porcentaje_cumplimiento}%, lo que corresponde al ${nivelMadurez.nivel}. ${nivelMadurez.descripcion}

Este documento tiene como propósito brindarle una visión clara del estado actual de cumplimiento, identificando fortalezas y áreas de mejora que permitirán fortalecer la gestión de la empresa en materia normativa.

Adjunto al presente se encuentra el informe detallado, en el cual se incluyen estadísticas, análisis y recomendaciones para orientar las acciones a seguir.

Agradezco de antemano la atención brindada y quedo a disposición para ampliar cualquier aspecto del presente informe.

Atentamente,

${resumen.usuario_auditor}
Auditor Responsable
`;

  const cartaLines = doc.splitTextToSize(carta, 170);
  doc.text(cartaLines, 20, 40);

  // Pie de página carta
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Página 1 de 2`, 170, 280);

  // =====================
  // 2. INFORME (segunda página)
  // =====================
  doc.addPage();

  // Encabezado
  doc.setFillColor(...colorPrimario);
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORME DE EVALUACIÓN DE CUMPLIMIENTO', 105, 20, { align: 'center' });

  // Información general
  let yPosition = 50;
  doc.setTextColor(...colorSecundario);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMACIÓN GENERAL', 20, yPosition);

  yPosition += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const infoGeneral = [
    [`ID Evaluación:`, resumen.id_evaluacion.toString()],
    [`Empresa:`, resumen.empresa],
    [`Marco Legal:`, resumen.marco_legal],
    [`Auditor:`, resumen.usuario_auditor],
    [`Fecha:`, new Date().toLocaleDateString('es-ES')]
  ];

  infoGeneral.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, yPosition);
    yPosition += 7;
  });

  // Nivel de madurez
  yPosition += 10;

  doc.setFillColor(...nivelMadurez.color);
  doc.rect(15, yPosition - 5, 180, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('NIVEL DE MADUREZ', 105, yPosition + 5, { align: 'center' });
  doc.setFontSize(14);
  doc.text(`${nivelMadurez.nivel} (${resumen.porcentaje_cumplimiento}%)`, 105, yPosition + 15, { align: 'center' });

  // Descripción del nivel
  yPosition += 35;
  doc.setTextColor(...colorSecundario);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descripcionLines = doc.splitTextToSize(nivelMadurez.descripcion, 170);
  doc.text(descripcionLines, 20, yPosition);
  yPosition += descripcionLines.length * 5 + 10;

  // Resumen estadístico
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMEN ESTADÍSTICO', 20, yPosition);
  yPosition += 15;

  // Tabla de estadísticas
  const estadisticas = [
    ['Categoría', 'Cantidad', 'Porcentaje', 'Color'],
    ['Cumple', resumen.cantidad_cumple, `${resumen.porcentaje_cumple}%`, 'verde'],
    ['No Cumple', resumen.cantidad_no_cumple, `${resumen.porcentaje_no_cumple}%`, 'rojo'],
    ['Cumple Parcialmente', resumen.cantidad_cumple_parcial, `${resumen.porcentaje_cumple_parcial}%`, 'amarillo'],
    ['No Aplica', resumen.cantidad_no_aplica, `${resumen.porcentaje_no_aplica}%`, 'gris']
  ];

  // Dibujar tabla
  const tableStartY = yPosition;
  const rowHeight = 10;
  const colWidths = [60, 30, 30, 30];
  const startX = 20;

  estadisticas.forEach((row, rowIndex) => {
    let currentX = startX;
    
    if (rowIndex === 0) {
      // Encabezado de tabla
      doc.setFillColor(...colorPrimario);
      doc.rect(currentX, tableStartY + (rowIndex * rowHeight) - 2, colWidths.reduce((a, b) => a + b), rowHeight, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
    } else {
      // Filas de datos
      let fillColor: [number, number, number];
      switch (row[3]) {
        case 'verde': fillColor = [46, 204, 113]; break;
        case 'rojo': fillColor = [231, 76, 60]; break;
        case 'amarillo': fillColor = [241, 196, 15]; break;
        default: fillColor = [149, 165, 166]; break;
      }
      
      // Fondo alternado para las filas
      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(currentX, tableStartY + (rowIndex * rowHeight) - 2, colWidths.reduce((a, b) => a + b), rowHeight, 'F');
      }
      
      doc.setTextColor(...colorSecundario);
      doc.setFont('helvetica', 'normal');
      
      // Indicador de color
      if (row[3] !== 'Color') {
        doc.setFillColor(...fillColor);
        doc.circle(currentX + colWidths[0] + colWidths[1] + colWidths[2] + 15, tableStartY + (rowIndex * rowHeight) + 2, 2, 'F');
      }
    }

    // Contenido de las celdas (sin mostrar la columna de color)
    for (let colIndex = 0; colIndex < 3; colIndex++) {
      if (rowIndex === 0) {
        doc.text(row[colIndex], currentX + 5, tableStartY + (rowIndex * rowHeight) + 5);
      } else {
        doc.text(row[colIndex], currentX + 5, tableStartY + (rowIndex * rowHeight) + 5);
      }
      currentX += colWidths[colIndex];
    }
  });

  yPosition += (estadisticas.length * rowHeight) + 20;


  // Recomendaciones basadas en el nivel
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RECOMENDACIONES', 20, yPosition);
  yPosition += 10;

  let recomendaciones = '';
  if (porcentajeCumplimiento <= 20) {
    recomendaciones = 'Se recomienda implementar un programa integral de cumplimiento normativo, comenzando por los artículos básicos y estableciendo procesos de seguimiento.';
  } else if (porcentajeCumplimiento <= 40) {
    recomendaciones = 'Es necesario ampliar el alcance del cumplimiento normativo y desarrollar procedimientos más robustos para cubrir los artículos faltantes.';
  } else if (porcentajeCumplimiento <= 60) {
    recomendaciones = 'Se debe enfocar en cerrar las brechas existentes y fortalecer los mecanismos de control interno para mejorar el cumplimiento.';
  } else if (porcentajeCumplimiento <= 80) {
    recomendaciones = 'Continuar con las mejoras incrementales y establecer un programa de mejora continua para alcanzar el cumplimiento total.';
  } else {
    recomendaciones = 'Mantener el alto nivel de cumplimiento mediante auditorías periódicas y actualización continua de procedimientos.';
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colorSecundario);
  const recomendacionesLines = doc.splitTextToSize(recomendaciones, 170);
  doc.text(recomendacionesLines, 20, yPosition);

  // Pie de página
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado el ${new Date().toLocaleString('es-ES')}`, 20, 280);
  doc.text(`Página 2 de 2`, 170, 280);

  // Guardar el PDF
  const nombreArchivo = `Evaluacion_${resumen.empresa}_${resumen.id_evaluacion}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(nombreArchivo);
}

// Función de uso para tu componente Angular
export function descargarInformeEvaluacion(resumen: any): void {
  try {
    generarInformePDF(resumen);
    console.log('Informe PDF generado exitosamente');
  } catch (error) {
    console.error('Error al generar el informe PDF:', error);
  }
}

