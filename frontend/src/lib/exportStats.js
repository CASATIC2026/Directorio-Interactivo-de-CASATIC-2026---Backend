// Utilidad para exportar datos a Excel y PDF
// Requiere instalar SheetJS (xlsx) y jsPDF

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export function exportStatsToExcel(stats) {
  const ws = XLSX.utils.json_to_sheet([
    { ...stats }
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas');
  XLSX.writeFile(wb, 'estadisticas.xlsx');
}

export function exportStatsToPDF(stats) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Estadísticas', 10, 10);
  let y = 30;
  Object.entries(stats).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`, 10, y);
    y += 10;
  });
  doc.save('estadisticas.pdf');
}
