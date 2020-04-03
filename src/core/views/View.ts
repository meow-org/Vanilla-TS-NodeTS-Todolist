import fs from "fs";
import { resolve,dirname } from 'path';
import { ViewDataInterface } from "./types";

class View {
    private path: string;
    private tmp: string;
    constructor(path){
        this.path = path;
        this.prepareTmp();
    }

    private read(path){
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path,  (err, data) => {
                err ? reject(err) : resolve(data.toString());
            });
        })
    }

    private async includeTemplates(path?: string){
        let dt: string = await this.read(path || this.path);
        const reg = /#include '(\S+)'/ig;
        const match = reg.exec(dt);

        if(match){
            const text = await this.includeTemplates(
                resolve(
                    dirname(path || this.path), match[1]));
            return dt.replace(`#include '${match[1]}'`, text)
        }

        return dt;
    }

    private replaceBlocks(data: string = ''): string{

        let buf = {};

        let dt = data.replace(/#block (\w+)([\s\S]*?)#endblock/gi, (_, name, text) => {
            buf[name] = text;
            return '';
        });

        Object.keys(buf).forEach((key) => {
            dt = dt.replace(`#layout ${key}`, buf[key]);
        });

        return dt;
    }

    private async prepareTmp() {
        const textTmp = await this.includeTemplates();
        this.tmp = this.replaceBlocks(textTmp);
    }

    public setDt(data: ViewDataInterface){
        let html = this.tmp;

        Object.keys(data).forEach(key => {
            html = html.replace(`#{${key}}`, data[key].toString());
        });

        return html;
    }
}

export default View;
