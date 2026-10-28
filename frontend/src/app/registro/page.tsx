"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sprout,
  UserRound,
} from "lucide-react";

type RegisterForm = {
  nombre: string;
  apellido: string;
  empresa: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const initialForm: RegisterForm = {
  nombre: "",
  apellido: "",
  empresa: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

export default function RegistroPage() {
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  function updateField(
    field: keyof RegisterForm,
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

    setSuccess(false);
  }

  function validateForm() {
    const newErrors: RegisterErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "Ingresa tu nombre.";
    } else if (form.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre es demasiado corto.";
    }

    if (!form.apellido.trim()) {
      newErrors.apellido = "Ingresa tu apellido.";
    } else if (form.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido es demasiado corto.";
    }

    if (!form.empresa.trim()) {
      newErrors.empresa =
        "Ingresa el nombre de tu empresa o nombre comercial.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Ingresa tu correo electrónico.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(form.email.trim())) {
        newErrors.email = "Ingresa un correo electrónico válido.";
      }
    }

    if (!form.password) {
      newErrors.password = "Crea una contraseña.";
    } else if (form.password.length < 8) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres.";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password =
        "La contraseña debe incluir al menos una letra mayúscula.";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password =
        "La contraseña debe incluir al menos una letra minúscula.";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password =
        "La contraseña debe incluir al menos un número.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (!form.terms) {
      newErrors.terms =
        "Debes aceptar los términos y políticas para continuar.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      setSuccess(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSuccess(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <div className="grid min-h-screen lg:grid-cols-[0.85fr_1.15fr]">
        <section className="relative hidden overflow-hidden bg-[#173c29] text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-[0.08]">
            <div className="absolute left-[20%] top-0 h-full w-px bg-white" />
            <div className="absolute left-[50%] top-0 h-full w-px bg-white" />
            <div className="absolute left-[80%] top-0 h-full w-px bg-white" />

            <div className="absolute left-0 top-[20%] h-px w-full bg-white" />
            <div className="absolute left-0 top-[50%] h-px w-full bg-white" />
            <div className="absolute left-0 top-[80%] h-px w-full bg-white" />
          </div>

          <div className="relative z-10 p-10 xl:p-14">
            <Link href="/" className="inline-flex items-center gap-3">
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b9c995]">
              Una sola cuenta
            </p>

            <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] xl:text-6xl">
              Compra, vende y haz crecer{" "}
              <span className="text-[#b9c995]">
                tu red comercial.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/60">
              Crea tu perfil para acceder al mercado, contactar proveedores
              y administrar tus operaciones dentro de la plataforma.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-5 border-t border-white/15 pt-6">
              <div>
                <p className="text-xl font-semibold">01</p>

                <p className="mt-2 text-xs leading-5 text-white/50">
                  Crea tu cuenta
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold">02</p>

                <p className="mt-2 text-xs leading-5 text-white/50">
                  Completa tu perfil
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold">03</p>

                <p className="mt-2 text-xs leading-5 text-white/50">
                  Entra al mercado
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
              href="/login"
              className="text-sm font-semibold text-[#183f2a] hover:underline"
            >
              Ya tengo una cuenta
            </Link>
          </header>

          <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="w-full max-w-2xl">
              {success && (
                <div className="mb-7 flex items-start gap-4 rounded-2xl border border-[#4d7c59]/20 bg-[#e4ebdc] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173c29] text-white">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Tus datos son válidos.
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#5e695f]">
                      El registro está listo para conectarse con la API.
                      Por ahora no se ha creado una cuenta en la base de
                      datos.
                    </p>

                    <Link
                      href="/login"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#173c29] hover:underline"
                    >
                      Ir a iniciar sesión
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#183f2a] text-white lg:hidden">
                  <Sprout size={20} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
                  Nueva cuenta
                </p>

                <h2 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
                  Empieza en Agromarket.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#697169]">
                  Ingresa tus datos principales. Después podrás completar
                  la información comercial de tu perfil.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Nombre
                    </label>

                    <div
                      className={`flex items-center gap-3 rounded-xl border bg-[#fffdf7] px-4 transition ${
                        errors.nombre
                          ? "border-red-500"
                          : "border-[#172019]/15 focus-within:border-[#39724a] focus-within:ring-2 focus-within:ring-[#39724a]/10"
                      }`}
                    >
                      <UserRound
                        size={18}
                        className="shrink-0 text-[#798179]"
                      />

                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        autoComplete="given-name"
                        value={form.nombre}
                        onChange={(event) =>
                          updateField("nombre", event.target.value)
                        }
                        placeholder="Tu nombre"
                        className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b]"
                      />
                    </div>

                    {errors.nombre && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="apellido"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Apellido
                    </label>

                    <div
                      className={`flex items-center gap-3 rounded-xl border bg-[#fffdf7] px-4 transition ${
                        errors.apellido
                          ? "border-red-500"
                          : "border-[#172019]/15 focus-within:border-[#39724a] focus-within:ring-2 focus-within:ring-[#39724a]/10"
                      }`}
                    >
                      <UserRound
                        size={18}
                        className="shrink-0 text-[#798179]"
                      />

                      <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        autoComplete="family-name"
                        value={form.apellido}
                        onChange={(event) =>
                          updateField("apellido", event.target.value)
                        }
                        placeholder="Tu apellido"
                        className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b]"
                      />
                    </div>

                    {errors.apellido && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {errors.apellido}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="empresa"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Empresa o nombre comercial
                  </label>

                  <div
                    className={`flex items-center gap-3 rounded-xl border bg-[#fffdf7] px-4 transition ${
                      errors.empresa
                        ? "border-red-500"
                        : "border-[#172019]/15 focus-within:border-[#39724a] focus-within:ring-2 focus-within:ring-[#39724a]/10"
                    }`}
                  >
                    <Building2
                      size={18}
                      className="shrink-0 text-[#798179]"
                    />

                    <input
                      id="empresa"
                      name="empresa"
                      type="text"
                      value={form.empresa}
                      onChange={(event) =>
                        updateField("empresa", event.target.value)
                      }
                      placeholder="Ej. Agrícola Los Pinos"
                      className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b]"
                    />
                  </div>

                  {errors.empresa ? (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.empresa}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-[#858c86]">
                      Si trabajas de forma independiente, puedes utilizar
                      tu nombre.
                    </p>
                  )}
                </div>

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
                      className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b]"
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Contraseña
                    </label>

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
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(event) =>
                          updateField("password", event.target.value)
                        }
                        placeholder="Mínimo 8 caracteres"
                        className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((current) => !current)
                        }
                        className="shrink-0 text-[#747d75] transition hover:text-[#173c29]"
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

                    {errors.password ? (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {errors.password}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs leading-5 text-[#858c86]">
                        Usa 8 caracteres, mayúscula, minúscula y número.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Confirmar contraseña
                    </label>

                    <div
                      className={`flex items-center gap-3 rounded-xl border bg-[#fffdf7] px-4 transition ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[#172019]/15 focus-within:border-[#39724a] focus-within:ring-2 focus-within:ring-[#39724a]/10"
                      }`}
                    >
                      <Lock
                        size={18}
                        className="shrink-0 text-[#798179]"
                      />

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        autoComplete="new-password"
                        value={form.confirmPassword}
                        onChange={(event) =>
                          updateField(
                            "confirmPassword",
                            event.target.value
                          )
                        }
                        placeholder="Repite tu contraseña"
                        className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-[#9ba09b]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (current) => !current
                          )
                        }
                        className="shrink-0 text-[#747d75] transition hover:text-[#173c29]"
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="mt-2 text-xs font-medium text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 pt-1">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(event) =>
                        updateField("terms", event.target.checked)
                      }
                      className="mt-1 h-4 w-4 shrink-0 accent-[#183f2a]"
                    />

                    <span className="text-sm leading-6 text-[#626b63]">
                      Acepto los términos de uso y las políticas de
                      privacidad de la plataforma.
                    </span>
                  </label>

                  {errors.terms && (
                    <p className="ml-7 mt-2 text-xs font-medium text-red-600">
                      {errors.terms}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#183f2a] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#24583b] active:scale-[0.99]"
                >
                  Crear mi cuenta

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              <div className="mt-7 border-t border-[#172019]/10 pt-6 text-center">
                <p className="text-sm text-[#6b736c]">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#183f2a] hover:underline"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}