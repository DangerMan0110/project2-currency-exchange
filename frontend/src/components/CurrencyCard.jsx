export default function CurrencyCard({ currency, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "16px",
        borderRadius: "12px",
        width: "150px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        color: "#000"
      }}
    >
      <h3 style={{ margin: 0 }}>{currency}</h3>
      <p style={{ fontSize: "1.2rem", margin: "10px 0" }}>
        {value !== undefined ? value.toFixed(3) : "N/A"}
      </p>
    </div>
  );
}
