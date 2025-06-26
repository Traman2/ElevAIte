import mongoose from "mongoose";

const generateAccountNumber = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        unique: true,
        required: true,
        default: generateAccountNumber,
    },
    accountName: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ["Savings", "Debit", "Credit"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    incoming: {
        type: Number,
        required: true,
        default: 0,
    },
    spending: {
        type: Number,
        required: true,
        default: 0,
    },
}, {timestamps: true});

export default mongoose.model("Account", accountSchema);