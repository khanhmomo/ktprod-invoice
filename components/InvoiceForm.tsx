'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  personName: string;
  salary: number;
  eventID: string;
  eventName: string;
  eventDate: string;
  travelExpenses: number;
  carExpenses: number;
  parkingExpenses: number;
  invoiceDate: string;
}

// Utility function to format dates in mm-dd-yyyy format
const formatDate = (date: string | Date) => {
  const d = new Date(date);
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero for single digits
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
};

const InvoiceForm = () => {
  const [formData, setFormData] = useState<FormData>({
    personName: '',
    salary: 0,
    eventID: '',
    eventName: '',
    eventDate: '',
    travelExpenses: 0,
    carExpenses: 0,
    parkingExpenses: 0,
    invoiceDate: formatDate(new Date()), // Initialize with today's date in mm-dd-yyyy format
  });

  const [isLoading, setIsLoading] = useState(false);
  const [docxPreview, setDocxPreview] = useState<string>(''); // Store the HTML preview content
  const [isPreview, setIsPreview] = useState(false); // Boolean to track preview status

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // For number fields (salary, expenses), set to value or 0 if empty
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : +value, // Set to 0 if empty, or convert to number
      });
    } else if (name === 'eventDate' || name === 'invoiceDate') {
      // Format the eventDate and invoiceDate to mm-dd-yyyy format
      setFormData({
        ...formData,
        [name]: formatDate(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch('/api/generate-docx', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error generating DOCX');
    } else {
      const data = await response.json();

      // Set preview HTML for the right side
      setDocxPreview(data.htmlPreview);

      // Set preview mode to true
      setIsPreview(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex">
      {/* Left Column: Form Inputs */}
      <div className="w-1/2 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-black">Generate Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="personName" className="text-sm font-semibold text-black">Person Name</label>
            <input
              type="text"
              name="personName"
              id="personName"
              value={formData.personName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="salary" className="text-sm font-semibold text-black">Salary</label>
            <input
              type="number"
              name="salary"
              id="salary"
              value={formData.salary !== 0 ? formData.salary : ''}
              onChange={handleChange}
              placeholder="0"
              className="mt-1 p-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="eventID" className="text-sm font-semibold text-black">Event ID</label>
            <input
              type="text"
              name="eventID"
              id="eventID"
              value={formData.eventID}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="eventName" className="text-sm font-semibold text-black">Event Name</label>
            <input
              type="text"
              name="eventName"
              id="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="eventDate" className="text-sm font-semibold text-black">Event Date</label>
            <input
              type="date"
              name="eventDate"
              id="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="travelExpenses" className="text-sm font-semibold text-black">Travel Expenses</label>
            <input
              type="number"
              name="travelExpenses"
              id="travelExpenses"
              value={formData.travelExpenses !== 0 ? formData.travelExpenses : ''}
              onChange={handleChange}
              placeholder="0"
              className="mt-1 p-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="carExpenses" className="text-sm font-semibold text-black">Car Expenses</label>
            <input
              type="number"
              name="carExpenses"
              id="carExpenses"
              value={formData.carExpenses !== 0 ? formData.carExpenses : ''}
              onChange={handleChange}
              placeholder="0"
              className="mt-1 p-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="parkingExpenses" className="text-sm font-semibold text-black">Parking Expenses</label>
            <input
              type="number"
              name="parkingExpenses"
              id="parkingExpenses"
              value={formData.parkingExpenses !== 0 ? formData.parkingExpenses : ''}
              onChange={handleChange}
              placeholder="0"
              className="mt-1 p-2 border border-gray-300 rounded-md text-black placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="invoiceDate" className="text-sm font-semibold text-black">Invoice Date</label>
            <input
              type="text"
              name="invoiceDate"
              id="invoiceDate"
              value={formData.invoiceDate}
              readOnly
              className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Invoice'}
          </button>
        </form>
      </div>

      {/* Right Column: Preview of DOCX */}
      <div className="w-1/2 p-6 bg-white shadow-md rounded-md ml-4">
        <h3 className="text-xl font-semibold mb-4 text-black">Preview</h3>
        <div
          className="overflow-auto bg-white p-4 rounded-md shadow-md"
          dangerouslySetInnerHTML={{ __html: docxPreview }}
          style={{
            color: 'black', // Force all text in the preview to be black
            fontFamily: 'Arial, sans-serif',
          }}
        />

        {/* Show the download button after preview */}
        {isPreview && (
          <a
            href="/debug-invoice.docx"  // This is the link to download the file from the public directory
            download={`AKT-${formData.eventID}.docx`}  // Change the name dynamically
            className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Download Invoice
          </a>
        )}
      </div>
    </div>
  );
};

export default InvoiceForm;
