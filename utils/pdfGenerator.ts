
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

// Helper to convert number to words (Indian Numbering System)
const numberToWords = (num: number): string => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = num.toString().length > 9 ? parseFloat(num.toString().slice(0, 9)) : num) === 0) return '';
  
  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  
  return str.trim();
};

// Manual formatter to avoid PDF font distortion
const formatIndianCurrency = (num: number): string => {
  if (num === undefined || num === null) return "0";
  const val = Math.round(num);
  const s = val.toString();
  let lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  let res = lastThree;
  if (otherNumbers !== '') {
      res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  }
  return res;
};

export const generateQuotePDF = async (data: QuoteData) => {
  if (!window.jspdf) {
    alert("PDF library not loaded yet.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Fonts & Config
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setLineWidth(0.1);
  const black = "#000000";
  doc.setTextColor(black);

  // --- LOAD LOGO ---
  const logoUrl = "https://i.postimg.cc/52fvQyLD/Repos-New-Logo-V1-1.png";
  let logoBase64 = "";
  try {
    logoBase64 = await getBase64ImageFromURL(logoUrl);
  } catch (e) { console.error(e); }

  // --- CONSTANTS FOR LAYOUT ---
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - (margin * 2);
  const startY = 10;
  const midX = margin + (contentWidth / 2);

  // --- 1. OUTER BORDER ---
  doc.rect(margin, startY, contentWidth, 280); 

  // --- 2. HEADER SECTION (Top Box) ---
  let y = startY + 5;
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PROFORMA INVOICE", midX, y, { align: "center" });
  doc.line(margin, y + 2, margin + contentWidth, y + 2);
  
  y += 7;
  
  // Company Details
  doc.setFontSize(9);
  doc.text("Repos Energy India Private Limited", midX, y, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  y += 4;
  doc.text("FL No. 301, Bhuvaneshwari Apartment, Plot No. 1, S.NO. 108/1B, Aundh,", midX, y, { align: "center" });
  y += 4;
  doc.text("Pune - 411007, Maharashtra", midX, y, { align: "center" });
  y += 4;
  doc.text("GSTIN/UIN: 27AAICR3322D1ZO, CIN: U74999PN2017PTC170768, PAN No.: AAICR3322D", midX, y, { align: "center" });
  y += 4;
  doc.text("Contact : 8669990062 E-Mail : rajesh.jadhav@reposenergy.com www.reposenergy.com", midX, y, { align: "center" });

  // Logo (Top Right)
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', margin + contentWidth - 40, startY + 4, 35, 10);
  }

  const headerBottomY = y + 6;
  doc.line(margin, headerBottomY, margin + contentWidth, headerBottomY);

  // --- 3. DETAILS GRID (4 Quadrants) ---
  // Vertical Split Line
  const gridBottomY = headerBottomY + 60; // Height for address block
  doc.line(midX, headerBottomY, midX, gridBottomY);
  
  // Horizontal Split Line
  const gridMidY = headerBottomY + 30;
  doc.line(margin, gridMidY, margin + contentWidth, gridMidY);
  doc.line(margin, gridBottomY, margin + contentWidth, gridBottomY); // Bottom of grid

  // QUADRANT 1: Bill To (Top Left)
  let qy = headerBottomY + 4;
  let qx = margin + 2;
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", qx, qy);
  
  doc.setFont("helvetica", "normal");
  const custName = (data.customerDetails?.company || data.customerDetails?.name || "Customer Name").toUpperCase();
  doc.text(custName, qx, qy + 5);
  
  // Address Placeholder (as per image request) + Dynamic State
  const custState = data.customerDetails?.state || "Maharashtra";
  const address = [
    "2nd Floor, Door No. 360/1, Near old Ganesh gas Godown",
    "Bharathi Nagar, Amaravathi, Hospet, Ballari,",
    `${custState} - 583201`,
    "GST No. 29AAGCC5056M2Z6"
  ];
  let ay = qy + 10;
  address.forEach(l => { doc.text(l, qx, ay); ay += 4; });

  // QUADRANT 2: Invoice Details (Top Right)
  qx = midX + 2;
  doc.setFont("helvetica", "bold");
  const invNo = `REIPL/RPS-${Date.now().toString().slice(-5)}/2025-26`;
  const invDate = new Date().toLocaleDateString('en-GB');
  doc.text(`Proforma Invoice No. - ${invNo}`, qx, qy);
  doc.text(`Dated- ${invDate}`, qx, qy + 5);
  // Adding Payment mode here as extra info since strictly following layout leaves empty space
  doc.setFont("helvetica", "normal");
  doc.text(`Mode: ${data.paymentMode === 'outright' ? 'Outright' : 'Installments'}`, qx, qy + 15);

  // QUADRANT 3: Ship To (Bottom Left)
  qy = gridMidY + 4;
  qx = margin + 2;
  doc.setFont("helvetica", "bold");
  doc.text("Ship To", qx, qy);
  doc.setFont("helvetica", "normal");
  doc.text(custName, qx, qy + 5);
  ay = qy + 10;
  address.forEach(l => { doc.text(l, qx, ay); ay += 4; });

  // QUADRANT 4: Bank Details (Bottom Right)
  qx = midX + 2;
  doc.setFont("helvetica", "bold");
  doc.text("Repos Account Details", qx, qy);
  doc.setFont("helvetica", "normal");
  ay = qy + 5;
  doc.text("Name of the Beneficiary - Repos Energy India Private Limited", qx, ay); ay += 4;
  doc.text("Account Number: 777705029009", qx, ay); ay += 4;
  doc.text("Bank Name: ICICI Bank Ltd", qx, ay); ay += 4;
  doc.text("Branch: Shivajinagar, Pune IFSC Code: ICIC0000039", qx, ay);

  // --- 4. ITEM TABLE ---
  // Prepare Data
  const tank = TANK_OPTIONS.find(t => t.id === data.configuration.tank);
  const dispenser = data.configuration.dispensingUnit;
  
  // Add-ons string
  const addons: string[] = [];
  if (data.configuration.decantation.price > 0) addons.push(`Decantation: ${data.configuration.decantation.name}`);
  const allAccessories = [
    ...data.configuration.accessories.reposOs,
    ...data.configuration.accessories.mechanical,
    ...data.configuration.accessories.safetyUnits,
    ...data.configuration.accessories.safetyUpgrades
  ];
  allAccessories.forEach(acc => {
    if (acc.price > 0) addons.push(acc.name);
  });

  let desc = "Sale of Repos Portable Station\n";
  desc += `Model: Repos Portable Station Capacity : ${tank?.name || '22KL'} (HSD)\n`;
  desc += `Dispenser Type: Suction type (${dispenser.name}, ${dispenser.subtext})\n`;
  desc += `DU Make: Tokheim Branding : Only Logo as per Buyer\nRequirement\n`;
  if (addons.length > 0) {
    desc += "Paid Add-ons:\n" + addons.join(", ") + "\n";
  }

  const rate = data.totalContractValue || 0;
  const qty = 1;
  const amount = rate;

  // Tax Calc
  const isMah = custState.toLowerCase().includes('maharashtra');
  let cgst = 0, sgst = 0, igst = 0;
  if (isMah) {
    cgst = rate * 0.09;
    sgst = rate * 0.09;
  } else {
    igst = rate * 0.18;
  }
  const totalTax = cgst + sgst + igst;
  const grandTotal = rate + totalTax;

  // Table Body
  const bodyData = [
    ["1", desc, "84131191", "1", formatIndianCurrency(rate), "Nos", "0", formatIndianCurrency(amount)],
    // Empty row for spacing if needed, but autotable handles it.
    // Footer rows inside table logic:
    ["", "Packing & Forwarding Charges", "", "", "", "", "", "0"],
  ];

  if (isMah) {
    bodyData.push(["", "CGST @ 9% Output", "", "", "", "", "", formatIndianCurrency(cgst)]);
    bodyData.push(["", "SGST @ 9% Output", "", "", "", "", "", formatIndianCurrency(sgst)]);
  } else {
    bodyData.push(["", "IGST @ 18% Output", "", "", "", "", "", formatIndianCurrency(igst)]);
  }
  
  bodyData.push(["", "Round Off", "", "", "", "", "", "0"]);
  bodyData.push(["", "TCS 1%", "", "", "", "", "", "0"]);
  bodyData.push(["", "Total (INR)", "", "", "", "1 Nos", "", formatIndianCurrency(grandTotal)]);

  doc.autoTable({
    startY: gridBottomY,
    head: [["Sr", "Product Descriptions", "HSN/SAC", "Quantity", "Rate", "Per", "Disc. %", "Amount"]],
    body: bodyData,
    theme: 'grid',
    margin: { left: margin, right: margin },
    tableWidth: contentWidth,
    styles: {
      font: "helvetica",
      fontSize: 8,
      textColor: black,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      valign: 'top',
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: black,
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 80 }, 
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 12, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' },
      7: { cellWidth: 23, halign: 'right' },
    },
    didParseCell: function (data: any) {
      // Bold Total Row
      if (data.row.index === bodyData.length - 1) {
        data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY;

  // --- 5. AMOUNT WORDS ---
  // Draw a box for it? Reference just has text below.
  doc.setFont("helvetica", "bold");
  doc.text(`Amount (Words) - Rs. ${numberToWords(Math.round(grandTotal))} Only`, margin + 2, finalY + 6);
  finalY += 10;

  // --- 6. FOOTER SECTION (Terms & Signatory) ---
  // Box from finalY to bottom margin (leave 5mm)
  const footerHeight = 285 - finalY; 
  doc.rect(margin, finalY, contentWidth, footerHeight);
  
  // Vertical Divider
  const splitX = margin + (contentWidth * 0.65); // 65% for terms
  doc.line(splitX, finalY, splitX, 285);

  // Terms
  doc.setFontSize(7);
  doc.text("Terms of Delivery", margin + 2, finalY + 4);
  doc.setFont("helvetica", "normal");
  const terms = [
    "1. Any missuse, reaction,explosion or failure in procedure or in transit or",
    "   any loss, we are not responsible since it is buyers risk",
    "2. Goods once sold will not be taken back or replaced.",
    "3. Interest of 18% p.a. will be charged on any outstanding more than 30 days",
    "4. All Disputes Subject to Pune Jurisdiction only",
    "5. If any objection is to be made regarding this Invoice it should reach us",
    "   within 7 Days from the date of issue.",
    "6. Cheque return charges if any will be applicable at INR 500 per instance",
    "7. Payment Terms - 100% Advance",
    "8. Price - Ex. Works"
  ];
  let ty = finalY + 8;
  terms.forEach(t => {
    doc.text(t, margin + 2, ty);
    ty += 3.5;
  });

  // Signatory
  doc.setFont("helvetica", "bold");
  doc.text("For Repos Energy India Private Limited", splitX + 2, finalY + 4);
  
  doc.text("Authorised Signatory", splitX + 20, 285 - 5, { align: 'center' });

  doc.save(`RPS_Invoice_${invNo.replace(/\//g, '_')}.pdf`);
};
