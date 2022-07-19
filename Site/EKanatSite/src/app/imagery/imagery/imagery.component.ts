import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import "leaflet-draw";
// import "leaflet.gridlayer.googlemutant";
import * as GeoSearch from 'leaflet-geosearch'

@Component({
  selector: 'app-imagery',
  templateUrl: './imagery.component.html',
  styleUrls: ['./imagery.component.scss']
})
export class ImageryComponent implements OnInit {

  map: Leaflet.Map|undefined;

  cords = 
    [
      {
        "x": 46.118631,
        "y": 38.103315
      },
      {
        "x": 46.120434,
        "y": 38.102437
      },
      {
        "x": 46.118889,
        "y": 38.101526
      },
      {
        "x": 46.117043,
        "y": 38.101897
      },
      {
        "x": 46.118631,
        "y": 38.103315
      }
    ]
  

  constructor() { }

  ngOnInit(): void {
    this.map = Leaflet.map('map').setView([38.0792, 46.2887], 10);
    this.map.scrollWheelZoom.disable();

    Leaflet.tileLayer('http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
        subdomains:['mt0','mt1','mt2','mt3'],
        maxZoom: 20,
        attribution: 'EKANAT.COM ❤️'
    }).addTo(this.map);
    
  }

}
