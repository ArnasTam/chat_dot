import axios from "axios";
import { apiUrl } from "../../utils/constants";

export const postLogin = async (userData: {
  userName: string;
  password: string;
}) => {
  const { userName, password } = userData;

  return await axios.post(`${apiUrl}/auth/login`, {
    userName: userName,
    password: password,
  });
};
