"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login as loginUser } from "../api/api.auth";
import { useUserContext } from "../context/userContext";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();
  const { setUser } = useUserContext();
  const router = useRouter();
  useAuth(false); // Redirige si ya está autenticado

  const onSubmit = async (data: FormData) => {
    clearErrors();
    try {
      const res = await loginUser(data.email, data.password);
      if (res && res.user) {
        setUser(res.user);
        router.replace("/emissions");
      }
    } catch (err: unknown) {
      let message = "Error en el login";
      if (err instanceof Error) {
        message = err.message;
      }
      setError("email", { type: "manual", message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-violet-950 p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-6 border border-violet-700"
      >
        <h1 className="text-violet-200 text-3xl font-extrabold text-center mb-4">
          Registro de huella de carbono
        </h1>
        <h2 className="text-violet-300 text-2xl font-bold text-center mb-2">
          Iniciar sesión
        </h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          {...register("email", {
            required: {
              value: true,
              message: "El correo es obligatorio",
            },
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: "Correo electrónico inválido",
            },
            minLength: {
              value: 5,
              message: "El correo debe tener al menos 5 caracteres",
            },
            maxLength: {
              value: 50,
              message: "El correo no puede superar los 50 caracteres",
            },
          })}
          className="p-3 rounded-lg border border-violet-700 bg-violet-900 text-violet-100 placeholder-violet-400 text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.email && (
          <div className="text-pink-400 text-center">
            {errors.email.message}
          </div>
        )}
        <input
          type="password"
          placeholder="Contraseña"
          {...register("password", {
            required: {
              value: true,
              message: "La contraseña es obligatoria",
            },
            minLength: {
              value: 3,
              message: "La contraseña debe tener al menos 6 caracteres",
            },
            maxLength: {
              value: 32,
              message: "La contraseña no puede superar los 32 caracteres",
            },
          })}
          className="p-3 rounded-lg border border-violet-700 bg-violet-900 text-violet-100 placeholder-violet-400 text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.password && (
          <div className="text-pink-400 text-center">
            {errors.password.message}
          </div>
        )}
        <button
          type="submit"
          className="bg-violet-700 text-violet-100 rounded-lg py-3 font-semibold text-base hover:bg-violet-800 transition-colors"
        >
          Acceder
        </button>
        <div className="text-center mt-2">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-violet-400 font-medium hover:text-violet-300"
          >
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
}
