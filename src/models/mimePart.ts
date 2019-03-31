import * as _ from 'lodash';
import { MimeHeader } from "./mimeHeader";

export class MimePart {

    private headers;
    private value;

    public static re = "/^(--)/gm";

    constructor(name?, headers?, value?) {
        this.headers = headers || [];
        this.value = value || "";
    }

    public setValue(value) {
        this.value = (value) ? value.replace(MimePart.re, ' $1') : "";
    }

    public getValue() {
        return this.value;
    }

    public setContentType(type) {
        this.setHeader('Content-Type', type);
    }

    public getContentType() {
        var h = this.getHeader('Content-Type');
        return (h.length > 0 ? h[0].value : '');
    }

    public setContentTypeFull(type) {
        this.setHeader('Content-Type', type);
    }

    public getContentTypeFull() {
        var h = this.getHeader('Content-Type');
        return (h.length > 0 ? h[0].valueToString() : '');
    }

    public toString() {
        var self = this;
        var CRLF = '\r\n';
        var result = '';
        result += self.headers.map(function (header) {
            return header.toString();
        }).join(CRLF);
        result += CRLF;
        result += self.value.toString();
    }

    public getHeader(header) {
        var hn;
        if (header instanceof MimeHeader)
            hn = header.getName();
        else
            if (_.isString(header))
                hn = header;
            else
                throw new Error('Parameter must either be a string or a MimeHeader instance');

        var result = this.headers.filter(function (header) {
            return header.getName() === hn;
        })
        return result;
    }

    public setHeader(headerName, headerValue) {
        var found = 0;
        var hn;

        if (headerName instanceof MimeHeader)
            hn = headerName;
        else
            if (_.isString(headerName))
                hn = new MimeHeader(headerName, headerValue);
            else
                throw new Error('Parameters must either be string,string or a single MimeHeader instance');

        for (var i = 0; i < this.headers.length; i++) {
            var header = this.headers[i];
            if (header.getName() === hn.name) {
                found++;
                this.headers[i] = hn;
            }
        }

        if (found < 1) {
            this.headers.push(hn);
            found = 1;
        }

        return found;
    }

    public addHeader(headerName, headerValue?) {
        var found = 0;
        var hn;

        if (headerName instanceof MimeHeader)
            hn = headerName;
        else
            if (_.isString(headerName))
                hn = new MimeHeader(headerName, headerValue);
            else
                throw new Error('Parameters must either be string,string or a single MimeHeader instance');

        for (var i = 0; i < this.headers.length; i++) {
            var header = this.headers[i];
            if (header.name === hn.name)
                found++;
        }

        this.headers.push(hn);
        found++;

        return found;
    }

    public removeHeader(headerName) {
        var found = 0;
        var hn;

        if (headerName instanceof MimeHeader)
            hn = headerName.getName();
        else
            if (_.isString(headerName))
                hn = headerName;
            else
                throw new Error('Parameters must either be a string or a single MimeHeader instance');

        var newHeaders = this.headers.filter(function (header) {
            return header.name !== hn;
        });

        found = this.headers.length - newHeaders.length;
        this.headers = newHeaders;
        return found;
    }

    public static parse(bodyPart) {
        var CRLF = '\r\n';
        var result = [];

        var state = 0;
        var lines = bodyPart.split(CRLF);
        var line;
        var part = new MimePart();

        for (var i = 0; i < lines.length; i++) {
            line = lines[i];

            switch (state) {

                // process mime block headers
                case 0:
                    if (line == '')
                        state = 1;
                    else {
                        var h = MimeHeader.parse(line);
                        if (h)
                            part.addHeader(h);
                    }
                    break;

                // process mime block value
                case 1:
                    part.value += line + CRLF;
                    break;
            }
        }
    }
}