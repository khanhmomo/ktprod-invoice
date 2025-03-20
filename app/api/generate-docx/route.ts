import { NextRequest, NextResponse } from 'next/server';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {  // Explicitly type `req` as NextRequest
  try {
    // Get form data from the request
    const { personName, salary, eventID, eventName, eventDate, travelExpenses, carExpenses, parkingExpenses, invoiceDate } = await req.json();

    // Calculate the current year for the invoice ID
    const currentYear = new Date().getFullYear();
    const invoiceID = `${currentYear}-${eventID}`;

    // Path to the DOCX template
    const templatePath = path.resolve('templates', 'invoice-template.docx');
    const templateContent = fs.readFileSync(templatePath, 'binary');

    // Initialize PizZip with the DOCX content
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip);

    // Log the data being passed to the template for debugging
    console.log({
      invoiceID,
      personName,
      salary,
      eventID,
      eventName,
      eventDate,
      travelExpenses,
      carExpenses,
      parkingExpenses,
      invoiceDate,
      total: salary + travelExpenses + carExpenses + parkingExpenses
    });

    // Set the data to replace in the template
    doc.setData({
      invoiceID,              // Add invoiceID to the data
      personName,
      salary,
      eventID,
      eventName,
      eventDate,
      travelExpenses,
      carExpenses,
      parkingExpenses,
      invoiceDate,
      total: salary + travelExpenses + carExpenses + parkingExpenses, // Calculate total
    });

    // Render the DOCX template with the data
    try {
      doc.render();
    } catch (error) {
      console.error('Error rendering DOCX:', error);
      return NextResponse.json({ error: 'Failed to render DOCX' }, { status: 500 });
    }

    // Generate the final DOCX buffer
    const buf = doc.getZip().generate({ type: 'nodebuffer' });

    // Save the DOCX file to the public directory for download
    const filePath = path.resolve('public', 'debug-invoice.docx');
    fs.writeFileSync(filePath, buf);  // Save to public directory

    // Create a basic HTML preview using mammoth
    const htmlPreview = await mammoth.convertToHtml({ buffer: buf }).then((result) => result.value);

    // Return the DOCX buffer and HTML preview
    return NextResponse.json({ docxBuffer: buf, htmlPreview });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return NextResponse.json({ error: 'Failed to generate DOCX' }, { status: 500 });
  }
}
