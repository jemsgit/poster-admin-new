import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { store } from "./store/store.ts";
import router from "./routes/routes.tsx";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
