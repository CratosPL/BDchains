import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <img src="/images/logo.jpg" alt="Metal Logo" className="h-16 w-16 mx-auto" />
        </motion.div>
        <p className="text-[#8a4a4a] font-unbounded uppercase tracking-wide text-lg animate-pulse">
          Forging the Crypt...
        </p>
      </div>
    </motion.div>
  );
}