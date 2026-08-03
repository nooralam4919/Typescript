import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
    console.log("Hello");
    res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Application is listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map