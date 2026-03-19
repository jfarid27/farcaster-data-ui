import useUserScores from "./../../hooks/user-scores/useUserScores.ts";

export default function TopUsers() {
  const { userScores } = useUserScores();

  const downloadCsv = async () => {
    // Keep consistent with the existing API adapter in `src/domain/api/adapters.ts`.
    const url = "/api/user-scores/csv";

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to download CSV: ${res.status} ${res.statusText}`);
    }

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = "latest-user-scores.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(objectUrl);
  };

  return (
    <div id="top-users">
      <h3>Farcaster User Scores </h3>
      <button type="button" onClick={downloadCsv}>
        Download CSV
      </button>
      {userScores.map((userScore: any) => {
        return (
          <div
            key={userScore.fid}
            className="user-score"
          >
            <p>
                {userScore.fid}: {userScore.scores?.pagerank || 0}
            </p>
          </div>
        );
      })}
    </div>
  );
}
