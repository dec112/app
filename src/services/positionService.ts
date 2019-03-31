import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GeoPosition } from '../models/geoPosition';

@Injectable()
export class PositionService {
  private watch;
  private position: GeoPosition = new GeoPosition();
  private positionValid = false;
  private positionError: string = '';
  private lastUpdate: string = '';

  constructor(protected geolocation: Geolocation) {
  }

  public start() {
    this.geolocation
      .getCurrentPosition()
      .then(pos => {
        this.mapPosition(pos);
        this.positionValid = true;
      })
      .catch(err => {
        this.positionValid = false;
      });
    this.watch = this.geolocation.watchPosition({ enableHighAccuracy: true, maximumAge: 20000 });
    this.watch.subscribe(pos => {
      if (pos != null) {
        this.mapPosition(pos);
      }
    });
  }

  private mapPosition(pos) {
    if (pos != null && pos.coords != null) {
      this.position.setAccuracy(pos.coords.accuracy);
      this.position.setLatitude(pos.coords.latitude);
      this.position.setLongitude(pos.coords.longitude);
      var indicatorNS: string = pos.coords.latitude > 0 ? 'N' : pos.coords.latitude < 0 ? 'S' : '';
      var indicatorEW: string = pos.coords.longitude > 0 ? 'E' : pos.coords.longitude < 0 ? 'W' : '';
      this.position.setIndicatorEW(indicatorEW);
      this.position.setIndicatorNS(indicatorNS);
      this.lastUpdate = new Date().toISOString();
    }
  }

  public getPosition(): GeoPosition {
    return this.position;
  }

  public isPositionValid(): boolean {
    return this.positionValid;
  }

  public getPositionErrorMessage() {
    return this.positionError;
  }

  public getPositionLastUpdate() {
    return this.lastUpdate;
  }
}
