"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Clock3,
  PackageCheck,
  RefreshCw,
  Sprout,
  X,
} from "lucide-react";
import {
  cancelReservation,
  getMyReservations,
  type Reservation,
  type ReservationStatus,
} from "@/services/reservationService";

function translateStatus(status: ReservationStatus) {
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

function statusClasses(status: ReservationStatus) {
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

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ReservasPage() {
  const [reservations, setReservations] = useState<
    Reservation[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState<
    string | null
  >(null);

  const [error, setError] = useState("");

  const [filter, setFilter] =
    useState<"Todas" | ReservationStatus>("Todas");

  async function loadReservations() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyReservations();

      setReservations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar tus reservas."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  async function handleCancel(id: string) {
    try {
      setProcessingId(id);
      setError("");

      await cancelReservation(id);

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id
            ? {
                ...reservation,
                status: "Cancelled",
                resolvedAt: new Date().toISOString(),
              }
            : reservation
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cancelar la reserva."
      );
    } finally {
      setProcessingId(null);
    }
  }

  const filteredReservations = useMemo(() => {
    if (filter === "Todas") {
      return reservations;
    }

    return reservations.filter(
      (reservation) => reservation.status === filter
    );
  }, [reservations, filter]);

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "Pending"
  ).length;

  const acceptedCount = reservations.filter(
    (reservation) => reservation.status === "Accepted"
  ).length;

  const finishedCount = reservations.filter(
    (reservation) =>
      reservation.status === "Rejected" ||
      reservation.status === "Cancelled"
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition-colors hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout size={18} />
            </div>

            <span className="hidden font-semibold sm:block">
              Agromarket
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
              Mis compras
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Mis reservas
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687069]">
              Consulta las solicitudes que has enviado a
              los proveedores y revisa su estado.
            </p>
          </div>

          <button
            type="button"
            onClick={loadReservations}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#e8e6da] disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </section>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <CircleAlert
              size={19}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm">
              {error}
            </p>
          </div>
        )}

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={<Clock3 size={18} />}
            label="Pendientes"
            value={pendingCount}
          />

          <SummaryCard
            icon={<PackageCheck size={18} />}
            label="Aceptadas"
            value={acceptedCount}
          />

          <SummaryCard
            icon={<X size={18} />}
            label="Rechazadas / canceladas"
            value={finishedCount}
          />
        </section>

        <section className="mt-7">
          <div className="flex flex-wrap gap-2 border-b border-[#172019]/10 pb-5">
            {(
              [
                ["Todas", "Todas"],
                ["Pending", "Pendientes"],
                ["Accepted", "Aceptadas"],
                ["Rejected", "Rechazadas"],
                ["Cancelled", "Canceladas"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === value
                    ? "bg-[#173c29] text-white"
                    : "border border-[#172019]/10 bg-[#fffdf7] text-[#606961] hover:bg-[#e8e6da]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <p className="text-sm text-[#747c75]">
                Cargando reservas...
              </p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#173c29]/20 bg-[#fffdf7]/60 px-6 text-center">
              <PackageCheck size={28} />

              <h2 className="mt-5 text-xl font-semibold">
                No tienes reservas
              </h2>

              <p className="mt-2 max-w-md text-sm text-[#747c75]">
                Cuando solicites productos desde el
                mercado aparecerán aquí.
              </p>

              <Link
                href="/productos"
                className="mt-6 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white"
              >
                Explorar mercado
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {filteredReservations.map(
                (reservation) => (
                  <article
                    key={reservation.id}
                    className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-semibold">
                            {
                              reservation.publicationTitle
                            }
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${statusClasses(
                              reservation.status
                            )}`}
                          >
                            {translateStatus(
                              reservation.status
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-[#6b736c]">
                          Proveedor:{" "}
                          <strong>
                            {reservation.seller?.email ??
                              "Proveedor Agromarket"}
                          </strong>
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-[#858c86]">
                          <CalendarDays size={14} />

                          {formatDate(
                            reservation.createdAt
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[430px]">
                        <Info
                          label="Cantidad"
                          value={`${reservation.quantity} ${
                            reservation.unit ?? ""
                          }`}
                        />

                        <Info
                          label="Precio unitario"
                          value={formatPrice(
                            reservation.unitPrice
                          )}
                        />

                        <Info
                          label="Total"
                          value={formatPrice(
                            reservation.totalPrice
                          )}
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/productos/${reservation.publicationId}`}
                          className="rounded-full border border-[#172019]/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#f0efe7]"
                        >
                          Ver producto
                        </Link>

                        {reservation.status ===
                          "Pending" && (
                          <button
                            type="button"
                            disabled={
                              processingId ===
                              reservation.id
                            }
                            onClick={() =>
                              handleCancel(
                                reservation.id
                              )
                            }
                            className="flex items-center gap-2 rounded-full border border-[#8b5e50]/20 bg-[#f1e8e3] px-4 py-2.5 text-xs font-semibold text-[#76594d] disabled:opacity-50"
                          >
                            <X size={15} />

                            {processingId ===
                            reservation.id
                              ? "Cancelando..."
                              : "Cancelar"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
        {icon}
      </div>

      <p className="mt-6 text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {label}
      </p>
    </article>
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
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#919692]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}