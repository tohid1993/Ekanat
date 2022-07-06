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
import { EeService } from 'src/app/shared/services/ee.service';
import { GeneralService } from 'src/app/shared/services/general.service';



@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})

export class AddFieldComponent implements OnInit {

  @ViewChild('methodModal' , {static:true}) methodModal:ElementRef|undefined;

  map: Leaflet.Map|undefined;

  minHA:number = 1;
  maxHA:number = 100;

  FieldCoordinates:any|undefined;
  FieldArea:number = 0;

  currentStep:number = 1;

  showMethodSelect:boolean = true;
  selectedMethod:number = -1;

  drawnItems:any;
  file: any

  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private gService:GeneralService,
    private eeService:EeService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit(): void {
    this.openMethodModal();
    this.map = Leaflet.map('map').setView([38.0792, 46.2887], 10);


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
      self.addPolygonToMap(event.layer.toGeoJSON())
    })


    this.map.on(Leaflet.Draw.Event.DELETED, function(e) {
      self.FieldCoordinates = undefined;
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




  fileChanged(e:any) {
    this.file = e.target.files[0];

    let fileType = this.file.name.split('.');
    fileType = fileType[fileType.length-1];

    // console.log(fileType);
    // console.log(this.file);

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
          self.addPolygonToMap(geojson)
        }).catch(error=>{
          console.log(error);
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
      self.addPolygonToMap(geoJSON);
      // console.log(geoJSON);
      return e.target.result;
    }
    fileReader.readAsText(file)
   } catch (error) {
    console.log(error);
   }
  }

  // ایجاد چند ضلعی با استفاده از geoJson
  addPolygonToMap(states:any){
    if(this.map){
      this.drawnItems.clearLayers();

      let coordinates = this.GetCoordinates(states)[0];
      let coords =  coordinates.map(function(val:any, index:number){
        return [val[0],val[1]];
      })

      let geoJSON = Leaflet.geoJSON(states).addTo(this.drawnItems);
      geoJSON.bindTooltip("درحال محاسبه مساحت ..." , {direction:"right" , permanent:true}).openTooltip();
      this.map.fitBounds(geoJSON.getBounds());


      this.checkValidArea(coords , geoJSON);
    }
  }

  checkValidArea(coords:any[] , geoJSON:any):any{
    new Promise<number>(()=>{
      let self = this;
      this.eeService.calcArea(coords)
      .subscribe(
        {
          next(res) {
            let area = Math.round(((res.area/10000) + Number.EPSILON) * 100) / 100;
            
            if(area>=self.minHA && area<=self.maxHA){
              self.FieldArea = area;
              self.FieldCoordinates = coords;
              geoJSON.bindTooltip(area.toString()+" هکتار " , {direction:'right' , permanent:true}).openTooltip();
            }else{
              Swal.fire({
                icon:"warning",
                title:"زمین انتخابی نا معتبر است",
                text:"اندازه زمین انتخابی باید بیشتر از "+self.minHA+" و کمتر از " + self.maxHA + " هکتار باشد.",
                confirmButtonText:"متوجه شدم"
              })

              self.drawnItems.clearLayers();
            }

          },
          error(err) { 
            console.error(err);
            self.drawnItems.clearLayers();
          },
          complete() {}
        }
      )
    })
  }

  GetCoordinates(theObject:any): any {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = this.GetCoordinates(theObject[i]);
            if (result) {
                break;
            }
        }
    }
    else
    {
        for(var prop in theObject) {
            if(prop == 'coordinates') {
              return theObject[prop];
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
                result = this.GetCoordinates(theObject[prop]);
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
  }


  resetAll(){
    this.drawnItems.clearLayers();
    this.FieldArea = 0;
    this.FieldCoordinates = undefined;

    (document.querySelector('[title="Cancel drawing"]') as any).click();
    
    this.openMethodModal();
  }
}
