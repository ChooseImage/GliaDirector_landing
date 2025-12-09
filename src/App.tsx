import { BrowserRouter } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";
import { LandingPage } from "./LandingPage";

function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <LandingPage />
      </NuqsAdapter>
    </BrowserRouter>
  );
}
export default App;
