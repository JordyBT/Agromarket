"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ImageIcon,
  MessageCircle,
  RefreshCw,
  Send,
  Sprout,
  Store,
} from "lucide-react";

import {
  getConversationMessages,
  getConversations,
  sendMessage,
  type ChatMessage,
  type ConversationDetail,
  type ConversationSummary,
} from "@/services/chatService";

function formatTime(value: string) {
  return new Intl.DateTimeFormat(
    "es-GT",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "es-GT",
    {
      day: "2-digit",
      month: "short",
    }
  ).format(new Date(value));
}

function getUserName(user: {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
}) {
  if (user.companyName?.trim()) {
    return user.companyName.trim();
  }

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  if (fullName) {
    return fullName;
  }

  return user.email;
}

export default function MensajesPage() {
  const [
    conversations,
    setConversations,
  ] = useState<ConversationSummary[]>([]);

  const [
    selectedId,
    setSelectedId,
  ] = useState<string | null>(null);

  const [
    conversation,
    setConversation,
  ] = useState<ConversationDetail | null>(
    null
  );

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([]);

  const [message, setMessage] =
    useState("");

  const [
    loadingConversations,
    setLoadingConversations,
  ] = useState(true);

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  async function loadConversations() {
    try {
      setLoadingConversations(true);
      setError("");

      const data =
        await getConversations();

      setConversations(data);

      const params =
        new URLSearchParams(
          window.location.search
        );

      const requestedId =
        params.get("conversation");

      if (
        requestedId &&
        data.some(
          (item) =>
            item.id === requestedId
        )
      ) {
        setSelectedId(requestedId);
      } else if (
        !selectedId &&
        data.length > 0
      ) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar las conversaciones."
      );
    } finally {
      setLoadingConversations(false);
    }
  }

  async function loadMessages(
    conversationId: string,
    showLoading = true
  ) {
    try {
      if (showLoading) {
        setLoadingMessages(true);
      }

      const data =
        await getConversationMessages(
          conversationId
        );

      setConversation(
        data.conversation
      );

      setMessages(data.messages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar los mensajes."
      );
    } finally {
      if (showLoading) {
        setLoadingMessages(false);
      }
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setConversation(null);
      setMessages([]);
      return;
    }

    loadMessages(selectedId);

    const interval =
      window.setInterval(() => {
        loadMessages(
          selectedId,
          false
        );
      }, 4000);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [selectedId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  async function handleSend(
    event: FormEvent
  ) {
    event.preventDefault();

    if (
      !selectedId ||
      sending
    ) {
      return;
    }

    const content =
      message.trim();

    if (!content) {
      return;
    }

    if (content.length > 1000) {
      setError(
        "El mensaje no puede superar los 1000 caracteres."
      );

      return;
    }

    try {
      setSending(true);
      setError("");

      const created =
        await sendMessage(
          selectedId,
          content
        );

      setMessages(
        (current) => [
          ...current,
          created,
        ]
      );

      setMessage("");

      await loadConversations();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible enviar el mensaje."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f2ea] text-[#172019]">
      <header className="border-b border-[#172019]/10 bg-[#f4f2ea]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 lg:px-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-[#667068] transition hover:text-[#173c29]"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#173c29] text-white">
              <Sprout size={18} />
            </div>

            <span className="hidden font-semibold sm:block">
              Agromarket
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7759]">
              Comunicación
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
              Mensajes
            </h1>

            <p className="mt-3 text-sm text-[#6b746c]">
              Conversa directamente con
              compradores y proveedores.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadConversations
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#172019]/10 bg-[#fffdf7] transition hover:bg-[#ecebe3]"
            title="Actualizar conversaciones"
          >
            <RefreshCw
              size={17}
            />
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid min-h-[650px] overflow-hidden rounded-[28px] border border-[#172019]/10 bg-[#fffdf7] lg:grid-cols-[360px_1fr]">
          <aside className="border-b border-[#172019]/10 lg:border-b-0 lg:border-r">
            <div className="border-b border-[#172019]/10 px-5 py-5">
              <div className="flex items-center gap-2">
                <MessageCircle
                  size={17}
                />

                <p className="font-semibold">
                  Conversaciones
                </p>
              </div>
            </div>

            {loadingConversations ? (
              <div className="p-6 text-sm text-[#727a73]">
                Cargando conversaciones...
              </div>
            ) : conversations.length ===
              0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                <MessageCircle
                  size={30}
                  className="text-[#8e968f]"
                />

                <p className="mt-4 font-semibold">
                  Sin conversaciones
                </p>

                <p className="mt-2 text-sm leading-6 text-[#747c75]">
                  Cuando contactes a un
                  proveedor o comprador,
                  la conversación aparecerá
                  aquí.
                </p>

                <Link
                  href="/productos"
                  className="mt-5 rounded-full bg-[#173c29] px-5 py-3 text-sm font-semibold text-white"
                >
                  Ir al mercado
                </Link>
              </div>
            ) : (
              <div className="max-h-[590px] overflow-y-auto">
                {conversations.map(
                  (item) => {
                    const active =
                      selectedId ===
                      item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setSelectedId(
                            item.id
                          )
                        }
                        className={`w-full border-b border-[#172019]/8 px-5 py-5 text-left transition ${
                          active
                            ? "bg-[#e8ecdf]"
                            : "hover:bg-[#f3f1e8]"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#dfe5d4]">
                            {item.publication
                              .imageUrl ? (
                              <img
                                src={
                                  item
                                    .publication
                                    .imageUrl
                                }
                                alt={
                                  item
                                    .publication
                                    .title
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#55705d]">
                                <ImageIcon
                                  size={
                                    20
                                  }
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="truncate text-sm font-semibold">
                                {getUserName(
                                  item.otherUser
                                )}
                              </p>

                              <span className="shrink-0 text-[10px] text-[#8a918b]">
                                {formatDate(
                                  item.updatedAt
                                )}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs font-medium text-[#55705d]">
                              {
                                item
                                  .publication
                                  .title
                              }
                            </p>

                            <p className="mt-2 truncate text-xs text-[#747c75]">
                              {item.lastMessage
                                ?.content ??
                                "Conversación iniciada"}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </aside>

          <section className="flex min-h-[650px] flex-col">
            {!selectedId ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e5eadb] text-[#315f3f]">
                  <MessageCircle
                    size={27}
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  Selecciona una
                  conversación
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#747c75]">
                  Aquí podrás consultar y
                  responder los mensajes.
                </p>
              </div>
            ) : loadingMessages ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-[#747c75]">
                  Cargando mensajes...
                </p>
              </div>
            ) : conversation ? (
              <>
                <div className="flex items-center justify-between gap-4 border-b border-[#172019]/10 px-5 py-4 sm:px-7">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#173c29] text-white">
                      <Store
                        size={18}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {getUserName(
                          conversation.otherUser
                        )}
                      </p>

                      <p className="truncate text-xs text-[#747c75]">
                        {
                          conversation
                            .publication
                            .title
                        }
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/productos/${conversation.publication.id}`}
                    className="shrink-0 rounded-full border border-[#172019]/15 px-4 py-2 text-xs font-semibold transition hover:bg-[#efeee6]"
                  >
                    Ver producto
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto bg-[#faf8f1] px-5 py-6 sm:px-7">
                  {messages.length ===
                  0 ? (
                    <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                      <MessageCircle
                        size={28}
                        className="text-[#899189]"
                      />

                      <p className="mt-4 font-semibold">
                        Inicia la
                        conversación
                      </p>

                      <p className="mt-2 text-sm text-[#747c75]">
                        Escribe el primer
                        mensaje sobre este
                        producto.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(
                        (item) => {
                          const mine =
                            item.senderId !==
                            conversation
                              .otherUser
                              .id;

                          return (
                            <div
                              key={
                                item.id
                              }
                              className={`flex ${
                                mine
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                                  mine
                                    ? "rounded-br-md bg-[#173c29] text-white"
                                    : "rounded-bl-md border border-[#172019]/10 bg-[#fffdf7] text-[#172019]"
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                  {
                                    item.content
                                  }
                                </p>

                                <p
                                  className={`mt-2 text-right text-[10px] ${
                                    mine
                                      ? "text-white/65"
                                      : "text-[#899089]"
                                  }`}
                                >
                                  {formatTime(
                                    item.createdAt
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}

                      <div
                        ref={
                          messagesEndRef
                        }
                      />
                    </div>
                  )}
                </div>

                <form
                  onSubmit={
                    handleSend
                  }
                  className="border-t border-[#172019]/10 bg-[#fffdf7] p-4 sm:p-5"
                >
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(
                          event
                        ) =>
                          setMessage(
                            event
                              .target
                              .value
                          )
                        }
                        maxLength={1000}
                        rows={2}
                        placeholder="Escribe un mensaje..."
                        className="max-h-36 min-h-[52px] w-full resize-none rounded-2xl border border-[#172019]/15 bg-[#faf8f1] px-4 py-3 text-sm outline-none transition focus:border-[#173c29]"
                      />

                      <p className="mt-1 text-right text-[10px] text-[#979c97]">
                        {
                          message.length
                        }
                        /1000
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        sending ||
                        !message.trim()
                      }
                      className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#173c29] text-white transition hover:bg-[#24583b] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send
                        size={18}
                      />
                    </button>
                  </div>
                </form>
              </>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}