// /lib/generatePdf.ts
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// Updated exportToPdf function with more robust error handling
export async function exportToPdf(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Create a simple clone with basic styles
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.width = `${element.offsetWidth}px`;
    clone.style.background = 'white';
    document.body.appendChild(clone);

    // Remove all styles that might cause issues
    const allElements = clone.querySelectorAll('*');
    allElements.forEach((el) => {
      (el as HTMLElement).removeAttribute('style');
    });

    const canvas = await html2canvas(clone, {
      logging: true,
      useCORS: true,
      allowTaint: true,
    });

    document.body.removeChild(clone);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to simple text PDF
    const pdf = new jsPDF();
    pdf.text('Could not generate PDF preview', 10, 10);
    pdf.save(`${filename}-fallback.pdf`);
  }
}
