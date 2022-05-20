import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import PlanningPoker from "./PlanningPoker";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/index" element={<PlanningPoker />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;