import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [invalidPass, setInvalidPass] = useState(false);

  const handleDashboard = () => {
    navigate("/Dashboard");
  };

  const handleHome = () => {
    navigate("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await axios
      .post("http://localhost:3000/auth", data)
      .then((response) => {
        const token = response.data;
        if (token) {
          localStorage.setItem("token", token);
          handleDashboard();
        } else {
          console.error("No token received from server");
        }
      })
      .catch((error) => {
        console.error("Login error: ", error.message);
        setInvalidPass(true);
      });
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Section - Bigger */}
      <div className="flex-3 bg-[url(/bg-bottom.jpg)] bg-cover bg-center relative pl-25 flex items-center">
        <div className="absolute inset-0 bg-[#EED2D2] opacity-60"></div>
        <div className="text-left relative">
          <div className="w-70 h-70 mb-20 flex items-center justify-center">
            <img
              src="/icons/noto--money-bag.svg"
              alt="Logo"
              className="w-full h-full"
            />
          </div>
          <h1
            className="ml-6 text-[60px] font-semibold text-[#0c4626] mb-6 leading-none font-(family-name:--font-IBMPlexMono)"
          >
            Welcome
            <br />
            Back
          </h1>
          <div className="ml-6 max-w-140">
            <p
              className="text-2xl font-semibold text-black font-(family-name:--font-IBMPlexSans)"
            >
              Login to Schedgy & manage everything college throws at you.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-2 bg-[#f7eaea] flex flex-col items-center justify-center ">
        <div className="w-full max-w-sm bg-[#F4D5D5] p-8 rounded-lg shadow-md">
          <h2
            onClick={() => handleHome()}
            className="cursor-pointer text-left font-(family-name:--font-IBMPlexMono) font-extrabold text-3xl text-[#5C543C] mb-2"
          >
            Schedgy
          </h2>
          {invalidPass && (
              <div
                className="transition-all font-(family-name:--font-IBMPlexSans) duration-300 ease-in-out bg-red-200 border border-red-400 text-red-600 font-bold rounded-lg shadow-md px-4 py-3 mb-6 flex items-center justify-center animate-fade-in min-h-12"
              >
                Invalid email or password
              </div>
            )}
          <p className="text-sm font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-7">
            Please enter your details
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email">Email</label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="block font-(family-name:--font-IBMPlexSans) w-full px-4 py-3 bg-[#f1eaea] border border-transparent rounded-md"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-(family-name:--font-IBMPlexSans) text-sm font-medium text-[#5C543C]"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  className="block font-(family-name:--font-IBMPlexSans) w-full px-4 py-3 bg-[#f1eaea] border border-transparent rounded-md"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="font-(family-name:--font-IBMPlexSans) cursor-pointer flex item-center py-3 px-7 border border-transparent rounded-3xl shadow-sm font-bold text-gray-800 bg-[#FCD34D] hover:bg-yellow-400"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="mt-6 text-xs text-center font-(family-name:--font-IBMPlexSans) text-[#5C543C] font-bold w-full max-w-sm">
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
    </div>
  );
}
