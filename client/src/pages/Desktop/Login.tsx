import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const handleDashboard = () => {
    navigate("/Dashboard");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    console.log(data);
    handleDashboard();
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
            className="ml-6 text-[60px] font-semibold text-[#0c4626] mb-6 leading-none"
            style={{ fontFamily: "IBM Plex Mono" }}
          >
            Welcome
            <br />
            Back
          </h1>
          <div className="ml-6 max-w-140">
            <p
              className="text-2xl font-semibold text-black"
              style={{ fontFamily: "IBM Plex Sans" }}
            >
              Login to Schedgy & manage everything college throws at you.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-2 bg-[#f7eaea] flex flex-col items-center justify-center ">
        <div className="w-full max-w-sm bg-[#F4D5D5]/[0.64] p-8 rounded-lg shadow-md">
          <h2 className="text-left font-(family-name:--font-IBMPlexMono) font-extrabold text-3xl text-[#5C543C] mb-8">
            Schedgy
          </h2>
          <p className="text-sm font-(family-name:--font-IBMPlexSans) text-[#5C543C] mb-4">
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
                  className="block font-(family-name:--font-IBMPlexSans) w-full px-4 py-3 bg-[#D9D9D9] border border-transparent rounded-md"
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
                  className="block font-(family-name:--font-IBMPlexSans) w-full px-4 py-3 bg-[#D9D9D9] border border-transparent rounded-md"
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
