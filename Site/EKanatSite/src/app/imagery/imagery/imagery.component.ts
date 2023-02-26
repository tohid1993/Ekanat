import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Leaflet from 'leaflet';
import "leaflet-draw";
// import "leaflet.gridlayer.googlemutant";
import * as GeoSearch from 'leaflet-geosearch'
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalysViewModel, ChartsTypes, DateModel, FieldDetailViewModel, IndicatorsTypes } from 'src/app/shared/models/model';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { EeService } from 'src/app/shared/services/ee.service';
import { FieldService } from 'src/app/shared/services/field.service';
import { GestureHandling } from "leaflet-gesture-handling";
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/shared/services/general.service';
import { NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { EChartsOption } from 'echarts';
import {TranslateService} from "../../shared/services/traslate.service";
import { liveQuery } from 'dexie';
import { db } from '../../../db/indexedDB';


@Component({
  selector: 'app-imagery',
  templateUrl: './imagery.component.html',
  styleUrls: ['./imagery.component.scss']
})
export class ImageryComponent implements OnInit , AfterViewInit {
  @ViewChild('TaskDetailModal' , {static:true}) TaskDetailModal:ElementRef|undefined;
  @ViewChild('AnalyzDetailModal' , {static:true}) AnalyzDetailModal:ElementRef|undefined;
  @ViewChild('ChartModal' , {static:true}) ChartModal:ElementRef|undefined;

  

  map: Leaflet.Map|undefined;
  drawnItems:any;

  fieldId!:number;
  fieldDetail!:FieldDetailViewModel;
  CurrentWeather:any;

  fromDate!:DateModel;
  toDate!:DateModel;

  SelectedCategory:number = 0;
  SelectedChartCategory:number = 0;

  showFieldDetails:boolean = true;

  imageLayer:any;
  selectedIndicator!:IndicatorsTypes;

  IndicatorsTypes=IndicatorsTypes;
  ChartsTypes = ChartsTypes;

  windowWidth:number = window.innerWidth;

  Math=Math;

  showLegend:boolean = false;

  indicatorDetails:any;

  colsHeight = "500px";

  transparency:number = 100;

  hasPackage:boolean = false;

  options1: EChartsOption = {};

  showCharts:boolean = false;

  fieldIndexedDBId:number | undefined

  constructor(
    private eeService:EeService,
    public dateTimeService:DateTimeService,
    private spinner:NgxSpinnerService,
    private fieldService:FieldService,
    private route:ActivatedRoute,
    private toastr:ToastrService,
    private gService:GeneralService,
    private modalService: NgbModal,
    private router:Router,
    public translateService:TranslateService
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
    (document.querySelector('#imagery_wrapper>.row') as HTMLElement).style.minHeight = "calc(100vh - 184px)";

    this.colsHeight = "calc(100vh - 200px)";
  }

  @HostListener('window:resize', ['$event'])
    onResize() {
      this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {


    this.getFieldDetails();
    this.GetAnalyzList();
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
          self.hasPackage = self.fieldDetail.hasPackage
          self.getForecastWeather();
          self.addPolygonToMap(self.eeService.getLatLngFromXYarray(self.fieldDetail.polygon));
          self.spinner.hide();

          self.checkAndGetFieldDBId().finally()
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
      this.fieldService.getFieldWeather(FieldLatLng[1],FieldLatLng[0],this.fieldDetail.id)
        .subscribe({
          next(res:any){
              self.CurrentWeather = res.data.current;

              try {
                let CurrentDateTime =
                self.dateTimeService.toJalaliDateTimeCustomFormat(
                  self.dateTimeService.timeStampToDateTime(self.CurrentWeather.dt*1000) ,
                  "M/D/YYYY HH:mm:ss" ,
                  "YYYY-MM-DD"
                );

                self.getSubmitedTasksList(CurrentDateTime)
              } catch (error) {}
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


/**
 * recive indicator image
 * @param key indicator type
 * @param imageIndex image index
 */
  async getIndicators(key:IndicatorsTypes,imageIndex:number=-1,date:string = ''){
    if(!this.hasPackage && key != IndicatorsTypes.ndvi){
      this.showPackageAlert()
      return
    }
    if(!key) return;
    this.beforeIndicatorProcess();

    // let fromDate = this.dateTimeService.modelToString(this.fromDate)
    // let toDate = this.dateTimeService.modelToString(this.toDate)

    let fromDate = this.translateService.calendarType==='Shamsi'?
        this.dateTimeService.toGeorgianDate(this.dateTimeService.modelToString(this.fromDate)):
        this.dateTimeService.modelToString(this.fromDate)

    let toDate = this.translateService.calendarType==='Shamsi'?
        this.dateTimeService.toGeorgianDate(this.dateTimeService.modelToString(this.toDate)):
        this.dateTimeService.modelToString(this.toDate)

    this.spinner.show();

    // check and get saved image from indexedDB
    const image = await this.getImageFromDB(key,date)
    if(image){
      this.indicatorDetails.imageBase64 = image.imageBase64
      this.indicatorDetails.imageUrl = image.imageUrl
      this.indicatorDetails.legendRange = image.legendRange
      this.indicatorDetails.imageIndex = imageIndex

      this.addImageToMap(
          "data:image/png;base64,"+this.indicatorDetails.imageBase64,
          this.eeService.getLatLngFromXYarray(this.fieldDetail.polygon)
      );
      this.selectedIndicator = key;
      this.spinner.hide()
      return;
    }

    let self = this;

    this.eeService.getIndicators(
      this.fieldDetail.id,
      key,
      fromDate,
      toDate,
      imageIndex
    ).subscribe({
      next(res:any){
        if(res.isSuccess){
          if(res.data.imageBase64){
            self.showLegend = true;
            self.indicatorDetails = res.data;
            self.addImageToMap(
              "data:image/png;base64,"+self.indicatorDetails.imageBase64,
              self.eeService.getLatLngFromXYarray(self.fieldDetail.polygon)
            );

            self.addImageToDB(
                key ,
                res.data.dates[res.data.imageIndex],
                self.indicatorDetails.imageBase64,
                self.indicatorDetails.imageUrl,
                self.indicatorDetails.legendRange
            ).finally()
          }else{
            self.toastr.error(self.translateService.translate('noImageFoundForThisTimeFrame'));
          }

          self.spinner.hide();

          try {
            setTimeout(() => {
              (document.querySelector(".indicators_dates_wrapper .scrollable") as HTMLElement).scrollTo((self.indicatorDetails.imageIndex * 115),0)
            }, 100);
          } catch (error) {
            
          }
        }

      }
    })

    this.selectedIndicator = key;
  }


  // pre operations before request indicator
  beforeIndicatorProcess(){
    let toDate = new Date(new Date().setDate(new Date().getDate()));
    let fromDate = new Date(new Date().setMonth(toDate.getMonth() - 1));



    // let fromDate = this.translateService.calendarType==='Shamsi'?
    //     this.dateTimeService.modelToString(this.fromDate):
    //     this.dateTimeService.toGeorgianDate(this.dateTimeService.modelToString(this.fromDate))
    //
    // let toDate = this.translateService.calendarType==='Shamsi'?
    //     this.dateTimeService.modelToString(this.toDate):
    //     this.dateTimeService.toGeorgianDate(this.dateTimeService.modelToString(this.toDate));


    if(!this.toDate){
      let date = this.translateService.calendarType==='Shamsi'?
                    this.dateTimeService.toJalaliDateTimeCustomFormat(toDate.toLocaleString(),"M/D/YYYY HH:mm:ss" , "YYYY-MM-DD"):
                    this.dateTimeService.toGeorgianDateTimeCustomFormat(toDate.toLocaleString(),"M/D/YYYY HH:mm:ss" , "YYYY-MM-DD")
      this.toDate = this.dateTimeService.getDateModel(date,'-')
    }

    if(!this.fromDate){
      let date = this.translateService.calendarType==='Shamsi'?
          this.dateTimeService.toJalaliDateTimeCustomFormat(fromDate.toLocaleString(),"M/D/YYYY HH:mm:ss" , "YYYY-MM-DD"):
          this.dateTimeService.toGeorgianDateTimeCustomFormat(fromDate.toLocaleString(),"M/D/YYYY HH:mm:ss" , "YYYY-MM-DD")
      this.fromDate = this.dateTimeService.getDateModel(date,'-')
    }



    if (this.map && this.imageLayer && this.map.hasLayer(this.imageLayer)) {
      this.map.removeLayer(this.imageLayer);
    }

    this.closeFieldDetailsSide(false);
  }


  // generate polygon by geoJson
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


  // add indicator image to map
  addImageToMap(imageUrl:string,cords:any[]){

    this.loadEECanvas(imageUrl);
    if(this.colors.length==0)
      this.loadLegend('./assets/images/legend-kanat-vpm-artan1100-0106.jpg');

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


            if(value>=this.indicatorDetails.legendRange[0] && value<=this.indicatorDetails.legendRange[1]){
              
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

  // load indicator image
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

  // load legend image
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


        for(var i = imgHeight-1; i>=0 ;i--){
            var col = this.getRGBA(5,i,'legend');
            this.colors.push(col);
        }
    }
    legendImg.src = imgUrl;
  }


  // get indicator point value
  getValueOfPoint(x:number,y:number){
    try {
      let color = this.getRGBA(x,y,'ee');
      let index = this.colors.findIndex(c=>(c[0]==color[0] && c[1]==color[1] && c[2]==color[2] && c[3]==color[3]));
      let finalValueOfPoint = undefined;

      if(index>=0){
          let value = ((index/(this.colors.length-1)) * (this.indicatorDetails.legendRange[1] - this.indicatorDetails.legendRange[0])) + this.indicatorDetails.legendRange[0];
          finalValueOfPoint = value.toFixed(2); ;
      }else{
          let flag = false;
          for(let index = 0 ; index<this.colors.length ; index++) {
              if(this.isNeighborColor(this.colors[index],color,30)){
                  let value = ((index/(this.colors.length-1)) * (this.indicatorDetails.legendRange[1] - this.indicatorDetails.legendRange[0])) + this.indicatorDetails.legendRange[0];
                  finalValueOfPoint = value.toFixed(2);
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


  // take point color
  getRGBA(x:number,y:number,img:string):any{
    try {
      const {data} = img=='legend'? this.context2.getImageData(x,y, 1, 1) : this.context.getImageData(x,y, 1, 1);;
      let color = Array.from(data);
      return color;
    } catch (error) {
      console.log(error)
    }
  }


  // get neariest color
  isNeighborColor(color1:number[], color2:number[], tolerance:number) {
    if(tolerance == undefined) {
        tolerance = 32;
    }

    return Math.abs(color1[0] - color2[0]) <= tolerance
        && Math.abs(color1[1] - color2[1]) <= tolerance
        && Math.abs(color1[2] - color2[2]) <= tolerance;
  }


  SubmitedTasksList:any[] = [];
  getSubmitedTasksList(dateTime:string){
    let curentDate = this.dateTimeService.getDateModel(dateTime,'-');
    let firstDayDate = this.dateTimeService.toGeorgianDate(this.dateTimeService.modelToString(curentDate))
  
    this.gService.get("v1/Activity/GetList",{fieldId:this.fieldId , fromDate:firstDayDate})
      .subscribe(
        (res:any)=>{
          if(res.isSuccess){
            this.SubmitedTasksList = res.data;
          }
        }
      )
  }

  TaskDetail:any;
  showTaskDetails(item:any){
    this.TaskDetail = item;
    this.modalService.open(this.TaskDetailModal , { centered: true , size: 'md'  });
  }

  AnalyzList:any = [];
  GetAnalyzList(){
    this.gService.get("v1/Analysis/GetList",{fieldId:this.fieldId})
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess) this.AnalyzList = res.data;
        }
      })
  }

  AnalyzDetail:AnalysViewModel|undefined = undefined;
  ShowAnalyzDetail(analyzId:number) {
    this.gService.get("v1/Analysis/GetDetail",{id:analyzId})
    .subscribe({
      next:(res:any)=>{
        if(res.isSuccess){
          this.AnalyzDetail = res.data;
          this.modalService.open(this.AnalyzDetailModal, { fullscreen: true , scrollable: true });
        }
      }
    })
  }

  showPackageAlert(){
    if(!this.hasPackage){
      Swal.fire({
        text:this.translateService.translate('needPackageMessage'),
        icon:"warning",
        cancelButtonText: this.translateService.translate('dismissLabel'),
        confirmButtonText: this.translateService.translate('buyPlane'),
        showCancelButton:true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/package/invoice'],{queryParams:{fieldId:this.fieldId}});
        }
      })
    }
  }

  getCharts(type:ChartsTypes){
    if(!this.hasPackage){
      this.showPackageAlert()
      return
    }

    let cords = this.eeService.getLatLngFromXYarray(this.fieldDetail.polygon);
    this.spinner.show();
    this.eeService.getChart(this.fieldId, cords , 1)
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess){
            this.spinner.hide();

            this.generateCharts(res.data.data)
            this.modalService.open(this.ChartModal, { size:'xl' , scrollable: true });

          }
        }
      })
  }

  generateCharts(res:any){
    const tLabel:string[] = [];
    const minValue: number[] = [];
    const meanValue: number[] = [];
    const maxValue: number[] = [];

    res.forEach((item:any) => {
      tLabel.push(this.dateTimeService.toJalaliDate(item[0]));
      maxValue.push(item[1][0]);
      minValue.push(item[1][1]);
      meanValue.push(item[1][2]);
    });

    this.showCharts = true


    this.options1 = {
      textStyle:{
        fontFamily: this.translateService.siteDir==='rtl'?'Vazir':'sofia',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: "<strong>{b}</strong><br>{a1}: {c1}<br>{a0}: {c0}",
        textStyle:{
            fontFamily: this.translateService.siteDir==='rtl'?'Vazir':'sofia',
            align:'right',
            
        }
      },
      legend: {
        data: [this.translateService.translate('Max NDVI') , this.translateService.translate('Mean NDVI') , this.translateService.translate('Min NDVI')],
        top: '0px'
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '2%',
        top:'10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: tLabel
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: this.translateService.translate('Max NDVI'),
          type: 'line',
          areaStyle: { opacity:0 },
          data: maxValue
        },
        {
          name: this.translateService.translate('Mean NDVI'),
          type: 'line',
          areaStyle: { opacity:0 },
          data: meanValue
        },
        {
          name: this.translateService.translate('Min NDVI'),
          type: 'line',
          areaStyle: { opacity:0 },
          data: minValue
        }
      ]
    };

  }



  // چک  و بررسی اینکه آیا این فیلد به دیتا بیس اضافه شده یا نه
  async checkAndGetFieldDBId(){
    const fields = await db.fieldsList.toArray()
    const field = fields.find(f => f.fieldId === this.fieldDetail.id)
    if (field) {
      this.fieldIndexedDBId = field.id
    } else {
      this.fieldIndexedDBId = await this.addFieldToIndexDB()
    }
  }

  //  اضافه کردن فیلد به دیتا بیس و برگرداندن شناسه آن
  async addFieldToIndexDB() {
    const fieldDBId = await db.fieldsList.add({
      fieldId: this.fieldDetail.id,
      name: this.fieldDetail.name,
    });

    return fieldDBId
  }

  // اضافه کردن عکس شاخص به دیتابیس
  async addImageToDB(indicator:number , imageDate:string , imageBase64:string , imageUrl:string , legendRange:Array<Number>) {
    const image = await this.getImageFromDB(indicator,imageDate)
    if (image) return

    await db.imagesList.add({
      fieldDBId: this.fieldIndexedDBId || 0,
      indicator:indicator,
      imageDate:imageDate,
      imageBase64:imageBase64,
      imageUrl:imageUrl,
      legendRange:legendRange
    });
  }

  // بازیابی عکس از دیتابیس
  async getImageFromDB(indicator:number,imageDate:string) {
    const image = await db.imagesList
                  .where({
                    fieldDBId:this.fieldIndexedDBId,
                    indicator:indicator,
                    imageDate:imageDate
                  })
                  .first();

    if(image)
      return image
    return null
  }

  goToCompare(){
    const len = this.indicatorDetails.dates.length
    this.router.navigate(
        ['/compare/field',this.fieldId],
        {
                queryParams: {
                    type: this.selectedIndicator,
                    // dates: `${this.indicatorDetails.dates[len-1]}}`
                }
              }
        );
  }
}
