import useUserScores from "./../../hooks/user-scores/useUserScores.ts";

export default function TopUsers() {
  const { userScores } = useUserScores();

  return (
    <div id="top-users">
      <h3>Farcaster User Scores </h3>
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
