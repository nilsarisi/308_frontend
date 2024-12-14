import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            fetchInvoices(dateRange.start, dateRange.end);
        }
    }, [dateRange]);

    const fetchInvoices = async (startDate, endDate) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5001/api/invoices?start=${startDate}&end=${endDate}`
            );
            setInvoices(response.data);
        } catch (error) {
            console.error("Failed to fetch invoices:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintInvoice = (invoice) => {
        const invoiceBlob = new Blob([JSON.stringify(invoice, null, 2)], {
            type: "application/json",
        });
        saveAs(invoiceBlob, `invoice_${invoice.id}.pdf`);
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
                        onChange={(e) =>
                            setDateRange({ ...dateRange, start: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input
                        type="date"
                        className="border px-4 py-2 rounded"
                        value={dateRange.end}
                        onChange={(e) =>
                            setDateRange({ ...dateRange, end: e.target.value })
                        }
                    />
                </div>
            </div>

            {/* Invoice List */}
            {loading ? (
                <p>Loading invoices...</p>
            ) : (
                <table className="table-auto border-collapse border border-gray-300 w-full mb-6">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Total</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="even:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{invoice.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{invoice.date}</td>
                                <td className="border border-gray-300 px-4 py-2">${invoice.total.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handlePrintInvoice(invoice)}
                                        className="px-4 py-1 bg-blue-500 text-white rounded"
                                    >
                                        Print/Save
                                    </button>
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
