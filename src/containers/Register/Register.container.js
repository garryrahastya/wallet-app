import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import handlers from "./Register.handler";
import styles from "./Register.module.css";
import { toast, Toaster } from "react-hot-toast";

const { registerUser } = handlers;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));

  if (userData) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Successfully registered");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="text"
            className={styles.input}
            placeholder="Username"
            {...register("username", { required: true })}
          />
          {errors.email && (
            <span className={styles.errorMessage}>Username is required</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fullname" className={styles.label}>
            Full Name
          </label>
          <input
            id="fullname"
            type="text"
            className={styles.input}
            placeholder="Full Name"
            {...register("fullname", { required: true })}
          />
          {errors.email && (
            <span className={styles.errorMessage}>Full Name is required</span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="img" className={styles.label}>
            Profile Picture
          </label>
          <input
            id="img"
            type="text"
            className={styles.input}
            placeholder="Image Url"
            {...register("imgurl", { required: true })}
          />
          {errors.email && (
            <span className={styles.errorMessage}>Image Url is required</span>
          )}
        </div>
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
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <ClipLoader color="#ffffff" loading={isLoading} size={20} />
          ) : (
            "Register"
          )}
        </button>
        <button
          type="button"
          className={styles.buttonLogin}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </form>
      <Toaster />
    </div>
  );
};

export default Register;
