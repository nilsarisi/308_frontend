import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [selectionEnabled, setSelectionEnabled] = useState(false);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchInvoices(dateRange.start, dateRange.end);
    }
  }, [dateRange]);

  const fetchInvoices = async (startDate, endDate) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found. Please log in as a sales manager.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5001/api/orders/invoices/date-range?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setInvoices(response.data);
      setSelectedInvoices([]); // Reset selections
    } catch (error) {
      console.error("Failed to fetch invoices:", error.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableSelection = () => {
    setSelectionEnabled(true);
  };

  const handleSelectAll = () => {
    setSelectionEnabled(true);
    setSelectedInvoices(invoices.map((invoice) => invoice.invoiceId));
  };

  const handleDeselectAll = () => {
    setSelectedInvoices([]);
  };

  const handleInvoiceSelection = (invoiceId) => {
    setSelectedInvoices((prevSelected) =>
      prevSelected.includes(invoiceId)
        ? prevSelected.filter((id) => id !== invoiceId)
        : [...prevSelected, invoiceId]
    );
  };

  const handleDownloadSelectedPDF = async () => {
    if (selectedInvoices.length === 0) {
        alert("Please select at least one invoice to download.");
        return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
        console.error("No access token found. Please log in.");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:5001/api/orders/invoices/pdf/selected`,
            { invoiceIds: selectedInvoices },
            {
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        saveAs(pdfBlob, `selected_invoices.pdf`);
    } catch (error) {
        console.error("Failed to download selected invoices PDF:", error.message);
    }
};


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      {/* Date Range Selection */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="border px-4 py-2 rounded"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            className="border px-4 py-2 rounded"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mb-6">
        <button
          onClick={handleEnableSelection}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
        >
          Select
        </button>
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
        >
          Select All
        </button>
        <button
          onClick={handleDeselectAll}
          className="px-4 py-2 bg-gray-500 text-white rounded mr-4"
          disabled={!selectionEnabled}
        >
          Deselect All
        </button>
        <button
          onClick={handleDownloadSelectedPDF}
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={!selectionEnabled || selectedInvoices.length === 0}
        >
          Download the Selected Invoices as PDF
        </button>
      </div>

      {/* Invoice List */}
      {loading ? (
        <p>Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p>No invoices found for the selected date range.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Invoice ID</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceId} className="even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    disabled={!selectionEnabled}
                    checked={selectedInvoices.includes(invoice.invoiceId)}
                    onChange={() => handleInvoiceSelection(invoice.invoiceId)}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{invoice.invoiceId}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${invoice.totalAmount.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-4 py-2">{invoice.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.userName} ({invoice.userEmail})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Invoice;
