import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Example: Check if the user is logged in
  const isAuthenticated = Boolean(localStorage.getItem("authToken")); // Replace with your auth mechanism

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      alert("You must log in to place an order.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

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

  const handleConfirmOrder = () => {
    const orderData = {
      orderNumber: Math.floor(Math.random() * 1000000),
      status: "Processing",
      estimatedDelivery: "Within 5-7 business days",
      items: cart,
      totalPrice: totalPrice,
    };

    localStorage.setItem("orderData", JSON.stringify(orderData));

    clearCart();

    navigate("/order-success");
  };

  return (
    <div className="container mx-auto p-8">
      {step === 1 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
          <form>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={shippingInfo.name}
              onChange={(e) => handleInputChange(e, "shipping")}
              className="border p-2 w-full rounded mb-4"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={shippingInfo.address}
              onChange={(e) => handleInputChange(e, "shipping")}
              className="border p-2 w-full rounded mb-4"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={(e) => handleInputChange(e, "shipping")}
              className="border p-2 w-full rounded mb-4"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={shippingInfo.postalCode}
              onChange={(e) => handleInputChange(e, "shipping")}
              className="border p-2 w-full rounded mb-4"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={shippingInfo.country}
              onChange={(e) => handleInputChange(e, "shipping")}
              className="border p-2 w-full rounded mb-4"
            />
          </form>
          <button onClick={handleNextStep} className="bg-blue-500 text-white py-2 px-4 rounded">
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
          <form>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={paymentInfo.cardNumber}
              onChange={(e) => handleInputChange(e, "payment")}
              className="border p-2 w-full rounded mb-4"
            />
            <input
              type="text"
              name="expiryDate"
              placeholder="Expiry Date (MM/YY)"
              value={paymentInfo.expiryDate}
              onChange={(e) => handleInputChange(e, "payment")}
              className="border p-2 w-full rounded mb-4"
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={paymentInfo.cvv}
              onChange={(e) => handleInputChange(e, "payment")}
              className="border p-2 w-full rounded mb-4"
            />
          </form>
          <button onClick={handlePreviousStep} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
            Back
          </button>
          <button onClick={handleNextStep} className="bg-blue-500 text-white py-2 px-4 rounded">
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Confirmation</h2>
          <p><strong>Name:</strong> {shippingInfo.name}</p>
          <p><strong>Address:</strong> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>
          <h3 className="text-xl font-bold mt-6">Order Summary</h3>
          {cart.map((item) => (
            <p key={item.id}>
              {item.name} x {item.quantity} - ₺{(item.price * item.quantity).toFixed(2)}
            </p>
          ))}
          <p className="font-bold mt-4">Total Items: {totalItems}</p>
          <p className="font-bold">Total Price: ₺{totalPrice}</p>
          <button onClick={handlePreviousStep} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
            Back
          </button>
          <button onClick={handleConfirmOrder} className="bg-green-500 text-white py-2 px-4 rounded">
            Confirm Order
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
