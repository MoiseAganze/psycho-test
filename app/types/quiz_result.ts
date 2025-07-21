export interface quizResultQuestion {
  questionId: string;
  question: string;
  reponseIndex: number;
  reponse_text: string;
  reponse_value: string;
}
export interface quizResult {
  quizId: string;
  questions: quizResultQuestion[];
}
export interface responseData {
  quiz_results: quizResult;
  id: string;
  created_at: string;
}
