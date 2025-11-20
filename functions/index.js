const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = getFirestore();

exports.fetchCurrencies = onSchedule(
  {
    schedule: "every 2 hours",
    timeZone: "Europe/Bucharest",
    region: "us-central1",
  },
  async () => {
    console.log("Fetching latest EUR exchange rates...");

    try {
      const response = await axios.get("https://open.er-api.com/v6/latest/EUR");

      if (!response.data || !response.data.rates) {
        console.error("No rates returned.");
        return;
      }

      await db.collection("historical").add({
        timestamp: FieldValue.serverTimestamp(),
        rates: response.data.rates,
      });

      console.log("Saved new historical rates.");
    } catch (err) {
      console.error("Error fetching currencies:", err);
    }
  }
);

exports.checkAlerts = onSchedule(
  {
    schedule: "every 2 hours",
    timeZone: "Europe/Bucharest",
    region: "us-central1",
  },
  async () => {
    console.log("Checking alerts...");

    const db = getFirestore();

    try {
      const latestSnapshot = await db
        .collection("historical")
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

      if (latestSnapshot.empty) {
        console.log("No historical data found.");
        return;
      }

      const latest = latestSnapshot.docs[0].data().rates;

      const alertsSnap = await db
        .collection("alerts")
        .where("triggered", "==", false)
        .get();

      if (alertsSnap.empty) {
        console.log("No active alerts found.");
        return;
      }

      for (const doc of alertsSnap.docs) {
        const alert = doc.data();

        const currValue = latest[alert.currency];
        if (!currValue) continue;

        let shouldTrigger = false;

        if (alert.direction === "above" && currValue > alert.target) {
          shouldTrigger = true;
        }
        if (alert.direction === "below" && currValue < alert.target) {
          shouldTrigger = true;
        }

        if (shouldTrigger) {
          console.log(
            `Alert TRIGGERED: ${alert.currency} ${alert.direction} ${alert.target}`
          );

          await doc.ref.update({
            triggered: true,
            triggeredAt: FieldValue.serverTimestamp(),
            currentValue: currValue,
          });
        }
      }
    } catch (error) {
      console.error("Error checking alerts:", error);
    }
  }
);
