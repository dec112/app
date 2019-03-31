import * as moment from "moment";

export class DateUtils{
	public static formatDateTime(dateTime) {
		var m = moment(dateTime);
		return m.format('DD.MM.YYYY hh:mm:ss');
	};
}