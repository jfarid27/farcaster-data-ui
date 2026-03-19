import useDAUs from "./../../hooks/daus/useDAUs.ts";

export default function TopUsers() {
  const { daus } = useDAUs();

  return (
    <div id="dau-graph">
      <h3>Farcaster DAUs </h3>
    </div>
  );
}
