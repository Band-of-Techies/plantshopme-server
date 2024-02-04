import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autoTable plugin
import invoice from '../Image/invoice1.jpeg';

const PrintPage = ({ intent }) => {

  const numberToWords = (num) => {
    const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (num) => {
      if (num < 10) return units[num];
      else if (num < 20) return teens[num - 11];
      else if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
      else return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convert(num % 100) : '');
    };

    const wholePart = Math.floor(num);
    const decimalPart = Math.round((num - wholePart) * 100); // Assuming up to two decimal places

    let result = convert(wholePart);

    if (decimalPart > 0) {
      result += ' Point ' + convert(decimalPart);
    }

    return result;
  };

  const handlePrint = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Add background image
    pdf.addImage(invoice, 'JPEG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);

    // Set font size and style for the entire document
    pdf.setFontSize(8);
    pdf.setFont('times', 'normal');

    // Set line width for creating padding
    pdf.setLineWidth(1);

    // Display invoice details in two columns (Bill To and Ship To)

    const last4Digits = intent?.orderId;
    pdf.text(`Invoice No: OID ${last4Digits}`, 20, 40);

    pdf.text('Date: ' + new Date().toLocaleDateString(), 20, 45);

    // Bill To
    pdf.text('Bill To:', 20, 55);
    pdf.text(`Name: ${intent?.user?.name}`, 20, 60);
    pdf.text(`Phone: ${intent?.checkoutData?.phone}`, 20, 65);

    // Ship To
    pdf.text('Ship To:', pdf.internal.pageSize.width / 2, 55);
    pdf.text(`Name: ${intent?.user?.name}`, pdf.internal.pageSize.width / 2, 60);
    pdf.text(`Address: ${intent?.checkoutData?.country}, ${intent?.checkoutData?.state}, ${intent?.checkoutData?.city}, ${intent?.checkoutData?.houseNumber}`, pdf.internal.pageSize.width / 2, 65);
    pdf.text(`${intent?.checkoutData?.landmark}`, pdf.internal.pageSize.width / 2, 70);
    pdf.text(`Phone: ${intent?.checkoutData?.phone}`, pdf.internal.pageSize.width / 2, 75);
    var Gamount = 0
    var spay = 0

    const Final = intent.total || 0
 

    const shippingfee=intent.shipping_fee || 0

    const coin=intent?.coinsData?.value || '';
   
    const type = intent?.couponData?.type || '';
    let discountperc = 0;
    let discountflat = 0;
    
    if (type === 'Flat') {
      discountflat = Number(intent?.couponData?.value) || 0 ;
    } else if(type ==='Percentage') {
      discountperc = Number(intent?.couponData?.value) || 0;
    }
    else{
      discountflat = Number(intent?.coinsData?.value) || 0 ;
    }
    // discountflat = intent?.couponData?.value || ''
    // discountperc = intent?.couponData?.value || ''
    let finalAmount=0

    if (intent?.updatedCartItems && intent.updatedCartItems.length > 0) {
      // Draw a line for padding
      pdf.setDrawColor(144, 238, 144); // Light green color
      pdf.line(20, 85, pdf.internal.pageSize.width - 20, 85);
    
      const tableData = intent.updatedCartItems.map((product, index) => {
        const quantity = product.amount || 0;
        let title = '';
    
        if (product.flashSalePrice !== undefined) {
          title = product.title + '(Flash Sale)' || '';
        } else {
          title = product.title || '';
        }
    
        const productPrice = product.flashSalePrice || product.dimension.Price || 0;
    
        const Value1 = product.dimension?.Value1 || '';
        const Value2 = product.dimension?.Value2 || '';
    
        const dimensions = `${Value1},${Value2}`;
    
        // Calculate the total amount based on flash sale or regular price, including GiftWrap
        let total = product.flashSalePrice !== undefined
          ? quantity * product.flashSalePrice
          : quantity * productPrice;
    
        // Add GiftWrap amount to the total (multiplied by quantity)
        const GiftWrap = product.GiftWrap ? 20 * quantity : 0;
        total += GiftWrap;
     
        const GiftWrap1 = product.GiftWrap ? 20 : 0;
        return [
          index + 1,    // SL No
          title,        // Product Name
          quantity,     // Quantity
          dimensions,   // Dimensions
          productPrice, // Product Price
          GiftWrap1,     // GiftWrap Amount
          total,        // Total
        ];
      });
    
      // Now `tableData` contains the correct totals for each product based on the conditions.
      console.log(tableData);
    
    

      // Assuming you want to calculate the grand total for all products
      const grandTotal = tableData.reduce((total, row) => total + row[6], 0);

      console.log(tableData);  // Check the console for the calculated table data
      console.log(grandTotal); // Check the console for the grand total

      Gamount = grandTotal

      // Add a table using the autoTable plugin with added styling
      pdf.autoTable({
        head: [['SL No', 'Product Name', 'Quantity','Dimensions', 'Product Price','GiftWrap','Total']],
        body: tableData,
        startY: 93, // Add padding to the top
        styles: {
          cellPadding: 5,
          textColor: [0, 0, 0], // Text color (black)
          lineColor: [0, 0, 0], // Line color (black)
          fillColor: [220, 220, 220], // Fill color (light gray)
        },
      });
    }

    // Draw a line for padding
    pdf.setDrawColor(144, 238, 144); // Light green color
    pdf.line(20, 203, pdf.internal.pageSize.width - 20, 203);

    // Add a column for Subtotal, VAT, Total
    pdf.text('Subtotal', pdf.internal.pageSize.width / 2, 213, { align: 'right' });
    pdf.text('Shipping Fee', pdf.internal.pageSize.width / 2, 218, { align: 'right' });
    pdf.text('Total', pdf.internal.pageSize.width / 2, 223, { align: 'right' });
    pdf.text('After Discount', pdf.internal.pageSize.width / 2, 233, { align: 'right' });
    pdf.text('Discount', pdf.internal.pageSize.width / 2, 227, { align: 'right' });
    pdf.setTextColor(0, 0, 0); // Reset text color to black


    const subtotal = 100; 
    const vatp=5;// Replace with actual subtotal value
    const vat = (Gamount*5)/100; // Replace with actual VAT value
    const grandTotal = Gamount+shippingfee; // Replace with actual total value
    const finalt = Final + vat
    pdf.text(`AED ${Gamount}`, pdf.internal.pageSize.width - 20, 213, { align: 'right' });
    pdf.text(`${shippingfee}`, pdf.internal.pageSize.width - 20, 218, { align: 'right' });
    pdf.text(`AED ${grandTotal}`, pdf.internal.pageSize.width - 20, 223, { align: 'right' });
    const discountText = discountperc !== 0
  ? `${discountperc} %`
  : discountflat !== 0
    ? `AED ${discountflat}`
    : 'AED 0';

pdf.text(discountText, pdf.internal.pageSize.width - 20, 227, { align: 'right' });
    pdf.text(`AED ${Final}`, pdf.internal.pageSize.width - 20, 233, { align: 'right' });
    // Display the total amount in words
    pdf.setFont('times', 'bolditalic');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 139);
    pdf.text('Amount in Words:', pdf.internal.pageSize.width / 2, 238, { align: 'right' });
    pdf.text('AED ' + numberToWords(Final) + ' only', pdf.internal.pageSize.width - 20, 238, { align: 'right' });
    // Draw a line for padding
    pdf.setDrawColor(144, 238, 144); // Light green color
    pdf.line(20, 240, pdf.internal.pageSize.width - 20, 240);

    // Add a bottom footer with Bank details
    pdf.setFont('times', 'bolditalic');
    pdf.setFontSize(13);
    pdf.setTextColor(144, 238, 144); // Light green color
    pdf.text('Bank Details', 20, 245);
    pdf.setFont('times', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 139); // Dark blue color
    pdf.text('FAB Bank: Dubai branch', 20, 250);
    pdf.text('A/C Name: myplantstore', 20, 255);
    pdf.text('A/C No: 21454321641316415', 20, 260);
    pdf.text('IBAN: 65296584103216', 20, 265);



    // Save or open the PDF
    const pdfName = `invoice_${last4Digits}.pdf`; // e.g., invoice_1234.pdf
    pdf.save(pdfName);
  };

  return (
    <div>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default PrintPage;
