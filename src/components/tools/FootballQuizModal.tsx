/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * FootBuzz Interactive Football Trivia & Rules Quiz Modal
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Which nation has won the most FIFA World Cup titles?',
    options: ['Germany', 'Italy', 'Brazil', 'Argentina'],
    correctIndex: 2,
    explanation: 'Brazil has won the World Cup a record 5 times (1958, 1962, 1970, 1994, 2002).',
  },
  {
    id: 2,
    question: 'Who is the all-time record goalscorer for the Indian National Football Team?',
    options: ['Bhaichung Bhutia', 'Sunil Chhetri', 'I.M. Vijayan', 'Jeje Lalpekhlua'],
    correctIndex: 1,
    explanation: 'Sunil Chhetri scored 94 international goals in 151 appearances for India.',
  },
  {
    id: 3,
    question: 'Which club won the inaugural Indian Super League (ISL) title in 2014?',
    options: ['Kerala Blasters', 'ATK (Atlético de Kolkata)', 'Chennaiyin FC', 'Bengaluru FC'],
    correctIndex: 1,
    explanation: 'ATK won the first ISL final in 2014, defeating Kerala Blasters 1–0.',
  },
  {
    id: 4,
    question: 'Which club has won the most UEFA Champions League titles?',
    options: ['AC Milan', 'Bayern Munich', 'Liverpool', 'Real Madrid'],
    correctIndex: 3,
    explanation: 'Real Madrid has won an unprecedented 15 European Cup / Champions League titles.',
  },
  {
    id: 5,
    question: 'What is the maximum number of substitutions permitted in regular time in major FIFA competitions?',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'IFAB and FIFA permanently adopted the 5-substitution rule across 3 stoppage windows.',
  },
];

export const FootballQuizModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      addToast('Quiz Completed!', `You scored ${score + (selectedOption === currentQ.correctIndex ? 1 : 0)} out of ${QUIZ_QUESTIONS.length}!`, 'SUCCESS');
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-[#009270] to-teal-700 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-bold tracking-wide">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-200" />
            <span>FOOTBALL IQ & TRIVIA</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display mt-2 text-white">
            Matchday Trivia & Rules Challenge
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Test your knowledge across Indian Super League, World Cup, and European football history.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isFinished ? (
            <>
              {/* Progress */}
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500">
                <span>QUESTION {currentIdx + 1} OF {QUIZ_QUESTIONS.length}</span>
                <span>SCORE: {score}</span>
              </div>

              {/* Question */}
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => {
                  let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';
                  if (isAnswered) {
                    if (i === currentQ.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (i === selectedOption) {
                      btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && i === currentQ.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && i === selectedOption && i !== currentQ.correctIndex && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {isAnswered && (
                <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-3 animate-in fade-in">
                  <p>{currentQ.explanation}</p>
                  <button
                    onClick={handleNext}
                    className="w-full py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white font-bold text-xs transition-colors"
                  >
                    {currentIdx + 1 < QUIZ_QUESTIONS.length ? 'Next Question →' : 'See Final Score 🏆'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 font-display">
                Quiz Complete!
              </h3>
              <p className="text-sm text-slate-600">
                You scored <span className="font-extrabold text-[#009270] font-mono text-base">{score} / {QUIZ_QUESTIONS.length}</span>!
              </p>
              <div className="pt-2">
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl bg-[#009270] hover:bg-[#028060] text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Test your football acumen anytime</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
