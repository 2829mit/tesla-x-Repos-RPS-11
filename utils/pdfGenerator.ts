import { TANK_OPTIONS } from '../constants';
import { QuoteData } from '../types';

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
    alert("PDF library not loaded yet. Please check your connection.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const logoUrl = "https://i.postimg.cc/52fvQyLD/Repos-New-Logo-V1-1.png";
  let logoBase64 = "";
  try {
    logoBase64 = await getBase64ImageFromURL(logoUrl);
  } catch (e) {
    console.error(e);
  }

  const black = "#000000";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(black);

  doc.rect(5, 5, 200, 287); // Main border

  // --- HEADER ---
  let yPos = 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("PROFORMA INVOICE", 105, yPos, { align: "center" });
  doc.line(5, yPos + 2, 205, yPos + 2); 

  yPos += 8;
  
  doc.setFontSize(10);
  doc.text("Repos Energy India Private Limited", 105, yPos, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  yPos += 5;
  doc.text("FL No. 301, Bhuvaneshwari Apartment, Plot No. 1, S.NO. 108/1B, Aundh,", 105, yPos, { align: "center" });
  yPos += 5;
  doc.text("Pune - 411007, Maharashtra", 105, yPos, { align: "center" });
  yPos += 5;
  doc.text("GSTIN/UIN: 27AAICR3322D1ZO, CIN: U74999PN2017PTC170768, PAN No.: AAICR3322D", 105, yPos, { align: "center" });
  yPos += 5;
  doc.text("Contact : 8669990062 E-Mail : rajesh.jadhav@reposenergy.com www.reposenergy.com", 105, yPos, { align: "center" });

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', 160, 8, 35, 10);
  }

  yPos += 8;
  doc.line(5, yPos, 205, yPos);

  // --- GRID SECTION ---
  const sectionTop = yPos;
  const col1X = 5;
  const col2X = 105; 
  const rowHeight = 35;
  
  doc.line(105, sectionTop, 105, sectionTop + (rowHeight * 2));
  doc.line(105, sectionTop + rowHeight, 205, sectionTop + rowHeight);
  doc.line(5, sectionTop + (rowHeight * 2), 205, sectionTop + (rowHeight * 2));

  // Bill To
  yPos = sectionTop + 5;
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", col1X + 2, yPos);
  doc.setFont("helvetica", "normal");
  
  const custName = data.customerDetails?.company || data.customerDetails?.name || "Customer Name";
  doc.text(custName.toUpperCase(), col1X + 2, yPos + 5);
  
  const addressLines = [
    "2nd Floor, Door No. 360/1, Near old Ganesh gas Godown",
    "Bharathi Nagar, Amaravathi, Hospet, Ballari,",
    `${data.customerDetails?.state || "Karnataka"} - 583201`,
    "GST No. 29AAGCC5056M2Z6",
    `Salesperson: ${data.customerDetails?.salesperson || 'N/A'}`
  ];
  
  // Also show mobile/email if available
  if (data.customerDetails?.mobile) {
      addressLines.push(`Mob: ${data.customerDetails.mobile}`);
  }
  
  let addrY = yPos + 10;
  addressLines.forEach(line => {
    doc.text(line, col1X + 2, addrY);
    addrY += 4;
  });

  // Invoice Details
  const tank = TANK_OPTIONS.find(t => t.id === data.configuration.tank);
  const capacity = tank ? tank.name : '22KL';
  
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
  const serial = String(Date.now()).slice(-4);
  
  const invoiceNo = `REIPL_RPS_${capacity}_${dateStr}_${serial}`;
  const invoiceDate = now.toLocaleDateString('en-GB');
  
  yPos = sectionTop + 5;
  doc.setFont("helvetica", "bold");
  doc.text(`Proforma Invoice No. - ${invoiceNo}`, col2X + 2, yPos);
  doc.text(`Dated- ${invoiceDate}`, col2X + 2, yPos + 5);
  
  const modeText = data.paymentMode === 'installments' ? 'Easy Installments (36 Months)' : 'Outright (Full Amount)';
  doc.setFont("helvetica", "normal");
  doc.text(`Payment Mode: ${modeText}`, col2X + 2, yPos + 10);

  if (data.paymentMode === 'installments' && data.monthlyPrice) {
      doc.text(`Monthly Payment: Rs. ${formatIndianCurrency(data.monthlyPrice)}`, col2X + 2, yPos + 15);
      doc.text(`Down Payment: Rs. ${formatIndianCurrency(data.gstAmount || 0)}`, col2X + 2, yPos + 20);
  }

  // Repos Account
  yPos = sectionTop + rowHeight + 5;
  doc.setFont("helvetica", "bold");
  doc.text("Repos Account Details", col2X + 2, yPos);
  doc.setFont("helvetica", "normal");
  yPos += 5;
  doc.text("Name of the Beneficiary - Repos Energy India Private Limited", col2X + 2, yPos);
  yPos += 5;
  doc.text("Account Number: 777705029009", col2X + 2, yPos);
  yPos += 5;
  doc.text("Bank Name: ICICI Bank Ltd", col2X + 2, yPos);
  yPos += 5;
  doc.text("Branch: Shivajinagar, Pune IFSC Code: ICIC0000039", col2X + 2, yPos);

  yPos = sectionTop + (rowHeight * 2);

  // --- TABLE ---
  
  let productDesc = "Sale of Repos Portable Station\n";
  productDesc += `Model: Repos Portable Station Capacity : ${tank?.name || '22KL'} (HSD)\n`;
  
  // List Selected Dispensing Units
  const duList = data.configuration.dispensingUnits;
  if (duList && duList.length > 0) {
      duList.forEach(du => {
          productDesc += `Dispenser: Suction type (${du.name}, ${du.subtext})\n`;
      });
  } else {
      // Fallback to Standard Single DU Text to ensure Invoice remains correct even if selection is cleared
      productDesc += `Dispenser: Suction type (Single DU, 2 Nozzle 100 Tags)\n`;
  }
  
  productDesc += `DU Make: Tokheim Branding : Only Logo as per Buyer\nRequirement\n`;
  
  const addons: string[] = [];
  data.configuration.accessories.reposOs.forEach(acc => { if (acc.price > 0) addons.push(acc.name); });
  
  // Handle decantation logic (if null, assume standard basic skid)
  if (data.configuration.decantation && data.configuration.decantation.price > 0) {
      addons.push(`Decantation: ${data.configuration.decantation.name}`);
  }
  
  data.configuration.accessories.mechanical.forEach(acc => { if (acc.price > 0) addons.push(acc.name); });
  data.configuration.accessories.safetyUnits.forEach(acc => { if (acc.price > 0) addons.push(acc.name); });
  data.configuration.accessories.safetyUpgrades.forEach(acc => { if (acc.price > 0) addons.push(acc.name); });
  
  if (addons.length > 0) {
    productDesc += "\nPAID ADD-ONS INCLUDED:\n";
    addons.forEach(addon => productDesc += `- ${addon}\n`);
  }

  // Rate Calculation:
  const rate = data.totalContractValue || 0;
  const amount = rate;

  const customerState = data.customerDetails?.state?.toLowerCase() || "";
  const isMaharashtra = customerState.includes("maharashtra");
  
  const gstRate = 0.18;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isMaharashtra) {
    cgstAmount = rate * 0.09;
    sgstAmount = rate * 0.09;
  } else {
    igstAmount = rate * gstRate;
  }

  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = rate + totalTax;

  const tableBody = [
    [
      "1",
      productDesc,
      "84131191",
      "1",
      formatIndianCurrency(rate),
      "Nos",
      "0",
      formatIndianCurrency(amount)
    ]
  ];

  const addFooterRow = (label: string, value: string) => {
    tableBody.push(["", label, "", "", "", "", "", value]);
  };

  addFooterRow("Packing & Forwarding Charges", "0");
  
  if (isMaharashtra) {
    addFooterRow("CGST @ 9% Output", formatIndianCurrency(cgstAmount));
    addFooterRow("SGST @ 9% Output", formatIndianCurrency(sgstAmount));
  } else {
    addFooterRow("IGST @ 18% Output", formatIndianCurrency(igstAmount));
  }
  
  addFooterRow("Round Off", "0");
  addFooterRow("TCS 1%", "0");
  
  tableBody.push(["", "Total (INR)", "", "", "", "1 Nos", "", formatIndianCurrency(grandTotal)]);

  doc.autoTable({
    startY: yPos,
    head: [["Sr", "Product Descriptions", "HSN/SAC", "Quantity", "Rate", "Per", "Disc. %", "Amount"]],
    body: tableBody,
    theme: 'grid',
    margin: { left: 7, right: 7 }, // Fix: Explicit margins to handle content overflow
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
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' }, 
      1: { cellWidth: 80 }, // Adjusted slightly to fit with margins
      2: { cellWidth: 18, halign: 'center' },
      3: { cellWidth: 12, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 10, halign: 'center' },
      6: { cellWidth: 12, halign: 'center' },
      7: { cellWidth: 25, halign: 'right' },
    },
    didParseCell: function (data: any) {
      // Bold Total Row
      if (data.row.index === tableBody.length - 1) {
         data.cell.styles.fontStyle = 'bold';
      }
      // Bold 'PAID ADD-ONS' row
      if (data.section === 'body' && data.cell.text[0] === 'PAID ADD-ONS INCLUDED:') {
          data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY;

  doc.setFont("helvetica", "bold");
  doc.text(`Amount (Words) - Rs. ${numberToWords(Math.round(grandTotal))} Only`, 7, finalY + 6);
  
  finalY += 10;

  const footerTop = finalY;
  
  doc.rect(5, footerTop, 200, 287 - footerTop - 5);
  doc.line(140, footerTop, 140, 287 - 5);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Terms of Delivery", 7, footerTop + 5);
  doc.setFont("helvetica", "normal");
  
  const paymentTerm = data.paymentMode === 'installments' 
    ? '7. Payment Terms - Down Payment (GST) Advance, Balance in 36 Months' 
    : '7. Payment Terms - 100% Advance';

  const terms = [
    "1. Any missuse, reaction,explosion or failure in procedure or in transit or",
    "   any loss, we are not responsible since it is buyers risk",
    "2. Goods once sold will not be taken back or replaced.",
    "3. Interest of 18% p.a. will be charged on any outstanding more than 30 days",
    "4. All Disputes Subject to Pune Jurisdiction only",
    "5. If any objection is to be made regarding this Invoice it should reach us",
    "   within 7 Days from the date of issue.",
    "6. Cheque return charges if any will be applicable at INR 500 per instance",
    paymentTerm,
    "8. Price - Ex. Works"
  ];
  
  let termY = footerTop + 10;
  terms.forEach(term => {
    doc.text(term, 7, termY);
    termY += 4;
  });

  doc.setFont("helvetica", "bold");
  doc.text("For Repos Energy India Private Limited", 142, footerTop + 5);
  doc.text("Authorised Signatory", 160, 287 - 10, { align: "center" });

  doc.save(`${invoiceNo}.pdf`);
};