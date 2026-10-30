"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Leaf,
  MapPin,
  Sprout,
} from "lucide-react";

import {
  getFavorites,
  removeFavorite,
  type Favorite,
} from "@/services/favoriteService";

function formatPrice(
  price: number
) {
  return new Intl.NumberFormat(
    "es-GT",
    {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }
  ).format(price);
}

export default function FavoritosPage() {
  const [
    favorites,
    setFavorites,
  ] = useState<Favorite[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    removingId,
    setRemovingId,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getFavorites();

        setFavorites(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar tus favoritos."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  async function handleRemove(
    publicationId: string
  ) {
    if (
      removingId ===
      publicationId
    ) {
      return;
    }

    try {
      setRemovingId(
        publicationId
      );

      await removeFavorite(
        publicationId
      );

      setFavorites(
        (current) =>
          current.filter(
            (favorite) =>
              favorite.publicationId !==
              publicationId
          )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible quitar el producto de favoritos."
      );
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/productos"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition hover:text-[#173c29]"
          >
            <ArrowLeft
              size={17}
            />

            Volver al mercado
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

            <div>
              <p className="font-semibold">
                Agromarket
              </p>

              <p className="text-[9px] uppercase tracking-[0.18em] text-[#7b837c]">
                Mercado agrícola B2B
              </p>
            </div>
          </Link>
        </div>
      </header>

      <section className="border-b border-[#172019]/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173c29] text-white">
            <Heart
              size={21}
              fill="currentColor"
            />
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
            Mis favoritos
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Productos guardados.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-[#687069]">
            Aquí encontrarás las
            publicaciones que guardaste
            para consultarlas después.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <p className="text-sm text-[#747c75]">
              Cargando favoritos...
            </p>
          </div>
        ) : favorites.length >
          0 ? (
          <>
            <div className="mb-6 flex items-end justify-between border-b border-[#172019]/10 pb-5">
              <div>
                <p className="font-semibold">
                  Tus productos favoritos
                </p>

                <p className="mt-1 text-xs text-[#777f78]">
                  {favorites.length}{" "}
                  {favorites.length ===
                  1
                    ? "producto guardado"
                    : "productos guardados"}
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map(
                (favorite) => {
                  const product =
                    favorite.publication;

                  const removing =
                    removingId ===
                    product.id;

                  return (
                    <article
                      key={
                        favorite.id
                      }
                      className="group overflow-hidden rounded-3xl border border-[#172019]/10 bg-[#fffdf7] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173c29]/5"
                    >
                      <div className="relative h-52 overflow-hidden bg-[#e2e6d7]">
                        <Link
                          href={`/productos/${product.id}`}
                          className="block h-full w-full"
                        >
                          {product.imageUrl ? (
                            <img
                              src={
                                product.imageUrl
                              }
                              alt={
                                product.title
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#173c29] text-white">
                                <Leaf
                                  size={
                                    38
                                  }
                                  strokeWidth={
                                    1.5
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </Link>

                        <span className="absolute left-4 top-4 rounded-full bg-[#fffdf7]/95 px-3 py-1.5 text-[11px] font-semibold text-[#526057] shadow-sm">
                          {
                            product.category
                          }
                        </span>

                        <button
                          type="button"
                          disabled={
                            removing
                          }
                          onClick={() =>
                            handleRemove(
                              product.id
                            )
                          }
                          aria-label="Quitar de favoritos"
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#173c29] bg-[#173c29] text-white shadow-sm transition hover:scale-105 disabled:cursor-wait disabled:opacity-60"
                        >
                          <Heart
                            size={18}
                            fill="currentColor"
                          />
                        </button>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-xs text-[#7b837c]">
                          <MapPin
                            size={13}
                          />

                          {
                            product.municipality
                          }
                          ,{" "}
                          {
                            product.department
                          }
                        </div>

                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                          {
                            product.title
                          }
                        </h2>

                        <p className="mt-1 truncate text-xs text-[#818882]">
                          {product
                            .seller
                            ?.email ??
                            "Proveedor Agromarket"}
                        </p>

                        <div className="mt-5 flex items-end justify-between border-t border-[#172019]/10 pt-4">
                          <div>
                            <p className="text-xl font-semibold tracking-[-0.025em]">
                              {formatPrice(
                                product.price
                              )}
                            </p>

                            <p className="mt-1 text-xs text-[#7a817b]">
                              por{" "}
                              {
                                product.unit
                              }
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.12em] text-[#919692]">
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

                        <Link
                          href={`/productos/${product.id}`}
                          className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#173c29] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#24583b]"
                        >
                          Ver publicación

                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#173c29]/20 bg-[#fffdf7]/60 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4e8d8] text-[#173c29]">
              <Heart
                size={27}
              />
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Todavía no tienes
              favoritos
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#747c75]">
              Guarda productos del
              mercado para encontrarlos
              fácilmente más adelante.
            </p>

            <Link
              href="/productos"
              className="mt-7 flex items-center gap-2 rounded-full bg-[#173c29] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24583b]"
            >
              Explorar mercado

              <ArrowRight
                size={16}
              />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}