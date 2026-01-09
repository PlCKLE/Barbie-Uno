import express from "express"

const routes = express.Router();

//Root endpoint will be used to confirm if the server is running, and serve API information.
routes.get("/",(req, res) => {
    res.json({
        success: true,
        message: "Barbie Uno Backend is running!",
        endpoints: {

        }
    })
})


export default routes;
