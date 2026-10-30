"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  ArrowRight,
  Boxes,
  CircleUserRound,
  Clock3,
  Heart,
  LayoutDashboard,
  Leaf,
  LogOut,
  MapPin,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  Store,
  UserRound,
  Users,
  Wheat,
} from "lucide-react";

import {
  clearSession,
  getUser,
} from "@/services/sessionService";

import type {
  AuthUser,
} from "@/services/authService";

import {
  getMyPublications,
  getPublications,
  type Publication,
} from "@/services/publicationService";

import {
  getMyReservations,
  getReceivedReservations,
  type Reservation,
} from "@/services/reservationService";

import {
  getAdminSummary,
  type AdminSummary,
} from "@/services/adminService";

function formatPrice(
  value: number
) {
  return new Intl.NumberFormat(
    "es-GT",
    {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }
  ).format(value);
}

function getIcon(
  category: string
): LucideIcon {
  const value =
    category.toLowerCase();

  if (
    value.includes("grano") ||
    value.includes("cereal")
  ) {
    return Wheat;
  }

  if (
    value.includes("hortaliza") ||
    value.includes("vegetal")
  ) {
    return Sprout;
  }

  return Leaf;
}

export default function DashboardPage() {
  const router =
    useRouter();

  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null
    );

  const [
    publications,
    setPublications,
  ] = useState<Publication[]>(
    []
  );

  const [
    marketProducts,
    setMarketProducts,
  ] = useState<Publication[]>(
    []
  );

  const [
    reservations,
    setReservations,
  ] = useState<Reservation[]>(
    []
  );

  const [
    adminSummary,
    setAdminSummary,
  ] =
    useState<AdminSummary | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    const currentUser =
      getUser();

    if (!currentUser) {
      router.replace(
        "/login"
      );

      return;
    }

    const authenticatedUser =
      currentUser;

    setUser(
      authenticatedUser
    );

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const market =
          await getPublications();

        setMarketProducts(
          market
        );

        if (
          authenticatedUser.rol ===
          "Proveedor"
        ) {
          const [
            mine,
            received,
          ] =
            await Promise.all([
              getMyPublications(),
              getReceivedReservations(),
            ]);

          setPublications(
            mine
          );

          setReservations(
            received
          );
        } else if (
          authenticatedUser.rol ===
          "Comprador"
        ) {
          const mine =
            await getMyReservations();

          setReservations(
            mine
          );
        } else if (
          authenticatedUser.rol ===
          "Administrador"
        ) {
          const summary =
            await getAdminSummary();

          setAdminSummary(
            summary
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar el dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  function handleLogout() {
    clearSession();

    router.replace(
      "/login"
    );
  }

  const isProvider =
    user?.rol ===
    "Proveedor";

  const isBuyer =
    user?.rol ===
    "Comprador";

  const isAdmin =
    user?.rol ===
    "Administrador";

  const initials =
    user
      ? `${user.nombre.charAt(
          0
        )}${user.apellido.charAt(
          0
        )}`.toUpperCase()
      : "AG";

  const providerStats =
    useMemo(() => {
      const active =
        publications.filter(
          (
            publication
          ) =>
            publication.isActive &&
            publication.stock >
              0
        ).length;

      const pending =
        reservations.filter(
          (
            reservation
          ) =>
            reservation.status ===
            "Pending"
        ).length;

      const accepted =
        reservations.filter(
          (
            reservation
          ) =>
            reservation.status ===
            "Accepted"
        ).length;

      const stock =
        publications.reduce(
          (
            total,
            publication
          ) =>
            total +
            publication.stock,
          0
        );

      return [
        {
          label:
            "Publicaciones activas",

          value:
            active.toString(),

          detail:
            `${publications.length} publicaciones en total`,

          icon:
            Boxes,

          href:
            "/publicaciones",
        },

        {
          label:
            "Reservas pendientes",

          value:
            pending.toString(),

          detail:
            pending === 1
              ? "1 solicitud por responder"
              : `${pending} solicitudes por responder`,

          icon:
            Clock3,

          href:
            "/reservas/recibidas",
        },

        {
          label:
            "Reservas aceptadas",

          value:
            accepted.toString(),

          detail:
            "Operaciones confirmadas",

          icon:
            PackageCheck,

          href:
            "/reservas/recibidas",
        },

        {
          label:
            "Inventario registrado",

          value:
            stock.toString(),

          detail:
            "Unidades entre tus publicaciones",

          icon:
            ShoppingBasket,

          href:
            "/publicaciones",
        },
      ];
    }, [
      publications,
      reservations,
    ]);

  const buyerStats =
    useMemo(() => {
      const pending =
        reservations.filter(
          (
            reservation
          ) =>
            reservation.status ===
            "Pending"
        ).length;

      const accepted =
        reservations.filter(
          (
            reservation
          ) =>
            reservation.status ===
            "Accepted"
        ).length;

      const cancelled =
        reservations.filter(
          (
            reservation
          ) =>
            reservation.status ===
              "Cancelled" ||
            reservation.status ===
              "Rejected"
        ).length;

      const acceptedTotal =
        reservations
          .filter(
            (
              reservation
            ) =>
              reservation.status ===
              "Accepted"
          )
          .reduce(
            (
              total,
              reservation
            ) =>
              total +
              reservation.totalPrice,
            0
          );

      return [
        {
          label:
            "Reservas pendientes",

          value:
            pending.toString(),

          detail:
            "Esperando respuesta del proveedor",

          icon:
            Clock3,

          href:
            "/reservas",
        },

        {
          label:
            "Reservas aceptadas",

          value:
            accepted.toString(),

          detail:
            "Solicitudes confirmadas",

          icon:
            PackageCheck,

          href:
            "/reservas",
        },

        {
          label:
            "No completadas",

          value:
            cancelled.toString(),

          detail:
            "Canceladas o rechazadas",

          icon:
            ShoppingBasket,

          href:
            "/reservas",
        },

        {
          label:
            "Total aceptado",

          value:
            formatPrice(
              acceptedTotal
            ),

          detail:
            "Valor de reservas aceptadas",

          icon:
            Store,

          href:
            "/reservas",
        },
      ];
    }, [reservations]);

  const adminStats =
    useMemo(() => {
      if (!adminSummary) {
        return [];
      }

      return [
        {
          label:
            "Usuarios",

          value:
            adminSummary.users.total.toString(),

          detail:
            `${adminSummary.users.active} usuarios activos`,

          icon:
            Users,

          href:
            "/admin",
        },

        {
          label:
            "Publicaciones",

          value:
            adminSummary.publications.total.toString(),

          detail:
            `${adminSummary.publications.active} publicaciones activas`,

          icon:
            Boxes,

          href:
            "/admin",
        },

        {
          label:
            "Reservas",

          value:
            adminSummary.reservations.total.toString(),

          detail:
            `${adminSummary.reservations.pending} pendientes`,

          icon:
            PackageCheck,

          href:
            "/admin",
        },

        {
          label:
            "Valor aceptado",

          value:
            formatPrice(
              adminSummary.reservations
                .acceptedValue
            ),

          detail:
            "Valor de reservas aceptadas",

          icon:
            Store,

          href:
            "/admin",
        },
      ];
    }, [adminSummary]);

  const stats =
    isAdmin
      ? adminStats
      : isProvider
        ? providerStats
        : buyerStats;

  const recentReservations =
    reservations.slice(
      0,
      4
    );

  const opportunities =
    marketProducts.slice(
      0,
      3
    );

  const navigation = [
    {
      name:
        "Inicio",

      href:
        "/dashboard",

      icon:
        LayoutDashboard,
    },

    {
      name:
        "Mercado",

      href:
        "/productos",

      icon:
        Store,
    },

    ...(isProvider
      ? [
          {
            name:
              "Publicaciones",

            href:
              "/publicaciones",

            icon:
              Boxes,
          },

          {
            name:
              "Reservas recibidas",

            href:
              "/reservas/recibidas",

            icon:
              ShoppingBasket,
          },

          {
            name:
              "Mensajes",

            href:
              "/mensajes",

            icon:
              MessageCircle,
          },
        ]
      : []),

    ...(isBuyer
      ? [
          {
            name:
              "Mis reservas",

            href:
              "/reservas",

            icon:
              ShoppingBasket,
          },

          {
            name:
              "Favoritos",

            href:
              "/favoritos",

            icon:
              Heart,
          },

          {
            name:
              "Mensajes",

            href:
              "/mensajes",

            icon:
              MessageCircle,
          },
        ]
      : []),

    ...(isAdmin
      ? [
          {
            name:
              "Panel administrativo",

            href:
              "/admin",

            icon:
              ShieldCheck,
          },
        ]
      : []),

    {
      name:
        "Perfil",

      href:
        "/perfil",

      icon:
        UserRound,
    },
  ];

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea]">
        <p className="text-sm text-[#747c75]">
          Cargando sesión...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[#172019]/10 bg-[#173c29] text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#173c29]">
                <Sprout
                  size={20}
                  strokeWidth={
                    1.8
                  }
                />
              </div>

              <div>
                <p className="text-lg font-semibold">
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

              {navigation.map(
                (item) => {
                  const Icon =
                    item.icon;

                  return (
                    <Link
                      key={
                        item.name
                      }
                      href={
                        item.href
                      }
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                        item.href ===
                        "/dashboard"
                          ? "bg-white text-[#173c29]"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={
                          18
                        }
                        strokeWidth={
                          1.8
                        }
                      />

                      {
                        item.name
                      }
                    </Link>
                  );
                }
              )}
            </nav>

            <div>
              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="mb-4 flex w-full items-center gap-3 rounded-xl border-t border-white/10 px-3 py-4 text-sm font-medium text-white/65 hover:bg-red-400/10 hover:text-red-200"
              >
                <LogOut
                  size={18}
                />

                Cerrar sesión
              </button>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b9c995] text-sm font-semibold text-[#173c29]">
                    {
                      initials
                    }
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.empresa ||
                        `${user.nombre} ${user.apellido}`}
                    </p>

                    <p className="truncate text-xs text-white/45">
                      {
                        user.rol
                      }
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
                  <Sprout
                    size={19}
                  />
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

                <Link
                  href="/productos"
                  className="w-full text-sm text-[#8c938d]"
                >
                  Buscar productos
                  en el mercado...
                </Link>
              </div>

              <div className="ml-auto flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden items-center gap-2 rounded-full border border-[#173c29]/15 bg-[#173c29] px-4 py-2.5 text-sm font-semibold text-white sm:flex"
                  >
                    <ShieldCheck
                      size={16}
                    />

                    Administrar
                  </Link>
                )}

                <Link
                  href="/perfil"
                  className="flex items-center gap-2 rounded-full border border-[#172019]/10 bg-white/60 py-1.5 pl-1.5 pr-3 hover:bg-white"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173c29] text-xs font-semibold text-white">
                    {
                      initials
                    }
                  </div>

                  <span className="hidden text-sm font-medium sm:block">
                    Mi cuenta
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#172019]/10 bg-white/60 hover:bg-white"
                  aria-label="Cerrar sesión"
                >
                  <LogOut
                    size={17}
                  />
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 xl:px-10 xl:py-10">
            <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-[#173c29]/10 bg-white/50 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#4d8c5d]" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4e6d56]">
                    {isAdmin
                      ? "Panel del administrador"
                      : isProvider
                        ? "Panel del proveedor"
                        : "Panel del comprador"}
                  </span>
                </div>

                <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  Hola,{" "}
                  {
                    user.nombre
                  }
                  .
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#687069] sm:text-base">
                  {isAdmin
                    ? "Supervisa usuarios, publicaciones, reservas y la actividad general de Agromarket."
                    : isProvider
                      ? "Administra tus publicaciones, revisa solicitudes y controla tu inventario."
                      : "Explora el mercado, revisa tus reservas y da seguimiento a tus compras."}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/productos"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#172019]/15 bg-white/60 px-5 py-3 text-sm font-semibold hover:bg-white"
                >
                  Explorar mercado

                  <ArrowRight
                    size={16}
                  />
                </Link>

                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white hover:bg-[#24583b]"
                  >
                    Panel administrativo

                    <ShieldCheck
                      size={16}
                    />
                  </Link>
                ) : isProvider ? (
                  <Link
                    href="/publicaciones/nueva"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white hover:bg-[#24583b]"
                  >
                    Nueva publicación

                    <ArrowRight
                      size={16}
                    />
                  </Link>
                ) : (
                  <Link
                    href="/reservas"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white hover:bg-[#24583b]"
                  >
                    Mis reservas

                    <ArrowRight
                      size={16}
                    />
                  </Link>
                )}
              </div>
            </section>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {
                  error
                }
              </div>
            )}

            {loading ? (
              <div className="flex min-h-96 items-center justify-center">
                <p className="text-sm text-[#747c75]">
                  Cargando
                  información...
                </p>
              </div>
            ) : (
              <>
                <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map(
                    (stat) => {
                      const Icon =
                        stat.icon;

                      return (
                        <Link
                          key={
                            stat.label
                          }
                          href={
                            stat.href
                          }
                          className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5 transition-shadow hover:shadow-lg hover:shadow-[#173c29]/5"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                            <Icon
                              size={
                                18
                              }
                              strokeWidth={
                                1.8
                              }
                            />
                          </div>

                          <p className="mt-7 text-3xl font-semibold tracking-[-0.04em]">
                            {
                              stat.value
                            }
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {
                              stat.label
                            }
                          </p>

                          <p className="mt-2 text-xs leading-5 text-[#767d77]">
                            {
                              stat.detail
                            }
                          </p>
                        </Link>
                      );
                    }
                  )}
                </section>

                {isAdmin &&
                adminSummary ? (
                  <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <article className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold">
                            Estado de
                            Agromarket
                          </p>

                          <p className="mt-1 text-xs text-[#747c75]">
                            Resumen general
                            de la plataforma
                          </p>
                        </div>

                        <ShieldCheck
                          size={22}
                          className="text-[#315f3f]"
                        />
                      </div>

                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        <AdminMiniMetric
                          label="Compradores"
                          value={
                            adminSummary
                              .users
                              .buyers
                          }
                        />

                        <AdminMiniMetric
                          label="Proveedores"
                          value={
                            adminSummary
                              .users
                              .providers
                          }
                        />

                        <AdminMiniMetric
                          label="Reseñas"
                          value={
                            adminSummary
                              .reviews
                              .total
                          }
                        />

                        <AdminMiniMetric
                          label="Conversaciones"
                          value={
                            adminSummary
                              .chat
                              .conversations
                          }
                        />

                        <AdminMiniMetric
                          label="Reservas aceptadas"
                          value={
                            adminSummary
                              .reservations
                              .accepted
                          }
                        />

                        <AdminMiniMetric
                          label="Publicaciones sin stock"
                          value={
                            adminSummary
                              .publications
                              .outOfStock
                          }
                        />
                      </div>
                    </article>

                    <article className="rounded-2xl bg-[#173c29] p-6 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9c995]">
                        Administración
                      </p>

                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                        Control general
                      </h2>

                      <p className="mt-4 text-sm leading-6 text-white/60">
                        Gestiona usuarios,
                        publicaciones y
                        consulta todas las
                        reservas desde un
                        solo panel.
                      </p>

                      <Link
                        href="/admin"
                        className="mt-8 flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#173c29]"
                      >
                        Abrir panel

                        <ArrowRight
                          size={16}
                        />
                      </Link>
                    </article>
                  </section>
                ) : (
                  <section className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <article className="overflow-hidden rounded-2xl border border-[#172019]/10 bg-[#fffdf7]">
                      <div className="flex items-center justify-between border-b border-[#172019]/10 px-5 py-5 sm:px-6">
                        <div>
                          <p className="text-lg font-semibold">
                            {isProvider
                              ? "Reservas recientes"
                              : "Mis solicitudes recientes"}
                          </p>

                          <p className="mt-1 text-xs text-[#747c75]">
                            Actividad real de
                            tu cuenta
                          </p>
                        </div>

                        <Link
                          href={
                            isProvider
                              ? "/reservas/recibidas"
                              : "/reservas"
                          }
                          className="text-xs font-semibold text-[#3e6b49]"
                        >
                          Ver todas
                        </Link>
                      </div>

                      {recentReservations.length ===
                      0 ? (
                        <div className="flex min-h-72 items-center justify-center px-6 text-center">
                          <p className="max-w-md text-sm text-[#747c75]">
                            Todavía no hay
                            reservas para
                            mostrar.
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#172019]/10">
                          {recentReservations.map(
                            (
                              reservation
                            ) => (
                              <div
                                key={
                                  reservation.id
                                }
                                className="flex gap-4 px-5 py-5 sm:px-6"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef0e6] text-[#456a4d]">
                                  <ShoppingBasket
                                    size={
                                      17
                                    }
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                                    <div>
                                      <p className="text-sm font-semibold">
                                        {reservation.publicationTitle ??
                                          "Reserva"}
                                      </p>

                                      <p className="mt-1 text-sm text-[#687069]">
                                        {
                                          reservation.quantity
                                        }{" "}
                                        {reservation.unit ??
                                          ""}{" "}
                                        ·{" "}
                                        {formatPrice(
                                          reservation.totalPrice
                                        )}
                                      </p>
                                    </div>

                                    <div className="text-xs text-[#8a908a]">
                                      {
                                        reservation.status
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </article>

                    <article className="rounded-2xl bg-[#173c29] p-6 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9c995]">
                        Resumen
                      </p>

                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
                        {isProvider
                          ? `${publications.length} publicaciones`
                          : `${reservations.length} reservas`}
                      </h2>

                      <p className="mt-4 text-sm leading-6 text-white/55">
                        {isProvider
                          ? "Tus métricas se calculan directamente con tus publicaciones y reservas reales."
                          : "Tu actividad se calcula directamente con las reservas que has realizado."}
                      </p>

                      <div className="mt-8 border-t border-white/15 pt-5">
                        <p className="text-xs text-white/45">
                          Datos actualizados
                          desde Agromarket
                        </p>
                      </div>
                    </article>
                  </section>
                )}

                <section className="mt-4 overflow-hidden rounded-2xl border border-[#172019]/10 bg-[#fffdf7]">
                  <div className="flex items-center justify-between border-b border-[#172019]/10 px-5 py-5 sm:px-6">
                    <div>
                      <p className="text-lg font-semibold">
                        Oportunidades en el
                        mercado
                      </p>

                      <p className="mt-1 text-xs text-[#747c75]">
                        Publicaciones activas
                        recientes
                      </p>
                    </div>

                    <Link
                      href="/productos"
                      className="flex items-center gap-2 text-sm font-semibold text-[#315f3f]"
                    >
                      Ver mercado

                      <ArrowRight
                        size={
                          15
                        }
                      />
                    </Link>
                  </div>

                  {opportunities.length ===
                  0 ? (
                    <div className="flex min-h-52 items-center justify-center">
                      <p className="text-sm text-[#747c75]">
                        No hay productos
                        disponibles.
                      </p>
                    </div>
                  ) : (
                    <div className="grid lg:grid-cols-3">
                      {opportunities.map(
                        (
                          product,
                          index
                        ) => {
                          const Icon =
                            getIcon(
                              product.category
                            );

                          return (
                            <Link
                              key={
                                product.id
                              }
                              href={`/productos/${product.id}`}
                              className={`p-5 transition-colors hover:bg-[#f3f1e8] sm:p-6 ${
                                index !==
                                opportunities.length -
                                  1
                                  ? "border-b border-[#172019]/10 lg:border-b-0 lg:border-r"
                                  : ""
                              }`}
                            >
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                                <Icon
                                  size={
                                    20
                                  }
                                  strokeWidth={
                                    1.8
                                  }
                                />
                              </div>

                              <div className="mt-7 flex items-center gap-1.5 text-xs text-[#757d76]">
                                <MapPin
                                  size={
                                    13
                                  }
                                />

                                {
                                  product.municipality
                                }
                                ,{" "}
                                {
                                  product.department
                                }
                              </div>

                              <p className="mt-2 text-xl font-semibold">
                                {
                                  product.title
                                }
                              </p>

                              <div className="mt-5 flex items-end justify-between border-t border-[#172019]/10 pt-4">
                                <div>
                                  <p className="font-semibold">
                                    {formatPrice(
                                      product.price
                                    )}
                                  </p>

                                  <p className="text-xs text-[#7a817b]">
                                    por{" "}
                                    {
                                      product.unit
                                    }
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#8a908b]">
                                    Disponible
                                  </p>

                                  <p className="mt-1 text-xs font-semibold text-[#42694b]">
                                    {
                                      product.stock
                                    }{" "}
                                    {
                                      product.unit
                                    }
                                  </p>
                                </div>
                              </div>
                            </Link>
                          );
                        }
                      )}
                    </div>
                  )}
                </section>

                <section
                  className={`mt-4 grid gap-4 ${
                    isAdmin
                      ? "md:grid-cols-2"
                      : "md:grid-cols-2"
                  }`}
                >
                  <Link
                    href="/perfil"
                    className="group flex items-center justify-between rounded-2xl border border-[#172019]/10 bg-[#e8e6da] p-6 hover:bg-[#dedcd0]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173c29] text-white">
                        <CircleUserRound
                          size={
                            19
                          }
                        />
                      </div>

                      <div>
                        <p className="font-semibold">
                          Mi perfil
                        </p>

                        <p className="mt-1 text-xs text-[#6d746e]">
                          Revisa tu
                          información
                          comercial.
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={
                        18
                      }
                    />
                  </Link>

                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="group flex items-center justify-between rounded-2xl border border-[#172019]/10 bg-[#e8e6da] p-6 hover:bg-[#dedcd0]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173c29] text-white">
                          <ShieldCheck
                            size={
                              19
                            }
                          />
                        </div>

                        <div>
                          <p className="font-semibold">
                            Administrar
                            Agromarket
                          </p>

                          <p className="mt-1 text-xs text-[#6d746e]">
                            Gestiona usuarios,
                            publicaciones y
                            reservas.
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        size={
                          18
                        }
                      />
                    </Link>
                  ) : (
                    <Link
                      href={
                        isProvider
                          ? "/publicaciones"
                          : "/productos"
                      }
                      className="group flex items-center justify-between rounded-2xl border border-[#172019]/10 bg-[#e8e6da] p-6 hover:bg-[#dedcd0]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173c29] text-white">
                          {isProvider ? (
                            <Boxes
                              size={
                                19
                              }
                            />
                          ) : (
                            <Store
                              size={
                                19
                              }
                            />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {isProvider
                              ? "Gestionar publicaciones"
                              : "Explorar productos"}
                          </p>

                          <p className="mt-1 text-xs text-[#6d746e]">
                            {isProvider
                              ? "Administra inventario y ofertas."
                              : "Encuentra nuevas oportunidades."}
                          </p>
                        </div>
                      </div>

                      <ArrowRight
                        size={
                          18
                        }
                      />
                    </Link>
                  )}
                </section>

                <footer className="mt-10 border-t border-[#172019]/10 pt-6 text-xs text-[#818781]">
                  Agromarket ·
                  Marketplace agrícola
                  B2B
                </footer>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminMiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-[#f0eee5] p-4">
      <p className="text-xs text-[#737b74]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}