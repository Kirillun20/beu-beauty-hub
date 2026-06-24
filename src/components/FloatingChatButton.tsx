import { Link, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const FloatingChatButton = () => {
  const { pathname } = useLocation();
  // Hide on the Help page itself (chat is already in view) and the admin panel.
  if (pathname.startsWith("/help") || pathname.startsWith("/admin")) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 18 }}
      className="fixed bottom-5 right-5 z-50"
    >
      <Link
        to="/help#support-chat"
        aria-label="Открыть чат с поддержкой"
        className="group relative flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="relative inline-flex">
          <MessageCircle size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-primary animate-pulse" />
        </span>
        <span className="font-display font-semibold text-sm hidden sm:inline">Чат с поддержкой</span>
        <span className="absolute inset-0 rounded-full bg-primary/40 -z-10 animate-ping opacity-40" />
      </Link>
    </motion.div>
  );
};

export default FloatingChatButton;
