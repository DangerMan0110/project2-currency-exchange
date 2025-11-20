import { useEffect, useState } from "react";
import { getLatestRates } from "../services/firestore";
import { addAlert } from "../services/alerts";
import CurrencyCard from "../components/CurrencyCard";

export default function HomeView() {
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState(1);
  const [target, setTarget] = useState("USD");

  // Alert form states
  const [alertCurrency, setAlertCurrency] = useState("USD");
  const [alertTarget, setAlertTarget] = useState("");
  const [alertDirection, setAlertDirection] = useState("below");

  useEffect(() => {
    async function load() {
      const data = await getLatestRates();
      console.log("DATA FROM FIRESTORE:", data);
      setRates(data);
    }
    load();
  }, []);

  if (!rates) return <div>Loading latest currency rates...</div>;

  const importantCurrencies = ["USD", "GBP", "HUF", "CHF", "JPY"];

  async function handleAddAlert() {
    if (!alertTarget) return alert("Please enter a valid number.");

    await addAlert(alertCurrency, alertTarget, alertDirection);
    alert("Alert saved!");
    setAlertTarget("");
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Converter */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Currency Converter (EUR → {target})</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", width: "120px" }}
        />

        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          {Object.keys(rates.rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <strong>
          {amount} EUR ={" "}
          {(amount * (rates.rates[target] || 0)).toFixed(3)} {target}
        </strong>
      </div>

      {/* Currency cards */}
      <h2>Latest Currency Rates (EUR base)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {importantCurrencies.map((currency) => (
          <CurrencyCard
            key={currency}
            currency={currency}
            value={rates.rates[currency]}
          />
        ))}
      </div>

      <hr style={{ marginTop: "40px" }} />

      {/* Alerts */}
      <h3>Create Price Alert</h3>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={alertCurrency}
          onChange={(e) => setAlertCurrency(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          {Object.keys(rates.rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Target value"
          style={{ padding: "8px", marginRight: "10px", width: "150px" }}
          value={alertTarget}
          onChange={(e) => setAlertTarget(e.target.value)}
        />

        <select
          value={alertDirection}
          onChange={(e) => setAlertDirection(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option value="below">When BELOW target</option>
          <option value="above">When ABOVE target</option>
        </select>

        <button style={{ padding: "8px 16px" }} onClick={handleAddAlert}>
          Add Alert
        </button>
      </div>
    </div>
  );
}
