
import { TANK_OPTIONS } from '../constants';
import { QuoteData } from '../services/api';

// Declare jsPDF on window since we are using CDN
declare global {
  interface Window {
    jspdf: any;
  }
}

/**
 * Helper to load an image from a URL and convert it to Base64
 * This is necessary for jsPDF to embed images without CORS issues during generation
 */
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
      // Resolve empty string so PDF generation doesn't break, just lacks logo
      resolve("");
    };
    img.src = url;
  });
};

export const generateQuotePDF = async (data: QuoteData) => {
  if (!window.jspdf) {
    alert("PDF library not loaded yet. Please check your connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const logoUrl = "https://i.postimg.cc/52fvQyLD/Repos-New-Logo-V1-1.png";

  // Load logo asynchronously
  let logoBase64 = "";
  try {
    logoBase64 = await getBase64ImageFromURL(logoUrl);
  } catch (e) {
    console.error(e);
  }

  // Safe Currency Formatter for PDF to avoid font encoding issues with '₹'
  const formatPdfCurrency = (amount: number) => {
    const value = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
    return `Rs. ${value}`;
  };

  // Multiplier based on payment mode - standardizing breakdown to full value always
  const multiplier = 36;
  
  // Helper to calculate displayed price for an item
  const getItemPrice = (price: number) => {
    if (price === 0) return 'Included';
    return formatPdfCurrency(price * multiplier);
  };

  // Colors
  const primaryColor = [23, 26, 32]; // #171A20
  const accentColor = [29, 78, 216]; // Blue

  // Helper to get Y position
  let finalY = 20;

  // --- Header ---
  // Add Logo if loaded
  if (logoBase64) {
    // x, y, width, height
    doc.addImage(logoBase64, 'PNG', 14, 10, 30, 10);
    finalY = 30; 
  }

  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text("PROFORMA INVOICE / QUOTE", 14, finalY);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("Repos Energy Pvt Limited", 14, finalY + 8);
  
  // --- Metadata (Date, Order ID) ---
  const orderId = `RPS-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleDateString();
  
  doc.setFontSize(10);
  doc.text(`Date: ${date}`, 150, finalY);
  doc.text(`Order ID: ${orderId}`, 150, finalY + 6);
  doc.text(`Payment Mode: ${data.paymentMode === 'installments' ? 'Easy Installments' : 'Outright'}`, 150, finalY + 12);

  finalY += 25;

  // --- Customer Details ---
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text("Bill To:", 14, finalY);
  finalY += 8;

  doc.setFontSize(10);
  doc.setTextColor(0);
  if (data.customerDetails) {
    doc.text(`Name: ${data.customerDetails.name}`, 14, finalY);
    doc.text(`Company: ${data.customerDetails.company}`, 14, finalY + 6);
    doc.text(`Industry: ${data.customerDetails.industry}`, 14, finalY + 12);
    doc.text(`Consumption: ${data.customerDetails.consumption}`, 14, finalY + 18);
    doc.text(`Email: ${data.customerDetails.email}`, 110, finalY);
    doc.text(`Mobile: ${data.customerDetails.mobile}`, 110, finalY + 6);
  } else {
    doc.text("Customer details not provided.", 14, finalY);
  }

  finalY += 30;

  // --- Order Summary Table ---
  const tableColumn = ["Description", "Price (INR)"];
  const tableRows: any[] = [];

  // 1. Tank Base Price
  const tank = TANK_OPTIONS.find(t => t.id === data.configuration.tank);
  const tankPrice = tank ? tank.price : 0;
  tableRows.push([`RPS Base Price (${tank?.name || ''} Tank)`, getItemPrice(tankPrice)]);

  // 2. Dispensing Unit
  const { dispensingUnit } = data.configuration;
  tableRows.push([dispensingUnit.name, getItemPrice(dispensingUnit.price)]);

  // 3. RFID Tech
  const { trim } = data.configuration;
  tableRows.push([`RFID Tech: ${trim.name}`, getItemPrice(trim.price)]);

  // 4. Repos OS
  data.configuration.accessories.reposOs.forEach(opt => {
    tableRows.push([opt.name, getItemPrice(opt.price)]);
  });

  // 5. Decantation
  const { decantation } = data.configuration;
  tableRows.push([`Decantation: ${decantation.name}`, getItemPrice(decantation.price)]);

  // 6. Mechanical Inclusion
  data.configuration.accessories.mechanical.forEach(opt => {
     tableRows.push([opt.name, getItemPrice(opt.price)]);
  });

  // 7. Safety Unit
  data.configuration.accessories.safetyUnits.forEach(opt => {
     tableRows.push([opt.name, getItemPrice(opt.price)]);
  });

  // 8. Safety Upgrades
  data.configuration.accessories.safetyUpgrades.forEach(opt => {
     tableRows.push([opt.name, getItemPrice(opt.price)]);
  });
  
  // 9. Licenses
  data.configuration.licenses.forEach(opt => {
    tableRows.push([`License: ${opt.name}`, getItemPrice(opt.price)]);
  });

  // Generate Table
  doc.autoTable({
    startY: finalY,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // --- Total Calculations ---
  // @ts-ignore
  const finalYAfterTable = doc.lastAutoTable.finalY + 10;
  
  // Subtotal (Excl Tax)
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Subtotal (Excl. GST):", 130, finalYAfterTable);
  doc.text(formatPdfCurrency(data.totalContractValue || 0), 170, finalYAfterTable, { align: 'right' });
  
  // GST
  doc.text("GST (18%):", 130, finalYAfterTable + 6);
  doc.text(formatPdfCurrency(data.gstAmount || 0), 170, finalYAfterTable + 6, { align: 'right' });

  const totalY = finalYAfterTable + 14;

  // Grand Total
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text("Total (Inc. GST):", 130, totalY);
  doc.setTextColor(...accentColor);
  // Total Price (Inc GST) = totalContractValue + gstAmount
  const totalIncTax = (data.totalContractValue || 0) + (data.gstAmount || 0);
  doc.text(formatPdfCurrency(totalIncTax), 170, totalY, { align: 'right' });

  // --- Payment Mode Details ---
  const modeY = totalY + 10;

  if (data.paymentMode === 'installments') {
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text("Payment Mode: Easy Installments (36 Months)", 14, modeY);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`Monthly Payment: ${formatPdfCurrency(data.totalPrice)}`, 14, modeY + 6);

    // Down Payment Note
    doc.setFont(undefined, 'italic');
    doc.setTextColor(100);
    doc.text(`* Down Payment (GST Amount): ${formatPdfCurrency(data.gstAmount || 0)}`, 14, modeY + 12);
  } else {
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.text("Payment Mode: Outright (Full Amount)", 14, modeY);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.setFont(undefined, 'normal');
  doc.text("Thank you for choosing Repos Energy.", 105, 280, { align: 'center' });
  
  doc.save(`RPS_Quote_${orderId}.pdf`);
};
