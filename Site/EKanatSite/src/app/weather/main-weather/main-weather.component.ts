import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FieldsListVM } from 'src/app/shared/models/model';
import { FieldService } from 'src/app/shared/services/field.service';

@Component({
  selector: 'app-main-weather',
  templateUrl: './main-weather.component.html',
  styleUrls: ['./main-weather.component.scss']
})
export class MainWeatherComponent implements OnInit {

  @ViewChild('fieldsModal' , {static:true}) fieldsModal:ElementRef|undefined;

  SelectedField:FieldsListVM|undefined;
  FieldLatLng:number[]|undefined;

  isChanged:boolean = false;

  CurrentWeather:any|undefined;
  NextHoursWeather:any|undefined;
  NextDaysWeather:any|undefined;

  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private fieldService:FieldService,
    private http:HttpClient,
    private spinner: NgxSpinnerService,
  ) {
    // config.backdrop = 'static';
    config.keyboard = false;
  }


  FieldsList:FieldsListVM[] = [];

  ngOnInit(): void {
    this.getFields();
  }

  getForecastWeather(){
    let self = this;

    this.spinner.show();

    if(this.FieldLatLng)
      // lat = y , lng = x
      this.fieldService.getFieldWeather(this.FieldLatLng[1],this.FieldLatLng[0])
        .subscribe({
          next(res:any){
              self.CurrentWeather = res.data.current;
              self.NextHoursWeather = res.data.hourly;
              self.NextDaysWeather = res.data.daily;
          },
          error(err){console.log(err);
          },
          complete(){
            self.spinner.hide();
          }
        })
  }

  openFieldsModal() {
    this.modalService.open(this.fieldsModal , { centered: true , size: 'xl'  });
  }

  choaseFieldModal(field:any){
    this.isChanged = false;

    setTimeout(() => {
      this.SelectedField = field;

      let coords:any[] = [];
      this.SelectedField?.polygon.forEach((coord:any)=>{
        coords.push([coord.x,coord.y]);
      })
      this.FieldLatLng = this.fieldService.centerOfField(coords);

      this.getForecastWeather();
      this.isChanged = true;
      this.modalService.dismissAll();

    }, 10);

  }

  getFields(){
    let self = this;
    this.spinner.show();
    this.fieldService.getFieldsList()
      .subscribe({
        next(res:any){
          self.FieldsList = res.data;
          self.openFieldsModal();
          self.spinner.hide();
        }
      })
  }
}
