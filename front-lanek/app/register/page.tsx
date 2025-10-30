"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../../api/api.auth";
import { useUserContext } from "../../context/userContext";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormData>();
  const { setUser } = useUserContext();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    clearErrors();
    if (data.password !== data.confirm) {
      setError("confirm", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      return;
    }
    try {
      const res = await registerUser(data.name, data.email, data.password);
      if (res && res.user) {
        setUser(res.user);
        router.replace("/emissions");
      }
    } catch (err: unknown) {
      let message = "Error en el registro";
      if (err instanceof Error) {
        message = err.message;
      }
      setError("email", {
        type: "manual",
        message,
      });
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
          Registrarse
        </h2>
        <input
          type="text"
          placeholder="Nombre"
          {...register("name", { required: "El nombre es obligatorio" })}
          className="p-3 rounded-lg border border-violet-700 bg-violet-900 text-violet-100 placeholder-violet-400 text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.name && (
          <div className="text-pink-400 text-center">{errors.name.message}</div>
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          {...register("email", { required: "El correo es obligatorio" })}
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
            required: "La contraseña es obligatoria",
          })}
          className="p-3 rounded-lg border border-violet-700 bg-violet-900 text-violet-100 placeholder-violet-400 text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.password && (
          <div className="text-pink-400 text-center">
            {errors.password.message}
          </div>
        )}
        <input
          type="password"
          placeholder="Confirmar contraseña"
          {...register("confirm", { required: "Confirma la contraseña" })}
          className="p-3 rounded-lg border border-violet-700 bg-violet-900 text-violet-100 placeholder-violet-400 text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors.confirm && (
          <div className="text-pink-400 text-center">
            {errors.confirm.message}
          </div>
        )}
        <button
          type="submit"
          className="bg-violet-700 text-violet-100 rounded-lg py-3 font-semibold text-base hover:bg-violet-800 transition-colors"
        >
          Registrarse
        </button>
        <div className="text-center mt-2">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/"
            className="text-violet-400 font-medium hover:text-violet-300"
          >
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
