import * as _ from 'lodash';

export class StringUtils {

    public static simpleUnescape(str) {
        if (_.isNull(str))
            return 'null';
        if (_.isNil(str))
            return 'undefined';
        if (!_.isString(str))
            return str.toString();

        return str
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\'/g, "'")
            .replace(/\\"/g, '"');
    };

    public static strRandomFromDict(i_length, s_dict) {
        var s_ret = "";
        for (var i = 0; i < i_length; i++) {
            s_ret += s_dict[Math.floor(Math.random() * s_dict.length)];
        }
        return s_ret;
    }

    public static strRandom(i_length) {
        var s_dict = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        return StringUtils.strRandomFromDict(i_length, s_dict);
    }

    public static replacePlaceholder(str: string, replacements) {
        return str.replace(/%\w+%/g, function (all) {
            return replacements[all] || all;
        });
    }
}