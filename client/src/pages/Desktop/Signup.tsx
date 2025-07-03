import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const signupSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    userName: z.string().min(1, { message: "User name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });
  const [formError, setFormError] = useState(false);

  type SignupSchema = z.infer<typeof signupSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    await axios
      .post("http://localhost:3000/user", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Server Response: ", response);
        const token = response.data;
        if (token) {
          localStorage.setItem("token", token);
          navigate("/dashboard");
        } else {
          console.log();
          console.error("No token received from the server headers.");
        }
      })
      .catch((error) => {
        console.error("error submitting form: ", error);
        setFormError(true);
      });
    console.log("Signup Data:", data);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-[url('/bg-bottom.jpg')] bg-cover bg-center z-0" />
      <div className="absolute inset-0 w-full h-full bg-[#f7eaea] opacity-80 z-10" />
      <div className="flex flex-col items-center w-full z-20">
        <div className="w-full max-w-xl bg-[#F9F1F1] p-8 rounded-lg shadow-md flex flex-col items-center relative">
          <div
            className="absolute top-6 left-8 flex items-center"
            style={{ position: "absolute", top: "1.5rem", left: "2rem" }}
            onClick={() => navigate("/")}
          >
            <img
              src="/icons/noto--money-bag.svg"
              alt="Logo"
              className="w-6 h-6 mr-1"
            />
            <span className="cursor-pointer text-lg font-extrabold text-[#5C543C] font-(family-name:--font-IBMPlexMono)">
              Schedgy
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#5C543C] mb-6 font-(family-name:--font-IBMPlexSans) mt-10">
            Create Account
          </h2>
          {formError && (
            <p className="text-red-500 text-sm mb-3">
              Username or email is already taken
            </p>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
            autoComplete="off"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label
                  htmlFor="firstName"
                  className="block text-[#5C543C] font-medium mb-1 font-(family-name:--font-IBMPlexSans)"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  autoComplete="off"
                  {...register("firstName")}
                  className="block w-full px-3 py-2 bg-[#D9D9D9] rounded-md font-(family-name:--font-IBMPlexSans) border-none focus:ring-2 focus:ring-yellow-300 text-sm"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label
                  htmlFor="lastName"
                  className="block text-[#5C543C] font-medium mb-1 font-(family-name:--font-IBMPlexSans)"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  autoComplete="off"
                  {...register("lastName")}
                  className="block w-full px-3 py-2 bg-[#D9D9D9] rounded-md font-(family-name:--font-IBMPlexSans) border-none focus:ring-2 focus:ring-yellow-300 text-sm"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="flex-1 flex flex-col gap-1">
                <label
                  htmlFor="userName"
                  className="block text-[#5C543C] font-medium mb-1 font-(family-name:--font-IBMPlexSans)"
                >
                  User Name
                </label>
                <input
                  id="userName"
                  type="text"
                  placeholder="Enter your user name"
                  autoComplete="off"
                  {...register("userName")}
                  className="block w-full px-3 py-2 bg-[#D9D9D9] rounded-md font-(family-name:--font-IBMPlexSans) border-none focus:ring-2 focus:ring-yellow-300 text-sm"
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="block text-[#5C543C] font-medium mb-1 font-(family-name:--font-IBMPlexSans)"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="new-email"
                  {...register("email")}
                  className="block w-full px-3 py-2 bg-[#D9D9D9] rounded-md font-(family-name:--font-IBMPlexSans) border-none focus:ring-2 focus:ring-yellow-300 text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label
                htmlFor="password"
                className="block text-[#5C543C] font-medium mb-1 font-(family-name:--font-IBMPlexSans)"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                {...register("password")}
                className="block w-full px-3 py-2 bg-[#D9D9D9] rounded-md font-(family-name:--font-IBMPlexSans) border-none focus:ring-2 focus:ring-yellow-300 text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-sm font-(family-name:--font-IBMPlexSans) text-[#5C543C]">
                {"Already have an Account? "}
                <span
                  className="underline cursor-pointer font-bold hover:text-[#0c4626]"
                  onClick={() => navigate('/Login')}
                >
                  Login
                </span>
              </span>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="font-(family-name:--font-IBMPlexMono) cursor-pointer flex items-center py-2 px-5 border border-transparent rounded-2xl shadow-sm font-bold text-gray-800 bg-[#FCD34D] hover:bg-yellow-400 text-sm"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
        <p className="mt-6 text-xs text-center font-(family-name:--font-IBMPlexSans) text-[#5C543C] font-bold w-full max-w-xl px-2 z-30">
          WARNING: Data is not secure on the backend servers, please clone{" "}
          <a
            href="https://github.com/Traman2/Schedgy"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          if you plan on using Schedgy for personal use
        </p>
      </div>
    </div>
  );
}
