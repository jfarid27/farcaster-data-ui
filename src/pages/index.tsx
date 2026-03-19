import TopUsers from "../components/TopUsers/index.tsx";
import DAUGraph from "../components/DAUGraph/index.tsx";

export default function Index() {

  return (
    <main id="content">
      <h1>Farcaster User Data </h1>
      <DAUGraph />
      <TopUsers />
    </main>
  );
}
