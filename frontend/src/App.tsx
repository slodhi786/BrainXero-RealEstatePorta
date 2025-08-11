import { Outlet } from "react-router-dom";
import AppHeader from "./components/common/app-header";

const App = () => {
  return (
    <div className="min-h-dvh flex flex-col" style={{width: '100vw'}}>
      <AppHeader />
      <main className="flex-1 bg-[url('https://zealous-bush-09a3b4d1e.1.azurestaticapps.net/bg1.webp')] bg-cover bg-center">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
