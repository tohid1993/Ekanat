import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Leaflet from 'leaflet';
import "leaflet-draw";
// import "leaflet.gridlayer.googlemutant";
import * as GeoSearch from 'leaflet-geosearch'
import { NgxSpinnerService } from 'ngx-spinner';
import { DateModel, FieldDetailViewModel, IndicatorsTypes } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { EeService } from 'src/app/shared/services/ee.service';
import { FieldService } from 'src/app/shared/services/field.service';
import { GestureHandling } from "leaflet-gesture-handling";

@Component({
  selector: 'app-imagery',
  templateUrl: './imagery.component.html',
  styleUrls: ['./imagery.component.scss']
})
export class ImageryComponent implements OnInit , AfterViewInit {

  map: Leaflet.Map|undefined;
  drawnItems:any;

  fieldId!:number;
  fieldDetail!:FieldDetailViewModel;
  CurrentWeather:any;

  fromDate!:DateModel;
  toDate!:DateModel;

  SelectedCategory:number = 0;

  showFieldDetails:boolean = true;

  imageLayer:any;
  selectedIndicator!:IndicatorsTypes;

  IndicatorsTypes=IndicatorsTypes;

  windowWidth:number = window.innerWidth;

  Math=Math;

  showLegend:boolean = false;

  constructor(
    private eeService:EeService,
    private dateTimeService:DateTimeService,
    private spinner:NgxSpinnerService,
    private fieldService:FieldService,
    private route:ActivatedRoute
  ) {
    this.route.params.subscribe(
      params=>{
        this.fieldId = params['id'];
      }
    )
  }

  ngAfterViewInit(): void {

  }

  setHightOfImageryWrapper(){
    (document.querySelector('#imagery_wrapper>.row') as HTMLElement).style.minHeight = "calc(100vh - 144px)"
  }

  @HostListener('window:resize', ['$event'])
    onResize() {
      this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.getFieldDetails();
    this.setHightOfImageryWrapper();

    Leaflet.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
    this.map = Leaflet.map('map', {gestureHandling: true} as any).setView([38.0792, 46.2887], 10);

    this.map.scrollWheelZoom.disable();

    Leaflet.tileLayer('http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
        subdomains:['mt0','mt1','mt2','mt3'],
        maxZoom: 20,
        attribution: 'EKANAT.COM ❤️'
    }).addTo(this.map);

    this.drawnItems = Leaflet.featureGroup().addTo(this.map);

  }


  getFieldDetails(){
    this.spinner.show();
    let self = this;
    this.fieldService.getFieldDetails(this.fieldId)
      .subscribe({
        next(res:any){
          self.fieldDetail = (res.data as FieldDetailViewModel);
          self.getForecastWeather();
          self.addPolygonToMap(self.eeService.getLatLngFromXYarray(self.fieldDetail.polygon));
          self.spinner.hide();
        }
      })
  }

  getForecastWeather(){
    let self = this;

    this.spinner.show();

    let coords:any[] = [];
    this.fieldDetail.polygon.forEach((coord:any)=>{
      coords.push([coord.x,coord.y]);
    })
    let FieldLatLng = this.fieldService.centerOfField(coords)

    if(FieldLatLng)
      // lat = y , lng = x
      this.fieldService.getFieldWeather(FieldLatLng[1],FieldLatLng[0])
        .subscribe({
          next(res:any){
              self.CurrentWeather = res.data.current;
          },
          error(err){console.log(err);
          },
          complete(){
            self.spinner.hide();
          }
        })
  }


  closeFieldDetailsSide(bool:boolean|undefined=undefined){
    this.showFieldDetails = bool!=undefined? bool : !this.showFieldDetails;

    setTimeout(() => {
      if(this.map)
        this.map.invalidateSize()
    }, 100);

  }

  getIndicators(key:IndicatorsTypes){
    this.beforeIndicatorProcess();
    this.spinner.show();

    let fromDate = this.dateTimeService.toGeorgianDate(this.dateTimeService.modelToString(this.fromDate));
    let toDate = this.dateTimeService.toGeorgianDate(this.dateTimeService.modelToString(this.toDate));

    let self = this;

    this.eeService.getIndicators(this.fieldDetail.id,key,fromDate,toDate).subscribe({
      next(res:any){
        self.showLegend = true;
        self.addImageToMap("data:image/png;base64,"+res.data,self.eeService.getLatLngFromXYarray(self.fieldDetail.polygon));
        self.spinner.hide();
      }
    })

    this.selectedIndicator = key;
  }


  // عملیات های قبل از درخواست شاخص ها
  beforeIndicatorProcess(){
    let toDate = new Date(new Date().setDate(new Date().getDate()));
    let fromDate = new Date(new Date().setMonth(toDate.getMonth() - 1));


    if(!this.toDate){
      let persianDate = this.dateTimeService.toJalaliDateTimeCustomFormat(toDate.toLocaleString(),"M/D/YYYY HH:mm:ss" , "YYYY-MM-DD");
      this.toDate = this.dateTimeService.getDateModel(persianDate,'-')
    }
    if(!this.fromDate){
      let persianDate = this.dateTimeService.toJalaliDateTimeCustomFormat(fromDate.toLocaleString(),"M/D/YYYY HH:mm:ss" , "YYYY-MM-DD");
      this.fromDate = this.dateTimeService.getDateModel(persianDate,'-')
    }


    if (this.map && this.imageLayer && this.map.hasLayer(this.imageLayer)) {
      this.map.removeLayer(this.imageLayer);
    }

    this.closeFieldDetailsSide(false);
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
          coordinates
        ]
      }

      let geoJSON = Leaflet.geoJSON(status).addTo(this.drawnItems);
      this.map.fitBounds(geoJSON.getBounds());
    }
  }


  // اضافه کردن تصویر شاخص به نقشه
  addImageToMap(imageUrl:string,cords:any[]){

    this.loadEECanvas(imageUrl);
    if(this.colors.length==0)
      this.loadLegend('./assets/images/legend.jpg');

    let imageBounds:any[] = this.getImageBounds(cords);


    if(this.map){
      let obj = Leaflet.imageOverlay(imageUrl, imageBounds , {className:'addedImage',interactive:true}).addTo(this.map)
        .on('mousemove',(e)=>{
          if(this.map){

            var pixelStart = this.map.latLngToLayerPoint(obj.getBounds().getNorthEast());
            var pixelEnd = this.map.latLngToLayerPoint(obj.getBounds().getSouthWest());

            var startOfImage = [pixelEnd.x,pixelStart.y];
            var position = this.map.latLngToLayerPoint(e.latlng);


            var imgWidth = (e as any).originalEvent.target.naturalWidth;
            var imgHeight = (e as any).originalEvent.target.naturalHeight;


            var layerWidth = pixelStart.x - pixelEnd.x;
            var layerHeight = pixelEnd.y - pixelStart.y;

            var px = position.x-startOfImage[0];
            var py = position.y-startOfImage[1];

            var x = Math.round(imgWidth*px/layerWidth);
            var y = Math.round(imgHeight*py/layerHeight);

            let value = this.getValueOfPoint(x,y);

            value = value==undefined? -2:value;

            var mx = e.originalEvent.clientX,
            my = e.originalEvent.clientY;

            document.getElementById('tooltip_value')!!.style.top = (my - 45) + 'px';
            document.getElementById('tooltip_value')!!.style.left = (mx) + 'px';

            if(value>=-1 && value<=1){
              document.getElementById('tooltip_value')!!.innerText = value.toString();
              document.getElementById('tooltip_value')!!.style.display = "block";
            }else{
              document.getElementById('tooltip_value')!!.style.display = "none";
            }
          }
      }).on("mouseout",(e)=>{
        document.getElementById('tooltip_value')!!.style.display = "none";
      });

      this.imageLayer = obj;
      this.map.fitBounds(obj.getBounds());
    }
  }

  getImageBounds(cords:any[]):any{

    let minX = cords[0][0];
    let minY = cords[0][1];
    let maxX = cords[0][0];
    let maxY = cords[0][1];

    cords.forEach(cord => {
      if(minX>cord[0]) minX = cord[0];
      if(minY>cord[1]) minY = cord[1];
      if(maxX<cord[0]) maxX = cord[0];
      if(maxY<cord[1]) maxY = cord[1];
    });

    return [[minY,minX],[maxY,maxX]];
  }

  context:any;
  context2:any;
  colors:any[] = [];

  // بارگیری تصویر شاخص
  loadEECanvas(imgUrl:string){
    const eeImg = new Image();
    eeImg.crossOrigin = "Anonymous";

    eeImg.onload = () => {
        let imgWidth = eeImg.width;
        let imgHeight = eeImg.height;

        this.context = document.createElement('canvas');
        this.context.setAttribute('width',imgWidth);
        this.context.setAttribute('height',imgHeight);

        this.context = this.context.getContext('2d');

        this.context.drawImage(eeImg, 0, 0, imgWidth , imgHeight ,0 ,0 , imgWidth , imgHeight);
    }
    eeImg.src = imgUrl;
  }

  // بارگیری راهنما
  loadLegend(imgUrl:string){
    const legendImg = new Image();
    legendImg.crossOrigin = "Anonymous";

    this.colors = [];
    
    legendImg.onload = () => {
        let imgWidth = legendImg.width;
        let imgHeight = legendImg.height;

        this.context2 = document.createElement('canvas');
        this.context2.setAttribute('width',imgWidth);
        this.context2.setAttribute('height',imgHeight);

        this.context2 = this.context2.getContext('2d');
        this.context2.drawImage(legendImg, 0, 0, imgWidth , imgHeight ,0 ,0 , imgWidth , imgHeight);


        for(var i = 0; i< imgHeight ;i++){
            var col = this.getRGBA(5,i,'legend');
            this.colors.push(col);
        }
    }
    legendImg.src = imgUrl;
  }


  // گرفتن مقدار شاخص
  getValueOfPoint(x:number,y:number){
    try {
      let color = this.getRGBA(x,y,'ee');
      let index = this.colors.findIndex(c=>(c[0]==color[0] && c[1]==color[1] && c[2]==color[2] && c[3]==color[3]));
      let finalValueOfPoint = undefined;

      if(index>=0){
          let value = ((this.colors.length/2)-index)/(this.colors.length/2);
          let mode = value*100%5
          let finalValue = (mode>3)? ((value*100)+(5-mode))/100 : ((value*100)-mode)/100;

          finalValueOfPoint = finalValue;
      }else{
          let flag = false;
          for(let index = 0 ; index<this.colors.length ; index++) {
              if(this.isNeighborColor(this.colors[index],color,10)){

                  let value = ((this.colors.length/2)-index)/(this.colors.length/2);
                  let mode = value*100%5
                  let finalValue = (mode>3)? ((value*100)+(5-mode))/100 : ((value*100)-mode)/100;

                  finalValueOfPoint = finalValue;

                  flag = true;
                  break;
              }
          }

          if(!flag){
              finalValueOfPoint = undefined;
          }
      }

      return finalValueOfPoint;
    } catch (error) {
      return -2;
    }
  }


  // گرفتن رنگ یک نقطه
  getRGBA(x:number,y:number,img:string):any{
    try {
      const {data} = img=='legend'? this.context2.getImageData(x,y, 1, 1) : this.context.getImageData(x,y, 1, 1);;
      var color = Array.from(data);
      return color;
    } catch (error) {

    }
  }


  // تشخیص نزدیکترین رنگ
  isNeighborColor(color1:number[], color2:number[], tolerance:number) {
    if(tolerance == undefined) {
        tolerance = 32;
    }

    return Math.abs(color1[0] - color2[0]) <= tolerance
        && Math.abs(color1[1] - color2[1]) <= tolerance
        && Math.abs(color1[2] - color2[2]) <= tolerance;
  }



}
