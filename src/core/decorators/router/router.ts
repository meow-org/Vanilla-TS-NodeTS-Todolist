import paths from "./paths";

class Router{
    private wrap(url: string) {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            let originalMethod = descriptor.value;
            paths.set(url, (request, response) => {
                const data = originalMethod(request, response);
                target.render(response, data);
            });
            return descriptor;
        }
    }

    public get(url: string){
        return this.wrap(url);
    };

    public post(url: string){
        return this.wrap(url);
    }

    public delete(url: string){
        return this.wrap(url);
    }

    public put(url: string){
        return this.wrap(url);
    }
}

export default new Router();
