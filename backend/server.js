import express from "express"
import cors from "cors"
import restaurants  from "./api/restaurants.route.js"

//creates the express app
const app = express()

app.use(cors())
//allows the server to accept json in body of request
app.use(express.json())

app.use("/api/v1/restaurants", restaurants)

//catches errors on unknown routes
app.use("*", (req, res) => res.status(404).json({error: "page not found"}))

export default app