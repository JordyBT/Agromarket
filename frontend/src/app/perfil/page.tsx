"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Sprout,
  UserRound,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
  type Profile,
} from "@/services/profileService";

import {
  getSession,
  saveSession,
} from "@/services/sessionService";

export default function PerfilPage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyProfile();

        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone ?? "");
        setCompanyName(data.companyName ?? "");
        setAddress(data.address ?? "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar el perfil."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!firstName.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!lastName.trim()) {
      setError("El apellido es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateMyProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || null,
        companyName: companyName.trim() || null,
        address: address.trim() || null,
      });

      setProfile(updated);

      setFirstName(updated.firstName);
      setLastName(updated.lastName);
      setPhone(updated.phone ?? "");
      setCompanyName(updated.companyName ?? "");
      setAddress(updated.address ?? "");

      const session = getSession();

      if (session) {
        saveSession({
          token: session.token,
          user: {
            ...session.user,
            nombre: updated.firstName,
            apellido: updated.lastName,
            empresa: updated.companyName ?? "",
          },
        });
      }

      setSuccess(
        "Perfil actualizado correctamente."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible actualizar el perfil."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] text-[#172019]">
        <p className="text-sm text-[#737b74]">
          Cargando perfil...
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] px-6 text-[#172019]">
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">
            No fue posible cargar el perfil.
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <Link
            href="/dashboard"
            className="mt-5 inline-flex rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white"
          >
            Volver al dashboard
          </Link>
        </div>
      </main>
    );
  }

  const initials =
    `${profile.firstName.charAt(
      0
    )}${profile.lastName.charAt(0)}`.toUpperCase();

  const displayName =
    profile.companyName?.trim() ||
    `${profile.firstName} ${profile.lastName}`;

  const roleLabel =
    profile.role === "Proveedor"
      ? "Proveedor agrícola"
      : profile.role === "Comprador"
      ? "Comprador"
      : profile.role;

  const completedFields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    phone,
    companyName,
    address,
  ].filter((value) => value?.trim()).length;

  const completion = Math.round(
    (completedFields / 6) * 100
  );

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Volver al dashboard
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout size={18} />
            </div>

            <span className="font-semibold">
              Agromarket
            </span>
          </Link>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl px-6 py-10"
      >
        <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
              Mi cuenta
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Perfil comercial
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#697169]">
              Administra la información principal de
              tu cuenta en Agromarket.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#173c29] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#24583b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-5">
            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#173c29] text-3xl font-semibold text-white">
                  {initials}
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">
                  {displayName}
                </h2>

                <p className="mt-1 text-sm text-[#737b74]">
                  {roleLabel}
                </p>

                {profile.isVerified ? (
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-[#e5eadb] px-4 py-2 text-xs font-semibold text-[#315f3f]">
                    <BadgeCheck size={15} />
                    Perfil verificado
                  </div>
                ) : (
                  <div className="mt-4 rounded-full bg-[#eeece3] px-4 py-2 text-xs font-semibold text-[#747c75]">
                    Perfil no verificado
                  </div>
                )}
              </div>

              <div className="mt-7 space-y-4 border-t border-[#172019]/10 pt-6">
                <div className="flex items-start gap-3">
                  <Mail
                    size={17}
                    className="mt-0.5 shrink-0 text-[#667067]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-[#818881]">
                      Correo
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={17}
                    className="mt-0.5 shrink-0 text-[#667067]"
                  />

                  <div>
                    <p className="text-xs text-[#818881]">
                      Teléfono
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {phone || "Sin registrar"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#667067]"
                  />

                  <div>
                    <p className="text-xs text-[#818881]">
                      Dirección
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {address || "Sin registrar"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[#173c29] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Perfil al {completion}%
                  </p>

                  <p className="mt-1 text-xs text-white/50">
                    Completa tus datos principales
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#b9c995]"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </section>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Información personal
                    </h2>

                    <p className="mt-1 text-xs text-[#7b827b]">
                      Datos principales de la cuenta
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Nombre
                  </label>

                  <input
                    id="nombre"
                    type="text"
                    maxLength={100}
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none focus:border-[#39724a]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="apellido"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Apellido
                  </label>

                  <input
                    id="apellido"
                    type="text"
                    maxLength={100}
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none focus:border-[#39724a]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="correo"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Correo electrónico
                  </label>

                  <input
                    id="correo"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-[#172019]/10 bg-[#eceae2] px-4 py-3.5 text-sm text-[#777d78]"
                  />

                  <p className="mt-2 text-xs text-[#8a908a]">
                    El correo no se modifica desde el
                    perfil.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    type="text"
                    maxLength={30}
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="+502 5555 5555"
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none focus:border-[#39724a]"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                    <Building2 size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Información comercial
                    </h2>

                    <p className="mt-1 text-xs text-[#7b827b]">
                      Información asociada a tu perfil
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label
                    htmlFor="empresa"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Empresa o nombre comercial
                  </label>

                  <input
                    id="empresa"
                    type="text"
                    maxLength={200}
                    value={companyName}
                    onChange={(event) =>
                      setCompanyName(event.target.value)
                    }
                    placeholder="Nombre de tu empresa"
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none focus:border-[#39724a]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="direccion"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Dirección
                  </label>

                  <textarea
                    id="direccion"
                    rows={4}
                    maxLength={300}
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="Municipio, departamento o dirección comercial"
                    className="w-full resize-none rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm leading-6 outline-none focus:border-[#39724a]"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[#7b827b]">
                Tipo de cuenta
              </p>

              <p className="mt-2 text-xl font-semibold">
                {profile.role}
              </p>

              <p className="mt-2 text-sm text-[#697169]">
                El rol de la cuenta se asigna durante el
                registro y no puede modificarse desde el
                perfil.
              </p>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#173c29] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#24583b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Guardando..."
                  : "Guardar perfil"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}