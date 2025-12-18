
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
    data.customerDetails?.state || "",
    `Repos Representative: ${data.customerDetails?.salesperson || 'N/A'}`
  ];
  
  // Also show mobile/email if available
  if (data.customerDetails?.mobile) {
      addressLines.push(`Mob: ${data.customerDetails.mobile}`);
  }
  
  let addrY = yPos + 10;
  addressLines.forEach(line => {
    if (line) {
        doc.text(line, col1X + 2, addrY);
        addrY += 4;
    }
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
  
  const isInstallment = data.paymentMode === 'installments';
  const modeText = isInstallment ? 'Easy Installments (36 Months)' : 'Outright (Full Amount)';
  
  doc.setFont("helvetica", "normal");
  doc.text(`Payment Mode: ${modeText}`, col2X + 2, yPos + 10);

  if (isInstallment && data.monthlyPrice) {
      doc.setFont("helvetica", "bold");
      doc.text(`Monthly Payment: Rs. ${formatIndianCurrency(data.monthlyPrice)}`, col2X + 2, yPos + 15);
      doc.text(`Down Payment: Rs. ${formatIndianCurrency(data.gstAmount || 0)}`, col2X + 2, yPos + 20);
      doc.setFont("helvetica", "normal");
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
      productDesc += `Dispenser: Suction type (Single DU, 2 Nozzle 100 Tags)\n`;
  }
  
  productDesc += `DU Make: Tokheim Branding : Only Logo as per Buyer\nRequirement\n`;
  
  const addons: {name: string, price: number}[] = [];
  const collectAddons = (list: any[]) => {
      list.forEach(item => {
          if (item.price > 0) addons.push({name: item.name, price: item.price});
      });
  };

  collectAddons(data.configuration.accessories.reposOs);
  collectAddons(data.configuration.decantation);
  collectAddons(data.configuration.accessories.mechanical);
  collectAddons(data.configuration.accessories.safetyUnits);
  collectAddons(data.configuration.accessories.safetyUpgrades);
  
  if (addons.length > 0) {
    productDesc += "\nPAID ADD-ONS INCLUDED:\n";
    addons.forEach(addon => productDesc += `- ${addon.name} (Rs. ${formatIndianCurrency(addon.price)}/mo)\n`);
  }

  // Rate Calculation:
  const customerState = data.customerDetails?.state?.toLowerCase() || "";
  const isMaharashtra = customerState.includes("maharashtra");
  
  let columns = ["Sr", "Product Descriptions", "HSN/SAC", "Quantity", "Rate", "Per", "Amount"];
  let tableBody: any[] = [];
  let grandTotal = 0;
  let taxAmount = 0; // For Outright mode
  
  // Installment Mode Variables
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInstallment) {
      // Installment Mode Logic
      columns = ["Sr", "Product Descriptions", "HSN/SAC", "Quantity", "Rate", "Tenure", "Down Payment\n(GST Component)"];
      
      const rate = data.monthlyPrice || 0;
      const downPayment = data.gstAmount || 0;
      grandTotal = downPayment;

      // Tax breakdown for Footer (of the Down Payment amount)
      // Assuming Down Payment = Total GST. 
      // Breakdown logic: if Maharashtra, split 50/50. Else IGST.
      if (isMaharashtra) {
        cgstAmount = downPayment / 2;
        sgstAmount = downPayment / 2;
      } else {
        igstAmount = downPayment;
      }

      tableBody = [
        [
          "1",
          productDesc,
          "84131191",
          "1",
          formatIndianCurrency(rate),
          "36 Months",
          formatIndianCurrency(downPayment)
        ]
      ];
  } else {
      // Outright Mode Logic
      const rate = data.totalContractValue || 0;
      taxAmount = rate * 0.18;
      
      if (isMaharashtra) {
        cgstAmount = rate * 0.09;
        sgstAmount = rate * 0.09;
      } else {
        igstAmount = rate * 0.18;
      }

      grandTotal = rate + taxAmount;

      tableBody = [
        [
          "1",
          productDesc,
          "84131191",
          "1",
          formatIndianCurrency(rate),
          "Nos",
          formatIndianCurrency(rate)
        ]
      ];
  }

  const addFooterRow = (label: string, value: string) => {
    // 7 Columns
    tableBody.push(["", label, "", "", "", "", value]);
  };

  addFooterRow("Packing & Forwarding Charges", "0");
  
  if (isInstallment) {
      // For installments, the Amount column IS the tax component (Down Payment).
      // We don't add tax to it. We just show the total.
      // Optionally we could show the breakdown as info rows, but standard additive rows would be confusing.
      // Current implementation: Just show Total.
  } else {
      // For Outright, we add tax rows
      if (isMaharashtra) {
        addFooterRow("CGST @ 9% Output", formatIndianCurrency(cgstAmount));
        addFooterRow("SGST @ 9% Output", formatIndianCurrency(sgstAmount));
      } else {
        addFooterRow("IGST @ 18% Output", formatIndianCurrency(igstAmount));
      }
  }
  
  addFooterRow("Round Off", "0");
  addFooterRow("TCS 1%", "0");
  
  // Total Row
  tableBody.push(["", "Total (INR)", "", "", "", "1 Nos", formatIndianCurrency(grandTotal)]);

  doc.autoTable({
    startY: yPos,
    head: [columns],
    body: tableBody,
    theme: 'grid',
    // Removed tableWidth to allow auto-calculation based on margins and page width
    margin: { left: 10, right: 10 }, 
    styles: {
      font: "helvetica",
      fontSize: 7, 
      textColor: black,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      valign: 'top',
      cellPadding: 1.5,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: black,
      fontStyle: 'bold',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, 
      1: { cellWidth: 'auto' }, // Allow product description to fill available space
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' }, 
      5: { cellWidth: 25, halign: 'center' }, 
      6: { cellWidth: 40, halign: 'right' },  
    },
    didParseCell: function (data: any) {
      // Bold Total Row
      if (data.row.index === tableBody.length - 1) {
         data.cell.styles.fontStyle = 'bold';
      }
      // Bold 'PAID ADD-ONS' row
      if (data.section === 'body' && data.cell.text[0].includes('PAID ADD-ONS INCLUDED:')) {
          data.cell.styles.fontStyle = 'bold';
      }
    }
  });

  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`Amount (Words) - Rs. ${numberToWords(Math.round(grandTotal))} Only`, 10, finalY + 6);
  
  finalY += 10;

  const footerTop = finalY;
  
  // PAGE 1 Footer Container
  // Ensure we don't draw outside page bounds if content is long, but for invoice 1 page usually fits
  if (footerTop < 280) {
    doc.rect(5, footerTop, 200, 287 - footerTop - 5);
    doc.line(140, footerTop, 140, 287 - 5);

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("Note: Please refer to the attached Annexure for detailed", 7, footerTop + 10);
    doc.text("Terms and Conditions regarding this invoice.", 7, footerTop + 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("For Repos Energy India Private Limited", 142, footerTop + 5);
    doc.text("Authorised Signatory", 160, 287 - 10, { align: "center" });
  }

  // --- PAGE 2: TERMS AND CONDITIONS ---
  doc.addPage();
  doc.rect(5, 5, 200, 287); // Border for Page 2
  
  let tY = 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TERMS AND CONDITIONS (ANNEXURE)", 105, tY, { align: 'center' });
  doc.line(5, tY + 2, 205, tY + 2);
  
  tY += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  
  // Helper to add a point
  const addPoint = (title: string, content: string) => {
     doc.setFont("helvetica", "bold");
     doc.text(title, 10, tY);
     tY += 4;
     doc.setFont("helvetica", "normal");
     const splitText = doc.splitTextToSize(content, 185);
     doc.text(splitText, 10, tY);
     tY += (splitText.length * 4) + 2;
     
     // Page break check (simple)
     if (tY > 270) {
         doc.addPage();
         doc.rect(5, 5, 200, 287);
         tY = 20;
     }
  };

  addPoint("1. INTRODUCTION", 'These Terms and Conditions ("Agreement") govern the purchase, ownership, and operation of the Portable Fuel Station (RPS) supplied by Repos Energy India Private Limited ("Repos" or "Company") in compliance with Petroleum and Explosives Safety Organization (PESO) standards. By purchasing or operating the RPS, the Customer agrees to adhere to these terms.');
  
  addPoint("2. DEFINITIONS", '• Company: Repos Energy India Private Limited\n• Customer: The entity or individual purchasing the RPS.\n• RPS: Repos Portable Station, including all components supplied by Repos.\n• PESO: Petroleum and Explosives Safety Organization, the regulatory body for fuel storage and dispensing safety in India.\n• OMCs: Oil Marketing Companies supplying fuel to the Customer.\n• "Applicable laws": means all laws, regulations, rules including but not limited to PESO, MSHSD, MoPNG, Petroleum Act, and any other which are applicable to the Customer.');

  addPoint("3. ELIGIBILITY AND COMPLIANCE", '• The Customer must be an entity or individual legally permitted to store and dispense fuel as per PESO regulations.\n• The Customer must obtain all necessary licenses, permits, and approvals from PESO and other regulatory authorities before commissioning the RPS.\n• The RPS must be installed and operated in accordance with PESO guidelines and any other applicable local/state regulations.');

  addPoint("4. DELIVERY TERMS, PURCHASE, INSTALLATION, AND COMMISSIONING", '• The delivery of RPS will be within twelve (12) weeks from the date of PESO prior approval date.\n• The Customer must make full payment or enter into an agreed financing arrangement before delivery of the RPS.\n• Repos will supply and install the RPS at the Customer\'s designated site, subject to regulatory approvals and costs for such transportation & installation.\n• Title of the RPS transfers to the Customer upon delivery at Customer\'s site. No return or replacement will be accepted once the title of the product has been transferred.\n• The commissioning of the RPS will be conducted jointly by Repos and the Customer after compliance verification with PESO guidelines.\n• Any modifications or relocations of the RPS require prior written approval from Repos and relevant authorities.');

  addPoint("5. FUEL SUPPLY & SOURCING", '• The Customer may procure fuel either directly from OMCs or through an arrangement facilitated by Repos.\n• If the Customer opts for Repos-facilitated fuel procurement, the pricing, delivery schedules, and payment terms will be as per a separate agreement.\n• The Customer is responsible for ensuring that fuel sourcing and storage comply with all safety and environmental regulations and ensure the product quality.');

  addPoint("6. OWNERSHIP AND USAGE RIGHTS", '• The Customer retains ownership of the RPS upon full payment.\n• The Customer assumes full responsibility for proper use, storage, and handling of the product.\n• The RPS must not be used for any resale of fuel, unauthorized, or non-PESO-approved activities.\n• Any modification to the RPS without written consent from the Company or any tampering with the tracking system or dispensing unit will void the warranty.\n• The product is to be used solely for the internal business use of storage and/or dispensing of High Speed Diesel (HSD). Any usage of the product for substances other than HSD will automatically void the warranty.');

  addPoint("7. SAFETY AND LIABILITY", '• The Customer shall ensure that all safety measures, including fire suppression systems, emergency response protocols, and trained personnel, are in place as per PESO norms.\n• Repos shall not be liable for accidents, environmental hazards, or losses arising from non-compliance with safety protocols by the Customer.\n• The Customer shall obtain insurance coverage for fire, theft, liability, and any other applicable risks.');

  addPoint("8. WARRANTY AND SUPPORT", '• Repos provides a standard warranty for the RPS covering manufacturing defects for a period of 12 months from the date of commissioning.\n• The warranty does not cover damages due to water, fire, mishandling, unauthorized repairs, or force majeure events.\n• Post-warranty service shall be available at an additional cost as per the AMC terms.');

  // Point 9: PAYMENT TERMS & SCHEDULE with TABLE
  doc.setFont("helvetica", "bold");
  doc.text("9. PAYMENT TERMS & SCHEDULE", 10, tY);
  tY += 4;
  doc.setFont("helvetica", "normal");
  doc.text("• Payment must be made on advance basis or on agreed financial terms as per the agreed schedule.", 10, tY);
  tY += 4;
  doc.text("• Payment Schedule:", 10, tY);
  tY += 2;

  // Embedded AutoTable for Payment Schedule
  doc.autoTable({
      startY: tY,
      head: [["Payment Schedule", "Amount (Per RPS)"]],
      body: [
          ["Prior Approval Application", "INR 5,00,000/-"],
          ["Start of Manufacturing", "INR 18,00,000/-"],
          ["Before Dispatch", "Balance Amount"]
      ],
      theme: 'grid',
      tableWidth: 120,
      margin: { left: 15 },
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [220, 220, 220], textColor: black, fontStyle: 'bold' }
  });
  
  // @ts-ignore
  tY = doc.lastAutoTable.finalY + 8; // Resume text after table

  addPoint("10. TERMINATION & BREACH", '• Repos reserves the right to terminate the agreement if the Customer fails to comply with PESO regulations, payment terms, or safety protocols.\n• Upon termination, the Customer must cease operations and return/relinquish the RPS as per Repos\' instructions if the product is in their possession.\n• The Customer may terminate the agreement by providing a 60-day written notice, subject to fulfilment of all financial obligations and bearing the loss due to order cancellation.\n• In case of cancellation, prior approval application amount is non-refundable.');

  addPoint("11. FORCE MAJEURE", '• Repos shall not be held liable for any delays, disruptions, or failures in performance due to events beyond reasonable control, including natural disasters, government restrictions, strikes, or supply chain disruptions.');

  addPoint("12. DISPUTE RESOLUTION", '• Any disputes arising under this agreement shall be resolved through mutual discussions.\n• If disputes remain unresolved, they shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, with jurisdiction in Pune, Maharashtra.');

  addPoint("13. GOVERNING LAW", '• This Agreement shall be governed by and interpreted under the laws of India.');

  addPoint("14. MISCELLANEOUS", '• No amendment to these terms shall be valid unless agreed upon in writing by both parties.\n• Any notices under this agreement shall be communicated via registered mail or email.\n• By purchasing or operating a RPS from Repos, the Customer acknowledges that they have read, understood, and agreed to these Terms and Conditions.');

  doc.save(`${invoiceNo}.pdf`);
};
