import { jsPDF } from 'jspdf';

interface PayslipData {
  employeeName: string;
  department: string;
  designation: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  overtime: number;
  netSalary: number;
  month: string;
  notes?: string;
}

export const generatePayslipPDF = (data: PayslipData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const lineHeight = 10;
  let y = margin;

  // Company Logo and Header
  doc.setFontSize(20);
  doc.text('Employee Management System', pageWidth / 2, y, { align: 'center' });
  y += lineHeight * 2;

  doc.setFontSize(16);
  doc.text('PAYSLIP', pageWidth / 2, y, { align: 'center' });
  y += lineHeight * 2;

  // Employee Information
  doc.setFontSize(12);
  doc.text(`Employee Name: ${data.employeeName}`, margin, y);
  y += lineHeight;
  doc.text(`Department: ${data.department}`, margin, y);
  y += lineHeight;
  doc.text(`Designation: ${data.designation}`, margin, y);
  y += lineHeight;
  doc.text(`Month: ${data.month}`, margin, y);
  y += lineHeight * 2;

  // Salary Details
  doc.setFontSize(14);
  doc.text('Salary Details', margin, y);
  y += lineHeight * 1.5;

  doc.setFontSize(12);
  doc.text(`Basic Salary: $${data.basicSalary.toFixed(2)}`, margin, y);
  y += lineHeight;
  doc.text(`Allowances: $${data.allowances.toFixed(2)}`, margin, y);
  y += lineHeight;
  doc.text(`Bonus: $${data.bonus.toFixed(2)}`, margin, y);
  y += lineHeight;
  doc.text(`Overtime: $${data.overtime.toFixed(2)}`, margin, y);
  y += lineHeight;
  doc.text(`Deductions: $${data.deductions.toFixed(2)}`, margin, y);
  y += lineHeight * 1.5;

  // Net Salary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Net Salary: $${data.netSalary.toFixed(2)}`, margin, y);
  y += lineHeight * 2;

  // Notes
  if (data.notes) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Notes:', margin, y);
    y += lineHeight;
    doc.text(data.notes, margin, y);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - margin;
  doc.setFontSize(10);
  doc.text('This is a computer-generated document. No signature is required.', pageWidth / 2, footerY, { align: 'center' });

  // Save the PDF
  doc.save(`payslip-${data.employeeName}-${data.month}.pdf`);
}; 