"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  Boxes,
  ChevronRight,
  CircleUserRound,
  Clock3,
  LayoutDashboard,
  Leaf,
  LogOut,
  MapPin,
  MessageSquareText,
  PackageCheck,
  Search,
  Settings,
  ShoppingBasket,
  Sprout,
  Store,
  TrendingUp,
  UserRound,
  Wheat,
} from "lucide-react";

import {
  clearSession,
  getUser,
} from "@/services/sessionService";

import type { AuthUser } from "@/services/authService";

const navigation = [
  {
    name: "Inicio",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    name: "Mercado",
    href: "/productos",
    icon: Store,
    active: false,
  },
  {
    name: "Publicaciones",
    href: "/publicaciones",
    icon: Boxes,
    active: false,
  },
  {
    name: "Reservas",
    href: "/reservas",
    icon: ShoppingBasket,
    active: false,
  },
  {
    name: "Mensajes",
    href: "/mensajes",
    icon: MessageSquareText,
    active: false,
  },
  {
    name: "Perfil",
    href: "/perfil",
    icon: UserRound,
    active: false,
  },
];

const stats = [
  {
    label: "Publicaciones activas",
    value: "4",
    detail: "2 con alta disponibilidad",
    icon: Boxes,
  },
  {
    label: "Reservas en proceso",
    value: "2",
    detail: "1 pendiente de respuesta",
    icon: ShoppingBasket,
  },
  {
    label: "Mensajes nuevos",
    value: "3",
    detail: "2 conversaciones activas",
    icon: MessageSquareText,
  },
  {
    label: "Operaciones completadas",
    value: "12",
    detail: "Durante los últimos 30 días",
    icon: PackageCheck,
  },
];

const activity = [
  {
    title: "Nueva reserva recibida",
    description: "30 quintales de maíz amarillo",
    time: "Hace 18 minutos",
    icon: ShoppingBasket,
  },
  {
    title: "Consulta sobre una publicación",
    description:
      "Un comprador preguntó por disponibilidad de frijol negro",
    time: "Hace 1 hora",
    icon: MessageSquareText,
  },
  {
    title: "Publicación actualizada",
    description:
      "El inventario de tomate fue actualizado a 160 cajas",
    time: "Ayer, 16:42",
    icon: Boxes,
  },
];

const marketItems = [
  {
    name: "Maíz amarillo",
    location: "Zacapa",
    price: "Q 185.00",
    unit: "quintal",
    availability: "240 qq",
    icon: Wheat,
  },
  {
    name: "Frijol negro",
    location: "Chiquimula",
    price: "Q 465.00",
    unit: "quintal",
    availability: "85 qq",
    icon: Leaf,
  },
  {
    name: "Tomate",
    location: "Jalapa",
    price: "Q 145.00",
    unit: "caja",
    availability: "160 cajas",
    icon: Sprout,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  const initials = user
    ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
    : "AG";

  const displayName = user
    ? `${user.nombre} ${user.apellido}`
    : "Usuario";

  const companyName = user?.empresa || "Agromarket";

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[#172019]/10 bg-[#173c29] text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#173c29]">
                <Sprout size={20} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[-0.035em]">
                  Agromarket
                </p>

                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Comercio agrícola B2B
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 flex-col justify-between px-4 py-6">
            <nav className="space-y-1">
              <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Navegación
              </p>

              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-white text-[#173c29]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div>
              <div className="mb-4 border-t border-white/10 pt-5">
                <Link
                  href="/configuracion"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Settings size={18} strokeWidth={1.8} />
                  Configuración
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/65 transition-colors hover:bg-red-400/10 hover:text-red-200"
                >
                  <LogOut size={18} strokeWidth={1.8} />
                  Cerrar sesión
                </button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b9c995] text-sm font-semibold text-[#173c29]">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {companyName}
                    </p>

                    <p className="truncate text-xs text-white/45">
                      {user?.rol || "Cuenta de usuario"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[#172019]/10 bg-[#f4f2ea]/95 backdrop-blur">
            <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 xl:px-10">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#173c29] text-white">
                  <Sprout size={19} />
                </div>

                <p className="font-semibold">
                  Agromarket
                </p>
              </div>

              <div className="hidden max-w-md flex-1 items-center gap-3 rounded-full border border-[#172019]/10 bg-white/60 px-4 py-2.5 md:flex">
                <Search
                  size={17}
                  className="text-[#7b837c]"
                />

                <input
                  type="text"
                  placeholder="Buscar productos, publicaciones o reservas..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8c938d]"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#172019]/10 bg-white/60 transition-colors hover:bg-white"
                  aria-label="Notificaciones"
                >
                  <Bell size={18} />

                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#377a4d]" />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setShowAccountMenu(
                        (current) => !current
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-[#172019]/10 bg-white/60 py-1.5 pl-1.5 pr-3 transition-colors hover:bg-white"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173c29] text-xs font-semibold text-white">
                      {initials}
                    </div>

                    <span className="hidden text-sm font-medium sm:block">
                      Mi cuenta
                    </span>
                  </button>

                  {showAccountMenu && (
                    <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-[#172019]/10 bg-[#fffdf7] shadow-xl shadow-black/10">
                      <div className="border-b border-[#172019]/10 px-4 py-4">
                        <p className="truncate text-sm font-semibold">
                          {displayName}
                        </p>

                        <p className="mt-1 truncate text-xs text-[#777f78]">
                          {user?.email || ""}
                        </p>
                      </div>

                      <div className="p-2">
                        <Link
                          href="/perfil"
                          onClick={() =>
                            setShowAccountMenu(false)
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-[#f0efe6]"
                        >
                          <UserRound size={17} />
                          Mi perfil
                        </Link>

                        <Link
                          href="/configuracion"
                          onClick={() =>
                            setShowAccountMenu(false)
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-[#f0efe6]"
                        >
                          <Settings size={17} />
                          Configuración
                        </Link>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                        >
                          <LogOut size={17} />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 xl:px-10 xl:py-10">
            <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-[#173c29]/10 bg-white/50 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#4d8c5d]" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4e6d56]">
                    Panel principal
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Hola, {user?.nombre || "usuario"}.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687069] sm:text-base">
                  Revisa tus publicaciones, operaciones y movimientos recientes
                  dentro del mercado.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/productos"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#172019]/15 bg-white/60 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white"
                >
                  Explorar mercado
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/publicaciones/nueva"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
                >
                  Nueva publicación
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                        />
                      </div>

                      <ChevronRight
                        size={17}
                        className="text-[#969b96]"
                      />
                    </div>

                    <p className="mt-7 text-3xl font-semibold tracking-[-0.04em]">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#767d77]">
                      {stat.detail}
                    </p>
                  </article>
                );
              })}
            </section>

            <section className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <article className="overflow-hidden rounded-2xl border border-[#172019]/10 bg-[#fffdf7]">
                <div className="flex items-center justify-between border-b border-[#172019]/10 px-5 py-5 sm:px-6">
                  <div>
                    <p className="text-lg font-semibold tracking-[-0.025em]">
                      Actividad reciente
                    </p>

                    <p className="mt-1 text-xs text-[#747c75]">
                      Últimos movimientos de tu cuenta
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-xs font-semibold text-[#3e6b49] hover:underline"
                  >
                    Ver historial
                  </button>
                </div>

                <div className="divide-y divide-[#172019]/10">
                  {activity.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex gap-4 px-5 py-5 sm:px-6"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef0e6] text-[#456a4d]">
                          <Icon
                            size={17}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                            <div>
                              <p className="text-sm font-semibold">
                                {item.title}
                              </p>

                              <p className="mt-1 text-sm leading-5 text-[#687069]">
                                {item.description}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-1.5 text-xs text-[#8a908a]">
                              <Clock3 size={13} />
                              {item.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="relative overflow-hidden rounded-2xl bg-[#173c29] p-6 text-white">
                <div className="absolute inset-0 opacity-[0.08]">
                  <div className="absolute left-1/3 top-0 h-full w-px bg-white" />
                  <div className="absolute left-2/3 top-0 h-full w-px bg-white" />
                  <div className="absolute left-0 top-1/3 h-px w-full bg-white" />
                  <div className="absolute left-0 top-2/3 h-px w-full bg-white" />
                </div>

                <div className="relative z-10 flex h-full min-h-[310px] flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10">
                      <TrendingUp size={19} />
                    </div>

                    <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/65">
                      Esta semana
                    </span>
                  </div>

                  <div className="mt-12">
                    <p className="text-xs font-medium text-[#b9c995]">
                      Movimiento comercial
                    </p>

                    <p className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
                      6 operaciones
                    </p>

                    <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                      Tu cuenta registra actividad comercial en publicaciones,
                      reservas y conversaciones.
                    </p>
                  </div>

                  <div className="mt-8 border-t border-white/15 pt-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">
                        Última actualización
                      </span>

                      <span className="font-medium">
                        Hoy
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-4 overflow-hidden rounded-2xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="flex flex-col justify-between gap-4 border-b border-[#172019]/10 px-5 py-5 sm:flex-row sm:items-end sm:px-6">
                <div>
                  <p className="text-lg font-semibold tracking-[-0.025em]">
                    Oportunidades en el mercado
                  </p>

                  <p className="mt-1 text-xs text-[#747c75]">
                    Productos publicados recientemente
                  </p>
                </div>

                <Link
                  href="/productos"
                  className="flex items-center gap-2 text-sm font-semibold text-[#315f3f]"
                >
                  Ver mercado
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="grid lg:grid-cols-3">
                {marketItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.name}
                      className={`p-5 sm:p-6 ${
                        index !== marketItems.length - 1
                          ? "border-b border-[#172019]/10 lg:border-b-0 lg:border-r"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                          <Icon
                            size={20}
                            strokeWidth={1.8}
                          />
                        </div>

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#172019]/10 transition-colors hover:bg-[#173c29] hover:text-white"
                          aria-label={`Ver ${item.name}`}
                        >
                          <ArrowRight size={15} />
                        </button>
                      </div>

                      <div className="mt-7 flex items-center gap-1.5 text-xs text-[#757d76]">
                        <MapPin size={13} />
                        {item.location}
                      </div>

                      <p className="mt-2 text-xl font-semibold tracking-[-0.025em]">
                        {item.name}
                      </p>

                      <div className="mt-5 flex items-end justify-between border-t border-[#172019]/10 pt-4">
                        <div>
                          <p className="font-semibold">
                            {item.price}
                          </p>

                          <p className="text-xs text-[#7a817b]">
                            por {item.unit}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#8a908b]">
                            Disponible
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[#42694b]">
                            {item.availability}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="mt-4 grid gap-4 md:grid-cols-2">
              <Link
                href="/perfil"
                className="group flex items-center justify-between rounded-2xl border border-[#172019]/10 bg-[#e8e6da] p-6 transition-colors hover:bg-[#dedcd0]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173c29] text-white">
                    <CircleUserRound size={19} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Completa tu perfil comercial
                    </p>

                    <p className="mt-1 text-xs text-[#6d746e]">
                      Agrega información para generar más confianza.
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/publicaciones/nueva"
                className="group flex items-center justify-between rounded-2xl border border-[#172019]/10 bg-[#e8e6da] p-6 transition-colors hover:bg-[#dedcd0]"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173c29] text-white">
                    <Boxes size={19} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Publica un nuevo producto
                    </p>

                    <p className="mt-1 text-xs text-[#6d746e]">
                      Registra inventario y empieza a recibir consultas.
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </section>

            <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-[#172019]/10 pt-6 text-xs text-[#818781] sm:flex-row">
              <p>
                Agromarket · Marketplace agrícola B2B
              </p>

              <p>
                Datos mostrados con fines de demostración.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}