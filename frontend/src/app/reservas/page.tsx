"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Clock3,
  PackageCheck,
  RefreshCw,
  Sprout,
  Star,
  X,
} from "lucide-react";

import {
  cancelReservation,
  getMyReservations,
  type Reservation,
  type ReservationStatus,
} from "@/services/reservationService";

import {
  createReview,
  getReviewByReservation,
  type ReservationReviewStatus,
} from "@/services/reviewService";

function translateStatus(
  status: ReservationStatus
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

function statusClasses(
  status: ReservationStatus
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

export default function ReservasPage() {
  const [
    reservations,
    setReservations,
  ] = useState<Reservation[]>([]);

  const [
    reviewStatus,
    setReviewStatus,
  ] = useState<
    Record<
      string,
      ReservationReviewStatus
    >
  >({});

  const [loading, setLoading] =
    useState(true);

  const [
    processingId,
    setProcessingId,
  ] = useState<string | null>(null);

  const [
    reviewingReservation,
    setReviewingReservation,
  ] = useState<Reservation | null>(
    null
  );

  const [rating, setRating] =
    useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [reviewError, setReviewError] =
    useState("");

  const [reviewSuccess, setReviewSuccess] =
    useState("");

  const [submittingReview, setSubmittingReview] =
    useState(false);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState<
      "Todas" | ReservationStatus
    >("Todas");

  async function loadReviewStatuses(
    data: Reservation[]
  ) {
    const accepted =
      data.filter(
        (reservation) =>
          reservation.status ===
          "Accepted"
      );

    const results =
      await Promise.all(
        accepted.map(
          async (reservation) => {
            try {
              const status =
                await getReviewByReservation(
                  reservation.id
                );

              return [
                reservation.id,
                status,
              ] as const;
            } catch {
              return null;
            }
          }
        )
      );

    const nextStatuses: Record<
      string,
      ReservationReviewStatus
    > = {};

    for (const result of results) {
      if (result) {
        nextStatuses[result[0]] =
          result[1];
      }
    }

    setReviewStatus(nextStatuses);
  }

  async function loadReservations() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyReservations();

      setReservations(data);

      await loadReviewStatuses(data);
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

  async function handleCancel(
    id: string
  ) {
    try {
      setProcessingId(id);
      setError("");

      await cancelReservation(id);

      setReservations(
        (current) =>
          current.map(
            (reservation) =>
              reservation.id === id
                ? {
                    ...reservation,
                    status:
                      "Cancelled",
                    resolvedAt:
                      new Date().toISOString(),
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

  function openReview(
    reservation: Reservation
  ) {
    setReviewingReservation(
      reservation
    );

    setRating(0);
    setHoverRating(0);
    setComment("");
    setReviewError("");
    setReviewSuccess("");
  }

  function closeReview() {
    if (submittingReview) {
      return;
    }

    setReviewingReservation(null);
    setRating(0);
    setHoverRating(0);
    setComment("");
    setReviewError("");
  }

  async function handleSubmitReview() {
    if (!reviewingReservation) {
      return;
    }

    if (
      rating < 1 ||
      rating > 5
    ) {
      setReviewError(
        "Selecciona una calificación de 1 a 5 estrellas."
      );

      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError("");
      setReviewSuccess("");

      const created =
        await createReview({
          reservationId:
            reviewingReservation.id,
          rating,
          comment:
            comment.trim() ||
            undefined,
        });

      setReviewStatus(
        (current) => ({
          ...current,

          [reviewingReservation.id]:
            {
              reservationId:
                reviewingReservation.id,

              canReview: false,

              hasReview: true,

              review: {
                id: created.id,
                rating:
                  created.rating,
                comment:
                  created.comment,
                createdAt:
                  created.createdAt,
              },
            },
        })
      );

      setReviewSuccess(
        "Reseña publicada correctamente."
      );

      setReviewingReservation(
        null
      );

      setRating(0);
      setComment("");
    } catch (err) {
      setReviewError(
        err instanceof Error
          ? err.message
          : "No fue posible publicar la reseña."
      );
    } finally {
      setSubmittingReview(false);
    }
  }

  const filteredReservations =
    useMemo(() => {
      if (filter === "Todas") {
        return reservations;
      }

      return reservations.filter(
        (reservation) =>
          reservation.status ===
          filter
      );
    }, [reservations, filter]);

  const pendingCount =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "Pending"
    ).length;

  const acceptedCount =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "Accepted"
    ).length;

  const finishedCount =
    reservations.filter(
      (reservation) =>
        reservation.status ===
          "Rejected" ||
        reservation.status ===
          "Cancelled"
    ).length;

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition hover:text-[#173c29]"
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
              Consulta tus solicitudes,
              revisa su estado y califica
              a los proveedores cuando
              una reserva haya sido
              aceptada.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadReservations
            }
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-5 py-3 text-sm font-semibold transition hover:bg-[#e8e6da] disabled:opacity-60"
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

        {reviewSuccess && (
          <div className="mt-6 rounded-2xl border border-[#173c29]/15 bg-[#e4ecdf] px-5 py-4 text-sm font-medium text-[#315f3f]">
            {reviewSuccess}
          </div>
        )}

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={
              <Clock3 size={18} />
            }
            label="Pendientes"
            value={pendingCount}
          />

          <SummaryCard
            icon={
              <PackageCheck
                size={18}
              />
            }
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
                [
                  "Todas",
                  "Todas",
                ],
                [
                  "Pending",
                  "Pendientes",
                ],
                [
                  "Accepted",
                  "Aceptadas",
                ],
                [
                  "Rejected",
                  "Rechazadas",
                ],
                [
                  "Cancelled",
                  "Canceladas",
                ],
              ] as const
            ).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFilter(
                      value
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filter === value
                      ? "bg-[#173c29] text-white"
                      : "border border-[#172019]/10 bg-[#fffdf7] text-[#606961] hover:bg-[#e8e6da]"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <p className="text-sm text-[#747c75]">
                Cargando reservas...
              </p>
            </div>
          ) : filteredReservations.length ===
            0 ? (
            <div className="mt-7 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#173c29]/20 bg-[#fffdf7]/60 px-6 text-center">
              <PackageCheck
                size={28}
              />

              <h2 className="mt-5 text-xl font-semibold">
                No tienes reservas
              </h2>

              <p className="mt-2 max-w-md text-sm text-[#747c75]">
                Cuando solicites
                productos desde el
                mercado aparecerán
                aquí.
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
                (reservation) => {
                  const review =
                    reviewStatus[
                      reservation
                        .id
                    ];

                  return (
                    <article
                      key={
                        reservation.id
                      }
                      className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6"
                    >
                      <div className="flex flex-col gap-6 xl:flex-row xl:items-center">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-semibold">
                              {reservation.publicationTitle ??
                                "Producto"}
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
                              {reservation
                                .seller
                                ?.email ??
                                "Proveedor Agromarket"}
                            </strong>
                          </p>

                          <div className="mt-3 flex items-center gap-2 text-xs text-[#858c86]">
                            <CalendarDays
                              size={14}
                            />

                            {formatDate(
                              reservation.createdAt
                            )}
                          </div>

                          {reservation.status ===
                            "Accepted" &&
                            review
                              ?.hasReview &&
                            review.review && (
                              <div className="mt-4 rounded-2xl bg-[#f2efe3] p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#778079]">
                                  Tu reseña
                                </p>

                                <div className="mt-2 flex gap-1">
                                  {[
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                  ].map(
                                    (
                                      star
                                    ) => (
                                      <Star
                                        key={
                                          star
                                        }
                                        size={
                                          17
                                        }
                                        className={
                                          star <=
                                          review
                                            .review!
                                            .rating
                                            ? "fill-[#b88b24] text-[#b88b24]"
                                            : "text-[#c9c9c0]"
                                        }
                                      />
                                    )
                                  )}
                                </div>

                                {review
                                  .review
                                  .comment && (
                                  <p className="mt-2 text-sm leading-6 text-[#646c65]">
                                    {
                                      review
                                        .review
                                        .comment
                                    }
                                  </p>
                                )}
                              </div>
                            )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[430px]">
                          <Info
                            label="Cantidad"
                            value={`${
                              reservation.quantity
                            } ${
                              reservation.unit ??
                              ""
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
                            className="rounded-full border border-[#172019]/15 px-4 py-2.5 text-xs font-semibold transition hover:bg-[#f0efe7]"
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
                              <X
                                size={15}
                              />

                              {processingId ===
                              reservation.id
                                ? "Cancelando..."
                                : "Cancelar"}
                            </button>
                          )}

                          {reservation.status ===
                            "Accepted" &&
                            review
                              ?.canReview && (
                              <button
                                type="button"
                                onClick={() =>
                                  openReview(
                                    reservation
                                  )
                                }
                                className="flex items-center gap-2 rounded-full bg-[#173c29] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#24583b]"
                              >
                                <Star
                                  size={
                                    15
                                  }
                                />
                                Calificar
                              </button>
                            )}

                          {reservation.status ===
                            "Accepted" &&
                            review
                              ?.hasReview && (
                              <span className="flex items-center gap-1.5 rounded-full bg-[#e5eadb] px-4 py-2.5 text-xs font-semibold text-[#376344]">
                                <Star
                                  size={
                                    14
                                  }
                                  className="fill-current"
                                />
                                Reseñado
                              </span>
                            )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>

      {reviewingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-10">
          <div className="w-full max-w-lg rounded-[28px] bg-[#fffdf7] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7759]">
                  Reputación
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
                  Calificar proveedor
                </h2>

                <p className="mt-2 text-sm text-[#6c746d]">
                  {
                    reviewingReservation.publicationTitle
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={closeReview}
                disabled={
                  submittingReview
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#172019]/10 transition hover:bg-[#efede4]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold">
                ¿Cómo fue tu
                experiencia?
              </p>

              <div className="mt-3 flex gap-2">
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map((star) => {
                  const active =
                    star <=
                    (hoverRating ||
                      rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() =>
                        setHoverRating(
                          star
                        )
                      }
                      onMouseLeave={() =>
                        setHoverRating(
                          0
                        )
                      }
                      onClick={() =>
                        setRating(star)
                      }
                      className="transition hover:scale-110"
                      aria-label={`${star} estrellas`}
                    >
                      <Star
                        size={34}
                        className={
                          active
                            ? "fill-[#b88b24] text-[#b88b24]"
                            : "text-[#cbc9bd]"
                        }
                      />
                    </button>
                  );
                })}
              </div>

              <p className="mt-2 text-xs text-[#7f867f]">
                {rating === 0
                  ? "Selecciona de 1 a 5 estrellas."
                  : `${rating} de 5 estrellas`}
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="review-comment"
                className="text-sm font-semibold"
              >
                Comentario
              </label>

              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                maxLength={1000}
                rows={5}
                placeholder="Cuéntanos cómo fue la atención, el producto o el proceso de compra..."
                className="mt-2 w-full resize-none rounded-2xl border border-[#172019]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#173c29]"
              />

              <div className="mt-1 text-right text-xs text-[#92978f]">
                {comment.length}/1000
              </div>
            </div>

            {reviewError && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {reviewError}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeReview}
                disabled={
                  submittingReview
                }
                className="rounded-full border border-[#172019]/15 px-5 py-3 text-sm font-semibold transition hover:bg-[#efede4]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  handleSubmitReview
                }
                disabled={
                  submittingReview ||
                  rating === 0
                }
                className="rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24583b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingReview
                  ? "Publicando..."
                  : "Publicar reseña"}
              </button>
            </div>
          </div>
        </div>
      )}
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