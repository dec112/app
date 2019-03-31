import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable()
export class SubScriptionManager {
    constructor() {
    }

    public unsubscribe(subscriptions:Array<Subscription>){
        for(let i = 0; i < subscriptions.length; i++){
            subscriptions[i].unsubscribe();
        }
    }
}