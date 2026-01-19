// utils/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const loadFont = async (doc) => {
  try {
    const response = await fetch('/font-times-new-roman.ttf');
    if (!response.ok) throw new Error('Không thể tải file font');
    
    const fontBlob = await response.arrayBuffer();
    const base64String = btoa(
      new Uint8Array(fontBlob).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const fontName = 'TimesRes';
    const fontFileName = 'font-times-new-roman.ttf';

    doc.addFileToVFS(fontFileName, base64String);
    
    // Đăng ký font cho cả 2 kiểu để tránh lỗi Unicode khi gọi 'italic'
    doc.addFont(fontFileName, fontName, 'normal');
    doc.addFont(fontFileName, fontName, 'italic'); 
    
    doc.setFont(fontName, 'normal');
    return fontName;
  } catch (e) {
    console.error("Lỗi nạp font:", e);
    return null;
  }
};

export const generatePDF = async (tableData, config, days) => {
  const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });

  const customFont = await loadFont(doc);
  if (!customFont) {
    alert("Lỗi nạp font tiếng Việt.");
    return;
  }

  // --- 1. CHUẨN BỊ DỮ LIỆU ---
  const tableHead = [['TIẾT', ...days.map(d => d.toUpperCase())]];
  const tableBody = [];
  const schedule = config.data || {};
  const breaks = config.config.breaks || [];

  for (let p = 1; p <= config.config.maxPeriods; p++) {
    const row = [{ 
      content: p.toString(), 
      styles: { fontStyle: 'normal' } 
    }];
    
    days.forEach((_, dIdx) => {
      const key = `${dIdx}-${p}`;
      const cell = schedule[key];
      row.push(cell ? `${cell.subject}${cell.location ? `\n(${cell.location})` : ''}` : '');
    });
    tableBody.push(row);

    const brk = breaks.find(b => b.after === p);
    if (brk) {
      tableBody.push([{
        content: brk.label.toUpperCase(),
        colSpan: days.length + 1,
        styles: { 
          fillColor: [255, 235, 215],
          textColor: [150, 70, 0],
          fontSize: 12,
          fontStyle: 'normal',
          halign: 'center',
          valign: 'middle'
        }
      }]);
    }
  }

  const pageWidth = doc.internal.pageSize.getWidth();

  // --- 2. VẼ TIÊU ĐỀ ---
  // Tiêu đề chính: CHỮ THẲNG
  doc.setFont(customFont, 'normal');
  doc.setFontSize(22);
  doc.setTextColor(40, 60, 80);
  doc.text(tableData.name.toUpperCase(), pageWidth / 2, 18, { align: 'center' });
  
  // Dòng năm học: CHỮ NGHIÊNG (Đã fix lỗi Unicode bằng cách đăng ký font italic ở trên)
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont(customFont, 'italic'); 
  doc.text(`Năm học: ${tableData.year}`, pageWidth / 2, 26, { align: 'center' });

  // --- 3. VẼ BẢNG ---
  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 32,
    theme: 'grid',
    styles: {
      font: customFont,
      fontStyle: 'normal', // Ép toàn bảng là chữ thẳng
      fontSize: 11,
      halign: 'center',
      valign: 'middle',
      cellPadding: 3,
      lineColor: [180, 180, 180],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [240, 242, 245],
      fontStyle: 'normal', // Header chữ thẳng
      lineWidth: 0.2,
    },
    columnStyles: {
      // Tăng lên 25mm để chữ "TIẾT" nằm gọn trên 1 dòng
      0: { cellWidth: 25, fillColor: [250, 250, 250] }
    },
    didParseCell: (data) => {
      data.cell.styles.font = customFont;
      data.cell.styles.fontStyle = 'normal'; // Đảm bảo không ô nào bị lỗi render nghiêng
    }
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont(customFont, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(`Được xuất lúc: ${new Date().toLocaleString('vi-VN')}`, pageWidth - 10, pageHeight - 10, { align: 'right' });

  doc.save(`TKB-${tableData.name.replace(/\s+/g, '_')}.pdf`);
};