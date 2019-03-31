import * as _ from 'lodash';
import { MimeHeaderAddon } from "./mimeHeaderAddon";

export class MimeHeader {

    private name;
    private value;
    private addons;

    public static re = /^(.*?):(.*)$/;

    constructor(name, value, addons?) {
        this.name = name || 'X-unknown';
        this.value = (value || '').split(';')[0].trim();
        this.addons = MimeHeaderAddon.parse(value);
        this.addons = _.union(this.addons, addons || []);
    }

    public static parse(headerString) {
        var m;
        if ((m = this.re.exec(headerString)) !== null) {
            if (m.index === this.re.lastIndex) {
                this.re.lastIndex++;
            }
            return new MimeHeader(m[1], m[2]);
        }
        return null;
    }

    public toString() {
        var result = this.name + ': ' + this.valueToString();
        return result;
    };

    public valueToString() {
        var result = this.value;
        if (this.addons.length > 0)
            result += ';' + this.addons.map(function (addon) {
                return addon.toString();
            }).join(';')
        return result;
    }

    public getName(){
        return this.name;
    }
}