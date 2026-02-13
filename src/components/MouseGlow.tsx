import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MouseGlow = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-[1]"
      animate={{ x: pos.x - 150, y: pos.y - 150 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      style={{
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, hsla(260, 80%, 60%, 0.08) 0%, transparent 70%)",
      }}
    />
  );
};

export default MouseGlow;
