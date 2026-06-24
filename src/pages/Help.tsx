import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Phone, HelpCircle, ChevronDown, ChevronUp, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const faqs = [
  { q: "Как оформить заказ?", a: "Добавьте товары в корзину, перейдите к оформлению, заполните данные и выберите способ оплаты и доставки." },
  { q: "Какие способы оплаты доступны?", a: "Наложенный платёж (Европочта), наличными в офисе (самовывоз), банковская карта, ЕРИП, онлайн-оплата." },
  { q: "Сколько стоит доставка?", a: "Стоимость зависит от способа: курьер по Минску, Европочта по Беларуси, самовывоз бесплатно. Точные цены — на этапе оформления." },
  { q: "Как вернуть товар?", a: "Вы можете вернуть товар в течение 14 дней с момента получения при сохранении товарного вида. Свяжитесь с нами для оформления." },
  { q: "Товары оригинальные?", a: "Да, мы работаем напрямую с европейскими производителями и официальными дистрибьюторами. Все товары сертифицированы." },
  { q: "Как работает система лояльности?", a: "За каждую покупку вы получаете баллы (1 BYN = 1 балл). 20 баллов = 1 BYN скидки на будущие заказы." },
];

const CHAT_STORAGE_KEY = "beu-support-chat-id";
const CHAT_TOKEN_KEY = "beu-support-chat-token";

const Help = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatToken, setChatToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [guestName, setGuestName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    const savedToken = localStorage.getItem(CHAT_TOKEN_KEY);
    if (saved) setChatId(saved);
    if (savedToken) setChatToken(savedToken);
  }, []);

  // Load messages and subscribe (auth) or poll (guest)
  useEffect(() => {
    if (!chatId) return;
    const isGuest = !user;
    const scrollDown = () =>
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);

    const load = async () => {
      if (isGuest) {
        if (!chatToken) return;
        const { data } = await (supabase as any).rpc("get_guest_messages", {
          p_chat_id: chatId,
          p_token: chatToken,
        });
        setMessages(data || []);
      } else {
        const { data } = await supabase.from("support_messages").select("*").eq("chat_id", chatId).order("created_at");
        setMessages(data || []);
      }
      scrollDown();
    };
    load();

    if (isGuest) {
      const interval = setInterval(load, 3000);
      return () => clearInterval(interval);
    }
    const ch = supabase
      .channel(`chat-${chatId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages", filter: `chat_id=eq.${chatId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        scrollDown();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [chatId, chatToken, user]);

  const ensureChat = async (): Promise<string | null> => {
    if (chatId) return chatId;
    if (!user && !guestName.trim()) {
      setShowNamePrompt(true);
      return null;
    }
    if (!user) {
      const { data, error } = await (supabase as any).rpc("create_guest_chat", {
        p_guest_name: guestName.trim().slice(0, 100),
      });
      const row = Array.isArray(data) ? data[0] : data;
      if (error || !row) return null;
      setChatId(row.id);
      setChatToken(row.guest_token);
      localStorage.setItem(CHAT_STORAGE_KEY, row.id);
      localStorage.setItem(CHAT_TOKEN_KEY, row.guest_token);
      return row.id;
    }
    const { data, error } = await supabase
      .from("support_chats")
      .insert({ user_id: user.id, guest_name: null, guest_email: null })
      .select()
      .single();
    if (error || !data) return null;
    setChatId(data.id);
    localStorage.setItem(CHAT_STORAGE_KEY, data.id);
    return data.id;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    const id = await ensureChat();
    if (!id) { setSending(false); return; }
    if (!user) {
      const token = chatToken || localStorage.getItem(CHAT_TOKEN_KEY);
      if (!token) { setSending(false); return; }
      const { error } = await (supabase as any).rpc("send_guest_message", {
        p_chat_id: id,
        p_token: token,
        p_body: text.slice(0, 2000),
      });
      if (!error) {
        setInput("");
        // Optimistic refresh
        const { data } = await (supabase as any).rpc("get_guest_messages", { p_chat_id: id, p_token: token });
        if (data) setMessages(data);
      }
    } else {
      const { error } = await supabase.from("support_messages").insert({
        chat_id: id,
        sender: "user",
        author_id: user.id,
        body: text.slice(0, 2000),
      });
      if (!error) {
        await supabase.from("support_chats").update({ last_message_at: new Date().toISOString() }).eq("id", id);
        setInput("");
      }
    }
    setSending(false);
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Помощь</h1>
          <p className="text-muted-foreground text-base sm:text-lg mb-10">Ответы на вопросы и живой чат с поддержкой</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          <motion.a href="https://t.me/beu_support" target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 sm:p-8 flex items-center gap-4 sm:gap-6 hover:glow-border transition-all duration-300 group">
            <div className="p-3 sm:p-4 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors shrink-0">
              <Send size={28} className="text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">Telegram</h3>
              <p className="text-muted-foreground text-sm truncate">@beu_support</p>
              <p className="text-xs text-muted-foreground mt-1">Отвечаем в течение 15 минут</p>
            </div>
          </motion.a>

          <motion.a href="tel:+375293494080"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 sm:p-8 flex items-center gap-4 sm:gap-6 hover:glow-border transition-all duration-300 group">
            <div className="p-3 sm:p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
              <Phone size={28} className="text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">Телефон</h3>
              <p className="text-muted-foreground text-sm">+375 (29) 349-40-80</p>
              <p className="text-xs text-muted-foreground mt-1">Пн-Пт: 9:00 — 19:00</p>
            </div>
          </motion.a>
        </div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-2">
            <HelpCircle size={24} className="text-primary" /> Частые вопросы
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-display font-medium hover:text-primary transition-colors gap-3">
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="shrink-0" /> : <ChevronDown size={18} className="shrink-0" />}
                </button>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    className="px-4 sm:px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Live Chat */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-display text-2xl font-bold mb-3 flex items-center gap-2">
            <MessageCircle size={24} className="text-primary" /> Онлайн-чат с поддержкой
          </h2>
          <p className="text-sm text-muted-foreground mb-6">Сообщения видит администратор и ответит в этом же окне.</p>
          <div className="glass-card rounded-2xl overflow-hidden glow-box">
            <div ref={scrollRef} className="h-80 sm:h-96 overflow-y-auto p-4 sm:p-6 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-12">
                  Здравствуйте! 👋 Напишите ваш вопрос — мы ответим в ближайшее время.
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] sm:max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                    msg.sender === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
                  }`}>
                    {msg.sender === "admin" && <p className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">Поддержка BEU</p>}
                    {msg.body}
                  </div>
                </div>
              ))}
            </div>

            {showNamePrompt && !user && !chatId && (
              <div className="border-t border-border p-3 sm:p-4 bg-secondary/40">
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <User size={14} /> Как к вам обращаться?
                </div>
                <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Ваше имя"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" autoFocus />
              </div>
            )}

            <div className="border-t border-border p-3 sm:p-4 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Напишите сообщение..."
                className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button onClick={sendMessage} disabled={sending || !input.trim()}
                className="px-4 sm:px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0">
                <Send size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Help;
