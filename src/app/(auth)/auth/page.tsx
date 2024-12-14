"use client";

import { Button, Divider, Input, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/hooks/useUserContext";

export default function Signup() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const {setUser } = useUserContext();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);

    setFormData({
      name: "",
      username: "",
      password: "",
    });
  };

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = isSignUp ? "/api/user/signup" : "/api/user/signin";
      const response = await axios.post(`${endpoint}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200 ) {
        message.success("User " + (isSignUp ? "signed up" : "signed in") + " successfully");
        setUser(response.data.user);
        setLoading(false);
        router.push("/");
      } else {
        setLoading(false);
        message.error(
          isSignUp
            ? "Signup failed: "
            : "Signin failed: " + response.data.message
        );
      }
    } catch (error: unknown) {
      setLoading(false);
      message.error(
        isSignUp
          ? "Error in signup: "
          : "Error in signin: " + (error as any).message
      );
    } finally {
      setLoading(false);
    }
  };

  // const loginAsGuest = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.post(
  //       `${process.env.SERVER_URL}auth/guest`,
  //       {},
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

  //     if (response.status === 200 ) {
  //       setUser(
  //         response.data.user,
         
  //   );
  //       setLoading(false);
  //       router.push("/");
  //     } else {
  //       setLoading(false);
  //       message.error("Guest login failed: " + response.data.message);
  //     }
  //   } catch (error: unknown) {
  //     setLoading(false);
  //     message.error("Error in guest login " + (error as any).message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <div>
      <div className="w-full flex items-center justify-center mt-8 ">
        <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-black text-center">
            {isSignUp ? "Join Photoz App" : "Welcome to the Photoz App"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <Input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="h-12"
                  required
                />
              </>
            )}

            <Input
              name="username"
              placeholder="User name"
              value={formData.username}
              onChange={handleInputChange}
              className="h-12"
              required
            />

            <Input.Password
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="h-12"
              required
            />
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-0 text-lg"
              disabled={loading}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          {/* <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-4 h-12 bg-blue-600 hover:bg-blue-700 border-0 text-lg"
            onClick={() => loginAsGuest()}
            disabled={loading}
          >
            Roam as Guest User
          </Button> */}
          <Divider>
            <span className="text-gray-500">OR</span>
          </Divider>

          <p className="text-center mt-6 text-gray-600">
            {isSignUp ? "Already a member? " : "New to Photoz App? "}
            <Button
              type="link"
              onClick={toggleSignUp}
              className="text-blue-600 span-btn hover:text-blue-700 hover:underline cursor-pointer font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
