import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  Camera,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Sprout,
  UserRound,
  Warehouse,
} from "lucide-react";

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10 bg-[#f4f2ea]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition-colors hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Volver al dashboard
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout size={18} />
            </div>

            <span className="font-semibold tracking-[-0.03em]">
              Agromarket
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
              Mi cuenta
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Perfil comercial
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#697169]">
              Administra la información que otros compradores y proveedores
              podrán consultar dentro de la plataforma.
            </p>
          </div>

          <button
            type="button"
            className="rounded-full bg-[#173c29] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
          >
            Guardar cambios
          </button>
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-5">
            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#173c29] text-3xl font-semibold text-white">
                    AP
                  </div>

                  <button
                    type="button"
                    aria-label="Cambiar imagen"
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#fffdf7] bg-[#dfe5d4] text-[#173c29]"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em]">
                  Agrícola Los Pinos
                </h2>

                <p className="mt-1 text-sm text-[#737b74]">
                  Proveedor agrícola
                </p>

                <div className="mt-4 flex items-center gap-2 rounded-full bg-[#e5eadb] px-4 py-2 text-xs font-semibold text-[#315f3f]">
                  <BadgeCheck size={15} />
                  Perfil verificado
                </div>
              </div>

              <div className="mt-7 space-y-4 border-t border-[#172019]/10 pt-6">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#667067]"
                  />

                  <div>
                    <p className="text-xs text-[#818881]">
                      Ubicación
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Zacapa, Guatemala
                    </p>
                  </div>
                </div>

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
                      contacto@lospinos.com
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
                      +502 5555 5555
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
                    Perfil al 80%
                  </p>

                  <p className="mt-1 text-xs text-white/50">
                    Completa tus datos comerciales
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-[#b9c995]" />
              </div>

              <p className="mt-4 text-xs leading-5 text-white/55">
                Agrega información adicional para generar mayor confianza en
                tus operaciones.
              </p>
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
                    defaultValue="Alejandro"
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
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
                    defaultValue="Pérez"
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
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
                    defaultValue="contacto@lospinos.com"
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
                  />
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
                    defaultValue="+502 5555 5555"
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
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
                      Información visible dentro del marketplace
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
                    defaultValue="Agrícola Los Pinos"
                    className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="departamento"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Departamento
                    </label>

                    <select
                      id="departamento"
                      defaultValue="Zacapa"
                      className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
                    >
                      <option>Zacapa</option>
                      <option>Chiquimula</option>
                      <option>Jalapa</option>
                      <option>Jutiapa</option>
                      <option>Guatemala</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="municipio"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Municipio
                    </label>

                    <input
                      id="municipio"
                      type="text"
                      defaultValue="Zacapa"
                      className="w-full rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="descripcion"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Descripción del negocio
                  </label>

                  <textarea
                    id="descripcion"
                    rows={5}
                    defaultValue="Somos productores y distribuidores de granos básicos para compradores mayoristas y empresas del sector alimentario."
                    className="w-full resize-none rounded-xl border border-[#172019]/15 bg-[#f8f6ef] px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                    <Warehouse size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Tipo de participación
                    </h2>

                    <p className="mt-1 text-xs text-[#7b827b]">
                      Define cómo utilizarás Agromarket
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2">
                <label className="cursor-pointer rounded-2xl border-2 border-[#39724a] bg-[#edf0e6] p-5">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 h-4 w-4 accent-[#173c29]"
                    />

                    <div>
                      <p className="font-semibold">
                        Quiero vender
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#697169]">
                        Publicar productos, administrar inventario y recibir
                        reservas.
                      </p>
                    </div>
                  </div>
                </label>

                <label className="cursor-pointer rounded-2xl border border-[#172019]/10 bg-[#f8f6ef] p-5">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 h-4 w-4 accent-[#173c29]"
                    />

                    <div>
                      <p className="font-semibold">
                        Quiero comprar
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#697169]">
                        Buscar productos, contactar proveedores y realizar
                        reservas.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="button"
                className="rounded-full bg-[#173c29] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
              >
                Guardar perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}