"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CirclePause,
  CirclePlay,
  Eye,
  Leaf,
  MapPin,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Sprout,
  Wheat,
} from "lucide-react";
import {
  getMyPublications,
  type Publication,
  updatePublicationStatus,
} from "@/services/publicationService";

type PublicationStatus =
  | "Activa"
  | "Pausada"
  | "Agotada";

const filters = [
  "Todas",
  "Activas",
  "Pausadas",
  "Agotadas",
];

function getStatus(
  publication: Publication
): PublicationStatus {
  if (publication.stock <= 0) {
    return "Agotada";
  }

  return publication.isActive
    ? "Activa"
    : "Pausada";
}

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

export default function PublicacionesPage() {
  const [publications, setPublications] = useState<
    Publication[]
  >([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<
    string | null
  >(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPublications() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyPublications();
        setPublications(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No fue posible cargar las publicaciones."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPublications();
  }, []);

  const filteredPublications = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return publications.filter((publication) => {
      const status = getStatus(publication);

      const location =
        `${publication.municipality} ${publication.department}`.toLowerCase();

      const matchesSearch =
        publication.title
          .toLowerCase()
          .includes(searchValue) ||
        publication.category
          .toLowerCase()
          .includes(searchValue) ||
        location.includes(searchValue);

      let matchesFilter = true;

      if (filter === "Activas") {
        matchesFilter = status === "Activa";
      }

      if (filter === "Pausadas") {
        matchesFilter = status === "Pausada";
      }

      if (filter === "Agotadas") {
        matchesFilter = status === "Agotada";
      }

      return matchesSearch && matchesFilter;
    });
  }, [publications, search, filter]);

  async function toggleStatus(
    publication: Publication
  ) {
    const status = getStatus(publication);

    if (status === "Agotada") {
      return;
    }

    const nextStatus = !publication.isActive;

    try {
      setUpdatingId(publication.id);
      setError("");

      const result =
        await updatePublicationStatus(
          publication.id,
          nextStatus
        );

      setPublications((current) =>
        current.map((item) =>
          item.id === publication.id
            ? {
                ...item,
                isActive: result.isActive,
              }
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible actualizar la publicación."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const activeCount = publications.filter(
    (publication) =>
      getStatus(publication) === "Activa"
  ).length;

  const pausedCount = publications.filter(
    (publication) =>
      getStatus(publication) === "Pausada"
  ).length;

  const soldOutCount = publications.filter(
    (publication) =>
      getStatus(publication) === "Agotada"
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10 bg-[#f4f2ea]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition-colors hover:text-[#173c29]"
            >
              <ArrowLeft size={17} />
              Dashboard
            </Link>

            <div className="hidden h-6 w-px bg-[#172019]/10 sm:block" />

            <Link
              href="/"
              className="hidden items-center gap-3 sm:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
                <Sprout size={18} />
              </div>

              <div>
                <p className="font-semibold tracking-[-0.03em]">
                  Agromarket
                </p>

                <p className="text-[10px] uppercase tracking-[0.17em] text-[#7c837d]">
                  Comercio agrícola B2B
                </p>
              </div>
            </Link>
          </div>

          <Link
            href="/publicaciones/nueva"
            className="flex items-center gap-2 rounded-full bg-[#173c29] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
          >
            <Plus size={16} />
            Nueva publicación
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-14">
        <section className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
              Inventario comercial
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Mis publicaciones
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687069] sm:text-base">
              Consulta el estado de tus productos,
              administra disponibilidad y controla qué
              publicaciones permanecen visibles en el
              mercado.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-5 py-3.5 lg:w-[390px]">
            <Search
              size={17}
              className="shrink-0 text-[#737c74]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar en mis publicaciones..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#959b96]"
            />
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                <PackageCheck size={18} />
              </div>

              <span className="text-xs font-medium text-[#55745d]">
                Visibles
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold">
              {activeCount}
            </p>

            <p className="mt-1 text-sm font-semibold">
              Publicaciones activas
            </p>
          </article>

          <article className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ede9d9] text-[#665c35]">
                <CirclePause size={18} />
              </div>

              <span className="text-xs font-medium text-[#817752]">
                Ocultas
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold">
              {pausedCount}
            </p>

            <p className="mt-1 text-sm font-semibold">
              Publicaciones pausadas
            </p>
          </article>

          <article className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ece6df] text-[#735b4b]">
                <Boxes size={18} />
              </div>

              <span className="text-xs font-medium text-[#816c60]">
                Sin inventario
              </span>
            </div>

            <p className="mt-6 text-3xl font-semibold">
              {soldOutCount}
            </p>

            <p className="mt-1 text-sm font-semibold">
              Publicaciones agotadas
            </p>
          </article>
        </section>

        <section className="mt-7">
          <div className="flex flex-col justify-between gap-5 border-b border-[#172019]/10 pb-5 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === item
                      ? "bg-[#173c29] text-white"
                      : "border border-[#172019]/10 bg-[#fffdf7] text-[#606961] hover:bg-[#e8e6da]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <p className="text-xs text-[#7b827c]">
              {filteredPublications.length}{" "}
              {filteredPublications.length === 1
                ? "resultado"
                : "resultados"}
            </p>
          </div>

          {loading ? (
            <div className="mt-8 flex min-h-80 items-center justify-center rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <p className="text-sm text-[#747c75]">
                Cargando publicaciones...
              </p>
            </div>
          ) : filteredPublications.length > 0 ? (
            <div className="mt-5 space-y-3">
              {filteredPublications.map(
                (publication) => {
                  const status =
                    getStatus(publication);

                  const Icon = getIcon(
                    publication.category
                  );

                  return (
                    <article
                      key={publication.id}
                      className="rounded-2xl border border-[#172019]/10 bg-[#fffdf7] p-5 transition-shadow hover:shadow-lg hover:shadow-[#173c29]/5"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e3e7d8] text-[#315f3f]">
                            <Icon
                              size={27}
                              strokeWidth={1.5}
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-xl font-semibold tracking-[-0.03em]">
                                {publication.title}
                              </h2>

                              <StatusBadge
                                status={status}
                              />
                            </div>

                            <p className="mt-1 text-xs text-[#7d847e]">
                              {
                                publication.category
                              }
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#697169]">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={13} />
                                {
                                  publication.municipality
                                }
                                ,{" "}
                                {
                                  publication.department
                                }
                              </span>

                              <span>
                                Inventario:{" "}
                                <strong className="font-semibold text-[#172019]">
                                  {
                                    publication.stock
                                  }{" "}
                                  {
                                    publication.unit
                                  }
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex min-w-[145px] flex-col xl:items-end">
                          <p className="text-lg font-semibold">
                            {formatPrice(
                              publication.price
                            )}
                          </p>

                          <p className="text-xs text-[#7c837d]">
                            por {publication.unit}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 xl:justify-end">
                          {status === "Activa" && (
                            <Link
                              href={`/productos/${publication.id}`}
                              className="flex items-center gap-2 rounded-full border border-[#172019]/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#f0efe7]"
                            >
                              <Eye size={15} />
                              Ver
                            </Link>
                          )}

                          <Link
                            href={`/publicaciones/${publication.id}/editar`}
                            className="flex items-center gap-2 rounded-full border border-[#172019]/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#f0efe7]"
                          >
                            <Pencil size={15} />
                            Editar
                          </Link>

                          {status !== "Agotada" && (
                            <button
                              type="button"
                              disabled={
                                updatingId ===
                                publication.id
                              }
                              onClick={() =>
                                toggleStatus(
                                  publication
                                )
                              }
                              className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                status === "Activa"
                                  ? "border border-[#876f4a]/20 bg-[#f1ecde] text-[#705d3d] hover:bg-[#e9e1cf]"
                                  : "bg-[#173c29] text-white hover:bg-[#24583b]"
                              }`}
                            >
                              {updatingId ===
                              publication.id ? (
                                "Actualizando..."
                              ) : status ===
                                "Activa" ? (
                                <>
                                  <CirclePause
                                    size={15}
                                  />
                                  Pausar
                                </>
                              ) : (
                                <>
                                  <CirclePlay
                                    size={15}
                                  />
                                  Activar
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="mt-8 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-[#173c29]/20 bg-[#fffdf7]/60 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                <Boxes size={23} />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No encontramos publicaciones
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#747c75]">
                Crea una publicación o cambia los
                filtros de búsqueda.
              </p>
            </div>
          )}
        </section>

        <section className="mt-10 flex flex-col justify-between gap-6 rounded-3xl bg-[#173c29] p-7 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#b9c995]">
              Nueva oferta
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">
              ¿Tienes más producto disponible?
            </h2>

            <p className="mt-2 text-sm text-white/55">
              Agrega una nueva publicación para que
              aparezca dentro del marketplace.
            </p>
          </div>

          <Link
            href="/publicaciones/nueva"
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f4f2ea] px-6 py-3 text-sm font-semibold text-[#173c29]"
          >
            Crear publicación
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status: PublicationStatus;
}) {
  const styles: Record<
    PublicationStatus,
    string
  > = {
    Activa: "bg-[#e3eadc] text-[#376344]",
    Pausada: "bg-[#eee9d9] text-[#725f3e]",
    Agotada: "bg-[#ece4df] text-[#76594d]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}