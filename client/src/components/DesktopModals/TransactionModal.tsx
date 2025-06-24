import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const transactionFormSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  balance: z
    .string()
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0;
    }, "Please enter a valid positive number")
    .refine((val) => {
      const parts = val.split(".");
      return parts.length === 1 || (parts.length === 2 && parts[1].length <= 2);
    }, "Balance can have up to 2 decimal places"),
  transactionName: z
    .string()
    .min(1, "Transaction name is required")
    .max(20, "Transaction name must be 20 characters or less"),
});

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionModalProps {
  onClose?: () => void;
  userId?: string;
}

export default function TransactionModal({
  onClose,
  userId,
}: TransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [accounts, setAccounts] = useState<{_id: string, accountName: string, accountNumber?: string}[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
  });

  const selectedAccountId = watch("accountId");
  const selectedAccount = accounts.find((a) => a._id === selectedAccountId);

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3000/bankaccount/${userId}`)
      .then(res => setAccounts(res.data))
      .catch(() => setAccounts([]));
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    console.log(data);
    console.log(userId);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <>
      <div className="bg-[#E7D7D7] rounded-lg p-8 shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-[#3F3131] font-(family-name:--font-IBMPlexMono) mb-4">
          Create New Transaction
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="accountId"
              className="block text-sm font-medium text-[#3F3131] mb-2"
            >
              Select Account:
            </label>
            <div className="relative" ref={inputRef}>
              <input
                type="text"
                id="accountId"
                readOnly
                value={selectedAccount ? selectedAccount.accountName : ""}
                placeholder="Choose an account"
                className="w-full px-3 py-2 border border-[#B8ABAB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#FCD34D] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
                disabled={isSubmitting || isSuccess}
                tabIndex={0}
                {...register("accountId")}
                style={{ backgroundColor: isSubmitting || isSuccess ? "#f3f3f3" : undefined }}
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5" stroke="#3F3131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {showDropdown && !isSubmitting && !isSuccess && (
                <div
                  className="absolute z-10 mt-2 w-full rounded-lg shadow-lg bg-[#B8ABAB] max-h-48 overflow-y-auto"
                  style={{ backgroundColor: "#B8ABAB" }}
                >
                  {accounts.length === 0 ? (
                    <div className="px-4 py-2 text-[#3F3131]">No accounts found</div>
                  ) : (
                    accounts.map((account) => (
                      <div
                        key={account._id}
                        className={`px-4 py-2 cursor-pointer text-[#3F3131] ${selectedAccountId === account._id ? "bg-[#1E90FF] text-white" : "hover:bg-[#a89c9c]"}`}
                        onClick={() => {
                          setValue("accountId", account._id, { shouldValidate: true });
                          setShowDropdown(false);
                        }}
                      >
                        {account.accountName}
                        {account.accountNumber && account.accountNumber.length >= 4 && (
                          <span className="ml-2 text-xs text-[#3F3131]">...{account.accountNumber.slice(-4)}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {errors.accountId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.accountId.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="transactionName"
              className="block text-sm font-medium text-[#3F3131] mb-2"
            >
              Transaction Name:
            </label>
            <input
              type="text"
              id="transactionName"
              autoComplete="off"
              maxLength={20}
              {...register("transactionName")}
              className="w-full px-3 py-2 border border-[#B8ABAB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#FCD34D] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter account name"
              disabled={isSubmitting || isSuccess}
            />
            {errors.transactionName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.transactionName.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="balance"
              className="block text-sm font-medium text-[#3F3131] mb-2"
            >
              Balance:
            </label>
            <div className="flex items-center">
              <span className="text-lg text-[#3F3131] mr-2">$</span>
              <input
                type="number"
                id="balance"
                step="0.01"
                min="0"
                {...register("balance")}
                className="w-full px-3 py-2 border border-[#B8ABAB] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#FCD34D] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed no-spinner"
                placeholder="0.00"
                disabled={isSubmitting || isSuccess}
                autoComplete="off"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  let value = input.value;
                  if (value.includes(".")) {
                    const [int, dec] = value.split(".");
                    if (dec.length > 2) {
                      value = int + "." + dec.slice(0, 2);
                      input.value = value;
                    }
                  }
                }}
              />
            </div>
            {errors.balance && (
              <p className="text-red-600 text-sm mt-1">
                {errors.balance.message}
              </p>
            )}
          </div>

          {isSuccess ? (
            <div className="cursor-not-allowed w-full font-(family-name:--font-IBMPlexSans) bg-green-500 text-white font-semibold py-3 px-6 rounded-3xl shadow-md flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Transaction Added Successfully!
            </div>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-[#FCD34D] font-(family-name:--font-IBMPlexSans) text-[#3F3131] font-semibold py-3 px-6 rounded-3xl shadow-md hover:bg-[#F59E0B] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#3F3131]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Transaction...
                </>
              ) : (
                "Add Transaction"
              )}
            </button>
          )}
        </form>
      </div>
    </>
  );
}
