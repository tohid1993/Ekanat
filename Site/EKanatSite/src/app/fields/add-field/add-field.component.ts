import { Component, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import "leaflet-draw";
// import "leaflet.gridlayer.googlemutant";
import * as GeoSearch from 'leaflet-geosearch';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss']
})
export class AddFieldComponent implements OnInit {
  map: Leaflet.Map|undefined;

  minHA:number = 1;
  maxHA:number = 50;

  FieldCordinates:any;
  FieldArea:number = 0;

  currentStep:number = 1;

  constructor() { }

  ngOnInit(): void {
    this.map = Leaflet.map('map').setView([38.0792, 46.2887], 10);
    Leaflet.tileLayer('http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
        subdomains:['mt0','mt1','mt2','mt3'],
        maxZoom: 20,
        attribution: 'EKANAT.COM ❤️'
    }).addTo(this.map);




    let drawnItems = Leaflet.featureGroup().addTo(this.map);


    var drawControlFull = new Leaflet.Control.Draw({
      edit: {
        featureGroup:drawnItems,
        remove:true,
        edit:false
      },
      draw: {
        circle:false,
        circlemarker:false,
        marker:false,
        polyline:false,
        rectangle:false,
        polygon: {
            allowIntersection: true,
            showArea: true
        }
      }
    });
  
    var drawControlRemoveOnly = new Leaflet.Control.Draw({
      edit: {
        featureGroup:drawnItems,
        remove:true,
        edit:false
      },
      draw: {
        circle:false,
        circlemarker:false,
        marker:false,
        polyline:false,
        rectangle:false,
        polygon: false
      }
    });


    this.map.addControl(drawControlFull);

    let selfMap = this.map;
    let self = this;

    this.map.on(Leaflet.Draw.Event.CREATED, function (event:any) {
      var type = event.layerType,
      layer = event.layer;


      if (type === 'polygon') {
        var area = Leaflet.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        area = Math.round(((area/10000) + Number.EPSILON) * 100) / 100

        if(area>=self.minHA && area<=self.maxHA){
          layer.bindTooltip(area + " هکتار " , {direction:'rtl' , permanent:true}).openTooltip();
          drawnItems.addLayer(layer);
  
          
          self.FieldCordinates = layer.getLatLngs();
          self.FieldArea = area;
  
          drawControlFull.remove();
          drawControlRemoveOnly.addTo(selfMap);
        }else{
          Swal.fire({
            icon:"warning",
            title:"زمین انتخابی نا معتبر است",
            text:"اندازه زمین انتخابی باید بیشتر از "+self.minHA+" و کمتر از " + self.maxHA + " هکتار باشد.",
            confirmButtonText:"متوجه شدم"
          })
        }
      }  
    })



    this.map.on(Leaflet.Draw.Event.DELETED, function(e) {
      self.FieldCordinates = undefined;
      self.FieldArea = 0;

      drawControlRemoveOnly.remove();
      drawControlFull.addTo(selfMap);
    })
  }
  

}
