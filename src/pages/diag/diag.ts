import { Component } from '@angular/core';
import { MainPage } from '../main/main';
import { NavController, NavParams } from 'ionic-angular';
import { PositionService } from '../../services/positionService';
import { NetworkService } from '../../services/networkService';
import L from 'leaflet';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-diagPage',
  templateUrl: 'diag.html'
})
export class DiagPage {

  private map:L.Map;
  private marker:L.Marker;
  private markerIcon:L.Icon;

  constructor(protected navController: NavController, protected navParams: NavParams, protected translateService: TranslateService, protected positionService: PositionService, protected networkService: NetworkService) {

    this.markerIcon = L.icon({
      iconUrl: 'https://image.flaticon.com/icons/png/512/33/33622.png',
      iconSize: [38, 38], // size of the icon
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
  }

  public ionViewWillEnter() {
    if (this.map == null) {
      this.map = L.map('map').setView([this.positionService.getPosition().getLatitude(), this.positionService.getPosition().getLongitude()], 16);;
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(this.map);
      this.marker = new L.Marker(new L.LatLng(this.positionService.getPosition().getLatitude(), this.positionService.getPosition().getLongitude()), {icon: this.markerIcon});
      this.marker.addTo(this.map);
    }
  }
}
