import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const Refunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState({});
  const [sortOrder, setSortOrder] = useState("desc"); // Default to descending order

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication token is missing.");

      const response = await axios.get(`${backendUrl}/api/orders/refunds`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log("Fetched Refunds:", response.data); // Debug log to verify data
      setRefunds(response.data); // Set refunds data to state
    } catch (err) {
      console.error("Failed to fetch refund requests:", err.message);
      setError("Unable to fetch refund requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNoteChange = (refundId, value) => {
    setNotes((prev) => ({ ...prev, [refundId]: value }));
  };

  const handleApproveRefund = async (refundId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication token is missing.");

      await axios.put(
        `${backendUrl}/api/orders/refunds/${refundId}/approve`,
        { managerNote: notes[refundId] || "" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("Refund approved successfully.");
      fetchRefundRequests(); // Refresh the data after approval
    } catch (err) {
      console.error("Failed to approve refund:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Unable to approve refund. Please try again.");
    }
  };

  const handleRejectRefund = async (refundId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication token is missing.");

      await axios.put(
        `${backendUrl}/api/orders/refunds/${refundId}/reject`,
        { managerNote: notes[refundId] || "" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("Refund rejected successfully.");
      fetchRefundRequests(); // Refresh the data after rejection
    } catch (err) {
      console.error("Failed to reject refund:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Unable to reject refund. Please try again.");
    }
  };

  const sortRefunds = () => {
    const sortedRefunds = [...refunds].sort((a, b) => {
      const dateA = new Date(a.requestedAt);
      const dateB = new Date(b.requestedAt);

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setRefunds(sortedRefunds);
  };

  useEffect(() => {
    if (refunds.length > 0) {
      sortRefunds();
    }
  }, [sortOrder]); // Re-sort refunds whenever the sort order changes

  if (loading) {
    return <p className="text-center">Loading refund requests...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!refunds || refunds.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">No Refund Requests</h2>
        <p>There are no pending refund requests at the moment.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Refund Requests</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Sort by Date:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="desc">Newest to Oldest</option>
          <option value="asc">Oldest to Newest</option>
        </select>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Refund ID</th>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Customer Name</th>
            <th className="border px-4 py-2">Request Date</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((refund) => (
            <tr key={refund.refundId}>
              <td className="border px-4 py-2">{refund.refundId}</td>
              <td className="border px-4 py-2">{refund.product?.name || "N/A"}</td>
              <td className="border px-4 py-2">{refund.user?.name || "N/A"}</td>
              <td className="border px-4 py-2">
                {new Date(refund.requestedAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                {refund.status !== "pending" && refund.managerNote && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Note:</strong> {refund.managerNote}
                  </p>
                )}
              </td>
              <td className="border px-4 py-2">
                {refund.status === "pending" ? (
                  <>
                    <textarea
                      placeholder="Add notes (optional)"
                      value={notes[refund.refundId] || ""}
                      onChange={(e) => handleNoteChange(refund.refundId, e.target.value)}
                      className="border rounded w-full p-2"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleApproveRefund(refund.refundId)}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRefund(refund.refundId)}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 italic">No actions available</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Refunds;