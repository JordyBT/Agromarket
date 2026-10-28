"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  ShieldCheck,
  Sprout,
} from "lucide-react";

import { saveSession } from "@/services/sessionService";

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const initialForm: LoginForm = {
  email: "",
  password: "",
  remember: false,
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function updateField(
    field: keyof LoginForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function validateForm() {
    const newErrors: LoginErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Ingresa tu correo electrónico.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(form.email.trim())) {
        newErrors.email =
          "Ingresa un correo electrónico válido.";
      }
    }

    if (!form.password) {
      newErrors.password = "Ingresa tu contraseña.";
    } else if (form.password.length < 8) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      /*
       * Esta sesión es temporal mientras el backend
       * de autenticación todavía no está conectado.
       *
       * Después reemplazaremos estos datos por la
       * respuesta real de ASP.NET Core.
       */
      saveSession({
        token: "token-desarrollo-agromarket",
        user: {
          id: "1",
          nombre: "Carlos",
          apellido: "López",
          email: form.email.trim(),
          empresa: "Agro Oriente",
          rol: "Proveedor",
        },
      });

      router.push("/dashboard");
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#173c29] text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-[0.08]">
            <div className="absolute left-[20%] top-0 h-full w-px bg-white" />
            <div className="absolute left-[50%] top-0 h-full w-px bg-white" />
            <div className="absolute left-[80%] top-0 h-full w-px bg-white" />

            <div className="absolute left-0 top-[25%] h-px w-full bg-white" />
            <div className="absolute left-0 top-[55%] h-px w-full bg-white" />
            <div className="absolute left-0 top-[82%] h-px w-full bg-white" />
          </div>

          <div className="relative z-10 p-10 xl:p-14">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#173c29]">
                <Sprout size={21} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-xl font-semibold tracking-[-0.04em]">
                  Agromarket
                </p>

                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Comercio agrícola B2B
                </p>
              </div>
            </Link>
          </div>

          <div className="relative z-10 px-10 pb-10 xl:px-14 xl:pb-14">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
              <ShieldCheck size={21} />
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] xl:text-6xl">
              Tu mercado agrícola,
              <span className="text-[#b9c995]">
                {" "}
                siempre disponible.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/60">
              Consulta publicaciones, administra tus operaciones y mantén el
              contacto con compradores y proveedores desde un mismo lugar.
            </p>

            <div className="mt-12 flex items-center gap-8 border-t border-white/15 pt-6">
              <div>
                <p className="text-sm font-semibold">
                  Compra
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Encuentra oferta disponible
                </p>
              </div>

              <div className="h-10 w-px bg-white/15" />

              <div>
                <p className="text-sm font-semibold">
                  Vende
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Publica y administra inventario
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen flex-col">
          <header className="flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-[#59635b] transition-colors hover:text-[#183f2a]"
            >
              <ArrowLeft size={17} />
              Volver al mercado
            </Link>

            <Link
              href="/registro"
              className="text-sm font-semibold text-[#183f2a] hover:underline"
            >
              Crear una cuenta
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
            <div className="w-full max-w-md">
              <div className="mb-9">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#183f2a] text-white lg:hidden">
                  <Sprout size={20} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
                  Bienvenido
                </p>

                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
                  Inicia sesión.
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#697169]">
                  Ingresa con la cuenta que utilizas para comprar o vender
                  dentro de Agromarket.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Correo electrónico
                  </label>

                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-[#fffdf7] px-4 transition ${
                      errors.email
                        ? "border-red-500"
                        : "border-[#172019]/15 focus-within:border-[#39724a] focus-within:ring-2 focus-within:ring-[#39724a]/10"
                    }`}
                  >
                    <Mail
                      size={18}
                      className="shrink-0 text-[#798179]"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="nombre@empresa.com"
                      disabled={isLoading}
                      className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b] disabled:cursor-not-allowed"
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold"
                    >
                      Contraseña
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-[#4d7356] transition hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-[#fffdf7] px-4 transition ${
                      errors.password
                        ? "border-red-500"
                        : "border-[#172019]/15 focus-within:border-[#39724a] focus-within:ring-2 focus-within:ring-[#39724a]/10"
                    }`}
                  >
                    <Lock
                      size={18}
                      className="shrink-0 text-[#798179]"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="Ingresa tu contraseña"
                      disabled={isLoading}
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b] disabled:cursor-not-allowed"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      disabled={isLoading}
                      className="shrink-0 text-[#747d75] transition hover:text-[#173c29] disabled:cursor-not-allowed"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(event) =>
                      updateField(
                        "remember",
                        event.target.checked
                      )
                    }
                    disabled={isLoading}
                    className="h-4 w-4 accent-[#183f2a]"
                  />

                  <span className="text-sm text-[#626b63]">
                    Mantener mi sesión iniciada
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#183f2a] px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-[#24583b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
                >
                  {isLoading ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      Entrar a Agromarket

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-[#172019]/10 pt-6 text-center">
                <p className="text-sm text-[#6b736c]">
                  ¿Todavía no tienes una cuenta?{" "}
                  <Link
                    href="/registro"
                    className="font-semibold text-[#183f2a] hover:underline"
                  >
                    Regístrate
                  </Link>
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-[#172019]/10 bg-[#e8e6da]/60 p-4">
                <p className="text-xs font-semibold text-[#4f6454]">
                  Modo de desarrollo
                </p>

                <p className="mt-2 text-xs leading-5 text-[#747c75]">
                  Por ahora cualquier correo válido y una contraseña de al
                  menos 8 caracteres permiten continuar. Cuando conectemos
                  ASP.NET Core, estas credenciales serán verificadas por el
                  servidor.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}