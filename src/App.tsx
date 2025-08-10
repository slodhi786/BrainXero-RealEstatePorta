import { Outlet } from "react-router-dom";
import AppHeader from "./components/common/app-header";

const App = () => {
  return (
    <div className="min-h-dvh flex flex-col" style={{width: '100vw'}}>
      <AppHeader />
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
