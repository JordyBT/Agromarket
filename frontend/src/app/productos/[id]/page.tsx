import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  CalendarDays,
  Heart,
  MapPin,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Wheat,
  Leaf,
} from "lucide-react";

const products = [
  {
    id: "1",
    name: "Maíz amarillo",
    category: "Granos",
    location: "Zacapa, Guatemala",
    price: "Q 185.00",
    unit: "quintal",
    available: "240 qq",
    minimum: "10 quintales",
    supplier: "Agrícola Los Pinos",
    supplierInitials: "AP",
    description:
      "Maíz amarillo seco disponible para venta mayorista. Producto almacenado bajo condiciones controladas y listo para despacho según cantidad acordada.",
    icon: Wheat,
  },
  {
    id: "2",
    name: "Frijol negro",
    category: "Granos",
    location: "Chiquimula, Guatemala",
    price: "Q 465.00",
    unit: "quintal",
    available: "85 qq",
    minimum: "5 quintales",
    supplier: "Productores del Oriente",
    supplierInitials: "PO",
    description:
      "Frijol negro seleccionado para comercialización mayorista. Disponible para compradores, distribuidores y empresas del sector alimentario.",
    icon: Leaf,
  },
  {
    id: "3",
    name: "Tomate manzano",
    category: "Hortalizas",
    location: "Jalapa, Guatemala",
    price: "Q 145.00",
    unit: "caja",
    available: "160 cajas",
    minimum: "10 cajas",
    supplier: "Finca El Encanto",
    supplierInitials: "FE",
    description:
      "Tomate manzano fresco producido para distribución comercial. El inventario se actualiza según disponibilidad de cosecha.",
    icon: Sprout,
  },
  {
    id: "4",
    name: "Café pergamino",
    category: "Café",
    location: "Chiquimula, Guatemala",
    price: "Q 1,250.00",
    unit: "quintal",
    available: "40 qq",
    minimum: "2 quintales",
    supplier: "Café Sierra Verde",
    supplierInitials: "CV",
    description:
      "Café pergamino seco disponible para negociación mayorista. Producto orientado a compradores y empresas del sector cafetalero.",
    icon: Leaf,
  },
  {
    id: "5",
    name: "Cebolla blanca",
    category: "Hortalizas",
    location: "Jutiapa, Guatemala",
    price: "Q 120.00",
    unit: "quintal",
    available: "110 qq",
    minimum: "10 quintales",
    supplier: "Agroservicios del Sur",
    supplierInitials: "AS",
    description:
      "Cebolla blanca disponible para distribución comercial. Venta por volumen con cantidades sujetas a disponibilidad.",
    icon: Sprout,
  },
  {
    id: "6",
    name: "Arroz en granza",
    category: "Granos",
    location: "Izabal, Guatemala",
    price: "Q 210.00",
    unit: "quintal",
    available: "320 qq",
    minimum: "15 quintales",
    supplier: "Distribuidora del Caribe",
    supplierInitials: "DC",
    description:
      "Arroz en granza destinado a operaciones comerciales de volumen. Disponible para compradores mayoristas y procesadores.",
    icon: Wheat,
  },
];

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  const product =
    products.find((item) => item.id === id) ?? products[0];

  const Icon = product.icon;

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
            {product.name}
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

              <button
                type="button"
                aria-label="Guardar publicación"
                className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#fffdf7] transition-colors hover:bg-[#173c29] hover:text-white"
              >
                <Heart size={18} />
              </button>

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
                    {product.minimum}
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
                <div className="bg-[#fffdf7] p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                    <Boxes size={18} />
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    Inventario disponible
                  </p>

                  <p className="mt-2 text-sm text-[#6d756e]">
                    {product.available}
                  </p>
                </div>

                <div className="bg-[#fffdf7] p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                    <Truck size={18} />
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    Entrega
                  </p>

                  <p className="mt-2 text-sm text-[#6d756e]">
                    A coordinar con el proveedor
                  </p>
                </div>

                <div className="bg-[#fffdf7] p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                    <CalendarDays size={18} />
                  </div>

                  <p className="mt-5 text-sm font-semibold">
                    Publicado
                  </p>

                  <p className="mt-2 text-sm text-[#6d756e]">
                    Recientemente
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside>
            <div className="sticky top-8 space-y-5">
              <section className="rounded-[2rem] border border-[#172019]/10 bg-[#fffdf7] p-6 sm:p-8">
                <div className="flex items-center gap-1.5 text-sm text-[#687169]">
                  <MapPin size={16} />
                  {product.location}
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                  {product.name}
                </h1>

                <div className="mt-8 border-y border-[#172019]/10 py-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#858c86]">
                    Precio publicado
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-4xl font-semibold tracking-[-0.04em]">
                      {product.price}
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
                      {product.available}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#f1f1e8] p-4">
                    <p className="text-xs text-[#858c86]">
                      Mínimo
                    </p>

                    <p className="mt-2 font-semibold">
                      {product.minimum}
                    </p>
                  </div>
                </div>

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
                      min="1"
                      placeholder="Ej. 30"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none"
                    />

                    <div className="flex items-center border-l border-[#172019]/10 px-4 text-xs font-medium text-[#697169]">
                      {product.unit}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173c29] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
                >
                  <PackageCheck size={17} />
                  Solicitar reserva
                </button>

                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#172019]/15 px-6 py-4 text-sm font-semibold transition-colors hover:bg-[#f1f1e8]"
                >
                  <MessageSquareText size={17} />
                  Contactar proveedor
                </button>

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#edf0e6] p-4">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#3d6b49]"
                  />

                  <p className="text-xs leading-5 text-[#5f6b61]">
                    La disponibilidad se confirmará antes de completar la
                    operación.
                  </p>
                </div>
              </section>

              <section className="rounded-[2rem] border border-[#172019]/10 bg-[#fffdf7] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#173c29] font-semibold text-white">
                    {product.supplierInitials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate font-semibold">
                        {product.supplier}
                      </p>

                      <BadgeCheck
                        size={16}
                        className="shrink-0 text-[#41734d]"
                      />
                    </div>

                    <p className="mt-1 text-xs text-[#7d857e]">
                      Proveedor verificado
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#172019]/10 pt-5">
                  <div>
                    <p className="text-xs text-[#858c86]">
                      Tipo
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <Store size={15} />
                      <p className="text-sm font-medium">
                        Proveedor
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[#858c86]">
                      Estado
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#3d6b49]">
                      Activo
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-xl border border-[#172019]/15 py-3 text-sm font-semibold transition-colors hover:bg-[#f1f1e8]"
                >
                  Ver perfil del proveedor
                </button>
              </section>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}