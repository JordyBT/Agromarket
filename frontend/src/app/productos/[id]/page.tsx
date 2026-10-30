"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  Heart,
  Leaf,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
} from "lucide-react";

import {
  getPublicationById,
  type Publication,
} from "@/services/publicationService";

import {
  createReservation,
} from "@/services/reservationService";

import {
  addFavorite,
  checkFavorite,
  removeFavorite,
} from "@/services/favoriteService";

import {
  getUser,
} from "@/services/sessionService";

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
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProductoDetallePage() {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [publication, setPublication] =
    useState<Publication | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [
    reservationError,
    setReservationError,
  ] = useState("");

  const [
    reservationSuccess,
    setReservationSuccess,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isFavorite,
    setIsFavorite,
  ] = useState(false);

  const [
    favoriteLoading,
    setFavoriteLoading,
  ] = useState(false);

  const [
    favoriteError,
    setFavoriteError,
  ] = useState("");

  const user = useMemo(
    () => getUser(),
    []
  );

  const isBuyer =
    user?.rol === "Comprador";

  const isProvider =
    user?.rol === "Proveedor";

  useEffect(() => {
    async function loadPublication() {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getPublicationById(id);

        setPublication(data);

        setQuantity(
          data.minimumOrder.toString()
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar el producto."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPublication();
  }, [id]);

  useEffect(() => {
    async function loadFavoriteStatus() {
      if (
        !id ||
        !isBuyer
      ) {
        return;
      }

      try {
        const result =
          await checkFavorite(id);

        setIsFavorite(
          result.isFavorite
        );
      } catch {
        setIsFavorite(false);
      }
    }

    loadFavoriteStatus();
  }, [id, isBuyer]);

  async function handleFavorite() {
    if (
      !publication ||
      !isBuyer ||
      favoriteLoading
    ) {
      return;
    }

    try {
      setFavoriteLoading(true);
      setFavoriteError("");

      if (isFavorite) {
        await removeFavorite(
          publication.id
        );

        setIsFavorite(false);
      } else {
        await addFavorite(
          publication.id
        );

        setIsFavorite(true);
      }
    } catch (err) {
      setFavoriteError(
        err instanceof Error
          ? err.message
          : "No fue posible actualizar favoritos."
      );
    } finally {
      setFavoriteLoading(false);
    }
  }

  async function handleReservation() {
    if (!publication) {
      return;
    }

    setReservationError("");
    setReservationSuccess("");

    const numericQuantity =
      Number(quantity);

    if (
      !Number.isInteger(
        numericQuantity
      ) ||
      numericQuantity <= 0
    ) {
      setReservationError(
        "Ingresa una cantidad válida."
      );

      return;
    }

    if (
      numericQuantity <
      publication.minimumOrder
    ) {
      setReservationError(
        `La compra mínima es de ${publication.minimumOrder} ${publication.unit}.`
      );

      return;
    }

    if (
      numericQuantity >
      publication.stock
    ) {
      setReservationError(
        `Solo hay ${publication.stock} ${publication.unit} disponibles.`
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await createReservation({
        publicationId:
          publication.id,
        quantity:
          numericQuantity,
      });

      setReservationSuccess(
        "Reserva creada correctamente. El proveedor deberá aceptarla."
      );
    } catch (err) {
      setReservationError(
        err instanceof Error
          ? err.message
          : "No fue posible crear la reserva."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] text-[#172019]">
        <p className="text-sm text-[#737b74]">
          Cargando producto...
        </p>
      </main>
    );
  }

  if (
    error ||
    !publication
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] px-6 text-[#172019]">
        <div className="max-w-md rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">
            No fue posible cargar el producto.
          </p>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <Link
            href="/productos"
            className="mt-5 inline-flex rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white"
          >
            Volver al mercado
          </Link>
        </div>
      </main>
    );
  }

  const total =
    Number(quantity) > 0
      ? Number(quantity) *
        publication.price
      : 0;

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/productos"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Volver al mercado
          </Link>

          <div className="flex items-center gap-3">
            {isBuyer && (
              <Link
                href="/favoritos"
                className="hidden items-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#ecebe3] sm:flex"
              >
                <Heart size={16} />
                Favoritos
              </Link>
            )}

            {isProvider && (
              <Link
                href="/publicaciones/nueva"
                className="hidden rounded-full bg-[#173c29] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24583b] sm:block"
              >
                Publicar producto
              </Link>
            )}

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
                <Sprout size={18} />
              </div>

              <div className="hidden sm:block">
                <p className="font-semibold">
                  Agromarket
                </p>

                <p className="text-[9px] uppercase tracking-[0.18em] text-[#7b837c]">
                  Mercado agrícola B2B
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#727a73]">
          <Link
            href="/productos"
            className="hover:text-[#173c29]"
          >
            Mercado
          </Link>

          <span>/</span>

          <span>
            {publication.category}
          </span>

          <span>/</span>

          <span className="font-semibold text-[#172019]">
            {publication.title}
          </span>
        </div>

        {favoriteError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {favoriteError}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.8fr]">
          <div className="space-y-6">
            <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-[#dfe5d4]">
              {publication.imageUrl ? (
                <img
                  src={
                    publication.imageUrl
                  }
                  alt={
                    publication.title
                  }
                  className="h-full min-h-[420px] w-full object-cover"
                />
              ) : (
                <div className="flex min-h-[420px] items-center justify-center">
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#173c29] text-white">
                    <Leaf
                      size={64}
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              )}

              <div className="absolute left-5 top-5 rounded-full bg-[#fffdf7]/95 px-4 py-2 text-xs font-semibold shadow-sm">
                {
                  publication.category
                }
              </div>

              {isBuyer && (
                <button
                  type="button"
                  onClick={
                    handleFavorite
                  }
                  disabled={
                    favoriteLoading
                  }
                  aria-label={
                    isFavorite
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"
                  }
                  className={`absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition ${
                    isFavorite
                      ? "border-[#173c29] bg-[#173c29] text-white"
                      : "border-white/60 bg-[#fffdf7]/95 text-[#173c29] hover:bg-white"
                  } ${
                    favoriteLoading
                      ? "cursor-wait opacity-60"
                      : "hover:scale-105"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={
                      isFavorite
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              )}

              <div className="absolute bottom-5 left-5 rounded-full bg-[#fffdf7]/95 px-4 py-2 text-xs font-medium shadow-sm">
                Publicación disponible
              </div>
            </div>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7759]">
                Sobre el producto
              </p>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                Descripción
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#687069]">
                {
                  publication.description
                }
              </p>

              <div className="mt-7 grid gap-5 border-t border-[#172019]/10 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#838a84]">
                    Categoría
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {
                      publication.category
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#838a84]">
                    Unidad de venta
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    Por{" "}
                    {
                      publication.unit
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#838a84]">
                    Compra mínima
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {
                      publication.minimumOrder
                    }{" "}
                    {
                      publication.unit
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <h2 className="font-semibold">
                  Condiciones de la publicación
                </h2>
              </div>

              <div className="grid md:grid-cols-3">
                <div className="border-b border-[#172019]/10 p-6 md:border-b-0 md:border-r">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                    <Boxes size={17} />
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    Inventario disponible
                  </p>

                  <p className="mt-2 text-sm text-[#727a73]">
                    {
                      publication.stock
                    }{" "}
                    {
                      publication.unit
                    }
                  </p>
                </div>

                <div className="border-b border-[#172019]/10 p-6 md:border-b-0 md:border-r">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                    <Truck size={17} />
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    Entrega
                  </p>

                  <p className="mt-2 text-sm text-[#727a73]">
                    A coordinar con el proveedor
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                    <CalendarDays
                      size={17}
                    />
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    Publicado
                  </p>

                  <p className="mt-2 text-sm text-[#727a73]">
                    {formatDate(
                      publication.createdAt
                    )}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-7">
              <div className="flex items-center gap-2 text-xs text-[#737b74]">
                <MapPin size={15} />

                <span>
                  {
                    publication.municipality
                  }
                  ,{" "}
                  {
                    publication.department
                  }
                </span>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <h1 className="text-4xl font-semibold tracking-[-0.045em]">
                  {
                    publication.title
                  }
                </h1>

                {isBuyer && (
                  <button
                    type="button"
                    onClick={
                      handleFavorite
                    }
                    disabled={
                      favoriteLoading
                    }
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                      isFavorite
                        ? "border-[#173c29] bg-[#173c29] text-white"
                        : "border-[#172019]/15 bg-[#fffdf7] text-[#173c29] hover:bg-[#eeeee5]"
                    }`}
                    title={
                      isFavorite
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                  >
                    <Heart
                      size={19}
                      fill={
                        isFavorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                )}
              </div>

              <div className="mt-7 border-y border-[#172019]/10 py-6">
                <p className="text-xs uppercase tracking-[0.15em] text-[#7c847d]">
                  Precio publicado
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <p className="text-3xl font-semibold">
                    {formatPrice(
                      publication.price
                    )}
                  </p>

                  <p className="pb-1 text-xs text-[#737b74]">
                    /{" "}
                    {
                      publication.unit
                    }
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#efefe7] p-4">
                  <p className="text-xs text-[#7c847d]">
                    Disponible
                  </p>

                  <p className="mt-2 font-semibold">
                    {
                      publication.stock
                    }{" "}
                    {
                      publication.unit
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-[#efefe7] p-4">
                  <p className="text-xs text-[#7c847d]">
                    Mínimo
                  </p>

                  <p className="mt-2 font-semibold">
                    {
                      publication.minimumOrder
                    }{" "}
                    {
                      publication.unit
                    }
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-semibold"
                >
                  Cantidad que necesitas
                </label>

                <div className="flex overflow-hidden rounded-xl border border-[#172019]/15 bg-[#f8f6ef]">
                  <input
                    id="quantity"
                    type="number"
                    min={
                      publication.minimumOrder
                    }
                    max={
                      publication.stock
                    }
                    step="1"
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(
                        event.target.value
                      );

                      setReservationError(
                        ""
                      );

                      setReservationSuccess(
                        ""
                      );
                    }}
                    placeholder={`Mínimo ${publication.minimumOrder}`}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none"
                  />

                  <span className="flex items-center border-l border-[#172019]/10 px-4 text-xs text-[#727a73]">
                    {
                      publication.unit
                    }
                  </span>
                </div>
              </div>

              {Number(quantity) > 0 && (
                <div className="mt-3 flex items-center justify-between text-xs text-[#737b74]">
                  <span>
                    Total estimado
                  </span>

                  <span className="font-semibold text-[#172019]">
                    {formatPrice(total)}
                  </span>
                </div>
              )}

              {reservationError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {
                    reservationError
                  }
                </div>
              )}

              {reservationSuccess && (
                <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
                  {
                    reservationSuccess
                  }
                </div>
              )}

              {!user ? (
                <Link
                  href="/login"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173c29] px-5 py-4 text-sm font-semibold text-white hover:bg-[#24583b]"
                >
                  <PackageCheck
                    size={17}
                  />
                  Iniciar sesión para reservar
                </Link>
              ) : isBuyer ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={
                    handleReservation
                  }
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173c29] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#24583b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PackageCheck
                    size={17}
                  />

                  {isSubmitting
                    ? "Enviando solicitud..."
                    : "Solicitar reserva"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#94a79a] px-5 py-4 text-sm font-semibold text-white"
                >
                  <PackageCheck
                    size={17}
                  />
                  Solo compradores pueden reservar
                </button>
              )}

              <div className="mt-5 flex gap-3 rounded-2xl bg-[#eef0e6] p-4">
                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-[#3d704a]"
                />

                <p className="text-xs leading-5 text-[#687069]">
                  La solicitud no descuenta inventario hasta que el proveedor la acepte.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173c29] text-white">
                  <Store size={18} />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">
                    Proveedor
                  </p>

                  <p className="mt-1 truncate text-xs text-[#737b74]">
                    {publication.seller?.email ??
                      "Proveedor de Agromarket"}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[#172019]/10 pt-5">
                <p className="text-xs text-[#818881]">
                  Estado
                </p>

                <p className="mt-2 text-sm font-medium text-[#3e6b49]">
                  Activo
                </p>
              </div>

              {publication.seller?.email && (
                <a
                  href={`mailto:${publication.seller.email}`}
                  className="mt-6 flex w-full items-center justify-center rounded-xl border border-[#172019]/15 px-5 py-3.5 text-sm font-semibold transition hover:bg-[#f0efe6]"
                >
                  Contactar proveedor
                </a>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}