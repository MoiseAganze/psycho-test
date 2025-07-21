import { supabase } from "../../src/lib/supabaseClient";
import { quizResult, responseData } from "../types/quiz_result";

export async function getUsers() {
  const { data, error } = await supabase.from("quiz_response").select("*"); // récupère toutes les colonnes

  if (error) {
    console.error("Erreur récupération Supabase:", error.message);
    return null;
  }

  return data as responseData[];
}

export async function getUserData(email: string) {
  const { data, error } = await supabase
    .from("quiz_response")
    .select("*")
    .eq("email", email)
    .single(); // récupère un seul enregistrement

  if (error) {
    console.error("Erreur récupération Supabase:", error.message);
    return null;
  }

  return data as responseData;
}