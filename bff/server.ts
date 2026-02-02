import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/vehicles", async (req, res) => {
  try {
    const response = await axios.get(
      "https://dummyjson.com/c/1394-326c-4220-88d7"
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
});

//todo -> implement this on a dummy url. 
// use allSettled

// app.get("/api/dashboard", async (req, res) => {
//   try {
//     const [vehicles, pricing, availability] = await Promise.all([
//       axios.get("https://dummyjson.com/c/1394-326c-4220-88d7"),
//       axios.get("https://dummyjson.com/products"),
//       axios.get("https://dummyjson.com/users")
//     ]);

//     res.json({
//       vehicles: vehicles.data,
//       pricing: pricing.data,
//       availability: availability.data
//     });

//   } catch (err) {
//     res.status(500).json({ message: "Dashboard fetch failed" });
//   }
// });


app.listen(PORT, () => {
  console.log(`BFF running on port ${PORT}`);
});

