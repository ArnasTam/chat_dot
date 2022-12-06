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
import SingleServerPage from "../../pages/single_server/single_server_page";
import SingleChannelPage from '../../pages/single_channel/single_channel_page'
import SingleMessagePage from '../../pages/single_message/single_message_page'

const consoleError = console.error;
const consoleWarn = console.warn;
const SUPPRESSED_WARNINGS = ['Unknown event handler property', "onClick is deprecated, please use onPress"];

console.error = function filterWarnings(msg, ...args) {
  if (!SUPPRESSED_WARNINGS.some((entry) => msg.includes(entry))) {
    consoleError(msg, ...args);
  }
};

console.warn = function filterWarnings(msg, ...args) {
  if (!SUPPRESSED_WARNINGS.some((entry) => msg.includes(entry))) {
    consoleWarn(msg, ...args);
  }
};


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
              <Route path="/server/:serverId/channel/:channelId" element={<SingleChannelPage />} />
              <Route path="/server/:serverId/channel/:channelId/messages/:messageId" element={<SingleMessagePage />} />
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
