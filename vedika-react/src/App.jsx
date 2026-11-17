import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TemplatesPage from "./components/TemplatesPage";
import DesignStudio from "./components/DesignStudio";

export default function App() {
  const [page, setPage] = useState("templates");
  const [activeTemplate, setActiveTemplate] = useState(null);

  const openInEditor = (template) => {
    setActiveTemplate(template);
    setPage("studio");
  };

  return (
    <div className="shell">
      <Sidebar active={page} onNavigate={setPage} />
      <div className="main">
        <Topbar />
        <div className="content">
          {page === "templates" && <TemplatesPage onOpen={openInEditor} />}
          {page === "studio" && <DesignStudio template={activeTemplate} />}
          {page !== "templates" && page !== "studio" && (
            <p className="muted">“{page}” page goes here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
