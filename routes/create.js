import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.render("create.ejs");
});


export default router;