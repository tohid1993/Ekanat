import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as Leaflet from 'leaflet';
import "leaflet-draw";
// import "leaflet.gridlayer.googlemutant";
import * as GeoSearch from 'leaflet-geosearch';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as tj from "@tmcw/togeojson";
import { NgxSpinnerService } from 'ngx-spinner';
import * as shp from "shpjs";
import { DateModel, IrrigationType } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { EeService } from 'src/app/shared/services/ee.service';
import { FieldService } from 'src/app/shared/services/field.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import "src/assets/js/L.KML.js";
import Swal from 'sweetalert2';
import { GestureHandling } from "leaflet-gesture-handling";
import { LocationService } from 'src/app/shared/services/location.service';
import {TranslateService} from "../../shared/services/traslate.service";


@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss'],
})

export class AddFieldComponent implements OnInit , OnDestroy {

  @ViewChild('methodModal' , {static:true}) methodModal:ElementRef|undefined;

  map: Leaflet.Map|undefined;

  minHA:number = 2;
  maxHA:number = 100;
  remainingHA:number = 100;
  LimitHA:number = 100;


  FieldCoordinates:any|undefined;
  FieldArea:number = 0;

  currentStep:number = 1;

  showMethodSelect:boolean = true;
  selectedMethod:number = -1;

  drawnItems:any;
  file: any

  AddFieldForm:FormGroup;
  cultivationDate!:DateModel;
  harvestDate!:DateModel;
  fertilizationDate!:DateModel;

  FieldProductsList:any[] = []

  IrrigationType = [
      {
        title:'flooded',
        id: IrrigationType.Flooded
      },
      {
        title:'furrow',
        id: IrrigationType.Furrow
      },
      {
        title:'tip',
        id: IrrigationType.Tip
      },
      {
        title:'rainy',
        id: IrrigationType.Rainy
      },
      {
        title:'drip',
        id: IrrigationType.Drip
      },
      {
        title:'underground',
        id: IrrigationType.Underground
      },
      {
        title:'rainfed',
        id: IrrigationType.Rainfed
      }
  ];

  IrrigationTypes=IrrigationType;

  CountriesList: any[] = [];
  ProvincesList: any[] = [];


  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private gService:GeneralService,
    private eeService:EeService,
    private fieldService:FieldService,
    private router:Router,
    private dateTimeService:DateTimeService,
    private spinner:NgxSpinnerService,
    private locationService:LocationService,
    public translateService:TranslateService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.AddFieldForm = new FormGroup({
      name:new FormControl(null,[Validators.required]),
      area:new FormControl(null,[Validators.required]),
      countryId:new FormControl(null,[Validators.required]),
      provinceId:new FormControl(null,[Validators.required]),
      cultivationDate:new FormControl(null,[Validators.required]),
      polygon:new FormControl(null,[Validators.required]),

      fieldProductId:new FormControl(null,[Validators.required]),
      // otherProductTitle:new FormControl(null,[Validators.required]),
      previousFieldProductId:new FormControl(null,[Validators.required]),
      // otherPreviousProductTitle:new FormControl(null,[Validators.required]),
      harvestDate:new FormControl(null,[Validators.required]),
      // fertilizationDate:new FormControl(null,[Validators.required]),
      irrigationPeriod:new FormControl(null,[Validators.required]),
      irrigationType:new FormControl(null,[Validators.required])
    })
  }


  ngOnDestroy(): void {

  }

  ngOnInit(): void {

    this.getCountriesList();
    this.getFieldProductsList();
    this.openMethodModal();

    Leaflet.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
    
    this.map = Leaflet.map('map' , {gestureHandling: true} as any).setView([38.0792, 46.2887], 10);

    this.map.scrollWheelZoom.disable();


    let marker = Leaflet.icon({
      iconUrl: './assets/images/icons/mappin-kanat-vpm-artan1100-0106.svg',
      iconSize: [50, 75],
    });

    const search = new (GeoSearch.GeoSearchControl as any)({
      provider: new GeoSearch.OpenStreetMapProvider(),
      notFoundMessage: this.translateService.translate('notFound'),
      searchLabel: this.translateService.translate('searchYourRegion'),
      style:'bar',
      marker:{
        icon : marker
      }
    });
    this.map.addControl(search);



    var osm = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: 'EKANAT.COM ❤️'
    });

    var satilate = Leaflet.tileLayer('http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
      // subdomains:['mt0','mt1','mt2','mt3'],
      maxZoom: 20,
      attribution: 'EKANAT.COM ❤️'
    })
    

    this.map.addLayer(satilate);

    let baseMaps:any = {}

    baseMaps[this.translateService.translate('streetMapView')] = osm
    baseMaps[this.translateService.translate('satelliteMapView')] = satilate

    let layerControl = Leaflet.control.layers(baseMaps,{},{position:'bottomleft'}).addTo(this.map);


    this.drawnItems = Leaflet.featureGroup().addTo(this.map);


    var drawControlFull = new Leaflet.Control.Draw({
      edit: {
        featureGroup:this.drawnItems,
        remove:true,
        edit:false
      },
      draw: {
        circle:{
          showRadius:true,
          shapeOptions:{
            className:'test'
          }
        },
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
        polygon: false,
      }
    });


    this.map.addControl(drawControlFull);

    let selfMap = this.map;
    let self = this;

    this.map.on(Leaflet.Draw.Event.CREATED, function (event:any) {
      if(event.layerType==='circle'){
        const json = event.layer.toGeoJSON();
        if (event.layer instanceof Leaflet.Circle) {
          json.properties.radius = event.layer.getRadius();
        }
        self.addCircleShapeToMap(json)
      }
      if(event.layerType==='polygon'){
        self.addPolygonToMap(event.layer.toGeoJSON())
      }
    })


    this.map.on(Leaflet.Draw.Event.DELETED, function(e) {
      self.FieldCoordinates = undefined;
      self.FieldArea = 0;

      drawControlRemoveOnly.remove();
      drawControlFull.addTo(selfMap);
    })
  }

  getCountriesList(){
    this.locationService.getCountriesList()
      .subscribe(
        res=>{
          if(res.isSuccess){
            this.CountriesList = res.data;
          }
        }
      )
  }
  
  LoadProvincesList(){
    this.AddFieldForm.controls['provinceId'].setValue(null);
    this.ProvincesList = this.CountriesList.find(c=>c.id == this.AddFieldForm.value.countryId).provinces;
  }

  getFieldProductsList(){
    this.fieldService.getFieldProductionslist()
      .subscribe(
        (res:any)=>{
          if(res.isSuccess)
            this.FieldProductsList = res.data;
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


  irrigationTypeChange(){
    setTimeout(() => {
      if(this.AddFieldForm.value.irrigationType == IrrigationType.Rainfed){
        this.AddFieldForm.controls['irrigationPeriod'].setValue(0)
      }
    }, 100);
  }



  fileChanged(e:any) {
    this.file = e.target.files[0];

    let fileType = this.file.name.split('.');
    fileType = fileType[fileType.length-1];

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

  // generate polygon geoJson
  addPolygonToMap(states:any){
    if(this.map){
      this.drawnItems.clearLayers();

      let coordinates = this.GetCoordinates(states)[0];
      let coords =  coordinates.map(function(val:any, index:number){
        return [val[0],val[1]];
      })

      let geoJSON = Leaflet.geoJSON(states).addTo(this.drawnItems);

      geoJSON.bindTooltip(this.translateService.translate('calculating') , {direction:"right" , permanent:true}).openTooltip();
      this.map.fitBounds(geoJSON.getBounds());

      this.checkValidArea(coords , geoJSON);
    }
  }

  // ایجاد چند ضلعی با استفاده از geoJson
  addCircleShapeToMap(states:any){
    if(this.map){
      this.drawnItems.clearLayers();

      let coords = this.GetCoordinates(states);

      this.addPolygonToMap(
          require('leaflet-geodesy').circle([coords[1],coords[0]], states.properties.radius, {parts:360}).toGeoJSON()
      )

      // let geoJSON = Leaflet.geoJSON(states).addTo(this.drawnItems);
      // let circle = new Leaflet.Circle([coords[1],coords[0]], states.properties.radius ).addTo(this.drawnItems);
      // geoJSON.bindTooltip("درحال محاسبه مساحت ..." , {direction:"right" , permanent:true }).openTooltip();
      //
      // this.map.fitBounds(circle.getBounds())


      // this.checkValidArea(coords , geoJSON);
    }
  }

  checkValidArea(coords:any[] , geoJSON:any):any{
    new Promise<number>(()=>{
      let self = this;
      this.eeService.calcArea(coords)
      .subscribe(
        {
          next(res) {
            let area = Math.round((((+res.data.area)/10000) + Number.EPSILON) * 100) / 100;

            if(res.data.isValid){
              self.FieldArea = area;
              self.FieldCoordinates = coords;
              geoJSON.bindTooltip(area.toString()+ " " + self.translateService.translate('hectares') , {direction:'right' , permanent:true}).openTooltip();
            }else{

              let title = self.translateService.translate('calculatedFieldArea').replace('"fieldArea"',area.toString())

              Swal.fire({
                  icon:"warning",
                  title: title,
                  text:res.data.errorMessage,
                  confirmButtonText: self.translateService.translate('dismissLabel')
                })

                self.drawnItems.clearLayers();
            }

          },
          error(err) { 
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

    try {
      (document.querySelector('[title="Cancel drawing"]') as any).click();
    } catch (error) {
      
    }
    
    this.openMethodModal();
  }

  GoToNextStep(){
    let coords:any[] = [];
    this.FieldCoordinates.forEach((coord:any) => {
      coords.push({x:coord[0],y:coord[1]});
    });
    this.AddFieldForm.controls['polygon'].setValue(coords);
    this.AddFieldForm.controls['area'].setValue(this.FieldArea);

    this.currentStep = 2;
  }

  SaveField(){    
    if(this.AddFieldForm.invalid) return;

    this.spinner.show();

    let obj = this.gService.clone(this.AddFieldForm.value);

    if(obj.fieldProductId==0)
      obj.fieldProductId = null;
    else
      obj.otherProductTitle = null;


    if(obj.previousFieldProductId==0)
      obj.previousFieldProductId = null;
    else
      obj.otherPreviousProductTitle = null;

    let self = this;
    this.fieldService.saveField(this.AddFieldForm.value)
      .subscribe({
        next(){
          self.gService.showSuccessToastr(self.translateService.translate('newFieldAddSuccessFull'));
          self.router.navigate(['/fields']);
          self.spinner.hide();
        }
      })
  }

  setDate(key:string){

    switch (key) {
      case 'cultivationDate':
        this.AddFieldForm.controls['cultivationDate'].setValue(
      this.translateService.calendarType === 'Shamsi'?
                this.dateTimeService.toGeorgianDate(this.cultivationDate.year+"-"+this.cultivationDate.month+"-"+this.cultivationDate.day) :
                (this.cultivationDate.year+"-"+this.cultivationDate.month+"-"+this.cultivationDate.day)
        );
        break;

    case 'harvestDate':
      this.AddFieldForm.controls['harvestDate'].setValue(
      this.translateService.calendarType === 'Shamsi'?
              this.dateTimeService.toGeorgianDate(this.harvestDate.year+"-"+this.harvestDate.month+"-"+this.harvestDate.day):
              (this.harvestDate.year+"-"+this.harvestDate.month+"-"+this.harvestDate.day)
      );
      break;

    case 'fertilizationDate':
      this.AddFieldForm.controls['fertilizationDate'].setValue(
      this.translateService.calendarType === 'Shamsi'?
              this.dateTimeService.toGeorgianDate(this.fertilizationDate.year+"-"+this.fertilizationDate.month+"-"+this.fertilizationDate.day):
              (this.fertilizationDate.year+"-"+this.fertilizationDate.month+"-"+this.fertilizationDate.day)
      );
      break;
    
      default:
        break;
    }

  }



  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    } else {
      Swal.fire({
        text: this.translateService.translate('browserNotSupported'),
        icon:"warning"
      }) 
    }
  }

  
  showPosition(position:any) {
    if(this.map){
      Leaflet.marker([position.coords.latitude,position.coords.longitude]).addTo(this.map);
      this.map.setView([position.coords.latitude,position.coords.longitude],18);
    }
  }

  
  showError(error:any) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        Swal.fire({
          text: this.translateService.translate('notPermissionToLocationService'),
          icon:"error"
        }) 
        break;
      case error.POSITION_UNAVAILABLE:
        Swal.fire({
          text:this.translateService.translate('notFound'),
          icon:"error"
        }) 
        break;
      case error.TIMEOUT:
        Swal.fire({
          text:this.translateService.translate('notFoundTryAgain'),
          icon:"error"
        }) 
        break;
      case error.UNKNOWN_ERROR:
        Swal.fire({
          text:this.translateService.translate('errorOccurredTryAgain'),
          icon:"error"
        }) 
        break;
    }
  }
}
