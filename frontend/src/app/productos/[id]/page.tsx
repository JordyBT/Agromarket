"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Leaf,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Wheat,
} from "lucide-react";
import {
  getPublicationById,
  type Publication,
} from "@/services/publicationService";
import { createReservation } from "@/services/reservationService";
import { getUser } from "@/services/sessionService";

function getIcon(category: string): LucideIcon {
  const value = category.toLowerCase();

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(price);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProductPage() {
  const params = useParams();

  const publicationId =
    typeof params.id === "string" ? params.id : "";

  const [product, setProduct] =
    useState<Publication | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState("");
  const [reservationError, setReservationError] =
    useState("");
  const [reservationSuccess, setReservationSuccess] =
    useState(false);
  const [reserving, setReserving] = useState(false);

  const [userRole, setUserRole] = useState<
    string | null
  >(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = getUser();

    setLoggedIn(Boolean(user));
    setUserRole(user?.rol ?? null);
  }, []);

  useEffect(() => {
    if (!publicationId) {
      setLoading(false);
      setError("Publicación no encontrada.");
      return;
    }

    let cancelled = false;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPublicationById(publicationId);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No fue posible cargar la publicación."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [publicationId]);

  async function handleReservation() {
    if (!product) {
      return;
    }

    setReservationError("");
    setReservationSuccess(false);

    if (!loggedIn) {
      setReservationError(
        "Debes iniciar sesión como comprador para solicitar una reserva."
      );
      return;
    }

    if (userRole !== "Comprador") {
      setReservationError(
        "Solo las cuentas de comprador pueden solicitar reservas."
      );
      return;
    }

    if (!quantity.trim()) {
      setReservationError(
        "Ingresa la cantidad que deseas reservar."
      );
      return;
    }

    const numericQuantity = Number(quantity);

    if (
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      setReservationError(
        "La cantidad debe ser un número entero mayor que cero."
      );
      return;
    }

    if (numericQuantity < product.minimumOrder) {
      setReservationError(
        `La compra mínima es de ${product.minimumOrder} ${product.unit}.`
      );
      return;
    }

    if (numericQuantity > product.stock) {
      setReservationError(
        "La cantidad solicitada supera el inventario disponible."
      );
      return;
    }

    try {
      setReserving(true);

      await createReservation({
        publicationId: product.id,
        quantity: numericQuantity,
      });

      setReservationSuccess(true);
      setQuantity("");
    } catch (err) {
      setReservationError(
        err instanceof Error
          ? err.message
          : "No fue posible crear la reserva."
      );
    } finally {
      setReserving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] text-[#172019]">
        <p className="text-sm text-[#747c75]">
          Cargando publicación...
        </p>
      </main>
    );
  }

  if (!product || error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] px-6 text-[#172019]">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ece4df] text-[#76594d]">
            <CircleAlert size={23} />
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Publicación no disponible
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#747c75]">
            {error ||
              "Esta publicación ya no se encuentra disponible."}
          </p>

          <Link
            href="/productos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Volver al mercado
          </Link>
        </div>
      </main>
    );
  }

  const Icon = getIcon(product.category);

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10 bg-[#f4f2ea]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/productos"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition-colors hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Volver al mercado
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout size={18} />
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold tracking-[-0.03em]">
                Agromarket
              </p>

              <p className="text-[10px] uppercase tracking-[0.17em] text-[#7b837c]">
                Mercado agrícola B2B
              </p>
            </div>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-12">
        <div className="mb-8 flex items-center gap-2 text-xs text-[#7b837c]">
          <Link
            href="/productos"
            className="hover:text-[#173c29]"
          >
            Mercado
          </Link>

          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>

          <span className="font-medium text-[#172019]">
            {product.title}
          </span>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="relative flex min-h-[470px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#dfe4d3]">
              <div className="absolute inset-0 opacity-[0.08]">
                <div className="absolute left-1/4 top-0 h-full w-px bg-[#173c29]" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-[#173c29]" />
                <div className="absolute left-3/4 top-0 h-full w-px bg-[#173c29]" />
                <div className="absolute left-0 top-1/3 h-px w-full bg-[#173c29]" />
                <div className="absolute left-0 top-2/3 h-px w-full bg-[#173c29]" />
              </div>

              <div className="absolute left-6 top-6 rounded-full bg-[#fffdf7] px-4 py-2 text-xs font-semibold">
                {product.category}
              </div>

              <div className="flex h-44 w-44 items-center justify-center rounded-full bg-[#173c29] text-white shadow-2xl shadow-[#173c29]/15">
                <Icon
                  size={74}
                  strokeWidth={1.3}
                />
              </div>

              <div className="absolute bottom-6 left-6 rounded-full border border-[#173c29]/10 bg-[#fffdf7]/90 px-4 py-2 text-xs font-medium backdrop-blur">
                Publicación disponible
              </div>
            </div>

            <section className="mt-6 rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4d7558]">
                Sobre el producto
              </p>

              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">
                Descripción
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#697169]">
                {product.description}
              </p>

              <div className="mt-8 grid gap-4 border-t border-[#172019]/10 pt-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-[#838a84]">
                    Categoría
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {product.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#838a84]">
                    Unidad de venta
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    Por {product.unit}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#838a84]">
                    Compra mínima
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {product.minimumOrder}{" "}
                    {product.unit}
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <h2 className="font-semibold">
                  Condiciones de la publicación
                </h2>
              </div>

              <div className="grid gap-px bg-[#172019]/10 sm:grid-cols-3">
                <InfoCard
                  icon={<Boxes size={18} />}
                  title="Inventario disponible"
                  value={`${product.stock} ${product.unit}`}
                />

                <InfoCard
                  icon={<Truck size={18} />}
                  title="Entrega"
                  value="A coordinar con el proveedor"
                />

                <InfoCard
                  icon={
                    <CalendarDays size={18} />
                  }
                  title="Publicado"
                  value={formatDate(
                    product.createdAt
                  )}
                />
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-8 space-y-5">
              <section className="rounded-[2rem] border border-[#172019]/10 bg-[#fffdf7] p-6 sm:p-8">
                <div className="flex items-center gap-1.5 text-sm text-[#687169]">
                  <MapPin size={16} />
                  {product.municipality},{" "}
                  {product.department}
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  {product.title}
                </h1>

                <div className="mt-8 border-y border-[#172019]/10 py-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#858c86]">
                    Precio publicado
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-4xl font-semibold tracking-[-0.04em]">
                      {formatPrice(product.price)}
                    </p>

                    <p className="pb-1 text-sm text-[#777f78]">
                      / {product.unit}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#f1f1e8] p-4">
                    <p className="text-xs text-[#858c86]">
                      Disponible
                    </p>

                    <p className="mt-2 font-semibold">
                      {product.stock}{" "}
                      {product.unit}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f1f1e8] p-4">
                    <p className="text-xs text-[#858c86]">
                      Mínimo
                    </p>

                    <p className="mt-2 font-semibold">
                      {product.minimumOrder}{" "}
                      {product.unit}
                    </p>
                  </div>
                </div>

                {reservationSuccess && (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#4d7c59]/20 bg-[#e4ebdc] p-4">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-[#315f3f]"
                    />

                    <div>
                      <p className="text-sm font-semibold text-[#315f3f]">
                        Reserva solicitada
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#5e695f]">
                        El proveedor debe aceptar o
                        rechazar tu solicitud.
                      </p>
                    </div>
                  </div>
                )}

                {reservationError && (
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <CircleAlert
                      size={19}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <p className="text-xs leading-5 text-red-700">
                      {reservationError}
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <label
                    htmlFor="cantidad"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Cantidad que necesitas
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-[#172019]/15 bg-[#f8f6ef]">
                    <input
                      id="cantidad"
                      type="number"
                      min={product.minimumOrder}
                      max={product.stock}
                      step="1"
                      value={quantity}
                      onChange={(event) => {
                        setQuantity(
                          event.target.value
                        );
                        setReservationError("");
                        setReservationSuccess(false);
                      }}
                      placeholder={`Mínimo ${product.minimumOrder}`}
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none"
                    />

                    <div className="flex items-center border-l border-[#172019]/10 px-4 text-xs font-medium text-[#697169]">
                      {product.unit}
                    </div>
                  </div>
                </div>

                {!loggedIn ? (
                  <Link
                    href="/login"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173c29] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
                  >
                    Iniciar sesión para reservar
                  </Link>
                ) : userRole === "Comprador" ? (
                  <button
                    type="button"
                    onClick={handleReservation}
                    disabled={reserving}
                    className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#173c29] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#24583b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <PackageCheck size={17} />

                    {reserving
                      ? "Solicitando..."
                      : "Solicitar reserva"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#173c29]/50 px-6 py-4 text-sm font-semibold text-white"
                  >
                    <PackageCheck size={17} />
                    Solo compradores pueden reservar
                  </button>
                )}

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#edf0e6] p-4">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#3d6b49]"
                  />

                  <p className="text-xs leading-5 text-[#5f6b61]">
                    La solicitud no descuenta inventario
                    hasta que el proveedor la acepte.
                  </p>
                </div>
              </section>

              <section className="rounded-[2rem] border border-[#172019]/10 bg-[#fffdf7] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#173c29] text-white">
                    <Store size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold">
                      Proveedor
                    </p>

                    <p className="mt-1 truncate text-xs text-[#7d857e]">
                      {product.seller?.email ??
                        "Proveedor Agromarket"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#172019]/10 pt-5">
                  <p className="text-xs text-[#858c86]">
                    Estado
                  </p>

                  <p className="mt-2 text-sm font-medium text-[#3d6b49]">
                    Activo
                  </p>
                </div>

                {product.seller?.email && (
                  <a
                    href={`mailto:${product.seller.email}`}
                    className="mt-5 flex w-full items-center justify-center rounded-xl border border-[#172019]/15 py-3 text-sm font-semibold transition-colors hover:bg-[#f1f1e8]"
                  >
                    Contactar proveedor
                  </a>
                )}
              </section>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-[#fffdf7] p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-2 text-sm text-[#6d756e]">
        {value}
      </p>
    </div>
  );
}