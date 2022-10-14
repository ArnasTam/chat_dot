import axios from "axios";
import { apiUrl } from "../utils/constants";
import { Server } from "../types/server";
import { getJWT } from "../store/auth_slice";
import jwt_decode from "jwt-decode";

axios.defaults.headers.common["Authorization"] = "Bearer " + getJWT();

export const getAllServers = async (): Promise<Server[]> => {
  const response = await axios.get(`${apiUrl}/servers`);

  return response.data.map((server: any) => {
    return {
      id: server.id,
      name: server.name,
      description: server.description,
      adminId: server.adminId,
    } as Server;
  });
};

export const getServerById = async (props: { id: string }): Promise<Server> => {
  const response = await axios.get(`${apiUrl}/servers/${props.id}`);

  return {
    id: response.data.id,
    name: response.data.name,
    description: response.data.description,
    adminId: response.data.adminId,
  } as Server;
};

export const addServer = async (props: {
  name: string;
  description: string;
}): Promise<void> => {
  const response = await axios.post(`${apiUrl}/servers`, {
    name: props.name,
    description: props.description,
    adminId: jwt_decode<any>(getJWT()!).userId,
  });

  return response.data;
};

export const updateServer = async (props: {
  id: string,
  name: string;
  description: string;
}): Promise<void> => {
  const response = await axios.put(`${apiUrl}/servers/${props.id}`, {
    name: props.name,
    description: props.description,
    adminId: jwt_decode<any>(getJWT()!).userId,
  });

  return response.data;
};

export const deleteServer = async (props: { id: string }): Promise<void> => {
  const response = await axios.delete(`${apiUrl}/servers/${props.id}`);

  return response.data;
};
