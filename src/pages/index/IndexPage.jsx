import "./IndexPage.scss";
import LastBlocks from "../../components/blocks/LastBlocks.jsx";

export default function IndexPage(props) {
  return (
    <>
      <h1>FASTNEAR Explorer</h1>
      <div className="mb-3">
        <LastBlocks />
      </div>
    </>
  );
}
