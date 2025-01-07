// import { postData } from "@/api/ClientFunction";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// export function Login() {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const res = await postData("admin/adminlogin", { name, password });
//     if (res.success || res.status) {
//       toast.success(res.message);
//       localStorage.setItem("token", res.data);
//       navigate("/", { replace: true });
//     }
//     setName("");
//     setPassword("");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-200">
//       <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
//         <div className="flex items-center justify-center">
//           <img src="/logo.png" alt="integritygrove.tech" width={150} />
//         </div>
//         <h1 className="text-2xl font-semibold text-center text-gray-800">
//           Login
//         </h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="name" className="text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Your name"
//               required
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="text-sm font-medium text-gray-700"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               required
//               onChange={(e) => setPassword(e.target.value)}
//               className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Your password"
//             />
//           </div>
//           <div>
//             <button
//               type="submit"
//               className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Sign In
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import { postData } from "@/api/ClientFunction";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [otpStep, setOtpStep] = useState(false);

  // Step 1: Handle initial login (email and password submission)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await postData("admin/adminloginrequest", { email, password });
    console.log(res);
    if (res.status) {

      toast.success(res.message);
      setToken(res.data); // Save the token with OTP
      setOtpStep(true); // Move to OTP step
    } else {
      toast.error(res.message);
    }
  };

  // Step 2: Handle OTP submission
  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    const res = await postData("admin/adminlogin", { email, otp, token });
    console.log(res);

    if (res.status) {
      toast.success(res.message);
      localStorage.setItem("token", res.data); // Save the final token
      navigate("/", { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="integritygrove.tech" width={150} />
        </div>
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          {otpStep ? "Enter OTP" : "Login"}
        </h1>
        {!otpStep ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your password"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter OTP"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
