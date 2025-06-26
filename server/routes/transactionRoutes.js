import {Router} from "express";
import {
    createTransaction, getTransactionsByUserId, getTransactionsByAccountNumber
} from "../controllers/transactionsController.js";

const router = Router();

router.post("/create", createTransaction); // Create new account
router.get("/user/:userId", getTransactionsByUserId); // Get account by user ID
router.get("/account/:accountId", getTransactionsByAccountNumber); // Get account by user ID

export default router;