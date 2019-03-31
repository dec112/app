import { UserConfiguration } from "../models/configuration/userConfiguration";
import { AdditionalInformation } from "../models/configuration/additionalInformation";
import * as _ from 'lodash';
import { GeoPosition } from "../models/geoPosition";
import { MessageType } from "../constants/messageType";

export class MessageUtils {

    public static formatPosition(position: GeoPosition, latitudeShort: string, longitudeShort: string) {
        return latitudeShort + ': ' +
            position.getIndicatorNS() + ' ' + position.getLatitude() + '; ' +
            longitudeShort + ': ' +
            position.getIndicatorEW() + ' ' + position.getLongitude();
    }

    public static createPidf(contentID, latitude, longitude, deviceId, positionLastChange) {
        var values = {};
        values['lat'] = latitude;
        values['lon'] = longitude;
        values['contentID'] = contentID;
        values['deviceID'] = deviceId;
        // see https://tools.ietf.org/html/rfc4119#section-2.1
        values['timeStamp'] = (positionLastChange) ? positionLastChange.toISOString() : "";
        // see https://tools.ietf.org/html/rfc4119#section-2.2.2
        values['expires'] = (positionLastChange) ? positionLastChange.add(1, 'days').toISOString() : "";
        // see https://tools.ietf.org/html/rfc4119#section-6.1
        values['method'] = 'gps';

        var template = _.template('<?xml version="1.0" encoding="UTF-8"?>' +
            '<presence ' +
            'xmlns="urn:ietf:params:xml:ns:pidf" ' +
            'xmlns:gp="urn:ietf:params:xml:ns:pidf:geopriv10" ' +
            'xmlns:gbp="urn:ietf:params:xml:ns:pidf:geopriv10:basicPolicy" ' +
            'xmlns:cl="urn:ietf:params:xml:ns:pidf:geopriv10:civicAddr" ' +
            'xmlns:gml="http://www.opengis.net/gml" ' +
            'xmlns:dm="urn:ietf:params:xml:ns:pidf:data-model" ' +
            'entity="pres:geotarget@example.com">' +
            '<dm:device id="<%= deviceID %>">' +
            '<gp:geopriv>' +
            '<gp:location-info>' +
            '<gml:location>' +
            '<gml:Point srsName="urn:ogc:def:crs:EPSG::4326">' +
            '<gml:pos><%= lat %> <%= lon %></gml:pos>' +
            '</gml:Point>' +
            '</gml:location>' +
            '</gp:location-info>' +
            '<gp:usage-rules>' +
            '<gbp:retransmission-allowed>' +
            'false' +
            '</gbp:retransmission-allowed>' +
            '<gbp:retention-expiry><%= expires %></gbp:retention-expiry>' +
            '</gp:usage-rules>' +
            '<gp:method><%= method %></gp:method>' +
            '</gp:geopriv>' +
            '<dm:deviceID><%= deviceID %></dm:deviceID>' +
            '<dm:timestamp><%= timeStamp %></dm:timestamp>' +
            '</dm:device>' +
            '</presence>');

        var result = template(values);
        return result;
    }

    public static createVcard(userConfiguration: UserConfiguration) {
        var values = {};
        values['title'] = userConfiguration.getTitle();
        values['firstName'] = userConfiguration.getFirstName();
        values['lastName'] = userConfiguration.getLastName();
        values['fullName'] = userConfiguration.getFullName();
        values['phone'] = userConfiguration.getPhoneNumber();
        values['email'] = userConfiguration.getEmail();
        values['street'] = userConfiguration.getStreet();
        values['zip'] = userConfiguration.getZipCode();
        values['city'] = userConfiguration.getCity();
        values['country'] = userConfiguration.getCountry();
        values['additionalInfo'] = JSON.stringify(this.createAdditionalInfo(userConfiguration.getAdditionalInformation()));

        var template = _.template('<?xml version="1.0" encoding="UTF-8"?>' +
            '<sub:EmergencyCallData.SubscriberInfo ' +
            'xmlns:sub="urn:ietf:params:xml:ns:EmergencyCallData:SubscriberInfo" ' +
            'xmlns:xc="urn:ietf:params:xml:ns:vcard-4.0" ' +
            'privacyRequested="false">' +
            '<sub:SubscriberData>' +
            '<xc:vcards>' +
            '<xc:vcard>' +
            '<xc:fn>' +
            '<xc:text><%= fullName %></xc:text>' +
            '</xc:fn>' +
            '<xc:n>' +
            '<xc:surname><%= lastName %></xc:surname>' +
            '<xc:given><%= firstName %></xc:given>' +
            '<xc:prefix><%= title %></xc:prefix>' +
            '<xc:suffix/>' +
            '</xc:n>' +
            '<xc:tel>' +
            '<xc:parameters>' +
            '<xc:type>' +
            '<xc:text>cell</xc:text>' +
            '<xc:text>voice</xc:text>' +
            '<xc:text>text</xc:text>' +
            '</xc:type>' +
            '</xc:parameters>' +
            '<xc:text><%= phone %></xc:text>' +
            '</xc:tel>' +
            '<xc:email>' +
            '<xc:parameters>' +
            '<xc:type>' +
            '<xc:text>home</xc:text>' +
            '</xc:type>' +
            '</xc:parameters>' +
            '<xc:text><%= email %></xc:text>' +
            '</xc:email>' +
            '<xc:adr>' +
            '<xc:parameters>' +
            '<xc:type>' +
            '<xc:text>home</xc:text>' +
            '</xc:type>' +
            '</xc:parameters>' +
            '<xc:street><%= street %></xc:street>' +
            '<xc:locality><%= city %></xc:locality>' +
            '<xc:region/>' +
            '<xc:code><%= zip %></xc:code>' +
            '<xc:country><%= country %></xc:country>' +
            '</xc:adr>' +
            '<xc:note>' +
            '<xc:text><%= additionalInfo %></xc:text>' +
            '</xc:note>' +
            '</xc:vcard>' +
            '</xc:vcards>' +
            '</sub:SubscriberData>' +
            '</sub:EmergencyCallData.SubscriberInfo>');

        var result = template(values);
        return result;
    }

    public static createAdditionalInfo(additionalInfo: Array<AdditionalInformation>) {
        var filteredData = {};
        for (var i = 0; i < additionalInfo.length; i++) {
            if (additionalInfo[i].getKey().trim().length > 0) {
                filteredData[additionalInfo[i].getKey()] = additionalInfo[i].getValue();
            }
        }
        return filteredData;
    }

    public static generateMessageCallInfoHeader(messageType:MessageType, location:boolean, additionalInfos:boolean, messageText:boolean){
        var info = "000";
        if (messageText) {
            info = info + "1";
        } else {
            info = info + "0";
        }
        if (additionalInfos) {
            info = info + "1";
        } else {
            info = info + "0";
        }
        if (location) {
            info = info + "1";
        } else {
            info = info + "0";
        }
        if (messageType === MessageType.UNKNOWN) {
            info = info + "00";
        } else if (messageType === MessageType.START_CALL) {
            info = info + "01";
        } else if (messageType === MessageType.END_CALL) {
            info = info + "11";
        } else if (messageType === MessageType.MESSAGE_IN_CALL) {
            info = info + "10";
        }
        return info;
    }

    public static parseMessageCallInfoHeader(number) {
        var messageDigits = '000' + number.toString(2);
        var messageType = messageDigits[6] + messageDigits[7];
        if (messageType === "00") {
            return MessageType.UNKNOWN;
        } else if (messageType === "01") {
            return MessageType.START_CALL;
        } else if (messageType === "11") {
            return MessageType.END_CALL;
        } else if (messageType === "10") {
            return MessageType.MESSAGE_IN_CALL;
        }
        return MessageType.UNKNOWN;
    }
}