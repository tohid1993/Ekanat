import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as Leaflet from "leaflet";
import {GestureHandling} from "leaflet-gesture-handling";
import {DateModel, FieldDetailViewModel, IndicatorsTypes} from "../../shared/models/model";
import Swal from "sweetalert2";
import {TranslateService} from "../../shared/services/traslate.service";
import {DateTimeService} from "../../shared/services/dateTime.service";
import {NgxSpinnerService} from "ngx-spinner";
import {db} from "../../../db/indexedDB";
import {EeService} from "../../shared/services/ee.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-single-imagery',
  templateUrl: './single-imagery.component.html',
  styleUrls: ['./single-imagery.component.scss']
})
export class SingleImageryComponent implements OnInit, OnChanges {

  @Input('initType') initType!:IndicatorsTypes
  @Input('initDate') initDate!:string

  @Input('mapIndex') mapIndex:number = Math.random()
  @Input('changedMapIndex') changedMapIndex:number = -1
  @Input('latLng') latLng:[string,string] = ['','']
  @Input('zoom') zoom:number = 10
  @Input('fieldDetail') fieldDetail!:FieldDetailViewModel;

  @Input('imageXY') imageXY!:[number,number,number]


  @Output() latLngChange = new EventEmitter<[[string,string],number]>();
  @Output() zoomChange = new EventEmitter<[number,number]>();
  @Output() imageXYchange = new EventEmitter<[number,number,number]>();

  transparency:number = 100;
  showLegend:boolean = false;
  indicatorDetails:any;
  map: Leaflet.Map|undefined;
  drawnItems:any;

  fromDate!:DateModel;
  toDate!:DateModel;

  fieldIndexedDBId:number | undefined


  imageLayer:any;
  selectedIndicator!:IndicatorsTypes;

  IndicatorsTypes=IndicatorsTypes;

  firstLoadingFieldDetail:boolean = true

  constructor(
      public translateService:TranslateService,
      public dateTimeService:DateTimeService,
      public spinner:NgxSpinnerService,
      public eeService:EeService,
      public toastr:ToastrService,
      public router:Router,
      public route:ActivatedRoute
  ) {

  }


  ngOnChanges() {
    if(this.map && this.changedMapIndex !== this.mapIndex){
      this.map.panTo(new Leaflet.LatLng(+this.latLng[0], +this.latLng[1]));
    }

    if(this.map && this.map.getZoom() !== this.zoom)
      this.map.setZoom(this.zoom)

    if(this.firstLoadingFieldDetail && this.fieldDetail){
      this.addPolygonToMap(this.eeService.getLatLngFromXYarray(this.fieldDetail.polygon));
      this.checkAndGetFieldDBId().finally()

      setTimeout(()=>{
        this.getIndicators(this.initType,-1,this.initDate)

        this.firstLoadingFieldDetail = false

      },100)
    }

    if(this.imageXY && this.mapIndex !== this.imageXY[2]){
      this.showTooltip(this.imageXY[0],this.imageXY[1])
    }
  }

  ngOnInit(): void {
    setTimeout(()=>{
      const mapContainer = 'map_'+this.mapIndex
      Leaflet.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
      this.map = Leaflet.map(mapContainer, {gestureHandling: true} as any).setView([38.0792, 46.2887], 10);

      this.map.scrollWheelZoom.disable();

      Leaflet.tileLayer('http://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}', {
        subdomains:['mt0','mt1','mt2','mt3'],
        maxZoom: 20,
        attribution: 'EKANAT.COM ❤'
      }).addTo(this.map);

      this.drawnItems = Leaflet.featureGroup().addTo(this.map);

      this.map.on("mousedown", (e) => {
        this.changedMapIndex = this.mapIndex
      })

      this.map.on("mouseover", (e) => {
        this.changedMapIndex = this.mapIndex
      })

      this.map.on("move", (e) => {
        if(this.mapIndex !== this.changedMapIndex || this.firstLoadingFieldDetail) return
        this.latLngChange.emit([[e.target.getCenter().lat,e.target.getCenter().lng], this.mapIndex]);
      });

      this.map.on("zoom", (e) => {
        this.zoomChange.emit([e.target.getZoom(), this.mapIndex]);
      });
    },100)
  }



  /**
   * recive indicator image
   * @param key indicator type
   * @param imageIndex image index
   */
  async getIndicators(key:IndicatorsTypes,imageIndex:number=-1,date:string = ''){
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
      this.indicatorDetails = {}
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

          // try {
          //   setTimeout(() => {
          //     (document.querySelector(".indicators_dates_wrapper .scrollable") as HTMLElement).scrollTo((self.indicatorDetails.imageIndex * 115),0)
          //   }, 100);
          // } catch (error) {
          //
          // }
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

              this.imageXYchange.emit([x,y,this.mapIndex]);


              let value = this.getValueOfPoint(x,y);

              value = value==undefined? -2:value;

              var mx = e.originalEvent.clientX,
                  my = e.originalEvent.clientY;

              document.getElementById('tooltip_value_'+this.mapIndex)!!.style.top = (my - 45) + 'px';
              document.getElementById('tooltip_value_'+this.mapIndex)!!.style.left = (mx) + 'px';


              if(value>=this.indicatorDetails.legendRange[0] && value<=this.indicatorDetails.legendRange[1]){

                document.getElementById('tooltip_value_'+this.mapIndex)!!.innerText = value.toString();
                document.getElementById('tooltip_value_'+this.mapIndex)!!.style.display = "block";
              }else{
                document.getElementById('tooltip_value_'+this.mapIndex)!!.style.display = "none";
              }
            }
          }).on("mouseout",(e)=>{
            document.getElementById('tooltip_value_'+this.mapIndex)!!.style.display = "none";
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


  showTooltip(x:number,y:number){
    let value = this.getValueOfPoint(x,y);
    console.log(value)
  }
}
