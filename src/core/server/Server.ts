import http from 'http';
import url from 'url';


class Server{
    private port?: number;
    private host?: string;
    private paths = {};

    constructor(){
        this.port = 3000;
        this.host = 'mic mic';
        this.main = this.main.bind(this);
    }

    private main(request, response){
        const parts = url.parse(request.url);
        const route = this.paths[`${parts.pathname}-${request.method}`];

        if (route) {
            const dt = route.method(request, response);
            route.controller.render(response, dt);

        } else {
            response.end()
        }
    }

    public register(controller){
        const urls = controller.getUrls();
        const control = urls.reduce((acc, u) => ({ ...acc, [`${u[1]}-${u[0]}`]: { method: controller[u[2]], controller } }), {});
        this.paths = {...control, ...this.paths};
    }

    public run(port = 3000){
        const server = http.createServer(this.main);
        server.listen(this.port || port);
        return server;
    }
}

export default Server;
