import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { RouterProvider } from "@tanstack/react-router";
import useAuthStore from "./store/useAuthStore";
import "./index.css";
// import { router } from "./router";
import { hertzTheme, ThemeProvider , getTheme } from "@revlab/highlander-ui";
import { registerSW } from 'virtual:pwa-register'
import { BrowserRouter as Router, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import ReactDOM from 'react-dom';
import React from 'react';


registerSW({ immediate: true })


function AppRouter() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    // <h1 className="bg-indigo-600">Hello</h1>
    <LoginPage />
    // <DashboardPage />
  );
}


ReactDOM.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

// createRoot(document.getElementById("root")!).render(
//     <ThemeProvider theme={hertzTheme}>
//       <StrictMode>
//         <AppRouter />
//       </StrictMode>
//     </ThemeProvider>
// );



// function App() {
//   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

//   return (
//     <Router>
//       {/* <Switch> */}
//         <Route path="/login">
//           <LoginPage />
//         </Route>

//         <Route path="/dashboard">
//           {isLoggedIn ? <DashboardPage /> : <h1>Please Login First</h1>}
//         </Route>

//         {/* <Route path="/">
//           <Redirect to="/dashboard" />
//         </Route> */}
//       {/* </Switch> */}
//     </Router>
//   );
// }
