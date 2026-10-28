import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Sprout,
  Wheat,
  Leaf,
  Package,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Maíz amarillo",
    category: "Granos",
    location: "Zacapa",
    price: "Q 185.00",
    unit: "quintal",
    available: "240 qq disponibles",
    supplier: "Agrícola Los Pinos",
    icon: Wheat,
  },
  {
    id: 2,
    name: "Frijol negro",
    category: "Granos",
    location: "Chiquimula",
    price: "Q 465.00",
    unit: "quintal",
    available: "85 qq disponibles",
    supplier: "Productores del Oriente",
    icon: Leaf,
  },
  {
    id: 3,
    name: "Tomate manzano",
    category: "Hortalizas",
    location: "Jalapa",
    price: "Q 145.00",
    unit: "caja",
    available: "160 cajas disponibles",
    supplier: "Finca El Encanto",
    icon: Sprout,
  },
  {
    id: 4,
    name: "Café pergamino",
    category: "Café",
    location: "Chiquimula",
    price: "Q 1,250.00",
    unit: "quintal",
    available: "40 qq disponibles",
    supplier: "Café Sierra Verde",
    icon: Leaf,
  },
  {
    id: 5,
    name: "Cebolla blanca",
    category: "Hortalizas",
    location: "Jutiapa",
    price: "Q 120.00",
    unit: "quintal",
    available: "110 qq disponibles",
    supplier: "Agroservicios del Sur",
    icon: Sprout,
  },
  {
    id: 6,
    name: "Arroz en granza",
    category: "Granos",
    location: "Izabal",
    price: "Q 210.00",
    unit: "quintal",
    available: "320 qq disponibles",
    supplier: "Distribuidora del Caribe",
    icon: Wheat,
  },
];

const categories = [
  "Todos",
  "Granos",
  "Hortalizas",
  "Frutas",
  "Café",
  "Otros",
];

export default function ProductosPage() {
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

            <Link href="/" className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
                <Sprout size={18} />
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

          <Link
            href="/publicaciones/nueva"
            className="rounded-full bg-[#173c29] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
          >
            Publicar producto
          </Link>
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
                Explora publicaciones de productores y proveedores, compara
                disponibilidad y encuentra nuevas oportunidades comerciales.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-5 py-4 lg:w-[420px]">
              <Search
                size={18}
                className="shrink-0 text-[#737c74]"
              />

              <input
                type="text"
                placeholder="Buscar maíz, café, tomate..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#959b96]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <div className="flex items-center gap-2 border-b border-[#172019]/10 pb-4">
                <SlidersHorizontal size={17} />

                <p className="text-sm font-semibold">
                  Filtros
                </p>
              </div>

              <div className="border-b border-[#172019]/10 py-6">
                <p className="mb-4 text-sm font-semibold">
                  Categoría
                </p>

                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="radio"
                        name="category"
                        defaultChecked={index === 0}
                        className="h-4 w-4 accent-[#173c29]"
                      />

                      <span className="text-sm text-[#626b63]">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-b border-[#172019]/10 py-6">
                <p className="mb-4 text-sm font-semibold">
                  Ubicación
                </p>

                <select
                  defaultValue=""
                  className="w-full rounded-xl border border-[#172019]/15 bg-[#fffdf7] px-4 py-3 text-sm outline-none"
                >
                  <option value="">
                    Todos los departamentos
                  </option>
                  <option>Zacapa</option>
                  <option>Chiquimula</option>
                  <option>Jalapa</option>
                  <option>Jutiapa</option>
                  <option>Izabal</option>
                  <option>Guatemala</option>
                </select>
              </div>

              <div className="py-6">
                <p className="mb-4 text-sm font-semibold">
                  Disponibilidad
                </p>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-[#173c29]"
                  />

                  <div>
                    <p className="text-sm text-[#626b63]">
                      Solo con inventario
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#8b918c]">
                      Oculta publicaciones sin disponibilidad.
                    </p>
                  </div>
                </label>
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
                  6 publicaciones encontradas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-4 py-2.5 text-sm font-medium lg:hidden"
                >
                  <Filter size={16} />
                  Filtros
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-4 py-2.5 text-sm font-medium"
                >
                  Más recientes
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const Icon = product.icon;

                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-[#172019]/10 bg-[#fffdf7] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#173c29]/5"
                  >
                    <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#e2e6d7]">
                      <div className="absolute inset-0 opacity-[0.07]">
                        <div className="absolute left-1/3 top-0 h-full w-px bg-[#173c29]" />
                        <div className="absolute left-2/3 top-0 h-full w-px bg-[#173c29]" />
                        <div className="absolute left-0 top-1/2 h-px w-full bg-[#173c29]" />
                      </div>

                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#173c29] text-white">
                        <Icon
                          size={38}
                          strokeWidth={1.5}
                        />
                      </div>

                      <span className="absolute left-4 top-4 rounded-full bg-[#fffdf7] px-3 py-1.5 text-[11px] font-semibold text-[#526057]">
                        {product.category}
                      </span>

                      <button
                        type="button"
                        aria-label={`Guardar ${product.name}`}
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#fffdf7] text-[#173c29] transition hover:bg-[#173c29] hover:text-white"
                      >
                        <Heart size={16} />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-xs text-[#7b837c]">
                        <MapPin size={13} />
                        {product.location}
                      </div>

                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-xs text-[#818882]">
                        {product.supplier}
                      </p>

                      <div className="mt-5 flex items-end justify-between border-t border-[#172019]/10 pt-4">
                        <div>
                          <p className="text-xl font-semibold tracking-[-0.025em]">
                            {product.price}
                          </p>

                          <p className="mt-1 text-xs text-[#7a817b]">
                            por {product.unit}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-[#919692]">
                            Disponible
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[#42694b]">
                            {product.available}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/productos/${product.id}`}
                        className="mt-5 flex w-full items-center justify-between rounded-xl bg-[#173c29] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
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
              })}
            </div>

            <div className="mt-10 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#172019]/15 bg-[#173c29] text-sm font-semibold text-white"
                >
                  1
                </button>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#172019]/15 bg-[#fffdf7] text-sm font-semibold transition-colors hover:bg-[#e8e6da]"
                >
                  2
                </button>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#172019]/15 bg-[#fffdf7] text-sm font-semibold transition-colors hover:bg-[#e8e6da]"
                >
                  3
                </button>

                <button
                  type="button"
                  className="ml-2 flex items-center gap-2 rounded-full border border-[#172019]/15 bg-[#fffdf7] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#e8e6da]"
                >
                  Siguiente
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-10 bg-[#173c29] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-6 py-12 md:flex-row md:items-center lg:px-10">
          <div>
            <div className="flex items-center gap-2 text-[#b9c995]">
              <Package size={17} />

              <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                Para proveedores
              </p>
            </div>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.04em]">
              ¿Tienes producto disponible para vender?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
              Publica inventario y haz que compradores de la plataforma puedan
              encontrar tu oferta.
            </p>
          </div>

          <Link
            href="/publicaciones/nueva"
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#f4f2ea] px-6 py-3.5 text-sm font-semibold text-[#173c29]"
          >
            Crear publicación
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}