import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autoTable plugin
import invoice from '../Image/invoice1.jpeg';
import footerinvoice from '../Image/footerinvoice.jpeg'
import logo from './logo.png';
import whatsappicon from './wht.jpg'
import inboxicon from './inbox1.jpg';

const numberToWords = (num) => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const powersOfTen = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

  const convert = (num) => {
    if (num < 10) return units[num];
    else if (num < 20) return teens[num - 11];
    else if (num < 100) {
      const ten = tens[Math.floor(num / 10)];
      const unit = units[num % 10];
      return ten + (unit ? ' ' + unit : ''); // Handle cases where the tens position is zero
    }
    else if (num < 1000) {
      const hundred = units[Math.floor(num / 100)] + ' Hundred';
      const rest = convert(num % 100);
      return rest ? hundred + ' ' + rest : hundred;
    }
    else {
      for (let i = 0; i < powersOfTen.length; i++) {
        const base = Math.pow(10, 3 * (i + 1));
        if (num < base) {
          const divisor = Math.pow(10, 3 * i);
          const quotient = Math.floor(num / divisor);
          const remainder = num % divisor;
          const hundreds = convert(quotient);
          const suffix = powersOfTen[i];
          return hundreds + ' ' + suffix + (remainder ? ' ' + convert(remainder) : '');
        }
      }
    }
  };

  const wholePart = Math.floor(num);
  const decimalPart = Math.round((num - wholePart) * 100); // Assuming up to two decimal places

  let result = '';

  if (wholePart > 0) {
    result += convert(wholePart) + ' Dirham';
  }

  if (decimalPart > 0) {
    if (result !== '') result += ' ';
    result += convert(decimalPart) + ' Fils';
  }

  return result;
};
  const handleUploadPDF = async (formData) => {
    try {
      // Send a POST request to your backend API to upload the PDF
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/addInvoice`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }

      console.log('PDF uploaded successfully');
    } catch (error) {
      console.error('Error uploading PDF:', error.message);
    }
  };



//   const handlePrint = (intent) => {
//     // Create a new jsPDF instance
//     const pdf = new jsPDF();

//     // Add background image
//     pdf.addImage(invoice, 'JPEG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

//     // Set font size and style for the entire document
//     pdf.setFontSize(8);
//     pdf.setFont('times', 'normal');

//     // Set line width for creating padding
//     pdf.setLineWidth(1);

//     // Display invoice details in two columns (Bill To and Ship To)

//     const last4Digits = intent?.orderId;
//     pdf.text(`Invoice No: OID ${last4Digits}`, 20, 40);

//     pdf.text('Date: ' + new Date().toLocaleDateString(), 20, 45);

//     // Bill To
//     pdf.text('Bill To:', 20, 55);
//     pdf.text(`Name: ${intent?.user?.name}`, 20, 60);
//     pdf.text(`Phone: ${intent?.checkoutData?.phone}`, 20, 65);

//     // Ship To
//     pdf.text('Ship To:', pdf.internal.pageSize.width / 2, 55);
//     pdf.text(`Name: ${intent?.user?.name}`, pdf.internal.pageSize.width / 2, 60);
//     pdf.text(`Address: ${intent?.checkoutData?.country}, ${intent?.checkoutData?.state}, ${intent?.checkoutData?.city}, ${intent?.checkoutData?.houseNumber}`, pdf.internal.pageSize.width / 2, 65);
//     pdf.text(`${intent?.checkoutData?.landmark}`, pdf.internal.pageSize.width / 2, 70);
//     pdf.text(`Phone: ${intent?.checkoutData?.phone}`, pdf.internal.pageSize.width / 2, 75);
//     pdf.setDrawColor(144, 238, 144);
//     pdf.line(20, 84, pdf.internal.pageSize.width - 20, 84);
//     let Gamount = 0;
//     let spay = 0;

//     const Final = intent.total || 0;

//     const shippingfee = intent.shipping_fee || 0;

//     const coin = intent?.coinsData?.value || '';

//     const type = intent?.couponData?.type || '';
//     let discountperc = 0;
//     let discountflat = 0;

//     if (type === 'Flat') {
//       discountflat = Number(intent?.couponData?.value) || 0;
//     } else if (type === 'Percentage') {
//       discountperc = Number(intent?.couponData?.value) || 0;
//     } else {
//       discountflat = Number(intent?.coinsData?.value) || 0;
//     }

//     let finalAmount = 0;

//     let startY = 95; // Initial start position for table
//     let remainingHeight = pdf.internal.pageSize.height - startY - 100; // Remaining height for table

//     if (intent?.updatedCartItems && intent.updatedCartItems.length > 0) {
//       // Draw a line for padding
//       pdf.setDrawColor(144, 238, 144); // Light green color

//       const tableDataChunks = chunkArray(intent.updatedCartItems, 4); // Split the table data into chunks of 4 rows each

//      let totalAmount = 0; 
//      // Initialize totalAmount variable outside the loop
//      tableDataChunks.forEach((chunk, chunkIndex) => {
//       const tableData = chunk.map((product, index) => {
//           // Calculate continuous index based on chunk number and index within chunk
//           const continuousIndex = chunkIndex * 4 + index + 1;
  
//           const quantity = product.amount || 0;
//           let title = '';
  
//           if (product.flashSalePrice !== undefined) {
//               title = product.title + '(Flash Sale)' || '';
//           } else {
//               title = product.title || '';
//           }
  
//           // const productPrice = product.flashSalePrice || product.dimension.Price || 0;
  
//           let productPrice = 0;
//           if (product.flashSalePrice !== undefined) {
//             productPrice = product.flashSalePrice
//         } else {
//           productPrice = product.dimension.Price
//         }
  
//           const Value1 = product.dimension?.Value1 || '';
//           const Value2 = product.dimension?.Value2 || '';
  
//           const dimensions = `${Value1},${Value2}`;
  
//           // Calculate the total amount based on flash sale or regular price, including GiftWrap
//           let total = product.flashSalePrice !== undefined
//               ? quantity * product.flashSalePrice
//               : quantity * productPrice;
  
//           // Add GiftWrap amount to the total (multiplied by quantity)
//           const GiftWrap = product.GiftWrap ? 20 * quantity : 0;
//           total += GiftWrap;
  
//           return [
//               continuousIndex,    // SL No
//               title,        // Product Name
//               quantity,     // Quantity
//               dimensions,   // Dimensions
//               productPrice, // Product Price
//               GiftWrap,     // GiftWrap Amount
//               total,        // Total
//           ];
//       });
  
//       // Calculate total amount for the current chunk
//       const chunkTotal = tableData.reduce((total, row) => total + row[6], 0);
      
//       // Accumulate total amount for all chunks
//       totalAmount += chunkTotal;
//   Gamount=totalAmount
//       // Add table to the PDF (remaining code remains the same)
//       pdf.autoTable({
//           head: [['SL No', 'Product Name', 'Quantity', 'Dimensions', 'Product Price', 'GiftWrap', 'Total']],
//           body: tableData,
//           startY, // Add padding to the top
//           styles: {
//               cellPadding: 5,
//               textColor: [0, 0, 0], // Text color (black)
//               lineColor: [0, 0, 0], // Line color (black)
//               fillColor: [220, 220, 220], // Fill color (light gray)
//           },
//       });
  
//       // Calculate the height used by the table
//       const tableHeight = pdf.previousAutoTable.finalY - startY;
  
//       // If the table doesn't fit on the page, add a new page
//       if (tableHeight > remainingHeight && chunkIndex !== tableDataChunks.length - 1) {
//           pdf.addPage();
//           startY = 40; // Reset startY for the new page
//       } else {
//           startY += tableHeight; // Update startY for the remaining height
//       }
//   });
  

// // Now you have the totalAmount variable containing the grand total for all products across all pages

//     }

//     // Draw a line for padding
//     pdf.setDrawColor(144, 238, 144); // Light green color
//     pdf.line(20, 203, pdf.internal.pageSize.width - 20, 203);

//     // Add a column for Subtotal, VAT, Total
//     pdf.text('Subtotal', pdf.internal.pageSize.width / 2, 213, { align: 'right' });
//     pdf.text('Shipping Fee', pdf.internal.pageSize.width / 2, 218, { align: 'right' });
//     pdf.text('Total', pdf.internal.pageSize.width / 2, 223, { align: 'right' });
//     pdf.text('After Discount', pdf.internal.pageSize.width / 2, 233, { align: 'right' });
//     pdf.text('Discount', pdf.internal.pageSize.width / 2, 227, { align: 'right' });
//     pdf.setTextColor(0, 0, 0); // Reset text color to black

//     const subtotal = 100;
//     const vatp = 5;// Replace with actual subtotal value
//     const vat = (Gamount * 5) / 100; // Replace with actual VAT value
//     const grandTotalF = Gamount + shippingfee; // Replace with actual total value
//     const finalt = Final + vat
//     pdf.text(`AED ${Gamount}`, pdf.internal.pageSize.width - 20, 213, { align: 'right' });
//     pdf.text(`${shippingfee}`, pdf.internal.pageSize.width - 20, 218, { align: 'right' });
//     pdf.text(`AED ${grandTotalF}`, pdf.internal.pageSize.width - 20, 223, { align: 'right' });
//     const discountText = discountperc !== 0
//       ? `${discountperc} %`
//       : discountflat !== 0
//         ? `AED ${discountflat}`
//         : 'AED 0';

//     pdf.text(discountText, pdf.internal.pageSize.width - 20, 227, { align: 'right' });
//     pdf.text(`AED ${Final}`, pdf.internal.pageSize.width - 20, 233, { align: 'right' });
//     // Display the total amount in words
//     pdf.setFont('times', 'bolditalic');
//     pdf.setFontSize(10);
//     pdf.setTextColor(0, 0, 139);
//     pdf.text('Amount in Words:', pdf.internal.pageSize.width / 2, 238, { align: 'right' });
//     pdf.text('AED ' + numberToWords(Final) + ' only', pdf.internal.pageSize.width - 20, 243, { align: 'right' });
//     // Draw a line for padding
//     pdf.setDrawColor(144, 238, 144); // Light green color
//     pdf.line(20, 247, pdf.internal.pageSize.width - 20, 247);
//     // Draw a line for padding
//     pdf.setDrawColor(144, 238, 144); // Light green color

//     // // Payment details
//     // pdf.text('Payment Details', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 50, { align: 'right' });
//     // pdf.setFont('times', 'normal');
//     // pdf.setFontSize(10);
//     // pdf.setTextColor(0, 0, 139); // Dark blue color
//     // pdf.text('Payment Method: Credit Card', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 45, { align: 'right' });
//     // pdf.text('Total Amount Paid: 1000 AED', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 40, { align: 'right' });
//     // pdf.text('Payment Date: 2024-02-22', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 35, { align: 'right' });

//     const footerWidth = pdf.internal.pageSize.width - 15; // Adjust the width of the footer image as needed
//     const footerHeight = 20; // Adjust the height of the footer image as needed
//     const footerX = (pdf.internal.pageSize.width - footerWidth) / 2; // Center the image horizontally
//     const footerY = pdf.internal.pageSize.height - 30 + 5; // Place the image just below the IBAN text with some padding
//     pdf.addImage(footerinvoice, 'JPEG', footerX, footerY, footerWidth, footerHeight);
//     // Save or open the PDF
//     const pdfName = `invoice_${last4Digits}.pdf`; // e.g., invoice_1234.pdf
//     pdf.save(pdfName);
    
//     const blob = pdf.output('blob');
//     const formData = new FormData();
//     formData.append('Invoice', blob, pdfName);
//     formData.append('OrderId', last4Digits); // Append the Order ID

//     // Call the async function to upload the PDF
//     handleUploadPDF(formData);
// };

// Function to split array into chunks



const handlePrint = (intent) => {
  const doc = new jsPDF();
  
  // Set font style to Times, bold, and reduce font size
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);

  // Add the logo to the calculated position
  doc.addImage(logo, 'PNG', 11, 11, 49, 9);

  // Add the text at the top left corner
  const companyName = "HIFAA FLOWERS & ORNAMENTAL";
  const company = "PLANTS TRADING CO LLC";
  const address = "Dubai - UAE";
  const trn = ""; // Replace "Your TRN Here" with the actual TRN
  const text = `${companyName}\n${company}\n${address}\n${trn}`;
  doc.text(text, 17, 25);

  // Calculate the height of the text block
  const textHeight = doc.getTextDimensions(text).h;

  // Add the centered "Invoice" text at the top
  const invoiceText = "INVOICE";
  const pageWidth = doc.internal.pageSize.getWidth();
  const invoiceTextWidth = doc.getTextWidth(invoiceText);
  const invoiceTextX = (pageWidth - invoiceTextWidth) / 2;
  const invoiceTextY = 32 + textHeight + 10; // 10 units padding
 

  // Add email and phone number text at the right topmost corner
  const contactInfoX = pageWidth - 40; // Adjust the X-coordinate as needed
  const contactInfoY = 21; // Adjust the Y-coordinate as needed
  doc.setFont("helvetica");

  doc.text("Info@myplantstore.me", contactInfoX, contactInfoY+.8);
  doc.text("+971 52 7349 456", contactInfoX, contactInfoY + 6.5); // Adjust the Y-coordinate as needed

 
   // Provide the path to the mail icon image
  doc.addImage(inboxicon, 'JPG', contactInfoX - 6, contactInfoY - 2, 5, 5);
  doc.addImage(whatsappicon, 'JPG', contactInfoX - 6, contactInfoY + 3, 4, 4);

  doc.setFontSize(25);
  doc.setTextColor(5, 58, 173);
  doc.text(invoiceText, invoiceTextX-10, invoiceTextY-5);

  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  const deliveryLocation=intent?.deliveryLocation
  const customerName=intent?.user?.name
  const landmark=intent?.checkoutData?.landmark
  const billTo=`${customerName}\n${deliveryLocation}`
  const cCountry=intent?.checkoutData?.country
  const cState=intent?.checkoutData?.state
  const CCity=intent?.checkoutData?.city
  const HNo=intent?.checkoutData?.houseNumber
  const CPhone=intent?.checkoutData?.phone

  const Address1=`${cCountry},${cState},`
  const Address2=`${landmark},`
  const Address3=`${CCity},${HNo}`
  const ShippingTo=`${customerName}\n${CPhone}\n${deliveryLocation}\n${Address1}\n${Address2}\n${Address3}`


  
const customerNametWidth = doc.getTextWidth(customerName);
let lastInvoiceNumber = 0;



doc.text('Invoice No.', 14, 51);

doc.text('Date', 54, 51);

doc.text('Bill to:', 94, 51);

doc.text('Ship to:', customerNametWidth+118, 51);

doc.text('Order ID.', 14, 73);


doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
const id=intent?._id;
const lastFiveCharacters = id.substring(id.length - 5);

const last4Digits = intent?.orderId;
doc.text(`Inv-${lastFiveCharacters}`, 14, 57);
doc.text(new Date().toLocaleDateString(), 54, 57);
doc.text(`${billTo}`, 94, 57);
doc.text(`${ShippingTo}`, customerNametWidth+118, 57);
doc.text(`${last4Digits}`, 14, 79);

doc.setDrawColor(144, 238, 144);
doc.line(14, 85, doc.internal.pageSize.width - 20, 85);


let Gamount = 0;
  let spay = 0;

  const Final = intent.total || 0;

  const shippingfee = intent.shipping_fee || 0;

  const coin = intent?.coinsData?.value || '';

  const type = intent?.couponData?.type || '';
  let discountperc = 0;
  let discountflat = 0;

  if (type === 'Flat') {
    discountflat = Number(intent?.couponData?.value) || 0;
  } else if (type === 'Percentage') {
    discountperc = Number(intent?.couponData?.value) || 0;
  } else {
    discountflat = Number(intent?.coinsData?.value) || 0;
  }

  let finalAmount = 0;

  let startY = 95; // Initial start position for table
  let remainingHeight = doc.internal.pageSize.height - startY - 100; // Remaining height for table

  if (intent?.updatedCartItems && intent.updatedCartItems.length > 0) {
    // Draw a line for padding
    doc.setDrawColor(144, 238, 144); // Light green color

    const tableDataChunks = chunkArray(intent.updatedCartItems, 6); // Split the table data into chunks of 4 rows each

   let totalAmount = 0; 
   // Initialize totalAmount variable outside the loop
   tableDataChunks.forEach((chunk, chunkIndex) => {
    const tableData = chunk.map((product, index) => {
        // Calculate continuous index based on chunk number and index within chunk
        const continuousIndex = chunkIndex * 6 + index + 1;

        const quantity = product.amount || 0;
        let title = '';

        if (product.flashSalePrice !== undefined) {
            title = product.title + '(Flash Sale)' || '';
        } else {
            title = product.title || '';
        }

        // const productPrice = product.flashSalePrice || product.dimension.Price || 0;

        let productPrice = 0;
        if (product.flashSalePrice !== undefined) {
          productPrice = product.flashSalePrice
      } else {
        productPrice = product.dimension.Price
      }

        const Value1 = product.dimension?.Value1 || '';
        const Value2 = product.dimension?.Value2 || '';

        const dimensions = `${Value1},${Value2}`;

        const TitleD=`${title}\n${dimensions}`
        // Calculate the total amount based on flash sale or regular price, including GiftWrap
        let total = product.flashSalePrice !== undefined
            ? quantity * product.flashSalePrice
            : quantity * productPrice;

        // Add GiftWrap amount to the total (multiplied by quantity)
        const GiftWrap = product.GiftWrap ? 20 * quantity : 0;
        total += GiftWrap;

        return [
            continuousIndex,    // SL No
            TitleD,        // Product Name
            quantity,     // Quantity
            // Dimensions
            productPrice, // Product Price
                // GiftWrap Amount
            total,        // Total
        ];
    });

    // Calculate total amount for the current chunk
    const chunkTotal = tableData.reduce((total, row) => total + row[4], 0);
    
    // Accumulate total amount for all chunks
    totalAmount += chunkTotal;
Gamount=totalAmount
    // Add table to the PDF (remaining code remains the same)
    doc.autoTable({
      head: [['SL No', 'ITEM DESCRIPTION', 'QTY', 'RATE (AED)', 'TOTAL (AED)']],
      body: tableData,
      startY, // Add padding to the top
      styles: {
        cellPadding: 5,
        textColor: [0, 0, 0], // Text color (black)
        lineColor: [0, 0, 0], // Line color (black)
        // fillColor: [220, 220, 220], // Fill color (light gray)
      },
      headStyles: {
        fillColor: [255, 255, 255], // White background color for column headers
        textColor: [0, 0, 0] // Text color for column headers (black)
      },
      alternateRowStyles: { fillColor: [255, 255, 255] } // White background color for alternate rows
    });
    

    // Calculate the height used by the table
    const tableHeight = doc.previousAutoTable.finalY - startY;

    // If the table doesn't fit on the page, add a new page
    if (tableHeight > remainingHeight && chunkIndex !== tableDataChunks.length - 1) {
        doc.addPage();
        startY = 40; // Reset startY for the new page
    } else {
        startY += tableHeight; // Update startY for the remaining height
    }
});


// Now you have the totalAmount variable containing the grand total for all products across all pages

  }




 // Draw a line for padding
 doc.setDrawColor(0); // Light green color
 doc.line(18, 235, doc.internal.pageSize.width - 18, 235);
 
doc.setTextColor(0);
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
 
doc.text('SHIPPING', 23, 241);
if (shippingfee === 0) {
  doc.text('FREE', 135, 241);
} else {
  doc.text(`${shippingfee.toFixed(2)} AED`, 135, 241);
}

const final1=5.5

doc.text('SUB TOTAL', 23, 250);
doc.text(`${Gamount.toFixed(2)} AED`, 135, 250);

doc.text('TOTAL TO BE PAID', 23, 259);
doc.text(`${Final.toFixed(2)} AED`, 135, 259);

doc.setFillColor(135, 135, 138);
// Light brown background color
doc.setDrawColor(192);
// doc.text(' ESTIMATED VAT', 23, 282);
// Draw rounded rectangle
doc.setFillColor(135, 135, 138);

doc.rect(18, 264, 39, 9, 'FD');
doc.text(numberToWords(Final) + ' only', 82, 270);
doc.setTextColor(255, 255, 255);




doc.text('TOTAL IN WORDS', 23, 270);

  // Save the PDF

  doc.rect(18, 264, doc.internal.pageSize.width - 38, 9,);

  // doc.setTextColor(247, 149, 45);
  // doc.text(' 5% OF TOTAL TO BE KEPT HERE', 56, 282);
  // doc.rect(54, 276,26 , 9,);


  doc.setTextColor(1, 1, 112);
  doc.setFont("helvetica","italic");
 doc.setFontSize(12)
  doc.text('Thank You. Visit Again!', doc.internal.pageSize.getWidth() / 2, 292, { align: 'center' });

  const pdfName = `invoice_${last4Digits}.pdf`; // e.g., invoice_1234.pdf
  doc.save(pdfName);
  
  const blob = doc.output('blob');
  const formData = new FormData();
  formData.append('Invoice', blob, pdfName);
  formData.append('OrderId', last4Digits); // Append the Order ID

  // Call the async function to upload the PDF
  handleUploadPDF(formData);
};

const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    chunkedArr.push(chunk);
  }
  return chunkedArr;
};
  export { handlePrint };