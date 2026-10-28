"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  Sprout,
  Wheat,
} from "lucide-react";

type FormData = {
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

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
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

export default function NuevaPublicacionPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imageCount, setImageCount] = useState(0);
  const [success, setSuccess] = useState(false);

  function updateField(field: keyof FormData, value: string) {
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
      newErrors.nombre = "Ingresa el nombre del producto.";
    }

    if (!form.categoria) {
      newErrors.categoria = "Selecciona una categoría.";
    }

    if (!form.descripcion.trim()) {
      newErrors.descripcion = "Agrega una descripción del producto.";
    } else if (form.descripcion.trim().length < 20) {
      newErrors.descripcion =
        "La descripción debe tener al menos 20 caracteres.";
    }

    const precio = Number(form.precio);

    if (!form.precio) {
      newErrors.precio = "Ingresa el precio.";
    } else if (Number.isNaN(precio) || precio <= 0) {
      newErrors.precio = "El precio debe ser mayor que cero.";
    }

    if (!form.unidad) {
      newErrors.unidad = "Selecciona una unidad de venta.";
    }

    const inventario = Number(form.inventario);

    if (!form.inventario) {
      newErrors.inventario = "Ingresa la cantidad disponible.";
    } else if (!Number.isInteger(inventario) || inventario <= 0) {
      newErrors.inventario =
        "La cantidad disponible debe ser un número entero mayor que cero.";
    }

    const minimo = Number(form.minimo);

    if (!form.minimo) {
      newErrors.minimo = "Ingresa la compra mínima.";
    } else if (!Number.isInteger(minimo) || minimo <= 0) {
      newErrors.minimo =
        "La compra mínima debe ser un número entero mayor que cero.";
    } else if (
      form.inventario &&
      inventario > 0 &&
      minimo > inventario
    ) {
      newErrors.minimo =
        "La compra mínima no puede superar el inventario disponible.";
    }

    if (!form.departamento) {
      newErrors.departamento = "Selecciona un departamento.";
    }

    if (!form.municipio.trim()) {
      newErrors.municipio = "Ingresa el municipio.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
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

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#626b63] transition hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Volver al dashboard
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout size={18} />
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold tracking-[-0.03em]">
                Agromarket
              </p>

              <p className="text-[10px] uppercase tracking-[0.17em] text-[#7b837c]">
                Comercio agrícola B2B
              </p>
            </div>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
        {success && (
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-[#4d7c59]/20 bg-[#e4ebdc] p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#173c29] text-white">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="font-semibold">
                La publicación pasó todas las validaciones.
              </p>

              <p className="mt-1 text-sm leading-6 text-[#5e695f]">
                Por ahora estamos simulando el registro. Cuando conectemos la
                API, estos datos se enviarán al backend y se guardarán en la
                base de datos.
              </p>
            </div>
          </div>
        )}

        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f7759]">
            Nueva publicación
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Publica producto disponible.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687069] sm:text-base">
            Completa la información comercial que necesitarán los compradores
            para evaluar tu oferta.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-6 lg:grid-cols-[1fr_320px]"
        >
          <div className="space-y-6">
            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                    <Wheat size={18} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Información del producto
                    </h2>

                    <p className="mt-1 text-xs text-[#7b827c]">
                      Datos principales de la publicación
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Nombre del producto
                  </label>

                  <input
                    id="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={(event) =>
                      updateField("nombre", event.target.value)
                    }
                    placeholder="Ej. Maíz amarillo"
                    className={`w-full rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none transition ${
                      errors.nombre
                        ? "border-red-500"
                        : "border-[#172019]/15 focus:border-[#39724a] focus:ring-2 focus:ring-[#39724a]/10"
                    }`}
                  />

                  {errors.nombre && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="categoria"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Categoría
                  </label>

                  <select
                    id="categoria"
                    value={form.categoria}
                    onChange={(event) =>
                      updateField("categoria", event.target.value)
                    }
                    className={`w-full rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none ${
                      errors.categoria
                        ? "border-red-500"
                        : "border-[#172019]/15 focus:border-[#39724a]"
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option>Granos y cereales</option>
                    <option>Hortalizas</option>
                    <option>Frutas</option>
                    <option>Café</option>
                    <option>Semillas</option>
                    <option>Otros</option>
                  </select>

                  {errors.categoria && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.categoria}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="descripcion"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Descripción
                  </label>

                  <textarea
                    id="descripcion"
                    rows={5}
                    value={form.descripcion}
                    onChange={(event) =>
                      updateField("descripcion", event.target.value)
                    }
                    placeholder="Describe la calidad, presentación, condiciones de almacenamiento y cualquier información relevante."
                    className={`w-full resize-none rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm leading-6 outline-none ${
                      errors.descripcion
                        ? "border-red-500"
                        : "border-[#172019]/15 focus:border-[#39724a]"
                    }`}
                  />

                  <div className="mt-2 flex justify-between gap-4">
                    {errors.descripcion ? (
                      <p className="text-xs font-medium text-red-600">
                        {errors.descripcion}
                      </p>
                    ) : (
                      <span />
                    )}

                    <p className="text-xs text-[#8a908b]">
                      {form.descripcion.length} caracteres
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <h2 className="font-semibold">
                  Precio e inventario
                </h2>

                <p className="mt-1 text-xs text-[#7b827c]">
                  Condiciones iniciales de la oferta
                </p>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="precio"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Precio
                  </label>

                  <div
                    className={`flex overflow-hidden rounded-xl border bg-[#f8f6ef] ${
                      errors.precio
                        ? "border-red-500"
                        : "border-[#172019]/15"
                    }`}
                  >
                    <span className="flex items-center border-r border-[#172019]/10 px-4 font-semibold">
                      Q
                    </span>

                    <input
                      id="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.precio}
                      onChange={(event) =>
                        updateField("precio", event.target.value)
                      }
                      placeholder="0.00"
                      className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm outline-none"
                    />
                  </div>

                  {errors.precio && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.precio}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="unidad"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Unidad de venta
                  </label>

                  <select
                    id="unidad"
                    value={form.unidad}
                    onChange={(event) =>
                      updateField("unidad", event.target.value)
                    }
                    className={`w-full rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none ${
                      errors.unidad
                        ? "border-red-500"
                        : "border-[#172019]/15"
                    }`}
                  >
                    <option value="">Selecciona una unidad</option>
                    <option>Quintal</option>
                    <option>Libra</option>
                    <option>Kilogramo</option>
                    <option>Caja</option>
                    <option>Saco</option>
                    <option>Unidad</option>
                  </select>

                  {errors.unidad && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.unidad}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="inventario"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Cantidad disponible
                  </label>

                  <input
                    id="inventario"
                    type="number"
                    min="1"
                    value={form.inventario}
                    onChange={(event) =>
                      updateField("inventario", event.target.value)
                    }
                    placeholder="Ej. 240"
                    className={`w-full rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none ${
                      errors.inventario
                        ? "border-red-500"
                        : "border-[#172019]/15"
                    }`}
                  />

                  {errors.inventario && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.inventario}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="minimo"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Compra mínima
                  </label>

                  <input
                    id="minimo"
                    type="number"
                    min="1"
                    value={form.minimo}
                    onChange={(event) =>
                      updateField("minimo", event.target.value)
                    }
                    placeholder="Ej. 10"
                    className={`w-full rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none ${
                      errors.minimo
                        ? "border-red-500"
                        : "border-[#172019]/15"
                    }`}
                  />

                  {errors.minimo && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.minimo}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7]">
              <div className="border-b border-[#172019]/10 px-6 py-5">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#315f3f]" />

                  <div>
                    <h2 className="font-semibold">
                      Ubicación
                    </h2>

                    <p className="mt-1 text-xs text-[#7b827c]">
                      Lugar donde se encuentra el producto
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="departamento"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Departamento
                  </label>

                  <select
                    id="departamento"
                    value={form.departamento}
                    onChange={(event) =>
                      updateField("departamento", event.target.value)
                    }
                    className={`w-full rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none ${
                      errors.departamento
                        ? "border-red-500"
                        : "border-[#172019]/15"
                    }`}
                  >
                    <option value="">
                      Selecciona un departamento
                    </option>
                    <option>Zacapa</option>
                    <option>Chiquimula</option>
                    <option>Jalapa</option>
                    <option>Jutiapa</option>
                    <option>Izabal</option>
                    <option>Guatemala</option>
                  </select>

                  {errors.departamento && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.departamento}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="municipio"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Municipio
                  </label>

                  <input
                    id="municipio"
                    value={form.municipio}
                    onChange={(event) =>
                      updateField("municipio", event.target.value)
                    }
                    placeholder="Ej. Zacapa"
                    className={`w-full rounded-xl border bg-[#f8f6ef] px-4 py-3.5 text-sm outline-none ${
                      errors.municipio
                        ? "border-red-500"
                        : "border-[#172019]/15"
                    }`}
                  />

                  {errors.municipio && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.municipio}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
              <p className="font-semibold">
                Fotografías
              </p>

              <p className="mt-1 text-xs text-[#7b827c]">
                Selecciona imágenes del producto
              </p>

              <label
                htmlFor="imagenes"
                className="mt-5 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#173c29]/25 bg-[#f3f3e9] px-6 text-center transition hover:bg-[#eceee2]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#173c29] text-white">
                  <ImagePlus size={19} />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  Seleccionar fotografías
                </p>

                <p className="mt-2 text-xs text-[#777f78]">
                  {imageCount === 0
                    ? "Todavía no has seleccionado imágenes."
                    : `${imageCount} ${
                        imageCount === 1
                          ? "imagen seleccionada"
                          : "imágenes seleccionadas"
                      }`}
                </p>

                <input
                  id="imagenes"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    setImageCount(event.target.files?.length ?? 0)
                  }
                />
              </label>
            </section>

            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="flex items-center justify-center rounded-full border border-[#172019]/15 px-6 py-3.5 text-sm font-semibold transition hover:bg-[#e8e6da]"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                className="cursor-pointer rounded-full bg-[#173c29] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24583b] active:scale-[0.98]"
              >
                Publicar producto
              </button>
            </div>
          </div>

          <aside>
            <div className="sticky top-6 space-y-5">
              <section className="rounded-3xl bg-[#173c29] p-6 text-white">
                <Package size={20} />

                <h2 className="mt-5 text-2xl font-semibold">
                  Vista previa
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  Así empieza a verse tu publicación.
                </p>

                <div className="mt-7 rounded-2xl bg-[#f4f2ea] p-5 text-[#172019]">
                  <div className="flex h-32 items-center justify-center rounded-xl bg-[#dfe4d3]">
                    <Wheat
                      size={42}
                      className="text-[#173c29]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.15em] text-[#617063]">
                    {form.categoria || "Categoría"}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {form.nombre || "Nombre del producto"}
                  </h3>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#757d76]">
                    <MapPin size={13} />

                    {form.municipio && form.departamento
                      ? `${form.municipio}, ${form.departamento}`
                      : "Ubicación"}
                  </div>

                  <div className="mt-5 border-t border-[#172019]/10 pt-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs text-[#858c86]">
                          Precio
                        </p>

                        <p className="mt-1 text-lg font-semibold">
                          {form.precio
                            ? `Q ${Number(form.precio).toFixed(2)}`
                            : "Q 0.00"}
                        </p>

                        <p className="text-xs text-[#858c86]">
                          {form.unidad
                            ? `por ${form.unidad.toLowerCase()}`
                            : "unidad pendiente"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#858c86]">
                          Disponible
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {form.inventario || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-[#172019]/10 bg-[#fffdf7] p-6">
                <p className="font-semibold">
                  Antes de publicar
                </p>

                <div className="mt-5 space-y-4 text-sm text-[#687069]">
                  <p>• Verifica el precio.</p>
                  <p>• Mantén actualizado el inventario.</p>
                  <p>• Utiliza una descripción clara.</p>
                  <p>• Agrega fotografías reales.</p>
                </div>
              </section>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}