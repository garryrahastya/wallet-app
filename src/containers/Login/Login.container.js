import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import handlers from "./Login.handler";
import styles from "./Login.module.css";

const { loginUser } = handlers;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const { accessToken, user } = await loginUser(data);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Successfully Logged in");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className={styles.errorMessage}>Email is required</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className={styles.errorMessage}>Password is required</span>
          )}
        </div>
        <button type="submit" className={styles.button}>
          {isLoading ? (
            <ClipLoader color={"#ffffff"} loading={true} size={12} />
          ) : (
            "Login"
          )}
        </button>
        <h4>Don't have an account?</h4>
        <button
          type="button"
          className={styles.buttonRegister}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default Login;
