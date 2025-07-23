"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUserData, getUsers } from "../server_actions/getUsers";
import {
  quizResult,
  responseData,
  quizResultQuestion,
} from "../types/quiz_result";

const Page = () => {
  const [data, setData] = useState<responseData[] | null>([]);
  const [userResponses, setUserResponses] = useState<quizResultQuestion[]>([]);
  const [comparisonData, setComparisonData] = useState<{
    [key: string]: { match: number; total: number };
  }>({});
  const [loading, setLoading] = useState(true);

  // Récupère l'email depuis l'URL (côté client)
  const getEmailFromUrl = () => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("email");
  };

  const [email, setEmail] = useState<string | null>(null);
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    setEmail(getEmailFromUrl());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!email) {
        setLoading(false);
        return;
      }
      const results = await getUsers();
      setData(results);
      setParticipants(results ? results.length : 0);

      const currentUser = await getUserData(email);
      if (currentUser && results && results.length > 0) {
        setUserResponses(currentUser.quiz_results.questions);
        calculateMatches(currentUser, results);
      }
      setLoading(false);
    };
    fetchData();
  }, [email]);

  const calculateMatches = (
    currentUser: responseData,
    allUsers: responseData[]
  ) => {
    const matches: { [key: string]: { match: number; total: number } } = {};

    allUsers.forEach((user) => {
      if (user.id !== currentUser.id) {
        currentUser.quiz_results.questions.forEach((question) => {
          const otherQuestion = user.quiz_results.questions.find(
            (q) => q.questionId === question.questionId
          );

          if (otherQuestion) {
            if (!matches[question.questionId]) {
              matches[question.questionId] = { match: 0, total: 0 };
            }

            matches[question.questionId].total++;
            if (otherQuestion.reponseIndex === question.reponseIndex) {
              matches[question.questionId].match++;
            }
          }
        });
      }
    });

    setComparisonData(matches);
  };

  const getMatchPercentage = (questionId: string) => {
    if (!comparisonData[questionId] || comparisonData[questionId].total === 0)
      return 0;
    return Math.round(
      (comparisonData[questionId].match / comparisonData[questionId].total) *
        100
    );
  };

  const getOverallMatch = () => {
    if (Object.keys(comparisonData).length === 0) return 0;

    let totalMatch = 0;
    let totalQuestions = 0;

    Object.values(comparisonData).forEach(({ match, total }) => {
      totalMatch += match;
      totalQuestions += total;
    });

    return Math.round((totalMatch / totalQuestions) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-infinity loading-lg text-primary"></span>
      </div>
    );
  }

  if (participants < 30) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Merci d'avoir participé !
          </h2>
          <p className="mb-2">
            Pour que les résultats soient plus représentatifs, il faut au moins{" "}
            <span className="font-bold">50 participants</span>.
          </p>
          <p className="mb-4">
            Reviens dans 24h pour découvrir à quel point tu penses comme les
            autres&nbsp;!
          </p>
          <span className="text-4xl">⏳</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Overall Match */}
        <div className="card bg-base-100 shadow-xl mb-12 transform transition-all hover:scale-105">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-3xl mb-6">
              À quel point tu penses comme les autres ?
            </h2>
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-6">
              <div
                className="radial-progress text-primary border-4 border-primary/10"
                style={
                  {
                    "--value": getOverallMatch(),
                    "--size": "12rem",
                    // "--thickness": "1rem",
                    "--thickness": "0.75rem",
                  } as React.CSSProperties
                }
              >
                <span className="text-4xl sm:text-5xl font-bold">
                  {getOverallMatch()}%
                </span>
              </div>
            </div>
            <div className="text-lg">
              {getOverallMatch() > 70 ? (
                <p className="text-success">
                  Tu penses comme la majorité des gens !
                </p>
              ) : getOverallMatch() > 40 ? (
                <p className="text-warning">
                  Tu as une pensée assez commune mais avec des particularités
                </p>
              ) : (
                <p className="text-error">Tu as une pensée vraiment unique !</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userResponses.map((question) => (
            <div
              key={question.questionId}
              className="card bg-base-100 shadow-xl transform transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="card-body">
                <h3 className="card-title text-lg mb-2">{question.question}</h3>
                <p className="text-sm opacity-75 mb-4">
                  Ta réponse: {question.reponse_text}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className="radial-progress text-accent min-w-[6rem]"
                    style={
                      {
                        "--value": getMatchPercentage(question.questionId),
                        "--size": "6rem",
                        "--thickness": "0.5rem",
                      } as React.CSSProperties
                    }
                  >
                    <span className="text-sm font-bold">
                      {getMatchPercentage(question.questionId)}%
                    </span>
                  </div>

                  <div className="text-center sm:text-left">
                    <p className="text-sm">
                      <span className="font-bold">
                        {comparisonData[question.questionId]?.match || 0}
                      </span>{" "}
                      personnes sur{" "}
                      <span className="font-bold">
                        {comparisonData[question.questionId]?.total || 0}
                      </span>{" "}
                      ont répondu comme toi
                    </p>
                    <div className="badge badge-outline mt-2">
                      {question.reponse_value}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-6 border-t border-base-300">
          <p className="text-sm opacity-75">
            Merci d'avoir participé à notre quiz philosophique !
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
