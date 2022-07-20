import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import "leaflet-draw";
// import "leaflet.gridlayer.googlemutant";
import * as GeoSearch from 'leaflet-geosearch'
import { DateModel } from 'src/app/shared/models/model';

@Component({
  selector: 'app-imagery',
  templateUrl: './imagery.component.html',
  styleUrls: ['./imagery.component.scss']
})
export class ImageryComponent implements OnInit {

  map: Leaflet.Map|undefined;
  drawnItems:any;

  cords = 
    [
      {x:47.51624064076141, y:37.93231715852789},
      {x:47.51456694233612, y:37.92981229426884},
      {x:47.51894430744842, y:37.931877120986286},
      {x:47.52044634449676, y:37.93045544323541},
      {x:47.52203421223358, y:37.934618850438284},
      {x:47.51877264607147, y:37.933129528607815},
      {x:47.516583963515316, y:37.93472039400975},
      {x:47.51370863545135, y:37.932757193435556}
    ]
  

    fromDate!:DateModel;
    toDate!:DateModel;

  constructor() { }

  ngOnInit(): void {
    this.map = Leaflet.map('map').setView([38.0792, 46.2887], 10);
    // this.map.scrollWheelZoom.disable();



    Leaflet.tileLayer('http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
        subdomains:['mt0','mt1','mt2','mt3'],
        maxZoom: 20,
        attribution: 'EKANAT.COM ❤️'
    }).addTo(this.map);

    this.drawnItems = Leaflet.featureGroup().addTo(this.map);

    this.addPolygonToMap(this.cords)
    
  }


  // ایجاد چند ضلعی با استفاده از geoJson
  addPolygonToMap(coordinates:any){
    if(this.map){
      if(this.drawnItems)
        this.drawnItems.clearLayers();

      let status:any =
      {
        "type": "Polygon",
        "coordinates": [
          [
            [47.51624064076141, 37.93231715852789],
            [47.51456694233612, 37.92981229426884],
            [47.51894430744842, 37.931877120986286],
            [47.52044634449676, 37.93045544323541],
            [47.52203421223358, 37.934618850438284],
            [47.51877264607147, 37.933129528607815],
            [47.516583963515316, 37.93472039400975],
            [47.51370863545135, 37.932757193435556]
          ]
        ]
      }
     
      let geoJSON = Leaflet.geoJSON(status).addTo(this.drawnItems);
      this.map.fitBounds(geoJSON.getBounds());
    }
  }




}
