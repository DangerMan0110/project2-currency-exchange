export async function fetchRates() {
  const res = await fetch("https://api.exchangerate.host/latest?base=EUR");
  return res.json();
}
