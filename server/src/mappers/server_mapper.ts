import { Server } from "../entity/server";

export default class ServerMapper {
  public static mapToServerResponseDTO = function (server: Server) {
    return {
      id: server.id,
      adminId: server.admin.id,
      name: server.name,
      description: server.description,
    };
  }
}