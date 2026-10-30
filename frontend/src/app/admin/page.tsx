"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  ArrowLeft,
  Ban,
  Boxes,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Heart,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Star,
  Store,
  Sprout,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";

import {
  getAdminActivity,
  getAdminConversationMessages,
  getAdminConversations,
  getAdminPublications,
  getAdminReservations,
  getAdminReviews,
  getAdminSummary,
  getAdminUsers,
  updateAdminPublicationStatus,
  updateAdminUserStatus,
  type AdminActivity,
  type AdminConversation,
  type AdminConversationDetails,
  type AdminPublication,
  type AdminReservation,
  type AdminReview,
  type AdminSummary,
  type AdminUser,
} from "@/services/adminService";

import {
  getUser,
} from "@/services/sessionService";

import type {
  AuthUser,
} from "@/services/authService";

type Tab =
  | "resumen"
  | "usuarios"
  | "publicaciones"
  | "reservas"
  | "resenas"
  | "conversaciones";

function formatPrice(value: number) {
  return new Intl.NumberFormat(
    "es-GT",
    {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }
  ).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "es-GT",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function getDisplayName(
  user: AdminUser
) {
  if (
    user.profile?.companyName?.trim()
  ) {
    return user.profile.companyName;
  }

  const name =
    `${user.profile?.firstName ?? ""} ${user.profile?.lastName ?? ""}`.trim();

  return name || user.email;
}

function getPersonName(person: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const name =
    `${person.firstName ?? ""} ${person.lastName ?? ""}`.trim();

  return name || person.email;
}

function getProviderName(provider: {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
}) {
  if (provider.companyName?.trim()) {
    return provider.companyName;
  }

  return getPersonName(provider);
}

function reservationStatusLabel(
  status: AdminReservation["status"]
) {
  switch (status) {
    case "Pending":
      return "Pendiente";

    case "Accepted":
      return "Aceptada";

    case "Rejected":
      return "Rechazada";

    case "Cancelled":
      return "Cancelada";
  }
}

function reservationStatusClasses(
  status: AdminReservation["status"]
) {
  switch (status) {
    case "Pending":
      return "bg-[#eee9d9] text-[#725f3e]";

    case "Accepted":
      return "bg-[#e3eadc] text-[#376344]";

    case "Rejected":
      return "bg-[#ece4df] text-[#76594d]";

    case "Cancelled":
      return "bg-[#ece7df] text-[#71675d]";
  }
}

export default function AdminPage() {
  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null
    );

  const [
    sessionChecked,
    setSessionChecked,
  ] = useState(false);

  const [
    tab,
    setTab,
  ] = useState<Tab>(
    "resumen"
  );

  const [
    summary,
    setSummary,
  ] =
    useState<AdminSummary | null>(
      null
    );

  const [
    users,
    setUsers,
  ] =
    useState<AdminUser[]>(
      []
    );

  const [
    publications,
    setPublications,
  ] =
    useState<AdminPublication[]>(
      []
    );

  const [
    reservations,
    setReservations,
  ] =
    useState<AdminReservation[]>(
      []
    );

  const [
    reviews,
    setReviews,
  ] =
    useState<AdminReview[]>(
      []
    );

  const [
    conversations,
    setConversations,
  ] =
    useState<AdminConversation[]>(
      []
    );

  const [
    activity,
    setActivity,
  ] =
    useState<AdminActivity | null>(
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

  const [
    processingId,
    setProcessingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    selectedConversation,
    setSelectedConversation,
  ] =
    useState<AdminConversationDetails | null>(
      null
    );

  const [
    conversationLoading,
    setConversationLoading,
  ] =
    useState(false);

  const isAdmin =
    user?.rol ===
    "Administrador";

  useEffect(() => {
    const currentUser =
      getUser();

    setUser(
      currentUser
    );

    setSessionChecked(
      true
    );
  }, []);

  const loadData =
    useCallback(
      async () => {
        if (!isAdmin) {
          return;
        }

        try {
          setLoading(true);
          setError("");

          const [
            summaryData,
            usersData,
            publicationsData,
            reservationsData,
            reviewsData,
            conversationsData,
            activityData,
          ] =
            await Promise.all([
              getAdminSummary(),
              getAdminUsers(),
              getAdminPublications(),
              getAdminReservations(),
              getAdminReviews(),
              getAdminConversations(),
              getAdminActivity(),
            ]);

          setSummary(
            summaryData
          );

          setUsers(
            usersData
          );

          setPublications(
            publicationsData
          );

          setReservations(
            reservationsData
          );

          setReviews(
            reviewsData
          );

          setConversations(
            conversationsData
          );

          setActivity(
            activityData
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "No fue posible cargar el panel administrativo."
          );
        } finally {
          setLoading(false);
        }
      },
      [isAdmin]
    );

  useEffect(() => {
    if (!sessionChecked) {
      return;
    }

    if (!isAdmin) {
      setLoading(false);
      return;
    }

    loadData();
  }, [
    sessionChecked,
    isAdmin,
    loadData,
  ]);

  async function refreshSummary() {
    try {
      const data =
        await getAdminSummary();

      setSummary(data);
    } catch {
    }
  }

  async function handleUserStatus(
    item: AdminUser
  ) {
    try {
      setProcessingId(
        item.id
      );

      setError("");

      const nextStatus =
        !item.isActive;

      await updateAdminUserStatus(
        item.id,
        nextStatus
      );

      setUsers(
        (current) =>
          current.map(
            (userItem) =>
              userItem.id ===
              item.id
                ? {
                    ...userItem,
                    isActive:
                      nextStatus,
                  }
                : userItem
          )
      );

      await refreshSummary();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible actualizar el usuario."
      );
    } finally {
      setProcessingId(
        null
      );
    }
  }

  async function handlePublicationStatus(
    item: AdminPublication
  ) {
    try {
      setProcessingId(
        item.id
      );

      setError("");

      const nextStatus =
        !item.isActive;

      await updateAdminPublicationStatus(
        item.id,
        nextStatus
      );

      setPublications(
        (current) =>
          current.map(
            (publication) =>
              publication.id ===
              item.id
                ? {
                    ...publication,
                    isActive:
                      nextStatus,
                  }
                : publication
          )
      );

      await refreshSummary();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible actualizar la publicación."
      );
    } finally {
      setProcessingId(
        null
      );
    }
  }

  async function handleOpenConversation(
    id: string
  ) {
    try {
      setConversationLoading(
        true
      );

      setError("");

      const data =
        await getAdminConversationMessages(
          id
        );

      setSelectedConversation(
        data
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar la conversación."
      );
    } finally {
      setConversationLoading(
        false
      );
    }
  }

  if (!sessionChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] text-[#172019]">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#173c29] text-white">
            <ShieldCheck
              size={21}
            />
          </div>

          <p className="mt-4 text-sm text-[#747c75]">
            Verificando sesión...
          </p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] px-6 text-[#172019]">
        <div className="w-full max-w-md rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6eadf] text-[#173c29]">
            <ShieldCheck
              size={25}
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Acceso restringido
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6c756d]">
            Esta sección está disponible
            únicamente para administradores
            de Agromarket.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white"
          >
            Volver al dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#667068] transition hover:text-[#173c29]"
          >
            <ArrowLeft
              size={17}
            />

            Dashboard
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout
                size={18}
              />
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold">
                Agromarket
              </p>

              <p className="text-[9px] uppercase tracking-[0.16em] text-[#7e867f]">
                Administración
              </p>
            </div>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-9 lg:px-8">
        <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
              Administración
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Panel general
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687069]">
              Supervisa usuarios,
              publicaciones, reservas,
              reseñas y conversaciones
              de Agromarket.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadData
            }
            disabled={
              loading
            }
            className="flex items-center justify-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-5 py-3 text-sm font-semibold transition hover:bg-[#ecebe3] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Actualizar
          </button>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <nav className="mt-9 flex flex-wrap gap-2 border-b border-[#172019]/10 pb-5">
          <TabButton
            active={
              tab ===
              "resumen"
            }
            onClick={() =>
              setTab(
                "resumen"
              )
            }
          >
            Resumen
          </TabButton>

          <TabButton
            active={
              tab ===
              "usuarios"
            }
            onClick={() =>
              setTab(
                "usuarios"
              )
            }
          >
            Usuarios
          </TabButton>

          <TabButton
            active={
              tab ===
              "publicaciones"
            }
            onClick={() =>
              setTab(
                "publicaciones"
              )
            }
          >
            Publicaciones
          </TabButton>

          <TabButton
            active={
              tab ===
              "reservas"
            }
            onClick={() =>
              setTab(
                "reservas"
              )
            }
          >
            Reservas
          </TabButton>

          <TabButton
            active={
              tab ===
              "resenas"
            }
            onClick={() =>
              setTab(
                "resenas"
              )
            }
          >
            Reseñas
          </TabButton>

          <TabButton
            active={
              tab ===
              "conversaciones"
            }
            onClick={() =>
              setTab(
                "conversaciones"
              )
            }
          >
            Conversaciones
          </TabButton>
        </nav>

        {loading ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <p className="text-sm text-[#747c75]">
              Cargando panel administrativo...
            </p>
          </div>
        ) : (
          <>
            {tab ===
              "resumen" &&
              summary && (
                <SummaryView
                  summary={
                    summary
                  }
                  activity={
                    activity
                  }
                />
              )}

            {tab ===
              "usuarios" && (
                <UsersView
                  users={
                    users
                  }
                  processingId={
                    processingId
                  }
                  onChangeStatus={
                    handleUserStatus
                  }
                />
              )}

            {tab ===
              "publicaciones" && (
                <PublicationsView
                  publications={
                    publications
                  }
                  processingId={
                    processingId
                  }
                  onChangeStatus={
                    handlePublicationStatus
                  }
                />
              )}

            {tab ===
              "reservas" && (
                <ReservationsView
                  reservations={
                    reservations
                  }
                />
              )}

            {tab ===
              "resenas" && (
                <ReviewsView
                  reviews={
                    reviews
                  }
                />
              )}

            {tab ===
              "conversaciones" && (
                <ConversationsView
                  conversations={
                    conversations
                  }
                  loading={
                    conversationLoading
                  }
                  onOpen={
                    handleOpenConversation
                  }
                />
              )}
          </>
        )}
      </div>

      {selectedConversation && (
        <ConversationModal
          details={
            selectedConversation
          }
          onClose={() =>
            setSelectedConversation(
              null
            )
          }
        />
      )}
    </main>
  );
}

function SummaryView({
  summary,
  activity,
}: {
  summary: AdminSummary;
  activity: AdminActivity | null;
}) {
  return (
    <div className="mt-7 space-y-7">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={
            <Users
              size={20}
            />
          }
          label="Usuarios"
          value={
            summary.users.total
          }
          detail={`${summary.users.active} activos`}
        />

        <MetricCard
          icon={
            <Store
              size={20}
            />
          }
          label="Publicaciones"
          value={
            summary.publications.total
          }
          detail={`${summary.publications.active} activas`}
        />

        <MetricCard
          icon={
            <PackageCheck
              size={20}
            />
          }
          label="Reservas"
          value={
            summary.reservations.total
          }
          detail={`${summary.reservations.accepted} aceptadas`}
        />

        <MetricCard
          icon={
            <CircleDollarSign
              size={20}
            />
          }
          label="Valor aceptado"
          value={formatPrice(
            summary.reservations.acceptedValue
          )}
          detail="Reservas aceptadas"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SmallMetric
          icon={
            <UserCheck
              size={17}
            />
          }
          label="Compradores"
          value={
            summary.users.buyers
          }
        />

        <SmallMetric
          icon={
            <Store
              size={17}
            />
          }
          label="Proveedores"
          value={
            summary.users.providers
          }
        />

        <SmallMetric
          icon={
            <Star
              size={17}
            />
          }
          label="Reseñas"
          value={
            summary.reviews.total
          }
        />

        <SmallMetric
          icon={
            <MessageCircle
              size={17}
            />
          }
          label="Conversaciones"
          value={
            summary.chat.conversations
          }
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
          <h2 className="text-lg font-semibold">
            Estado de reservas
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <StatusMetric
              label="Pendientes"
              value={
                summary.reservations.pending
              }
              icon={
                <Clock3
                  size={17}
                />
              }
            />

            <StatusMetric
              label="Aceptadas"
              value={
                summary.reservations.accepted
              }
              icon={
                <CheckCircle2
                  size={17}
                />
              }
            />

            <StatusMetric
              label="Rechazadas"
              value={
                summary.reservations.rejected
              }
              icon={
                <XCircle
                  size={17}
                />
              }
            />

            <StatusMetric
              label="Canceladas"
              value={
                summary.reservations.cancelled
              }
              icon={
                <Ban
                  size={17}
                />
              }
            />
          </div>
        </article>

        <article className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
          <h2 className="text-lg font-semibold">
            Estado del mercado
          </h2>

          <div className="mt-6 space-y-4">
            <LineMetric
              label="Publicaciones activas"
              value={
                summary.publications.active
              }
            />

            <LineMetric
              label="Publicaciones inactivas"
              value={
                summary.publications.inactive
              }
            />

            <LineMetric
              label="Sin inventario"
              value={
                summary.publications.outOfStock
              }
            />

            <LineMetric
              label="Usuarios inactivos"
              value={
                summary.users.inactive
              }
            />

            <LineMetric
              label="Mensajes enviados"
              value={
                summary.chat.messages
              }
            />
          </div>
        </article>
      </section>

      {activity && (
        <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
          <h2 className="text-lg font-semibold">
            Actividad reciente
          </h2>

          <div className="mt-6 grid gap-7 lg:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#738078]">
                Publicaciones
              </p>

              <div className="mt-4 space-y-3">
                {activity.recentPublications.length ===
                0 ? (
                  <EmptyText />
                ) : (
                  activity.recentPublications.map(
                    (item) => (
                      <ActivityItem
                        key={
                          item.id
                        }
                        title={
                          item.title
                        }
                        detail={
                          item.sellerEmail
                        }
                        date={
                          item.createdAt
                        }
                      />
                    )
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#738078]">
                Reservas
              </p>

              <div className="mt-4 space-y-3">
                {activity.recentReservations.length ===
                0 ? (
                  <EmptyText />
                ) : (
                  activity.recentReservations.map(
                    (item) => (
                      <ActivityItem
                        key={
                          item.id
                        }
                        title={
                          item.publicationTitle
                        }
                        detail={`${item.buyerEmail} · ${item.status}`}
                        date={
                          item.createdAt
                        }
                      />
                    )
                  )
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#738078]">
                Reseñas
              </p>

              <div className="mt-4 space-y-3">
                {activity.recentReviews.length ===
                0 ? (
                  <EmptyText />
                ) : (
                  activity.recentReviews.map(
                    (item) => (
                      <ActivityItem
                        key={
                          item.id
                        }
                        title={`${item.rating}/5 · ${item.publicationTitle}`}
                        detail={
                          item.buyerEmail
                        }
                        date={
                          item.createdAt
                        }
                      />
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function UsersView({
  users,
  processingId,
  onChangeStatus,
}: {
  users: AdminUser[];
  processingId: string | null;
  onChangeStatus: (
    user: AdminUser
  ) => void;
}) {
  return (
    <section className="mt-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">
          Usuarios
        </h2>

        <p className="mt-2 text-sm text-[#727a73]">
          {users.length} usuarios registrados.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-[#172019]/10 bg-[#efeee6]">
              <tr className="text-left text-xs uppercase tracking-[0.1em] text-[#737b74]">
                <th className="px-5 py-4">
                  Usuario
                </th>

                <th className="px-5 py-4">
                  Rol
                </th>

                <th className="px-5 py-4">
                  Actividad
                </th>

                <th className="px-5 py-4">
                  Registro
                </th>

                <th className="px-5 py-4">
                  Estado
                </th>

                <th className="px-5 py-4 text-right">
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map(
                (item) => (
                  <tr
                    key={
                      item.id
                    }
                    className="border-b border-[#172019]/8 last:border-0"
                  >
                    <td className="px-5 py-5">
                      <p className="font-semibold">
                        {getDisplayName(
                          item
                        )}
                      </p>

                      <p className="mt-1 text-xs text-[#747c75]">
                        {
                          item.email
                        }
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-full bg-[#e7eadf] px-3 py-1.5 text-xs font-semibold text-[#46624d]">
                        {
                          item.role
                        }
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="text-xs text-[#626b63]">
                        {
                          item.publicationsCount
                        }{" "}
                        publicaciones
                      </p>

                      <p className="mt-1 text-xs text-[#626b63]">
                        {
                          item.reservationsCount
                        }{" "}
                        reservas
                      </p>

                      <p className="mt-1 text-xs text-[#626b63]">
                        {
                          item.reviewsCount
                        }{" "}
                        reseñas
                      </p>
                    </td>

                    <td className="px-5 py-5 text-xs text-[#747c75]">
                      {formatDate(
                        item.createdAt
                      )}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.isActive
                            ? "bg-[#e3eadc] text-[#376344]"
                            : "bg-[#ece4df] text-[#76594d]"
                        }`}
                      >
                        {item.isActive
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-right">
                      {item.role ===
                      "Administrador" ? (
                        <span className="text-xs text-[#8d938e]">
                          Protegido
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            processingId ===
                            item.id
                          }
                          onClick={() =>
                            onChangeStatus(
                              item
                            )
                          }
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                            item.isActive
                              ? "border border-[#8b5e50]/20 bg-[#f1e8e3] text-[#76594d]"
                              : "bg-[#173c29] text-white"
                          }`}
                        >
                          {processingId ===
                          item.id
                            ? "Procesando..."
                            : item.isActive
                              ? "Desactivar"
                              : "Activar"}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function PublicationsView({
  publications,
  processingId,
  onChangeStatus,
}: {
  publications: AdminPublication[];
  processingId: string | null;
  onChangeStatus: (
    publication: AdminPublication
  ) => void;
}) {
  return (
    <section className="mt-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">
          Publicaciones
        </h2>

        <p className="mt-2 text-sm text-[#727a73]">
          {publications.length} publicaciones registradas.
        </p>
      </div>

      <div className="grid gap-4">
        {publications.map(
          (item) => (
            <article
              key={
                item.id
              }
              className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-[#dfe5d4] lg:w-28">
                  {item.imageUrl ? (
                    <img
                      src={
                        item.imageUrl
                      }
                      alt={
                        item.title
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#55705d]">
                      <Boxes
                        size={24}
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {
                        item.title
                      }
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${
                        item.isActive &&
                        item.stock > 0
                          ? "bg-[#e3eadc] text-[#376344]"
                          : "bg-[#ece4df] text-[#76594d]"
                      }`}
                    >
                      {item.isActive &&
                      item.stock > 0
                        ? "Activa"
                        : "Inactiva"}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#747c75]">
                    {
                      item.seller.companyName ||
                      item.seller.email
                    }
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#626b63]">
                    <span>
                      {formatPrice(
                        item.price
                      )}
                      /{item.unit}
                    </span>

                    <span>
                      Stock:{" "}
                      {
                        item.stock
                      }{" "}
                      {
                        item.unit
                      }
                    </span>

                    <span>
                      {
                        item.reservationsCount
                      }{" "}
                      reservas
                    </span>

                    <span className="flex items-center gap-1">
                      <Heart
                        size={13}
                      />

                      {
                        item.favoritesCount
                      }
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/productos/${item.id}`}
                    className="rounded-full border border-[#172019]/15 px-4 py-2.5 text-xs font-semibold"
                  >
                    Ver producto
                  </Link>

                  <button
                    type="button"
                    disabled={
                      processingId ===
                        item.id ||
                      (!item.isActive &&
                        item.stock <=
                          0)
                    }
                    onClick={() =>
                      onChangeStatus(
                        item
                      )
                    }
                    className={`rounded-full px-4 py-2.5 text-xs font-semibold disabled:opacity-40 ${
                      item.isActive
                        ? "border border-[#8b5e50]/20 bg-[#f1e8e3] text-[#76594d]"
                        : "bg-[#173c29] text-white"
                    }`}
                  >
                    {processingId ===
                    item.id
                      ? "Procesando..."
                      : item.isActive
                        ? "Desactivar"
                        : item.stock <=
                            0
                          ? "Sin stock"
                          : "Activar"}
                  </button>
                </div>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

function ReservationsView({
  reservations,
}: {
  reservations: AdminReservation[];
}) {
  return (
    <section className="mt-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">
          Reservas
        </h2>

        <p className="mt-2 text-sm text-[#727a73]">
          {reservations.length} reservas registradas.
        </p>
      </div>

      <div className="grid gap-4">
        {reservations.map(
          (item) => (
            <article
              key={
                item.id
              }
              className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {
                        item.publication.title
                      }
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${reservationStatusClasses(
                        item.status
                      )}`}
                    >
                      {reservationStatusLabel(
                        item.status
                      )}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[#727a73]">
                    Comprador:{" "}
                    <strong>
                      {getPersonName(
                        item.buyer
                      )}
                    </strong>
                  </p>

                  <p className="mt-1 text-xs text-[#727a73]">
                    Proveedor:{" "}
                    <strong>
                      {getProviderName(
                        item.provider
                      )}
                    </strong>
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-4 xl:min-w-[520px]">
                  <Info
                    label="Cantidad"
                    value={`${item.quantity} ${item.publication.unit}`}
                  />

                  <Info
                    label="Precio"
                    value={formatPrice(
                      item.unitPrice
                    )}
                  />

                  <Info
                    label="Total"
                    value={formatPrice(
                      item.totalPrice
                    )}
                  />

                  <Info
                    label="Fecha"
                    value={formatDate(
                      item.createdAt
                    )}
                  />
                </div>
              </div>
            </article>
          )
        )}

        {reservations.length ===
          0 && (
          <EmptyPanel text="No hay reservas registradas." />
        )}
      </div>
    </section>
  );
}

function ReviewsView({
  reviews,
}: {
  reviews: AdminReview[];
}) {
  return (
    <section className="mt-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">
          Reseñas
        </h2>

        <p className="mt-2 text-sm text-[#727a73]">
          {reviews.length} reseñas publicadas en Agromarket.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {reviews.map(
          (review) => (
            <article
              key={
                review.id
              }
              className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6"
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e6eadf] text-[#315f3f]">
                  <Star
                    size={19}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div>
                      <p className="font-semibold">
                        {
                          review.publication.title
                        }
                      </p>

                      <p className="mt-1 text-xs text-[#747c75]">
                        {formatDate(
                          review.createdAt
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-[#e7eadf] px-3 py-1.5 text-sm font-semibold text-[#315f3f]">
                      <Star
                        size={14}
                        fill="currentColor"
                      />

                      {
                        review.rating
                      }/5
                    </div>
                  </div>

                  <div className="mt-5 flex gap-1">
                    {Array.from({
                      length: 5,
                    }).map(
                      (
                        _,
                        index
                      ) => (
                        <Star
                          key={
                            index
                          }
                          size={16}
                          className={
                            index <
                            review.rating
                              ? "fill-[#a3a85d] text-[#a3a85d]"
                              : "text-[#d4d4c8]"
                          }
                        />
                      )
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#f1efe6] p-4">
                    <p className="text-sm leading-6 text-[#59615a]">
                      {review.comment?.trim()
                        ? review.comment
                        : "El comprador no dejó un comentario."}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 border-t border-[#172019]/10 pt-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#8a918b]">
                        Comprador
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {getPersonName(
                          review.buyer
                        )}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#747c75]">
                        {
                          review.buyer.email
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#8a918b]">
                        Proveedor
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {getProviderName(
                          review.provider
                        )}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#747c75]">
                        {
                          review.provider.email
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {reviews.length ===
        0 && (
        <EmptyPanel text="Todavía no hay reseñas registradas." />
      )}
    </section>
  );
}

function ConversationsView({
  conversations,
  loading,
  onOpen,
}: {
  conversations: AdminConversation[];
  loading: boolean;
  onOpen: (
    id: string
  ) => void;
}) {
  return (
    <section className="mt-7">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">
          Conversaciones
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#727a73]">
          Consulta las conversaciones entre compradores y proveedores
          para fines de supervisión y moderación.
        </p>
      </div>

      <div className="grid gap-4">
        {conversations.map(
          (conversation) => (
            <article
              key={
                conversation.id
              }
              className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6"
            >
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e6eadf] text-[#315f3f]">
                    <MessageCircle
                      size={19}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/productos/${conversation.publication.id}`}
                      className="text-lg font-semibold hover:text-[#315f3f]"
                    >
                      {
                        conversation.publication.title
                      }
                    </Link>

                    <div className="mt-3 grid gap-2 text-xs text-[#6b736c] sm:grid-cols-2">
                      <p>
                        Comprador:{" "}
                        <strong className="text-[#172019]">
                          {getPersonName(
                            conversation.buyer
                          )}
                        </strong>
                      </p>

                      <p>
                        Proveedor:{" "}
                        <strong className="text-[#172019]">
                          {getProviderName(
                            conversation.provider
                          )}
                        </strong>
                      </p>
                    </div>

                    {conversation.lastMessage && (
                      <div className="mt-4 rounded-2xl bg-[#f1efe6] p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#838a84]">
                          Último mensaje
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm text-[#59615a]">
                          {
                            conversation.lastMessage.content
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 xl:justify-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#8d948e]">
                      Mensajes
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {
                        conversation.messagesCount
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#8d948e]">
                      Última actividad
                    </p>

                    <p className="mt-1 text-xs font-semibold">
                      {formatDate(
                        conversation.updatedAt
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={() =>
                      onOpen(
                        conversation.id
                      )
                    }
                    className="rounded-full bg-[#173c29] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#24583b] disabled:opacity-50"
                  >
                    {loading
                      ? "Cargando..."
                      : "Ver conversación"}
                  </button>
                </div>
              </div>
            </article>
          )
        )}

        {conversations.length ===
          0 && (
          <EmptyPanel text="Todavía no hay conversaciones registradas." />
        )}
      </div>
    </section>
  );
}

function ConversationModal({
  details,
  onClose,
}: {
  details: AdminConversationDetails;
  onClose: () => void;
}) {
  const {
    conversation,
    messages,
  } = details;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#f4f2ea] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#172019]/10 bg-[#fffdf7] px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#52705a]">
              Supervisión de conversación
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {
                conversation.publication.title
              }
            </h2>

            <p className="mt-2 text-xs text-[#747c75]">
              {getPersonName(
                conversation.buyer
              )}{" "}
              ·{" "}
              {getProviderName(
                conversation.provider
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#172019]/10 bg-[#f4f2ea] hover:bg-[#e5e3d9]"
            aria-label="Cerrar conversación"
          >
            <X
              size={18}
            />
          </button>
        </div>

        <div className="grid border-b border-[#172019]/10 bg-[#eeeCE4] sm:grid-cols-2">
          <div className="border-b border-[#172019]/10 px-5 py-4 sm:border-b-0 sm:border-r sm:px-7">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#858c86]">
              Comprador
            </p>

            <p className="mt-1 text-sm font-semibold">
              {getPersonName(
                conversation.buyer
              )}
            </p>

            <p className="mt-1 text-xs text-[#707871]">
              {
                conversation.buyer.email
              }
            </p>
          </div>

          <div className="px-5 py-4 sm:px-7">
            <p className="text-[10px] uppercase tracking-[0.12em] text-[#858c86]">
              Proveedor
            </p>

            <p className="mt-1 text-sm font-semibold">
              {getProviderName(
                conversation.provider
              )}
            </p>

            <p className="mt-1 text-xs text-[#707871]">
              {
                conversation.provider.email
              }
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          {messages.length ===
          0 ? (
            <div className="flex min-h-64 items-center justify-center">
              <p className="text-sm text-[#747c75]">
                Esta conversación todavía no tiene mensajes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(
                (message) => {
                  const isBuyer =
                    message.senderId ===
                    conversation.buyer.id;

                  return (
                    <div
                      key={
                        message.id
                      }
                      className={`flex ${
                        isBuyer
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-3xl px-5 py-4 sm:max-w-[70%] ${
                          isBuyer
                            ? "rounded-bl-md border border-[#172019]/10 bg-[#fffdf7]"
                            : "rounded-br-md bg-[#173c29] text-white"
                        }`}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p
                            className={`text-xs font-semibold ${
                              isBuyer
                                ? "text-[#315f3f]"
                                : "text-[#b9c995]"
                            }`}
                          >
                            {isBuyer
                              ? "Comprador"
                              : "Proveedor"}
                          </p>

                          <p
                            className={`text-[10px] ${
                              isBuyer
                                ? "text-[#8b928c]"
                                : "text-white/45"
                            }`}
                          >
                            {formatDate(
                              message.createdAt
                            )}
                          </p>
                        </div>

                        <p className="whitespace-pre-wrap break-words text-sm leading-6">
                          {
                            message.content
                          }
                        </p>

                        <p
                          className={`mt-2 text-[10px] ${
                            isBuyer
                              ? "text-[#8c938d]"
                              : "text-white/40"
                          }`}
                        >
                          {
                            message.sender.email
                          }
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div className="border-t border-[#172019]/10 bg-[#fffdf7] px-5 py-4 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs leading-5 text-[#777f78]">
              Vista administrativa de solo lectura.
            </p>

            <button
              type="button"
              onClick={
                onClose
              }
              className="rounded-full bg-[#173c29] px-5 py-2.5 text-xs font-semibold text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-[#173c29] text-white"
          : "border border-[#172019]/10 bg-[#fffdf7] text-[#626b63] hover:bg-[#ecebe3]"
      }`}
    >
      {children}
    </button>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value:
    | number
    | string;
  detail: string;
}) {
  return (
    <article className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e4e9dc] text-[#315f3f]">
        {icon}
      </div>

      <p className="mt-7 text-3xl font-semibold tracking-[-0.04em]">
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold">
        {label}
      </p>

      <p className="mt-1 text-xs text-[#747c75]">
        {detail}
      </p>
    </article>
  );
}

function SmallMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7eadf] text-[#315f3f]">
        {icon}
      </div>

      <div>
        <p className="text-xl font-semibold">
          {value}
        </p>

        <p className="text-xs text-[#727a73]">
          {label}
        </p>
      </div>
    </article>
  );
}

function StatusMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-[#f0eee5] p-4">
      <div className="flex items-center gap-2 text-[#55705d]">
        {icon}

        <span className="text-xs font-semibold">
          {label}
        </span>
      </div>

      <p className="mt-4 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function LineMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#172019]/8 pb-3 last:border-0">
      <span className="text-sm text-[#687069]">
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function ActivityItem({
  title,
  detail,
  date,
}: {
  title: string;
  detail: string;
  date: string;
}) {
  return (
    <div className="rounded-2xl bg-[#f1efe6] p-4">
      <p className="truncate text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 truncate text-xs text-[#727a73]">
        {detail}
      </p>

      <p className="mt-3 text-[10px] text-[#909691]">
        {formatDate(
          date
        )}
      </p>
    </div>
  );
}

function EmptyText() {
  return (
    <p className="text-sm text-[#858c86]">
      Sin actividad reciente.
    </p>
  );
}

function EmptyPanel({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-[#172019]/15 bg-[#fffdf7]/60 px-6 py-14 text-center">
      <p className="text-sm text-[#747c75]">
        {text}
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.1em] text-[#909691]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}