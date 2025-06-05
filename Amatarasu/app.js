import express from "express";
import cors from "cors";
import jobRoute from "./routes/jobs.js";
import authRoute from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); //Any JSON body will be accepted and parsed into the req.body object

app.use("/api/jobs", jobRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("Something broke");
});

app.listen(5000, () => {
  console.log("server is listening");
});
//You should NOT use the backend port (http://localhost:5000) as the origin in the CORS config — that would effectively be saying:

//"Allow this server to make requests to itself" — which isn't a cross-origin request and defeats the purpose.
