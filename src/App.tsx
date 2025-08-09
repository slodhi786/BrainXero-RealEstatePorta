import { Outlet } from "react-router-dom";
import AppHeader from "./components/common/app-header";

const App = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
