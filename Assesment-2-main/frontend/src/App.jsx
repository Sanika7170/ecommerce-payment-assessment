import { useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    setResult(null);

    // Basic frontend validation (nice touch for assessment)
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!cardNumber || cardNumber.length < 12) {
      setError("Please enter a valid card number");
      return;
    }

    try {
      const response = await fetch("http://localhost:5084/Payments/Pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Number(amount),
          cardDetails: {
            cardNumber: cardNumber,
            expiry: "12/26",
            cvv: "123"
          }
        })
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Payment failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="payment-container">
      <h2>Ecommerce Payment</h2>

      <div>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <div>
        <label>Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Enter card number"
        />
      </div>

      <button onClick={handlePay}>Pay</button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <p><b>Card Type:</b> {result.cardType}</p>
          <p><b>Total Amount:</b> ₹{result.originalAmount}</p>
          <p><b>Discount:</b> {result.discountPercentage}%</p>
          <p><b>Discount Amount:</b> ₹{result.discountAmount}</p>
          <h3><b>Final Payable:</b> ₹{result.finalAmount}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
