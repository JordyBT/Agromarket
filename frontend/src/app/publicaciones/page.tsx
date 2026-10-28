"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

type PublicationStatus = "Activa" | "Pausada" | "Agotada";

type Publication = {
  id: number;
  name: string;
  category: string;
  location: string;
  price: string;
  unit: string;
  stock: string;
  status: PublicationStatus;
  icon: typeof Wheat;
};

const initialPublications: Publication[] = [
  {
    id: 1,
    name: "Maíz amarillo",
    category: "Granos y cereales",
    location: "Zacapa",
    price: "Q 185.00",
    unit: "quintal",
    stock: "240 qq",
    status: "Activa",
    icon: Wheat,
  },
  {
    id: 2,
    name: "Frijol negro",
    category: "Granos y cereales",
    location: "Chiquimula",
    price: "Q 465.00",
    unit: "quintal",
    stock: "85 qq",
    status: "Activa",
    icon: Leaf,
  },
  {
    id: 3,
    name: "Tomate manzano",
    category: "Hortalizas",
    location: "Jalapa",
    price: "Q 145.00",
    unit: "caja",
    stock: "0 cajas",
    status: "Agotada",
    icon: Sprout,
  },
  {
    id: 4,
    name: "Café pergamino",
    category: "Café",
    location: "Chiquimula",
    price: "Q 1,250.00",
    unit: "quintal",
    stock: "40 qq",
    status: "Pausada",
    icon: Leaf,
  },
];

const filters = [
  "Todas",
  "Activas",
  "Pausadas",
  "Agotadas",
];

export default function PublicacionesPage() {
  const [publications, setPublications] =
    useState<Publication[]>(initialPublications);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");

  const filteredPublications = useMemo(() => {
    return publications.filter((publication) => {
      const searchValue = search
        .trim()
        .toLowerCase();

      const matchesSearch =
        publication.name
          .toLowerCase()
          .includes(searchValue) ||
        publication.category
          .toLowerCase()
          .includes(searchValue) ||
        publication.location
          .toLowerCase()
          .includes(searchValue);

      let matchesFilter = true;

      if (filter === "Activas") {
        matchesFilter =
          publication.status === "Activa";
      }

      if (filter === "Pausadas") {
        matchesFilter =
          publication.status === "Pausada";
      }

      if (filter === "Agotadas") {
        matchesFilter =
          publication.status === "Agotada";
      }

      return matchesSearch && matchesFilter;
    });
  }, [publications, search, filter]);

  function toggleStatus(id: number) {
    setPublications((current) =>
      current.map((publication) => {
        if (publication.id !== id) {
          return publication;
        }

        if (publication.status === "Agotada") {
          return publication;
        }

        return {
          ...publication,
          status:
            publication.status === "Activa"
              ? "Pausada"
              : "Activa",
        };
      })
    );
  }

  const activeCount = publications.filter(
    (publication) =>
      publication.status === "Activa"
  ).length;

  const pausedCount = publications.filter(
    (publication) =>
      publication.status === "Pausada"
  ).length;

  const soldOutCount = publications.filter(
    (publication) =>
      publication.status === "Agotada"
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

          {filteredPublications.length > 0 ? (
            <div className="mt-5 space-y-3">
              {filteredPublications.map(
                (publication) => {
                  const Icon = publication.icon;

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
                                {publication.name}
                              </h2>

                              <StatusBadge
                                status={
                                  publication.status
                                }
                              />
                            </div>

                            <p className="mt-1 text-xs text-[#7d847e]">
                              {publication.category}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#697169]">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={13} />
                                {
                                  publication.location
                                }
                              </span>

                              <span>
                                Inventario:{" "}
                                <strong className="font-semibold text-[#172019]">
                                  {publication.stock}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex min-w-[145px] flex-col xl:items-end">
                          <p className="text-lg font-semibold">
                            {publication.price}
                          </p>

                          <p className="text-xs text-[#7c837d]">
                            por {publication.unit}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 xl:justify-end">
                          <Link
                            href={`/productos/${publication.id}`}
                            className="flex items-center gap-2 rounded-full border border-[#172019]/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#f0efe7]"
                          >
                            <Eye size={15} />
                            Ver
                          </Link>

                          <Link
                            href={`/publicaciones/${publication.id}/editar`}
                            className="flex items-center gap-2 rounded-full border border-[#172019]/15 px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-[#f0efe7]"
                          >
                            <Pencil size={15} />
                            Editar
                          </Link>

                          {publication.status !==
                            "Agotada" && (
                            <button
                              type="button"
                              onClick={() =>
                                toggleStatus(
                                  publication.id
                                )
                              }
                              className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-colors ${
                                publication.status ===
                                "Activa"
                                  ? "border border-[#876f4a]/20 bg-[#f1ecde] text-[#705d3d] hover:bg-[#e9e1cf]"
                                  : "bg-[#173c29] text-white hover:bg-[#24583b]"
                              }`}
                            >
                              {publication.status ===
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
                Cambia los filtros o busca utilizando
                otro término.
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