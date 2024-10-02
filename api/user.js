const express = require("express");
const user_router = express.Router();

const { getUserById } = require("../db/user");

user_router.get("/user/:id", async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
});

module.exports = user_router;
