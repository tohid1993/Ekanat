import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateTimeService } from 'src/app/shared/services/dateTime.service';
import { EeService } from 'src/app/shared/services/ee.service';
import { GeneralService } from 'src/app/shared/services/general.service';
import Swal from 'sweetalert2';
import {TranslateService} from "../../shared/services/traslate.service";


@Component({
  selector: 'app-analyze-weather',
  templateUrl: './analyze-weather.component.html',
  styleUrls: ['./analyze-weather.component.scss']
})
export class AnalyzeWeatherComponent implements OnInit {
    @Input("FieldLatLng") FieldLatLng:number[]|undefined;
    @Input("FieldId") FieldId:number|undefined;
    @Input("hasPackage") hasPackage:boolean = false;

    options: EChartsOption = {};
    options1: EChartsOption = {};

    showCharts:boolean = false;

    translateUnsub:any

    constructor(
      private gService:GeneralService,
      private eeService:EeService,
      private dateTimeService:DateTimeService,
      private spinner: NgxSpinnerService,
      private router:Router,
      private translateService:TranslateService
    ) { }
  
    ngOnInit(): void {
      if(this.hasPackage)
        this.getPastWeather();
    }

    ngOnDestroy(): void {

    }

    getPastWeather(){
      let self = this;
      this.spinner.show();

      let toDate = new Date(new Date().setDate(new Date().getDate()));
      let fromDate = new Date(new Date().setMonth(toDate.getMonth() - 1));

      if(this.FieldLatLng)
        this.eeService.getPastWeather(
          this.FieldLatLng[0],
          this.FieldLatLng[1],
          fromDate.toISOString().split('T')[0],
          toDate.toISOString().split('T')[0],
          this.FieldId||0
        )
        .subscribe({
          next(res:any){
            self.generateCharts(res.data);
            self.showCharts = true;
          },
          error(err){console.log(err);
          },
          complete(){
            self.spinner.hide();
          }
        })
        
    }

    generateCharts(res:any){
      const prLabel:string[] = [];
      const prValue:number[] = [];


      const tLabel:string[] = [];
      const tMinValue:number[] = [];
      const tMaxValue:number[] = [];

      res.pr.forEach((item:any) => {
        prLabel.push(this.translateService.calendarType === 'Shamsi'? this.dateTimeService.toJalaliDate(item[0]) : item[0]);
        prValue.push(Math.round((item[1] + Number.EPSILON) * 100) / 100);
      });


      res.tMax.forEach((item:any) => {
        tLabel.push(this.translateService.calendarType === 'Shamsi'? this.dateTimeService.toJalaliDate(item[0]) : item[0]);
        tMaxValue.push(Math.round((item[1] + Number.EPSILON) * 100) / 100);
      });

      res.tMin.forEach((item:any) => {
        tMinValue.push(Math.round((item[1] + Number.EPSILON) * 100) / 100);
      });
  
      this.options = {
        textStyle:{
          fontFamily: this.translateService.siteDir==='rtl'?'Vazir':'sofia',
        },
        legend: {
          data: [this.translateService.translate('rainfall')],
          align: 'left',

        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
          top:'2%',
          containLabel: true
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985',
              }
            },

            formatter: "<span class='Primary_80_text bu_2_text'>{b}:</span> &nbsp;&nbsp;{c} " + this.translateService.translate('millimeter'),
            textStyle:{
                fontFamily: this.translateService.siteDir==='rtl'?'Vazir':'sofia',
                align:'right',
            }
                
        },
        xAxis: {
          data: prLabel,
          silent: false,
          splitLine: {
            show: true,
          },
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: prValue,
            
            itemStyle: {color: '#15957d'},
            animationDelay: (idx:any) => idx * 10,
          }
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: (idx:any) => idx * 5,
      };


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
          data: [this.translateService.translate('lowTemporary') , this.translateService.translate('highTemporary')],
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
            name: this.translateService.translate('lowTemporary'),
            type: 'line',
            areaStyle: { opacity:0 },
            data: tMinValue
          },
          {
            name: this.translateService.translate('highTemporary'),
            type: 'line',
            stack: 'counts',
            areaStyle: { opacity:0 },
            data: tMaxValue
          }
        ]
      };
    }


    showPackageAlert(){
      if(!this.hasPackage){
        Swal.fire({
          text:this.translateService.translate('needPackageMessage'),
          icon:"warning",
          cancelButtonText:this.translateService.translate('dismissLabel'),
          confirmButtonText:this.translateService.translate('buyPlane'),
          showCancelButton:true
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/package/invoice'],{queryParams:{fieldId:this.FieldId}});
          }
        })
      }
    }
}
