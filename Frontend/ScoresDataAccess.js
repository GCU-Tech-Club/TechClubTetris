const bearerToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcHZuZ2VwdWdvb3J5dndreWp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg3OTUxMywiZXhwIjoyMDc1NDU1NTEzfQ.rlii6Z2P_TNd1h-tVvA99lW2jOkJUTWpLhculNaqhEY";

export async function createSession() {
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
  console.log("status:", res.status);
  console.log("ok:", res.ok);
}

export async function getHighScores() {
  const response = await fetch(
    "https://kspvngepugooryvwkyjw.supabase.co/functions/v1/getHighScores",
    {
      method: "GET",
      headers: { Authorization: bearerToken },
      credentials: "include",
    },
  );

  const data = await response.json();
  console.log(data);
  console.log(document.cookie);
}

export async function saveHighScore() {
  const res = await fetch(
    "https://kspvngepugooryvwkyjw.supabase.co/functions/v1/saveHighScore",
    {
      method: "POST",
      headers: { Authorization: bearerToken },
      credentials: "include",
      body: JSON.stringify({
        initials: "TST",
        score: 100,
      }),
    },
  );
  const data = res.json();
}
