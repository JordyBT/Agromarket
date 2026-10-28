"use client";

import Link from "next/link";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  MapPin,
  Package,
  Save,
  Sprout,
  Tag,
} from "lucide-react";

type PublicationForm = {
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string;
  unidad: string;
  inventario: string;
  minimo: string;
  departamento: string;
  municipio: string;
};

type FormErrors = Partial<
  Record<keyof PublicationForm, string>
>;

type DemoPublication = PublicationForm & {
  id: string;
};

const publications: DemoPublication[] = [
  {
    id: "1",
    nombre: "Maíz amarillo",
    categoria: "Granos y cereales",
    descripcion:
      "Maíz amarillo nacional disponible para venta al por mayor. Producto almacenado en condiciones adecuadas y listo para despacho.",
    precio: "185",
    unidad: "quintal",
    inventario: "240",
    minimo: "20",
    departamento: "Zacapa",
    municipio: "Zacapa",
  },
  {
    id: "2",
    nombre: "Frijol negro",
    categoria: "Granos y cereales",
    descripcion:
      "Frijol negro seleccionado y disponible para compradores mayoristas. Producción regional con disponibilidad inmediata.",
    precio: "465",
    unidad: "quintal",
    inventario: "85",
    minimo: "10",
    departamento: "Chiquimula",
    municipio: "Chiquimula",
  },
  {
    id: "3",
    nombre: "Tomate manzano",
    categoria: "Hortalizas",
    descripcion:
      "Tomate manzano de producción local, seleccionado para comercialización y distribución dentro del mercado nacional.",
    precio: "145",
    unidad: "caja",
    inventario: "0",
    minimo: "5",
    departamento: "Jalapa",
    municipio: "Jalapa",
  },
  {
    id: "4",
    nombre: "Café pergamino",
    categoria: "Café",
    descripcion:
      "Café pergamino seco producido en la región oriental. Disponible para compradores y distribuidores mayoristas.",
    precio: "1250",
    unidad: "quintal",
    inventario: "40",
    minimo: "5",
    departamento: "Chiquimula",
    municipio: "Esquipulas",
  },
];

const emptyForm: PublicationForm = {
  nombre: "",
  categoria: "",
  descripcion: "",
  precio: "",
  unidad: "",
  inventario: "",
  minimo: "",
  departamento: "",
  municipio: "",
};

export default function EditarPublicacionPage() {
  const params = useParams();

  const publicationId =
    typeof params.id === "string" ? params.id : "";

  const [form, setForm] =
    useState<PublicationForm>(emptyForm);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [success, setSuccess] =
    useState(false);

  const [publicationFound, setPublicationFound] =
    useState(true);

  useEffect(() => {
    if (!publicationId) {
      return;
    }

    const publication = publications.find(
      (item) => item.id === publicationId
    );

    if (!publication) {
      setPublicationFound(false);
      return;
    }

    setPublicationFound(true);

    setForm({
      nombre: publication.nombre,
      categoria: publication.categoria,
      descripcion: publication.descripcion,
      precio: publication.precio,
      unidad: publication.unidad,
      inventario: publication.inventario,
      minimo: publication.minimo,
      departamento: publication.departamento,
      municipio: publication.municipio,
    });
  }, [publicationId]);

  function updateField(
    field: keyof PublicationForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSuccess(false);
  }

  function validateForm() {
    const newErrors: FormErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre =
        "Ingresa el nombre del producto.";
    }

    if (!form.categoria) {
      newErrors.categoria =
        "Selecciona una categoría.";
    }

    if (!form.descripcion.trim()) {
      newErrors.descripcion =
        "Agrega una descripción.";
    } else if (
      form.descripcion.trim().length < 20
    ) {
      newErrors.descripcion =
        "La descripción debe tener al menos 20 caracteres.";
    }

    if (!form.precio) {
      newErrors.precio =
        "Ingresa el precio.";
    } else if (
      Number.isNaN(Number(form.precio)) ||
      Number(form.precio) <= 0
    ) {
      newErrors.precio =
        "El precio debe ser mayor que cero.";
    }

    if (!form.unidad) {
      newErrors.unidad =
        "Selecciona una unidad de venta.";
    }

    if (form.inventario === "") {
      newErrors.inventario =
        "Ingresa el inventario disponible.";
    } else if (
      !Number.isInteger(Number(form.inventario)) ||
      Number(form.inventario) < 0
    ) {
      newErrors.inventario =
        "El inventario debe ser un número entero igual o mayor que cero.";
    }

    if (!form.minimo) {
      newErrors.minimo =
        "Ingresa la cantidad mínima.";
    } else if (
      !Number.isInteger(Number(form.minimo)) ||
      Number(form.minimo) <= 0
    ) {
      newErrors.minimo =
        "La cantidad mínima debe ser mayor que cero.";
    } else if (
      Number(form.inventario) > 0 &&
      Number(form.minimo) >
        Number(form.inventario)
    ) {
      newErrors.minimo =
        "La cantidad mínima no puede superar el inventario.";
    }

    if (!form.departamento) {
      newErrors.departamento =
        "Selecciona el departamento.";
    }

    if (!form.municipio.trim()) {
      newErrors.municipio =
        "Ingresa el municipio.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!validateForm()) {
      setSuccess(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSuccess(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!publicationFound) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f2ea] px-6 text-[#172019]">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ece4df] text-[#76594d]">
            <CircleAlert size={23} />
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Publicación no encontrada
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#747c75]">
            No encontramos una publicación con ese
            identificador.
          </p>

          <Link
            href="/publicaciones"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Volver a mis publicaciones
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-[1350px] items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/publicaciones"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition-colors hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Mis publicaciones
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout size={18} />
            </div>

            <span className="hidden font-semibold tracking-[-0.03em] sm:block">
              Agromarket
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1350px] px-6 py-10 lg:px-10 lg:py-14">
        {success && (
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-[#4d7c59]/20 bg-[#e4ebdc] p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173c29] text-white">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="font-semibold">
                Cambios validados correctamente.
              </p>

              <p className="mt-1 text-sm leading-6 text-[#5e695f]">
                Estamos simulando la actualización.
                Cuando conectemos la API, estos cambios
                quedarán guardados en PostgreSQL.
              </p>
            </div>
          </div>
        )}

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
            Administración de inventario
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Editar publicación
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687069] sm:text-base">
            Actualiza la información comercial,
            disponibilidad y ubicación de tu producto.
          </p>
        </section>

        <div className="mt-10 grid gap-7 xl:grid-cols-[1fr_370px]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6"
          >
            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-[#172019]/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                  <Tag size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Información del producto
                  </h2>

                  <p className="mt-1 text-xs text-[#7a817b]">
                    Datos principales visibles en el mercado.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Nombre del producto"
                  error={errors.nombre}
                >
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(event) =>
                      updateField(
                        "nombre",
                        event.target.value
                      )
                    }
                    placeholder="Ej. Maíz amarillo"
                    className={inputClasses(
                      Boolean(errors.nombre)
                    )}
                  />
                </FormField>

                <FormField
                  label="Categoría"
                  error={errors.categoria}
                >
                  <select
                    value={form.categoria}
                    onChange={(event) =>
                      updateField(
                        "categoria",
                        event.target.value
                      )
                    }
                    className={inputClasses(
                      Boolean(errors.categoria)
                    )}
                  >
                    <option value="">
                      Selecciona una categoría
                    </option>

                    <option value="Granos y cereales">
                      Granos y cereales
                    </option>

                    <option value="Frutas">
                      Frutas
                    </option>

                    <option value="Hortalizas">
                      Hortalizas
                    </option>

                    <option value="Café">
                      Café
                    </option>

                    <option value="Otros">
                      Otros
                    </option>
                  </select>
                </FormField>
              </div>

              <div className="mt-5">
                <FormField
                  label="Descripción"
                  error={errors.descripcion}
                >
                  <textarea
                    rows={5}
                    value={form.descripcion}
                    onChange={(event) =>
                      updateField(
                        "descripcion",
                        event.target.value
                      )
                    }
                    placeholder="Describe calidad, condiciones y características del producto..."
                    className={`${inputClasses(
                      Boolean(errors.descripcion)
                    )} resize-none`}
                  />
                </FormField>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-[#172019]/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                  <Package size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Precio e inventario
                  </h2>

                  <p className="mt-1 text-xs text-[#7a817b]">
                    Define las condiciones comerciales.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Precio"
                  error={errors.precio}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#717971]">
                      Q
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.precio}
                      onChange={(event) =>
                        updateField(
                          "precio",
                          event.target.value
                        )
                      }
                      className={`${inputClasses(
                        Boolean(errors.precio)
                      )} pl-9`}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Unidad de venta"
                  error={errors.unidad}
                >
                  <select
                    value={form.unidad}
                    onChange={(event) =>
                      updateField(
                        "unidad",
                        event.target.value
                      )
                    }
                    className={inputClasses(
                      Boolean(errors.unidad)
                    )}
                  >
                    <option value="">
                      Selecciona una unidad
                    </option>

                    <option value="quintal">
                      Quintal
                    </option>

                    <option value="caja">
                      Caja
                    </option>

                    <option value="libra">
                      Libra
                    </option>

                    <option value="kilogramo">
                      Kilogramo
                    </option>

                    <option value="unidad">
                      Unidad
                    </option>
                  </select>
                </FormField>

                <FormField
                  label="Inventario disponible"
                  error={errors.inventario}
                >
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.inventario}
                    onChange={(event) =>
                      updateField(
                        "inventario",
                        event.target.value
                      )
                    }
                    className={inputClasses(
                      Boolean(errors.inventario)
                    )}
                  />
                </FormField>

                <FormField
                  label="Compra mínima"
                  error={errors.minimo}
                >
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.minimo}
                    onChange={(event) =>
                      updateField(
                        "minimo",
                        event.target.value
                      )
                    }
                    className={inputClasses(
                      Boolean(errors.minimo)
                    )}
                  />
                </FormField>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-[#172019]/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e8d8] text-[#315f3f]">
                  <MapPin size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Ubicación
                  </h2>

                  <p className="mt-1 text-xs text-[#7a817b]">
                    Indica dónde está disponible el producto.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Departamento"
                  error={errors.departamento}
                >
                  <select
                    value={form.departamento}
                    onChange={(event) =>
                      updateField(
                        "departamento",
                        event.target.value
                      )
                    }
                    className={inputClasses(
                      Boolean(errors.departamento)
                    )}
                  >
                    <option value="">
                      Selecciona departamento
                    </option>

                    <option value="Zacapa">
                      Zacapa
                    </option>

                    <option value="Chiquimula">
                      Chiquimula
                    </option>

                    <option value="Jalapa">
                      Jalapa
                    </option>

                    <option value="Jutiapa">
                      Jutiapa
                    </option>

                    <option value="Izabal">
                      Izabal
                    </option>
                  </select>
                </FormField>

                <FormField
                  label="Municipio"
                  error={errors.municipio}
                >
                  <input
                    type="text"
                    value={form.municipio}
                    onChange={(event) =>
                      updateField(
                        "municipio",
                        event.target.value
                      )
                    }
                    placeholder="Ej. Zacapa"
                    className={inputClasses(
                      Boolean(errors.municipio)
                    )}
                  />
                </FormField>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/publicaciones"
                className="flex items-center justify-center rounded-full border border-[#172019]/15 px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#e8e6da]"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#173c29] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#24583b]"
              >
                <Save size={16} />
                Guardar cambios
              </button>
            </div>
          </form>

          <aside className="xl:sticky xl:top-8 xl:self-start">
            <div className="overflow-hidden rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="bg-[#173c29] p-6 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b9c995]">
                  Vista previa
                </p>

                <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <Sprout
                    size={31}
                    strokeWidth={1.5}
                  />
                </div>

                <p className="mt-8 text-xs text-white/50">
                  {form.categoria ||
                    "Categoría del producto"}
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  {form.nombre ||
                    "Nombre del producto"}
                </h2>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-white/55">
                  <MapPin size={13} />

                  {form.municipio ||
                    form.departamento ||
                    "Ubicación"}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-end justify-between gap-4 border-b border-[#172019]/10 pb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a908b]">
                      Precio
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                      Q{" "}
                      {form.precio
                        ? Number(
                            form.precio
                          ).toLocaleString(
                            "es-GT",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )
                        : "0.00"}
                    </p>

                    <p className="mt-1 text-xs text-[#7a817b]">
                      por{" "}
                      {form.unidad ||
                        "unidad"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a908b]">
                      Disponible
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#42694b]">
                      {form.inventario || "0"}{" "}
                      {form.unidad ||
                        "unidades"}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#8a908b]">
                    Compra mínima
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {form.minimo || "0"}{" "}
                    {form.unidad ||
                      "unidades"}
                  </p>
                </div>

                <p className="mt-6 text-xs leading-5 text-[#858c86]">
                  Esta vista previa se actualiza mientras
                  modificas los datos.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#172019]/10 bg-[#e8e6da] p-5">
              <p className="text-sm font-semibold">
                Publicación #{publicationId}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#717871]">
                En la versión final, los datos se
                cargarán desde ASP.NET Core utilizando
                el identificador de esta publicación.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClasses(error: boolean) {
  return `w-full rounded-xl border bg-[#fffdf7] px-4 py-3.5 text-sm outline-none transition ${
    error
      ? "border-red-500"
      : "border-[#172019]/15 focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
  }`;
}