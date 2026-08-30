import { PDFViewer } from "@react-pdf/renderer";
import BOQDocument from "./BOQDocument.jsx";
import { useLocation } from "react-router-dom";

export default function BOQPreview (){
  const location = useLocation();
  const items = location.state?.items || [];

if (items.length === 0) {
    return <div>No BOQ data found</div>;
  }

return(
    <PDFViewer width="100%" height={600}>
  <BOQDocument items={items} />
</PDFViewer>
)
}