export class MimeHeaderAddon {

    private name;
    private value;
    public static re: RegExp = /(?:;\s*(.*?)\s*=\s*([^;]*))/g;

    constructor(name, value) {
        this.name = name;
        this.value = value;
    };

    public static parse(addOnString: string) {
        var m;
        var result = [];
        while ((m = this.re.exec(addOnString)) !== null) {
            result.push(new MimeHeaderAddon(m[1], m[2]));
        }
        return result;
    }

    public toString() {
        var self = this;
        if (this.name) {
            return self.name + (self.value ? '=' + self.value : '');
        }
        return '';
    }
}