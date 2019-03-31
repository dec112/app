import { StringUtils } from "../utils/stringUtils";
import * as _ from 'lodash';
import { MimeHeader } from "./mimeHeader";
import { MimePart } from "./mimePart";

export class MultipartMime {
    private boundary;
    private parts;

    constructor(boundary, parts?) {
        this.boundary = boundary || '----------' + StringUtils.strRandom(16);
        if (this.boundary.length > 70) {
            throw new Error('mime boundary must be <= 70 characters');
        }
        this.parts = parts || [];
    }

    public getBoundary() {
        return this.boundary;
    }

    public getParts() {
        return this.parts;
    }

    public addPart(part:any) {
        if (!(part instanceof MimePart)) {
            throw new Error('Parameter must be an instance of "MimePart"');
        }
        this.parts.push(part);
    }

    public determineBoundary(body) {
        var CRLF = '\r\n';
        var b;
        var eb;
        var ebFound = false;
        var lines = body.split(CRLF);
        var line;
        var parts = 0;
        var error;

        for (var i = 0; i < lines.length; i++) {
            line = lines[i];

            if (_.startsWith(line, '--')) {
                if (line === '--') {
                    error = 'Invalid boundary found (body line: ' + i + ')';
                    break;
                }

                if (!b) {
                    b = _.trim(line);
                    eb = b + '--';
                    parts++;
                }
                else {
                    if (_.startsWith(line, eb)) {
                        ebFound = true;
                        break;
                    }
                    if (line === b)
                        parts++;
                    else {
                        error = 'Different boundaries found (body line: ' + i + ')';
                        break;
                    }
                }
            }
            else
                if (!b && line !== '')
                    error = 'Content found before boundary';
        }

        if (b)
            b = b.substring(2);
        else
            error = 'No boundaries found';

        if (!ebFound && !error)
            error = 'No end boundary found';

        return { boundary: b, count: parts, error: error };
    }

    public toString() {
        var self = this;
        var CRLF = '\r\n';
        var body = '';
        var boundary = '--' + self.boundary;

        self.parts.forEach(function (part) {
            body += boundary + CRLF;

            if (part.headers) {
                body += part.headers
                    .map(function (header) {
                        return header.toString();
                    })
                    .join(CRLF)

                if (part.headers.length > 0)
                    body += CRLF;
            }

            body += CRLF;

            body += _.get(part, 'value', '').toString() + CRLF;
        });

        if (self.parts.length > 0)
            body += boundary + '--' + CRLF;

        return body;
    }

    public parse(body, boundary) {
        var CRLF = '\r\n';
        var b;
        var eb;

        if (boundary)
            b = boundary;
        else {
            var bt = this.determineBoundary(body);
            if (bt.error)
                throw new Error(bt.error);
            b = bt.boundary;
        }
        var result = new MultipartMime(b);

        b = '--' + b;
        eb = b + '--';

        var state = 0;
        var lines = body.split(CRLF);
        var line;
        var part;

        for (var i = 0; i < lines.length; i++) {
            line = lines[i];

            switch (state) {

                // search for start or end boundary
                case 0:
                    if (line === b) {
                        state = 1
                        part = new MimePart();
                    }
                    else if (line === eb) {
                        state = 9;
                        i--;
                    }
                    break;

                // process mime block headers
                case 1:
                    if (line == '')
                        state = 2;
                    else {
                        var h = MimeHeader.parse(line);
                        if (h)
                            part.headers.push(h);
                    }
                    break;

                // process mime block value
                case 2:
                    if (line !== b && line !== eb)
                        part.value += line + CRLF;
                    else {
                        state = 0;
                        i--;
                        result.addPart(part);
                    }
                    break;

                // end processing
                case 9:
                    i = lines.length + 1;
            }
        }
        return result;
    }
}