// Lưu ý: Không import ở trên cùng (Top-level) để tránh lỗi SSR trong Next.js
// Xóa các dòng: import jsPDF ... và import 'jspdf-autotable' ...

const addVietnameseFont = async (doc) => {
  const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
  try {
    const response = await fetch(fontUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        doc.addFileToVFS('Roboto-Regular.ttf', base64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');
        resolve();
      };
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Lỗi tải font:", e);
  }
};

export const generatePDF = async (tableData, config, days) => {
  // 1. DYNAMIC IMPORT (Quan trọng: Sửa lỗi doc.autoTable is not a function)
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  // Cấu hình Theme
  const THEME = {
    primary: [41, 128, 185],
    headerText: 255,
    gridLine: [189, 195, 199],
    textMain: [44, 62, 80],
    breakRowFill: [253, 235, 208],
    breakRowText: [211, 84, 0],
  };

  // Khởi tạo PDF
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Nạp font
  await addVietnameseFont(doc);

  // --- XỬ LÝ DỮ LIỆU ---
  const schedule = config.data || {};
  const breaks = config.config.breaks || [];
  const maxPeriods = config.config.maxPeriods || 10;

  const tableHead = [['TIẾT', ...days.map(d => d.toUpperCase())]];
  const tableBody = [];
  
  for (let period = 1; period <= maxPeriods; period++) {
    const row = [];
    // Cột Tiết
    row.push({ content: period.toString(), styles: { fontStyle: 'bold', halign: 'center' } });

    // Các cột ngày
    days.forEach((_, index) => {
      const key = `${index}-${period}`;
      const cell = schedule[key];
      if (cell) {
        let content = cell.subject;
        if (cell.location) content += `\n(${cell.location})`;
        row.push(content);
      } else {
        row.push('');
      }
    });
    tableBody.push(row);

    // Dòng nghỉ
    const breakInfo = breaks.find(b => b.after === period);
    if (breakInfo) {
      tableBody.push([{
        content: breakInfo.label || 'NGHỈ GIẢI LAO',
        colSpan: days.length + 1,
        styles: { 
          fillColor: THEME.breakRowFill, 
          textColor: THEME.breakRowText, 
          fontStyle: 'bold', 
          halign: 'center',
          cellPadding: 2 
        }
      }]);
    }
  }

  // --- VẼ HEADER ---
  doc.setFontSize(22);
  doc.setTextColor(...THEME.primary);
  doc.text((tableData.name || 'THỜI KHÓA BIỂU').toUpperCase(), 148.5, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Năm học: ${tableData.year || '2024 - 2025'}`, 148.5, 28, { align: 'center' });

  // --- VẼ BẢNG (SỬA LỖI Ở ĐÂY) ---
  // Thay vì gọi doc.autoTable({...}), ta gọi hàm autoTable(doc, {...})
  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 35,
    theme: 'grid',
    
    styles: {
      font: 'Roboto',
      fontSize: 11,
      textColor: THEME.textMain,
      lineColor: THEME.gridLine,
      lineWidth: 0.1,
      valign: 'middle',
      cellPadding: 3,
    },

    headStyles: {
      fillColor: THEME.primary,
      textColor: THEME.headerText,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      minCellHeight: 12
    },

    columnStyles: {
      0: { 
        cellWidth: 15,
        halign: 'center',
        fillColor: [245, 245, 245]
      }
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(`Được xuất vào lúc: ${new Date().toLocaleString('vi-VN')}`, 280, pageHeight - 10, { align: 'right' });

  // Lưu file
  doc.save(`TKB-${tableData.name || 'export'}.pdf`);
};