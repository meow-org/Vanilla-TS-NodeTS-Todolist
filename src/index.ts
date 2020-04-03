import { View, Server, router, BaseController } from "./core";
import path from "path";

class Contr extends BaseController{
    urls = [
       ['GET', '/api', 'method']
    ];

    method(arg) {
        return { name: 'pica pica', text: "text text" };
    }
}

const view = new View(path.resolve(__dirname, '../templates/hello.hell'));


const contr  = new Contr({ model: {}, view });

const server = new Server();


server.register(contr);

server.run();
