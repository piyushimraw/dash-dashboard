import express from "express";
import cors from "cors";
import axios from "axios";
import { paths } from "./src/types";
import { errorHandler } from "./src/middleware/errorHandler";
import { openApiValidator } from "./src/middleware/openapiValidator";

const app = express();
const PORT = 3001;



app.use(cors());
app.use(express.json());

//custom middlewares.
// app.use(openApiValidator);
// app.use(errorHandler);

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


//throws error when vehicle id is of type number for api -> https://dummyjson.com/c/0735-235f-48c8-9069

// type VehiclesResponse = paths["/api/vehicles"]["get"]["responses"]["200"]["content"]["application/json"];

// app.get("/api/vehicles", async (_, res) => {
//   const response = await axios.get<VehiclesResponse>(
//     // "https://dummyjson.com/c/fd99-532e-4733-83a3"
//     "https://dummyjson.com/c/1394-326c-4220-88d7"
// );

//   res.json(response.data);
// });

// use allSettled instead of all to see how to handle partial failures.

app.get("/api/dashboard", async (req, res) => {
  try {
    const [vehicles, pricing, availability] = await Promise.all([
      axios.get("https://dummyjson.com/c/1394-326c-4220-88d7"),
      axios.get("https://dummyjson.com/products"),
      axios.get("https://dummyjson.com/users")
    ]);

    res.json({
      vehicles: vehicles.data,
      pricing: pricing.data,
      availability: availability.data
    });

  } catch (err) {
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
});


app.listen(PORT, () => {
  console.log(`BFF running on port ${PORT}`);
});

