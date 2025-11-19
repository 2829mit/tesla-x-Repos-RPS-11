
import { BASE_PRICE } from '../constants';
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

  // 1. Base Price
  tableRows.push(["RPS Base Price", formatPdfCurrency(BASE_PRICE)]);

  // 2. Dispensing Unit
  const { dispensingUnit } = data.configuration;
  tableRows.push([dispensingUnit.name, dispensingUnit.price === 0 ? 'Included' : formatPdfCurrency(dispensingUnit.price)]);

  // 3. RFID Tech
  const { trim } = data.configuration;
  tableRows.push([`RFID Tech: ${trim.name}`, trim.price === 0 ? 'Included' : formatPdfCurrency(trim.price)]);

  // 4. Fuel Level Tech
  data.configuration.accessories.fuelLevel.forEach(opt => {
    tableRows.push([opt.name, opt.price === 0 ? 'Included' : formatPdfCurrency(opt.price)]);
  });

  // 5. Repos OS
  data.configuration.accessories.reposOs.forEach(opt => {
    tableRows.push([opt.name, opt.price === 0 ? 'Included' : formatPdfCurrency(opt.price)]);
  });

  // 6. Decantation
  const { decantation } = data.configuration;
  tableRows.push([`Decantation: ${decantation.name}`, decantation.price === 0 ? 'Included' : formatPdfCurrency(decantation.price)]);

  // 7. Mechanical Inclusion
  data.configuration.accessories.mechanical.forEach(opt => {
     tableRows.push([opt.name, opt.price === 0 ? 'Included' : formatPdfCurrency(opt.price)]);
  });

  // 8. Safety Unit
  data.configuration.accessories.safetyUnits.forEach(opt => {
     tableRows.push([opt.name, opt.price === 0 ? 'Included' : formatPdfCurrency(opt.price)]);
  });

  // 9. Safety Upgrades
  data.configuration.accessories.safetyUpgrades.forEach(opt => {
     tableRows.push([opt.name, formatPdfCurrency(opt.price)]);
  });
  
  // 10. Licenses
  data.configuration.licenses.forEach(opt => {
    tableRows.push([`License: ${opt.name}`, opt.price === 0 ? 'Included' : formatPdfCurrency(opt.price)]);
  });

  // 11. Warranty
  const { warranty } = data.configuration;
  tableRows.push([`Warranty: ${warranty.name}`, warranty.price === 0 ? 'Included' : formatPdfCurrency(warranty.price)]);

  // Generate Table
  doc.autoTable({
    startY: finalY,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // --- Total ---
  // @ts-ignore
  const finalYAfterTable = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Total RPS Price:", 130, finalYAfterTable);
  doc.setTextColor(...accentColor);
  doc.setFontSize(14);
  doc.text(formatPdfCurrency(data.totalPrice), 170, finalYAfterTable);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.setFont(undefined, 'normal');
  doc.text("Thank you for choosing Repos Energy.", 105, 280, { align: 'center' });
  
  doc.save(`RPS_Quote_${orderId}.pdf`);
};
