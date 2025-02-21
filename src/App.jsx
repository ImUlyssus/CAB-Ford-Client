import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ChangeRequest from "./pages/ChangeRequest";
import PDFReport from "./pages/PDFReport";
import Presentation from "./pages/Presentation";
import DataVisualization from "./pages/DataVisualization";
import ExcelFiles from "./pages/ExcelFiles";
import Logout from "./pages/Logout";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all pages inside the Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="change-request" element={<ChangeRequest />} />
          <Route path="excel-files" element={<ExcelFiles />} />
          <Route path="pdf-report" element={<PDFReport />} />
          <Route path="presentation" element={<Presentation />} />
          <Route path="data-visualization" element={<DataVisualization />} />
          <Route path="logout" element={<Logout />} />
          {/* <Route path="logout" element={<Contact />} /> */}
          {/* <Route path="*" element={<NotFound />} /> Handles 404 */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
