class Paths{
    private paths = {};

    public get(id: string){
        return this.paths[id];
    }

    public set(id: string, fn: Function){
        this.paths[id] = fn;
    }
}

export default new Paths();
