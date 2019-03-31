import { CallTarget } from "../constants/callTarget";

export class EnumUtils {
    public static getCallTargetEnumIdentifier(callTargetString: string) {
        if (callTargetString === CallTarget.AMBULANCE.toString()) {
            return CallTarget.AMBULANCE;
        } else if (callTargetString === CallTarget.EURO_CALL.toString()) {
            return CallTarget.EURO_CALL;
        } else if (callTargetString === CallTarget.FIRE_BRIGADE.toString()) {
            return CallTarget.FIRE_BRIGADE;
        } else if (callTargetString === CallTarget.EURO_CALL.toString()) {
            return CallTarget.EURO_CALL;
        }
    }
}