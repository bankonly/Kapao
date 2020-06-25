import { Router } from "express";
const router = Router();

router.get("/register", (req, res) => {
  res.json({
    data: "HELLO WORLD",
  });
});

export default router;
