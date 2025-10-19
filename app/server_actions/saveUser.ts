import { supabase } from "../../src/lib/supabaseClient";
import { quizResult } from "../types/quiz_result";

export async function saveUser(
  quizResult: quizResult,
  user_token: string | null,
  email: string
) {
  const good = await userExist(email, user_token);

  if (good) {
    return false;
  }
  const { data, error } = await supabase
    .from("quiz_response")
    .insert([{ quiz_results: quizResult, email }]); // quiz_results est la colonne

  if (error) {
    console.error("Erreur insertion Supabase:", error.message);
    return false;
  }

  return true;
}
export async function userExist(email: string, user_token: string | null) {
  const { data: users } = await supabase
    .from("quiz_response")
    .select("*")
    .eq("email", email);

  if (users && users.length > 0) {
    console.log(users);

    return true;
  } else {
    return false;
  }
}
