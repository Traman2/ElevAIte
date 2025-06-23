import {Router} from "express";
import {
    createAccount,
    getAccountByUserId
} from "../controllers/bankAccountController.js";

const router = Router();

router.post("/create", createAccount); // Create new account
router.get("/:userId", getAccountByUserId); // Get account by user ID

export default router;