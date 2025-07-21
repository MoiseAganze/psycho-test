"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import quizData from "../datas/quiz.json";
import { quizResult } from "../types/quiz_result";
import { saveUser, userExist } from "../server_actions/saveUser";
import toast, { Toaster } from "react-hot-toast";

export default function QuizComponent() {
  const [currentStep, setCurrentStep] = useState<"email" | "quiz">("quiz");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [result, setResult] = useState<quizResult>({
    quizId: quizData.id,
    questions: [],
  });
  const router = useRouter();

  // Animations
  const [fireAnimation, setFireAnimation] = useState<any>(null);
  const [brainAnimation, setBrainAnimation] = useState<any>(null);
  const [particlesAnimation, setParticlesAnimation] = useState<any>(null);

  useEffect(() => {
    const auth = () => {
      if (!localStorage.getItem("kentoqwertyuiop")) {
        const token =
          Date.now().toString(36) + Math.random().toString(36).substring(2);
        localStorage.setItem("kentoqwertyuiop", token);
      }
    };
    auth();
  }, []);

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

  const handleEmailSubmit = async () => {
    if (!email) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    setEmailSubmitted(true);

    try {
      const user_token = localStorage.getItem("kentoqwertyuiop");
      const hasPlayed = await userExist(email, user_token);

      if (hasPlayed) {
        router.push(`/results?email=${encodeURIComponent(email)}`);
      } else {
        setCurrentStep("quiz");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      setEmailSubmitted(false);
    }
  };

  const handleAnswerSelect = (
    answer_text: string,
    answer_index: number,
    answer_value: string
  ) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Créer la nouvelle réponse immédiatement
    const newAnswer = {
      questionId: String(quizData.questions[currentQuestionIndex].id),
      question: quizData.questions[currentQuestionIndex].question,
      reponseIndex: answer_index,
      reponse_text: answer_text,
      reponse_value: answer_value,
    };

    setTimeout(async () => {
      const updatedResult = {
        ...result,
        questions: [...result.questions, newAnswer],
      };

      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsAnimating(false);
        setSelectedAnswer(null);
        setResult(updatedResult);
      } else {
        setResult(updatedResult);
        console.log(updatedResult);

        // const user_token = localStorage.getItem("kentoqwertyuiop");
        // const good = await saveUser(updatedResult, user_token, email);
        // if (good) {
        //   router.push(`/results?email=${encodeURIComponent(email)}`);
        // } else {
        //   toast.error("Une erreur est survenue lors de l'enregistrement");
        // }
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

      {currentStep === "email" ? (
        <div className="card glass bg-gradient-to-br from-base-100 to-base-200/80 w-full max-w-md shadow-2xl transition-all duration-300">
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
            <h2 className="card-title text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Avant de commencer...
            </h2>

            <p className="mb-6 text-base sm:text-lg font-medium text-gray-100">
              Veuillez entrer votre adresse email pour participer au quiz.
            </p>

            <div className="form-control w-full mb-6">
              <label className="label" htmlFor="email">
                <span className="label-text text-gray-300">Votre email</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="email@exemple.com"
                className="input input-bordered w-full bg-base-200/50 border-base-300/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailSubmitted}
              />
            </div>

            <button
              onClick={handleEmailSubmit}
              disabled={emailSubmitted}
              className="btn btn-primary glow-primary w-full"
            >
              {emailSubmitted ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Commencer le quiz"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`card glass bg-gradient-to-br from-base-100 to-base-200/80 w-full max-w-2xl shadow-2xl transition-all duration-300 ${
            isAnimating ? "scale-95" : "scale-100"
          }`}
        >
          {/* Barre de progression futuriste */}
          <div className="mt-3 pr-4">
            {/* <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                Progression
              </span>
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {Math.round(progressPercentage)}%
              </span>
            </div> */}

            <div className="flex items-center gap-3">
              {/* Animation du feu dont l'intensité change */}
              <div className="w-8 h-8 -mt-2">
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
                    handleAnswerSelect(option.text, index, option.value);
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
          </div>
        </div>
      )}

      {/* Effets de lumière */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
