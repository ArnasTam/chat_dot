import React from "react";
import "./app.css";
import { NextUIProvider } from "@nextui-org/react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import LoginPage from "../../pages/auth/login/login_page";
import HomePage from "../../pages/home/home_page";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import { isAuthenticated } from "../../store/auth_slice";
import { ChakraProvider } from "@chakra-ui/react";
import ServerPage from "../../pages/server/server_page";
import SingleServerPage from '../../pages/single_server/single_server_page'

function App() {
  return (
    <ChakraProvider>
      <NextUIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/servers" element={<PrivateRoute />}>
              <Route path="/servers" element={<ServerPage />} />
            </Route>
            <Route path="/server" element={<PrivateRoute />}>
              <Route path="/server/:serverId" element={<SingleServerPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </NextUIProvider>
    </ChakraProvider>
  );
}

const PrivateRoute = () => {
  useAppSelector((state: RootState) => state.auth.status);

  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default App;
