class BaseController{
    public model: any;
    public view: any;
    public urls: Array<Array<string>> = [];

    constructor({ model, view }){
        this.model = model;
        this.view = view;
    }

    public getUrls(){
        return this.urls;
    }

    public render(response, data){
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(this.view.setDt(data));
    }
}

export default BaseController;
