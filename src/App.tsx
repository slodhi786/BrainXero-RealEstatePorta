import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Real Estate Portal App</h1>
      <Outlet />
    </div>
  );
};

export default App;
