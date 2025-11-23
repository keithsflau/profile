import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "../data/questions";
import "./QuizModal.css";

interface QuizModalProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}

export const QuizModal = ({ question, onAnswer }: QuizModalProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    const correct = selectedIndex === question.correctIndex;
    setAnswered(true);
    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="quiz-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="quiz-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="quiz-header">
            <h2>語文問答挑戰</h2>
            <p className="quiz-category">分類：{question.category}</p>
          </div>
          <div className="quiz-content">
            <p className="quiz-question">{question.question}</p>
            <div className="quiz-options">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option ${
                    selectedIndex === index ? "selected" : ""
                  } ${
                    answered
                      ? index === question.correctIndex
                        ? "correct"
                        : selectedIndex === index
                        ? "incorrect"
                        : ""
                      : ""
                  }`}
                  onClick={() => handleSelect(index)}
                  disabled={answered}
                >
                  <span className="option-label">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="option-text">{option}</span>
                  {answered && index === question.correctIndex && (
                    <span className="checkmark">✓</span>
                  )}
                  {answered &&
                    selectedIndex === index &&
                    index !== question.correctIndex && (
                      <span className="crossmark">✗</span>
                    )}
                </button>
              ))}
            </div>
            {!answered && selectedIndex !== null && (
              <motion.button
                className="quiz-submit"
                onClick={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                確認答案
              </motion.button>
            )}
            {answered && (
              <motion.div
                className="quiz-result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {selectedIndex === question.correctIndex ? (
                  <div className="result-success">
                    <p className="result-message">答對了！恭喜你獲得購買權！</p>
                  </div>
                ) : (
                  <div className="result-failure">
                    <p className="result-message">
                      答錯了，正確答案是：{question.options[question.correctIndex]}
                    </p>
                    <p className="result-hint">
                      下次要更仔細思考哦！這次無法購買此地。
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

