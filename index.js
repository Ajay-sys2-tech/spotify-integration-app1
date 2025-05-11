const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const spotifyRoutes = require("./routes/spotify");
const authRoutes = require("./routes/auth");


app.use(cors());
app.use(express.json());
app.use("/spotify/auth", authRoutes);
app.use("/spotify", spotifyRoutes);
app.get("/", (req, res) => {
    res.send("Hello Spotify!");
});


app.listen(PORT, () => {    
  console.log(`Server is running on port ${PORT}`);
});