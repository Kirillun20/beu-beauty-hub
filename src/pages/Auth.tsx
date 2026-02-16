import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "register";
type AuthMethod = "email" | "phone";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [method, setMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Добро пожаловать!" });
      navigate("/profile");
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!emailOtpSent) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setEmailOtpSent(true);
        toast({ title: "Код отправлен", description: "Проверьте почту и введите код подтверждения." });
      } else {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otpCode,
          type: "signup",
        });
        if (error) throw error;
        toast({ title: "Регистрация завершена!" });
        navigate("/profile");
      }
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otpSent) {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        setOtpSent(true);
        toast({ title: "Код отправлен", description: "Введите код из SMS." });
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token: otpCode,
          type: "sms",
        });
        if (error) throw error;
        toast({ title: "Добро пожаловать!" });
        navigate("/profile");
      }
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    }
  };

  const inputClass = "w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <main className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <div className="glass-card rounded-2xl p-8 glow-box">
          <h1 className="font-display text-3xl font-bold text-center mb-2">
            {mode === "login" ? "Вход" : "Регистрация"}
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-6">
            {mode === "login" ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}
          </p>

          {/* Google Sign-in */}
          <button onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-border text-foreground font-display font-medium flex items-center justify-center gap-3 hover:bg-secondary transition-colors mb-5">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Войти через Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">или</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Method tabs */}
          <div className="flex gap-2 mb-5">
            <button onClick={() => { setMethod("email"); setOtpSent(false); setEmailOtpSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-display font-medium flex items-center justify-center gap-2 transition-all ${method === "email" ? "bg-primary/10 text-primary glow-border" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              <Mail size={16} /> Email
            </button>
            <button onClick={() => { setMethod("phone"); setOtpSent(false); setEmailOtpSent(false); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-display font-medium flex items-center justify-center gap-2 transition-all ${method === "phone" ? "bg-primary/10 text-primary glow-border" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              <Phone size={16} /> Телефон
            </button>
          </div>

          <AnimatePresence mode="wait">
            {method === "email" ? (
              <motion.form key="email-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                onSubmit={mode === "login" ? handleEmailLogin : handleEmailRegister} className="space-y-4">
                {mode === "register" && !emailOtpSent && (
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)}
                      className={inputClass} required />
                  </div>
                )}
                {!emailOtpSent && (
                  <>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className={inputClass} required />
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type={showPw ? "text" : "password"} placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" required minLength={6} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </>
                )}
                {emailOtpSent && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 text-center">Код отправлен на <span className="text-foreground font-medium">{email}</span></p>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="Код подтверждения" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className={inputClass} required maxLength={6} />
                    </div>
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? "Загрузка..." : emailOtpSent ? "Подтвердить" : mode === "login" ? "Войти" : "Зарегистрироваться"}
                  <ArrowRight size={18} />
                </button>
              </motion.form>
            ) : (
              <motion.form key="phone-form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={handlePhoneAuth} className="space-y-4">
                {!otpSent ? (
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="tel" placeholder="+375 (XX) XXX-XX-XX" value={phone} onChange={(e) => setPhone(e.target.value)}
                      className={inputClass} required />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 text-center">Код отправлен на <span className="text-foreground font-medium">{phone}</span></p>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="text" placeholder="Код из SMS" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className={inputClass} required maxLength={6} />
                    </div>
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                  {loading ? "Загрузка..." : otpSent ? "Подтвердить код" : "Отправить код"}
                  <ArrowRight size={18} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setOtpSent(false); setEmailOtpSent(false); }} className="text-primary hover:underline font-medium">
              {mode === "login" ? "Регистрация" : "Войти"}
            </button>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default Auth;
