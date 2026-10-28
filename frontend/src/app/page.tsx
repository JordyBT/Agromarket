import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Search,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Wheat,
} from "lucide-react";

const categories = [
  {
    name: "Granos y cereales",
    description: "Maíz, frijol, arroz y otros granos.",
    icon: Wheat,
  },
  {
    name: "Frutas",
    description: "Producto fresco de temporada.",
    icon: Sprout,
  },
  {
    name: "Hortalizas",
    description: "Oferta directa de productores.",
    icon: Sprout,
  },
];

const products = [
  {
    name: "Maíz amarillo",
    location: "Zacapa",
    price: "Q 185.00",
    unit: "por quintal",
    available: "240 qq disponibles",
    initials: "MA",
  },
  {
    name: "Frijol negro",
    location: "Chiquimula",
    price: "Q 465.00",
    unit: "por quintal",
    available: "85 qq disponibles",
    initials: "FN",
  },
  {
    name: "Tomate",
    location: "Jalapa",
    price: "Q 145.00",
    unit: "por caja",
    available: "160 cajas disponibles",
    initials: "TO",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10 bg-[#f4f2ea]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183f2a] text-white">
              <Sprout size={20} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-xl font-semibold tracking-[-0.04em]">
                Agromarket
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#667067]">
                Comercio agrícola B2B
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <Link
              href="#mercado"
              className="transition-colors hover:text-[#377a4d]"
            >
              Mercado
            </Link>

            <Link
              href="#categorias"
              className="flex items-center gap-1 transition-colors hover:text-[#377a4d]"
            >
              Categorías
              <ChevronDown size={15} />
            </Link>

            <Link
              href="#como-funciona"
              className="transition-colors hover:text-[#377a4d]"
            >
              Cómo funciona
            </Link>

            <Link
              href="#proveedores"
              className="transition-colors hover:text-[#377a4d]"
            >
              Proveedores
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#172019]/5 sm:block"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/registro"
              className="rounded-full bg-[#183f2a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#24583b]"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-[1400px] lg:min-h-[690px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-6 py-20 lg:px-10 lg:py-28">
            <div className="mb-7 flex w-fit items-center gap-2 rounded-full border border-[#183f2a]/15 bg-white/50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#4d8c5d]" />

              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3f5d47]">
                Mercado agrícola nacional
              </span>
            </div>

            <h1 className="max-w-4xl text-[3.4rem] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.4rem]">
              Del productor
              <br />
              al comprador,
              <br />
              <span className="text-[#36744a]">sin rodeos.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-[#606b62] sm:text-lg">
              Un espacio para encontrar, negociar y comercializar materia prima
              agrícola entre empresas, proveedores y productores.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#mercado"
                className="group flex items-center justify-center gap-3 rounded-full bg-[#183f2a] px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-[#24583b]"
              >
                Explorar el mercado
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/registro"
                className="flex items-center justify-center rounded-full border border-[#172019]/20 bg-transparent px-7 py-4 text-sm font-semibold transition-colors hover:bg-white/60"
              >
                Quiero vender
              </Link>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-3 border-t border-[#172019]/10 pt-6">
              <div>
                <p className="text-2xl font-semibold tracking-[-0.04em]">
                  +120
                </p>
                <p className="mt-1 text-xs text-[#6b746c]">
                  proveedores
                </p>
              </div>

              <div className="border-l border-[#172019]/10 pl-6">
                <p className="text-2xl font-semibold tracking-[-0.04em]">
                  8
                </p>
                <p className="mt-1 text-xs text-[#6b746c]">
                  categorías
                </p>
              </div>

              <div className="border-l border-[#172019]/10 pl-6">
                <p className="text-2xl font-semibold tracking-[-0.04em]">
                  B2B
                </p>
                <p className="mt-1 text-xs text-[#6b746c]">
                  trato directo
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[600px] bg-[#173c29] p-6 sm:p-10 lg:min-h-full">
            <div className="absolute inset-0 opacity-[0.08]">
              <div className="absolute left-[15%] top-0 h-full w-px bg-white" />
              <div className="absolute left-[45%] top-0 h-full w-px bg-white" />
              <div className="absolute left-[75%] top-0 h-full w-px bg-white" />
              <div className="absolute left-0 top-[25%] h-px w-full bg-white" />
              <div className="absolute left-0 top-[60%] h-px w-full bg-white" />
            </div>

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">
                  Mercado hoy
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white">
                  <TrendingUp size={19} />
                </div>
              </div>

              <div className="mx-auto my-14 w-full max-w-md">
                <div className="relative">
                  <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#b9c48d]" />
                  <div className="absolute -bottom-8 -right-5 h-36 w-36 rounded-full border border-[#d7dfb5]/30" />

                  <div className="relative rounded-[2rem] bg-[#f5f0df] p-7 shadow-2xl shadow-black/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#667067]">
                          Producto destacado
                        </p>

                        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#172019]">
                          Maíz amarillo
                        </h2>

                        <div className="mt-2 flex items-center gap-1.5 text-sm text-[#687069]">
                          <MapPin size={15} />
                          Zacapa, Guatemala
                        </div>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#183f2a] text-white">
                        <Wheat size={21} />
                      </div>
                    </div>

                    <div className="my-7 h-px bg-[#172019]/10" />

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-[#777d76]">
                          Precio publicado
                        </p>
                        <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">
                          Q 185.00
                        </p>
                        <p className="text-xs text-[#777d76]">
                          por quintal
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#777d76]">
                          Disponibilidad
                        </p>
                        <p className="mt-1 font-semibold">
                          240 qq
                        </p>
                      </div>
                    </div>

                    <button className="mt-7 flex w-full items-center justify-between rounded-full bg-[#172019] px-5 py-3.5 text-sm font-medium text-white">
                      Ver publicación
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Oferta publicada recientemente</span>
                <span>01 / 03</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="mercado"
        className="border-t border-[#172019]/10 bg-[#fffdf7]"
      >
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#497458]">
                Mercado
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Encuentra producto disponible.
              </h2>
            </div>

            <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-[#172019]/15 bg-white px-5 py-3.5">
              <Search size={18} className="text-[#718076]" />
              <input
                type="text"
                placeholder="Buscar maíz, café, tomate..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8d958f]"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.6rem] border border-[#172019]/10 bg-[#172019]/10 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="group bg-[#fffdf7] p-6 transition-colors hover:bg-[#f7f4e9]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3e8d6] text-sm font-bold text-[#36583e]">
                    {product.initials}
                  </div>

                  <button
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#172019]/15 transition-all group-hover:bg-[#183f2a] group-hover:text-white"
                    aria-label={`Ver ${product.name}`}
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>

                <div className="mt-10">
                  <div className="flex items-center gap-1 text-xs text-[#747d75]">
                    <MapPin size={13} />
                    {product.location}
                  </div>

                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                    {product.name}
                  </h3>

                  <div className="mt-6 flex items-end justify-between border-t border-[#172019]/10 pt-5">
                    <div>
                      <p className="text-xl font-semibold">
                        {product.price}
                      </p>
                      <p className="text-xs text-[#777f78]">
                        {product.unit}
                      </p>
                    </div>

                    <p className="text-xs font-medium text-[#4e6f57]">
                      {product.available}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="flex items-center gap-2 rounded-full border border-[#172019]/20 px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#172019] hover:text-white">
              Ver todos los productos
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section
        id="categorias"
        className="bg-[#e8e6da]"
      >
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4c7257]">
                Categorías
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">
                Compra según lo que tu negocio necesita.
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#697069]">
                Organizamos la oferta agrícola para encontrar productos de
                forma clara, sin perder tiempo entre publicaciones
                irrelevantes.
              </p>
            </div>

            <div className="divide-y divide-[#172019]/10 border-y border-[#172019]/10">
              {categories.map((category, index) => {
                const Icon = category.icon;

                return (
                  <button
                    key={category.name}
                    className="group grid w-full grid-cols-[50px_1fr_auto] items-center gap-4 py-6 text-left"
                  >
                    <span className="text-sm font-medium text-[#788078]">
                      0{index + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className="text-[#3c6f4a]"
                        />

                        <h3 className="text-xl font-semibold tracking-[-0.025em]">
                          {category.name}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm text-[#717872]">
                        {category.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="bg-[#183f2a] text-white"
      >
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-24 lg:grid-cols-2 lg:px-10">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20">
              <ShieldCheck size={21} />
            </div>

            <h2 className="mt-8 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
              Negociaciones más claras entre empresas y productores.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="border-t border-white/20 pt-5">
              <p className="text-sm font-semibold text-[#b9d0be]">
                01
              </p>
              <h3 className="mt-6 text-xl font-semibold">
                Encuentra
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Consulta productos, disponibilidad, ubicación y precio antes de
                iniciar una negociación.
              </p>
            </div>

            <div className="border-t border-white/20 pt-5">
              <p className="text-sm font-semibold text-[#b9d0be]">
                02
              </p>
              <h3 className="mt-6 text-xl font-semibold">
                Conecta
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Comunícate directamente con proveedores y compradores dentro
                de la plataforma.
              </p>
            </div>

            <div className="border-t border-white/20 pt-5">
              <p className="text-sm font-semibold text-[#b9d0be]">
                03
              </p>
              <h3 className="mt-6 text-xl font-semibold">
                Reserva
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Define cantidades y registra operaciones manteniendo el
                inventario actualizado.
              </p>
            </div>

            <div className="border-t border-white/20 pt-5">
              <p className="text-sm font-semibold text-[#b9d0be]">
                04
              </p>
              <h3 className="mt-6 text-xl font-semibold">
                Construye confianza
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Cada operación ayuda a formar el historial y reputación de los
                participantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#10291c] text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#183f2a]">
              <Sprout size={18} />
            </div>

            <div>
              <p className="font-semibold">
                Agromarket
              </p>
              <p className="text-xs text-white/50">
                Marketplace B2B agrícola
              </p>
            </div>
          </div>

          <p className="text-xs text-white/45">
            Plataforma para comercialización de materia prima agrícola.
          </p>
        </div>
      </footer>
    </main>
  );
}