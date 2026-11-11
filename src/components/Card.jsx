import { motion } from 'framer-motion';

const MotionSection = motion.section;

// The content card that opens in the middle of the scope. The background animation
// routes around it (via `ref`) and dims while the cursor is over it (via onFocusChange).
export default function Card({ ref, heading, onClose, onFocusChange, children }) {
  return (
    <MotionSection
      ref={ref}
      className="card"
      aria-label={heading}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onPointerEnter={() => onFocusChange(true)}
      onPointerLeave={() => onFocusChange(false)}
    >
      <div className="card-head">
        <span>{heading}</span>
        <button type="button" onClick={onClose}>
          [esc] close
        </button>
      </div>
      <div className="card-body">{children}</div>
    </MotionSection>
  );
}
