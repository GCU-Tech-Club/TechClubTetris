const bearerToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHZuZ2VwdWdvb3J5dndreWp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg3OTUxMywiZXhwIjoyMDc1NDU1NTEzfQ.rlii6Z2P_TNd1h-tVvA99lW2jOkJUTWpLhculNaqhEY";

export async function createSession() {
  try {
    const res = await fetch(
      "https://kspvngepugooryvwkyjw.supabase.co/functions/v1/createSession",
      {
        method: "POST",
        headers: { Authorization: bearerToken },
        credentials: "include",
      },
    );

    if (!res.ok) throw new Error(`Session create failed: ${res.status}`);

    const data = await res.json();
    console.log(data.message);
  } catch (error) {
    console.error("createSession failed:", error);
  }
}

export async function getHighScores() {
  try {
    const response = await fetch(
      "https://kspvngepugooryvwkyjw.supabase.co/functions/v1/getHighScores",
      {
        method: "GET",
        headers: { Authorization: bearerToken },
        credentials: "include",
      },
    );

    const data = await response.json();
    console.log("getHighScores response:", data);

    if (!response.ok) {
      console.error("getHighScores failed:", response.status, data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("getHighScores fetch error:", error);
    return [];
  }
}

export async function saveHighScore(initials, score) {
  try {
    const res = await fetch(
      "https://kspvngepugooryvwkyjw.supabase.co/functions/v1/saveHighScore",
      {
        method: "POST",
        headers: {
          Authorization: bearerToken,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ initials, score }),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("saveHighScore failed:", error);
    return null;
  }
}
