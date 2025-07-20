"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import quizData from "../datas/quiz.json";

export default function QuizComponent() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  const router = useRouter();

  // Animations
  const [fireAnimation, setFireAnimation] = useState<any>(null);
  const [brainAnimation, setBrainAnimation] = useState<any>(null);
  const [particlesAnimation, setParticlesAnimation] = useState<any>(null);

  useEffect(() => {
    // Chargez vos animations Lottie
    import("@/public/animations/fire.json").then((data) =>
      setFireAnimation(data.default)
    );
    import("@/public/animations/brain.json").then((data) =>
      setBrainAnimation(data.default)
    );
    import("@/public/animations/particles.json").then((data) =>
      setParticlesAnimation(data.default)
    );
  }, []);

  const handleAnswerSelect = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => {
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnimating(false);
      } else {
        router.push("/results");
      }
    }, 800);
  };

  const progressPercentage =
    ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="relative overflow-hidden flex justify-center">
      {/* Fond futuriste avec particules animées */}
      {particlesAnimation && (
        <div className="absolute inset-0 -z-10 opacity-20">
          <Lottie
            animationData={particlesAnimation}
            loop={true}
            className="h-full w-full"
          />
        </div>
      )}

      <div
        className={`card glass bg-gradient-to-br from-base-100 to-base-200/80 w-full max-w-2xl shadow-2xl transition-all duration-300 ${
          isAnimating ? "scale-95" : "scale-100"
        }`}
      >
        {/* Animation du cerveau en haut avec effet néon */}
        <figure className="px-6 pt-6 relative">
          {brainAnimation && (
            <div className="relative">
              <Lottie
                animationData={brainAnimation}
                loop={true}
                className="h-32 mx-auto filter drop-shadow-[0_0_10px_rgba(100,200,255,0.7)]"
              />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl -z-10"></div>
            </div>
          )}
        </figure>

        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <h2 className="card-title text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Question {currentQuestionIndex + 1}/{quizData.questions.length}
            </h2>
            <div className="badge badge-primary glow-primary">
              {currentQuestion.tags[0]}
            </div>
          </div>

          <p className="mb-6 text-base sm:text-lg font-medium text-gray-100">
            {currentQuestion.question}
          </p>

          <div className="space-y-3 mb-6 py-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedAnswer(option.value);
                  handleAnswerSelect();
                }}
                onMouseEnter={() => setHoveredOption(index)}
                onMouseLeave={() => setHoveredOption(null)}
                disabled={isAnimating}
                className={`btn w-full text-left justify-start transition-all duration-200 transform
                  ${
                    selectedAnswer === option.value
                      ? "btn-primary glow-primary"
                      : "btn-glass hover:bg-base-300/50"
                  }
                  ${isAnimating ? "opacity-70" : "opacity-100"}
                  ${
                    hoveredOption === index
                      ? "scale-[1.02] shadow-lg"
                      : "scale-100"
                  }
                  border border-base-300/50 hover:border-primary/30
                  relative overflow-hidden`}
              >
                {/* Effet de surbrillance futuriste */}
                {hoveredOption === index && (
                  <span className="absolute inset-0 bg-white/5 rounded-xl"></span>
                )}
                <span className="relative z-10">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Barre de progression futuriste */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Progression
              </span>
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Animation du feu dont l'intensité change */}
              <div className="w-8 h-8">
                {fireAnimation && (
                  <Lottie
                    animationData={fireAnimation}
                    loop={true}
                    className="w-8 filter drop-shadow-[0_0_5px_rgba(255,100,0,0.7)]"
                    style={{
                      opacity: 0.5 + (progressPercentage / 100) * 0.5,
                      scale: 0.8 + (progressPercentage / 100) * 0.4,
                    }}
                  />
                )}
              </div>

              {/* Barre de progression futuriste */}
              <div className="flex-1 h-3 bg-base-300/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 transition-all duration-500 ease-out relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Effets de lumière */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
