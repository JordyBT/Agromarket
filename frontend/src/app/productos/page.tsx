"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  ArrowLeft,
  ArrowRight,
  Filter,
  Heart,
  Leaf,
  MapPin,
  Package,
  Search,
  SlidersHorizontal,
  Sprout,
  Wheat,
} from "lucide-react";

import {
  getPublications,
  type Publication,
} from "@/services/publicationService";

import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/services/favoriteService";

import {
  getUser,
} from "@/services/sessionService";

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

export default function ProductosPage() {
  const [
    products,
    setProducts,
  ] = useState<Publication[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("Todos");

  const [
    department,
    setDepartment,
  ] = useState("");

  const [
    sort,
    setSort,
  ] = useState("recent");

  const [
    isBuyer,
    setIsBuyer,
  ] = useState(false);

  const [
    isProvider,
    setIsProvider,
  ] = useState(false);

  const [
    favoriteIds,
    setFavoriteIds,
  ] = useState<Set<string>>(
    new Set()
  );

  const [
    favoriteLoadingId,
    setFavoriteLoadingId,
  ] = useState<string | null>(
    null
  );

  const [
    favoriteError,
    setFavoriteError,
  ] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPublications();

        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar el mercado."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadUserData() {
      const currentUser =
        getUser();

      const buyer =
        currentUser?.rol ===
        "Comprador";

      const provider =
        currentUser?.rol ===
          "Proveedor" ||
        currentUser?.rol ===
          "Administrador";

      setIsBuyer(buyer);
      setIsProvider(provider);

      if (!buyer) {
        setFavoriteIds(
          new Set()
        );

        return;
      }

      try {
        const favorites =
          await getFavorites();

        setFavoriteIds(
          new Set(
            favorites.map(
              (favorite) =>
                favorite.publicationId
            )
          )
        );
      } catch {
        setFavoriteIds(
          new Set()
        );
      }
    }

    loadUserData();
  }, []);

  async function toggleFavorite(
    publicationId: string
  ) {
    if (!isBuyer) {
      return;
    }

    if (
      favoriteLoadingId ===
      publicationId
    ) {
      return;
    }

    setFavoriteError("");

    setFavoriteLoadingId(
      publicationId
    );

    const alreadyFavorite =
      favoriteIds.has(
        publicationId
      );

    try {
      if (alreadyFavorite) {
        await removeFavorite(
          publicationId
        );

        setFavoriteIds(
          (current) => {
            const next =
              new Set(current);

            next.delete(
              publicationId
            );

            return next;
          }
        );
      } else {
        await addFavorite(
          publicationId
        );

        setFavoriteIds(
          (current) => {
            const next =
              new Set(current);

            next.add(
              publicationId
            );

            return next;
          }
        );
      }
    } catch (err) {
      setFavoriteError(
        err instanceof Error
          ? err.message
          : "No fue posible actualizar favoritos."
      );
    } finally {
      setFavoriteLoadingId(
        null
      );
    }
  }

  const categories =
    useMemo(() => {
      return [
        "Todos",
        ...Array.from(
          new Set(
            products.map(
              (product) =>
                product.category
            )
          )
        ).sort(),
      ];
    }, [products]);

  const departments =
    useMemo(() => {
      return Array.from(
        new Set(
          products.map(
            (product) =>
              product.department
          )
        )
      ).sort();
    }, [products]);

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      const result =
        products.filter(
          (product) => {
            const sellerEmail =
              product.seller?.email ??
              "";

            const matchesSearch =
              product.title
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              product.category
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              product.department
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              product.municipality
                .toLowerCase()
                .includes(
                  searchValue
                ) ||
              sellerEmail
                .toLowerCase()
                .includes(
                  searchValue
                );

            const matchesCategory =
              category ===
                "Todos" ||
              product.category ===
                category;

            const matchesDepartment =
              !department ||
              product.department ===
                department;

            return (
              matchesSearch &&
              matchesCategory &&
              matchesDepartment
            );
          }
        );

      return [...result].sort(
        (a, b) => {
          if (
            sort ===
            "price-asc"
          ) {
            return (
              a.price -
              b.price
            );
          }

          if (
            sort ===
            "price-desc"
          ) {
            return (
              b.price -
              a.price
            );
          }

          return (
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
          );
        }
      );
    }, [
      products,
      search,
      category,
      department,
      sort,
    ]);

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10 bg-[#f4f2ea]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition-colors hover:text-[#173c29]"
            >
              <ArrowLeft
                size={17}
              />

              Dashboard
            </Link>

            <div className="hidden h-6 w-px bg-[#172019]/10 sm:block" />

            <Link
              href="/"
              className="hidden items-center gap-3 sm:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
                <Sprout
                  size={18}
                />
              </div>

              <div>
                <p className="font-semibold tracking-[-0.03em]">
                  Agromarket
                </p>

                <p className="text-[10px] uppercase tracking-[0.17em] text-[#7c837d]">
                  Mercado B2B
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isBuyer && (
              <Link
                href="/favoritos"
                className="flex items-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#ecebe3]"
              >
                <Heart
                  size={16}
                />

                <span className="hidden sm:inline">
                  Favoritos
                </span>
              </Link>
            )}

            {isProvider && (
              <Link
                href="/publicaciones/nueva"
                className="rounded-full bg-[#173c29] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
              >
                Publicar producto
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="border-b border-[#172019]/10">
        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
            Mercado
          </p>

          <div className="mt-4 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Encuentra lo que
                <br />
                tu negocio necesita.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-[#687069] sm:text-base">
                Explora publicaciones
                reales de productores y
                proveedores dentro de
                Agromarket.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-5 py-4 lg:w-[420px]">
              <Search
                size={18}
                className="shrink-0 text-[#737c74]"
              />

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Buscar maíz, café, tomate..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#959b96]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {favoriteError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {favoriteError}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="flex items-center gap-2 border-b border-[#172019]/10 pb-4">
                <SlidersHorizontal
                  size={17}
                />

                <p className="text-sm font-semibold">
                  Filtros
                </p>
              </div>

              <div className="border-b border-[#172019]/10 py-6">
                <p className="mb-4 text-sm font-semibold">
                  Categoría
                </p>

                <div className="space-y-3">
                  {categories.map(
                    (item) => (
                      <label
                        key={
                          item
                        }
                        className="flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={
                            item
                          }
                          checked={
                            category ===
                            item
                          }
                          onChange={() =>
                            setCategory(
                              item
                            )
                          }
                          className="h-4 w-4 accent-[#173c29]"
                        />

                        <span className="text-sm text-[#626b63]">
                          {item}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="border-b border-[#172019]/10 py-6">
                <p className="mb-4 text-sm font-semibold">
                  Ubicación
                </p>

                <select
                  value={
                    department
                  }
                  onChange={(
                    event
                  ) =>
                    setDepartment(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#172019]/15 bg-[#fffdf7] px-4 py-3 text-sm outline-none"
                >
                  <option value="">
                    Todos los
                    departamentos
                  </option>

                  {departments.map(
                    (item) => (
                      <option
                        key={
                          item
                        }
                        value={
                          item
                        }
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="py-6">
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory(
                      "Todos"
                    );
                    setDepartment(
                      ""
                    );
                    setSort(
                      "recent"
                    );
                  }}
                  className="w-full rounded-xl border border-[#172019]/15 bg-[#fffdf7] px-4 py-3 text-sm font-semibold transition-colors hover:bg-[#e8e6da]"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </aside>

          <section>
            <div className="flex flex-col justify-between gap-4 border-b border-[#172019]/10 pb-5 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold">
                  Productos disponibles
                </p>

                <p className="mt-1 text-xs text-[#777f78]">
                  {
                    filteredProducts.length
                  }{" "}
                  {filteredProducts.length ===
                  1
                    ? "publicación encontrada"
                    : "publicaciones encontradas"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-4 py-2.5 text-sm font-medium lg:hidden"
                >
                  <Filter
                    size={16}
                  />
                  Filtros
                </button>

                <select
                  value={sort}
                  onChange={(
                    event
                  ) =>
                    setSort(
                      event.target.value
                    )
                  }
                  className="rounded-full border border-[#172019]/15 bg-[#fffdf7] px-4 py-2.5 text-sm font-medium outline-none"
                >
                  <option value="recent">
                    Más recientes
                  </option>

                  <option value="price-asc">
                    Menor precio
                  </option>

                  <option value="price-desc">
                    Mayor precio
                  </option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-96 items-center justify-center">
                <p className="text-sm text-[#747c75]">
                  Cargando productos...
                </p>
              </div>
            ) : filteredProducts.length >
              0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map(
                  (product) => {
                    const Icon =
                      getIcon(
                        product.category
                      );

                    const favorite =
                      favoriteIds.has(
                        product.id
                      );

                    const savingFavorite =
                      favoriteLoadingId ===
                      product.id;

                    return (
                      <article
                        key={
                          product.id
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
                              <div className="relative flex h-full items-center justify-center">
                                <div className="absolute inset-0 opacity-[0.07]">
                                  <div className="absolute left-1/3 top-0 h-full w-px bg-[#173c29]" />
                                  <div className="absolute left-2/3 top-0 h-full w-px bg-[#173c29]" />
                                  <div className="absolute left-0 top-1/2 h-px w-full bg-[#173c29]" />
                                </div>

                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#173c29] text-white">
                                  <Icon
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

                          {isBuyer && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleFavorite(
                                  product.id
                                )
                              }
                              disabled={
                                savingFavorite
                              }
                              aria-label={
                                favorite
                                  ? "Quitar de favoritos"
                                  : "Agregar a favoritos"
                              }
                              title={
                                favorite
                                  ? "Quitar de favoritos"
                                  : "Agregar a favoritos"
                              }
                              className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${
                                favorite
                                  ? "border-[#173c29] bg-[#173c29] text-white"
                                  : "border-white/60 bg-[#fffdf7]/95 text-[#173c29] hover:bg-white"
                              } ${
                                savingFavorite
                                  ? "cursor-wait opacity-60"
                                  : "hover:scale-105"
                              }`}
                            >
                              <Heart
                                size={
                                  18
                                }
                                fill={
                                  favorite
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex items-center gap-1.5 text-xs text-[#7b837c]">
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
                            className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#173c29] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
                          >
                            Ver publicación

                            <ArrowRight
                              size={
                                16
                              }
                              className="transition-transform group-hover:translate-x-1"
                            />
                          </Link>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#173c29]/20 bg-[#fffdf7]/60 px-6 text-center">
                <Search
                  size={28}
                />

                <h2 className="mt-5 text-xl font-semibold">
                  No encontramos
                  productos
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#747c75]">
                  Prueba con otra
                  búsqueda o cambia los
                  filtros.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {isProvider && (
        <section className="mt-10 bg-[#173c29] text-white">
          <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-6 py-12 md:flex-row md:items-center lg:px-10">
            <div>
              <div className="flex items-center gap-2 text-[#b9c995]">
                <Package
                  size={17}
                />

                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Para proveedores
                </p>
              </div>

              <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em]">
                ¿Tienes producto
                disponible para vender?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                Publica inventario y
                permite que los
                compradores encuentren
                tu oferta.
              </p>
            </div>

            <Link
              href="/publicaciones/nueva"
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f4f2ea] px-6 py-3.5 text-sm font-semibold text-[#173c29]"
            >
              Crear publicación

              <ArrowRight
                size={16}
              />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}