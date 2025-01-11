import React, { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5001"; 

const CommentModeration = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingComments = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        // 1) İlk olarak /comments/pending ile tüm yorumları alıyoruz
        const response = await axios.get(`${backendUrl}/api/products/comments/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rawComments = response.data; // Burada productId, commentId, text, username var ama productName yok.

        // 2) Her yorumdaki productId ile /api/products/:id istekleri atıyoruz
        //    Promise.all kullanarak paralel istekler yapılır.
        const commentsWithNames = await Promise.all(
          rawComments.map(async (comment) => {
            if (!comment.productId) {
              // productId yoksa olduğu gibi dön
              return comment;
            }

            // /api/products/:id ile istek atarak productName'i alıyoruz
            try {
              const productRes = await axios.get(`${backendUrl}/api/products/${comment.productId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              // productRes.data.name varsayılarak, productName ekliyoruz
              return {
                ...comment,
                productName: productRes.data.name || "", // yoksa boş string
              };
            } catch (innerErr) {
              // Tek bir ürün bilgisi alınamadıysa yine de orijinal yorumu dön
              console.error("Failed to fetch product name:", innerErr);
              return comment;
            }
          })
        );

        // 3) Artık her comment objesinde productName alanı da var
        setComments(commentsWithNames);
      } catch (err) {
        setError("Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingComments();
  }, []);

  const handleApprove = async (productId, commentId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `${backendUrl}/api/products/comments/${productId}/${commentId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      setError("Failed to approve comment");
    }
  };

  const handleReject = async (productId, commentId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${backendUrl}/api/products/comments/${productId}/${commentId}/reject`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      setError("Failed to reject comment");
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pending Comments</h1>
      {comments.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-6 py-4 text-left">Username</th>
              <th className="border border-gray-300 px-6 py-4 text-left">Product Name</th>
              <th className="border border-gray-300 px-6 py-4 text-left">Comment</th>
              <th className="border border-gray-300 px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.commentId} className="even:bg-gray-50">
                <td className="border border-gray-300 px-6 py-4">{comment.username}</td>
                {/* Artık comment.productName, Promise.all sonrası gelmiş olacak */}
                <td className="border border-gray-300 px-6 py-4">{comment.productName}</td>
                <td className="border border-gray-300 px-6 py-4">{comment.text}</td>
                <td className="border border-gray-300 px-6 py-4">
                  <button
                    onClick={() => handleApprove(comment.productId, comment.commentId)}
                    className="px-4 py-1 bg-green-500 text-white rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(comment.productId, comment.commentId)}
                    className="px-4 py-1 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending comments.</p>
      )}
    </div>
  );
};

export default CommentModeration;
