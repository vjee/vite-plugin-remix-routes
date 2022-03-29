import { useParams } from "react-router-dom";

export default function DemosParamsId() {
  const { id } = useParams();

  return <div>/demos/params/$id.jsx : {id}</div>;
}
