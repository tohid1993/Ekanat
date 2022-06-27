import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as Leaflet from 'leaflet';
import "leaflet-draw";
// import "leaflet.gridlayer.googlemutant";
// import * as GeoSearch from 'leaflet-geosearch';
import Swal from 'sweetalert2';
import "src/assets/js/L.KML.js";
import * as shp from "shpjs";
import * as tj from "@tmcw/togeojson";


@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})

export class AddFieldComponent implements OnInit {

  @ViewChild('methodModal' , {static:true}) methodModal:ElementRef|undefined;

  map: Leaflet.Map|undefined;

  minHA:number = 1;
  maxHA:number = 50;

  FieldCordinates:any;
  FieldArea:number = 0;

  currentStep:number = 1;

  showMethodSelect:boolean = true;
  selectedMethod:number = -1;

  drawnItems:any;

  constructor(
    config: NgbModalConfig, private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit(): void {
    this.openMethodModal();

    this.map = Leaflet.map('map').setView([38.0792, 46.2887], 10).invalidateSize();
    Leaflet.tileLayer('http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
        // subdomains:['mt0','mt1','mt2','mt3'],
        maxZoom: 20,
        attribution: 'EKANAT.COM ❤️'
    }).addTo(this.map);


    this.drawnItems = Leaflet.featureGroup().addTo(this.map);


    var drawControlFull = new Leaflet.Control.Draw({
      edit: {
        featureGroup:this.drawnItems,
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
        featureGroup:this.drawnItems,
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
          self.drawnItems.addLayer(layer);
  
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
  

  openMethodModal() {
    this.modalService.open(this.methodModal, { centered: true });
  }

  choaseMethodModal(selectedMethod:number) {
    this.modalService.dismissAll();
    this.selectedMethod = selectedMethod;

    switch (selectedMethod) {
      case 1:
        (document.querySelector('.leaflet-draw-draw-polygon') as any).click();
        break;
    
      case 2:
        (document.querySelector('#file_input') as any).click();
        break;
      
      default:
        break;
    }
  }














  file: any

  fileChanged(e:any) {
    this.file = e.target.files[0];

    let fileType = this.file.name.split('.');
    fileType = fileType[fileType.length-1];

    console.log(fileType);
    console.log(this.file);


    if(fileType == "zip")
      this.readShpFile(this.file);

    if(fileType == "kml")
      this.readKmlFile(this.file)
  }

  readShpFile(file:any) {
      let fileReader = new FileReader();
      let self = this;
      fileReader.onload = async (e: any) => {
  
        shp(e.target.result).then(function(geojson:any){
          // console.log(geojson);
          self.addStaticPolygon(geojson)
        }).catch(error=>{
          console.log(111111);
        });

        return e.target.result;
      }
      fileReader.readAsArrayBuffer(file)
  }

  readKmlFile(file:any) {
   try {
    let fileReader = new FileReader();
    let self = this;
    fileReader.onload = async (e: any) => {

      const parser = new DOMParser();
      const kml = parser.parseFromString(e.target.result, 'text/xml');

      let geoJSON = tj.kml(kml);

      self.addStaticPolygon(geoJSON);

      // console.log(geoJSON);

      return e.target.result;
    }
    fileReader.readAsText(file)
   } catch (error) {
    console.log(error);
    
   }
  }

  // ایجاد چند ضلعی با استفاده از geoJson
  addStaticPolygon(states:any){
    if(this.map){
      let geoJSON = Leaflet.geoJSON(states).addTo(this.map);
      this.map.fitBounds(geoJSON.getBounds());

  
        


      let coords = states.features[0].geometry.coordinates;
      let coordsObj:any[] = [];

      coords[0].forEach((item:number[]) => {
        coordsObj.push({lat:item[0],lng:item[1]});
      });
      
      
      var area = Leaflet.GeometryUtil.geodesicArea(coordsObj);
      area = Math.round(((area/10000) + Number.EPSILON) * 100) / 100;

      console.log(area);
      

      // if(area>=this.minHA && area<=this.maxHA){
      //   layer.bindTooltip(area + " هکتار " , {direction:'rtl' , permanent:true}).openTooltip();
      //   this.drawnItems.addLayer(layer);

      //   this.FieldCordinates = layer.getLatLngs();
      //   this.FieldArea = area;
      // }else{
      //   Swal.fire({
      //     icon:"warning",
      //     title:"زمین انتخابی نا معتبر است",
      //     text:"اندازه زمین انتخابی باید بیشتر از "+self.minHA+" و کمتر از " + self.maxHA + " هکتار باشد.",
      //     confirmButtonText:"متوجه شدم"
      //   })
      // }
    }
  }

}
