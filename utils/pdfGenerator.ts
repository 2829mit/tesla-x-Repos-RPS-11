
import { TANK_OPTIONS } from '../constants';
import { QuoteData } from '../services/api';

// Declare jsPDF on window since we are using CDN
declare global {
  interface Window {
    jspdf: any;
  }
}

const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (error) => {
      console.warn("Failed to load logo for PDF", error);
      resolve("");
    };
    img.src = url;
  });
};

// Manual formatter for Indian Currency to avoid Intl non-breaking spaces/glyphs causing PDF distortion
const formatIndianCurrency = (num: number): string => {
  if (num === undefined || num === null) return "Rs. 0";
  
  const val = Math.round(num);
  const s = val.toString();
  
  // Get last 3 digits
  let lastThree = s.substring(s.length - 3);
  // Get all other digits
  const otherNumbers = s.substring(0, s.length - 3);
  
  let res = lastThree;
  if (otherNumbers !== '') {
      // Add commas every 2 digits for the rest
      res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  
  return "Rs. " + res;
};

export const generateQuotePDF = async (data: QuoteData) => {
  if (!window.jspdf) {
    alert("PDF library not loaded yet. Please check your connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Set standard font to avoid encoding issues
  doc.setFont("helvetica", "normal");

  const logoUrl = "https://i.postimg.cc/52fvQyLD/Repos-New-Logo-V1-1.png";

  let logoBase64 = "";
  try {
    logoBase64 = await getBase64ImageFromURL(logoUrl);
  } catch (e) {
    console.error(e);
  }

  // Use manual formatter instead of Intl
  const formatPdfCurrency = (amount: number) => {
    return formatIndianCurrency(amount);
  };

  // If payment mode is installments, show monthly prices (multiplier 1)
  // If outright, show full contract prices (multiplier 36)
  const multiplier = data.paymentMode === 'installments' ? 1 : 36;
  
  const getItemPrice = (price: number) => {
    if (price === 0) return 'Included';
    return formatPdfCurrency(price * multiplier);
  };

  const primaryColor = [23, 26, 32]; // #171A20
  const accentColor = [29, 78, 216]; // Blue

  let finalY = 20;

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 14, 10, 30, 10);
    finalY = 30; 
  }

  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("PROFORMA INVOICE / QUOTE", 14, finalY);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Repos Energy Pvt Limited", 14, finalY + 8);
  
  const orderId = `RPS-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleDateString();
  
  doc.setFontSize(10);
  doc.text(`Date: ${date}`, 150, finalY);
  doc.text(`Order ID: ${orderId}`, 150, finalY + 6);
  
  // Corrected Payment Mode Label
  const modeText = data.paymentMode === 'installments' ? 'Easy Installments (36 Months)' : 'Outright (Full Amount)';
  doc.text(`Payment Mode: ${modeText}`, 150, finalY + 12);

  finalY += 25;

  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Bill To:", 14, finalY);
  finalY += 8;

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  if (data.customerDetails) {
    doc.text(`Name: ${data.customerDetails.name}`, 14, finalY);
    doc.text(`Company: ${data.customerDetails.company}`, 14, finalY + 6);
    doc.text(`Industry: ${data.customerDetails.industry}`, 14, finalY + 12);
    doc.text(`State: ${data.customerDetails.state || 'N/A'}`, 14, finalY + 18);
    doc.text(`Consumption: ${data.customerDetails.consumption}`, 14, finalY + 24);
    
    doc.text(`Email: ${data.customerDetails.email}`, 110, finalY);
    doc.text(`Mobile: ${data.customerDetails.mobile}`, 110, finalY + 6);
  } else {
    doc.text("Customer details not provided.", 14, finalY);
  }

  finalY += 36;

  // Update header based on mode
  const priceHeader = data.paymentMode === 'installments' ? "Monthly Price (INR)" : "Price (INR)";
  const tableColumn = ["Description", priceHeader];
  const tableRows: any[] = [];

  const tank = TANK_OPTIONS.find(t => t.id === data.configuration.tank);
  const tankPrice = tank ? tank.price : 0;
  
  // Add Tank Base Price row
  tableRows.push([`RPS Base Price (${tank?.name || ''} Tank)`, getItemPrice(tankPrice)]);

  const { dispensingUnit } = data.configuration;
  tableRows.push([dispensingUnit.name, getItemPrice(dispensingUnit.price)]);

  // Access RFID via new property name
  const { rfidOption } = data.configuration;
  if (rfidOption) {
      tableRows.push([`RFID Tech: ${rfidOption.name}`, getItemPrice(rfidOption.price)]);
  }

  data.configuration.accessories.reposOs.forEach(opt => {
    tableRows.push([opt.name, getItemPrice(opt.price)]);
  });

  const { decantation } = data.configuration;
  tableRows.push([`Decantation: ${decantation.name}`, getItemPrice(decantation.price)]);

  data.configuration.accessories.mechanical.forEach(opt => {
     tableRows.push([opt.name, getItemPrice(opt.price)]);
  });

  data.configuration.accessories.safetyUnits.forEach(opt => {
     tableRows.push([opt.name, getItemPrice(opt.price)]);
  });

  data.configuration.accessories.safetyUpgrades.forEach(opt => {
     tableRows.push([opt.name, getItemPrice(opt.price)]);
  });
  
  data.configuration.licenses.forEach(opt => {
    tableRows.push([`License: ${opt.name}`, getItemPrice(opt.price)]);
  });

  doc.autoTable({
    startY: finalY,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255 },
    // Added columnStyles to fix width and prevent overlapping
    columnStyles: {
        0: { cellWidth: 'auto' }, 
        1: { cellWidth: 40, halign: 'right' }
    },
    styles: { 
        fontSize: 10, 
        cellPadding: 3, 
        font: "helvetica", 
        overflow: 'linebreak' // Ensures text wraps if description is too long
    }, 
  });

  // @ts-ignore
  const finalYAfterTable = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  if (data.paymentMode === 'outright') {
    // OUTRIGHT SUMMARY
    doc.text("Subtotal (Excl. GST):", 130, finalYAfterTable);
    doc.text(formatPdfCurrency(data.totalContractValue || 0), 195, finalYAfterTable, { align: 'right' });
    
    doc.text("GST (18%):", 130, finalYAfterTable + 6);
    doc.text(formatPdfCurrency(data.gstAmount || 0), 195, finalYAfterTable + 6, { align: 'right' });

    const totalY = finalYAfterTable + 14;
    const totalIncTax = (data.totalContractValue || 0) + (data.gstAmount || 0);

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Total (Inc. GST):", 130, totalY);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(formatPdfCurrency(totalIncTax), 195, totalY, { align: 'right' });
  } else {
    // INSTALLMENTS SUMMARY
    doc.text("Total Monthly Payment:", 130, finalYAfterTable);
    doc.text(formatPdfCurrency(data.monthlyPrice || 0), 195, finalYAfterTable, { align: 'right' });

    const totalY = finalYAfterTable + 8;
    
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Down Payment (GST Amount):", 130, totalY);
    doc.text(formatPdfCurrency(data.gstAmount || 0), 195, totalY, { align: 'right' });
    
    doc.text("Tenure:", 130, totalY + 6);
    doc.text("36 Months", 195, totalY + 6, { align: 'right' });
  }

  const modeY = finalYAfterTable + 30;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  
  if (data.paymentMode === 'installments') {
    doc.text("Payment Mode: Easy Installments (36 Months)", 14, modeY);
    doc.setFontSize(9);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text("* Subject to approval from Partnered Bank", 14, modeY + 6);
  } else {
      doc.text("Payment Mode: Outright (Full Amount)", 14, modeY);
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont(undefined, 'normal');
  doc.text("Thank you for choosing Repos Energy.", 105, 280, { align: 'center' });
  
  doc.save(`RPS_Quote_${orderId}.pdf`);
};
