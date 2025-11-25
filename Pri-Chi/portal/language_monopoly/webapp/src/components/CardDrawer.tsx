import { AnimatePresence, motion } from "framer-motion";
import type { DrawnCard } from "../types";

interface CardDrawerProps {
  drawnCard?: DrawnCard;
  onClose: () => void;
}

export const CardDrawer = ({ drawnCard, onClose }: CardDrawerProps) => (
  <AnimatePresence>
    {drawnCard && (
      <motion.div
        className="card-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`card-panel card-${drawnCard.deck}`}
          initial={{ y: 80, rotateX: -15, opacity: 0 }}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <p className="card-label">
            {drawnCard.deck === "opportunity" ? "機會" : "命運"}
          </p>
          <h3>{drawnCard.card.title}</h3>
          <p className="card-body">{drawnCard.card.description}</p>
          <button type="button" onClick={onClose}>
            關閉
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

