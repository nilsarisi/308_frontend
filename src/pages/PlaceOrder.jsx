import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = "http://localhost:5001";

const PlaceOrder = () => {
  const { cart, clearCart, isAuthenticated } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  // Redirect to login if not authenticated and fetch email
  useEffect(() => {
    if (!isAuthenticated) {
      alert("You must log in to place an order.");
      navigate("/login");
      return;
    }

    // Fetch the user's email from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.email) {
      setUserEmail(storedUser.email);
    } else {
      alert("Failed to retrieve user email.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Calculate total items and total price
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const totalPrice = cart
    .reduce((total, item) => total + (item.productId?.price || 0) * (item.quantity || 0), 0)
    .toFixed(2);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "shipping") {
      setShippingInfo({ ...shippingInfo, [name]: value });
    } else if (section === "payment") {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    }
  };

  const handleNextStep = () => {
    if (step === 1 && Object.values(shippingInfo).some((value) => !value)) {
      alert("Please fill in all shipping details.");
      return;
    }
    if (step === 2 && Object.values(paymentInfo).some((value) => !value)) {
      alert("Please fill in all payment details.");
      return;
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => setStep(step - 1);

  const handleConfirmOrder = async () => {
    try {
      // Step 1: Place the order
      const orderResponse = await axios.post(
        `${backendUrl}/api/orders/place`,
        { shippingInfo },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );

      const { orderId } = orderResponse.data;

      // Step 2: Make the payment
      const paymentResponse = await axios.post(`${backendUrl}/api/payment/mock-payment`, {
        cardNumber: paymentInfo.cardNumber,
        expiry: paymentInfo.expiryDate,
        cvv: paymentInfo.cvv,
        amount: totalPrice,
      });

      const { transactionId } = paymentResponse.data;

      // Step 3: Generate and send invoice
      await axios.post(`${backendUrl}/api/payment/generate-invoice`, {
        user: {
          name: shippingInfo.name,
          email: userEmail, // Use email from localStorage
          address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
        },
        orderDetails: {
          id: orderId,
          amount: totalPrice,
        },
        transactionId,
      });

      // Clear the cart and navigate to the success page
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Error processing order:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "An error occurred while processing your order."
      );
    }
  };

  return (
    <div className="container mx-auto p-8">
      {error && <p style={{ color: "red" }}>{error}</p>}

      {step === 1 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          <form>
            {["name", "address", "city", "postalCode", "country"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={shippingInfo[field]}
                  onChange={(e) => handleInputChange(e, "shipping")}
                  className="border p-2 w-full rounded mb-4"
                />
              )
            )}
          </form>
          <button
            onClick={handleNextStep}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
          <form>
            {["cardNumber", "expiryDate", "cvv"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={
                  field === "cvv"
                    ? "CVV"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={paymentInfo[field]}
                onChange={(e) => handleInputChange(e, "payment")}
                className="border p-2 w-full rounded mb-4"
              />
            ))}
          </form>
          <button
            onClick={handlePreviousStep}
            className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
          >
            Back
          </button>
          <button
            onClick={handleNextStep}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
          <p>
            <strong>Name:</strong> {shippingInfo.name}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
          </p>
          <h3 className="text-xl font-bold mt-6">Order Summary</h3>
          {cart.map((item) => (
            <p key={item.productId?._id || item.id}>
              {item.productId?.name || "Unknown Product"} x {item.quantity || 0} - ₺
              {((item.productId?.price || 0) * (item.quantity || 0)).toFixed(2)}
            </p>
          ))}
          <p className="font-bold mt-4">Total Items: {totalItems}</p>
          <p className="font-bold">Total Price: ₺{totalPrice}</p>
          <button
            onClick={handlePreviousStep}
            className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
          >
            Back
          </button>
          <button
            onClick={handleConfirmOrder}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
