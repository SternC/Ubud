import express from "express";

const app = express();

app.get("/api", (req,res) => {
    res.json({"message": "Hello from the backend!"});
});

app.listen(5000, () =>{
    console.log("Server started on http://localhost:5000");
})