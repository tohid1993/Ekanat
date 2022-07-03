import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { GeneralService } from 'src/app/service/general.service';

@Component({
  selector: 'app-analyze-weather',
  templateUrl: './analyze-weather.component.html',
  styleUrls: ['./analyze-weather.component.scss']
})
export class AnalyzeWeatherComponent implements OnInit {
    options: EChartsOption = {};
    options1: EChartsOption = {};
    constructor(
      private gService:GeneralService
    ) { }
  
    ngOnInit(): void {
      this.getPastWeather();
    }

    getPastWeather(){
      let self = this;

      this.gService.postObservable<any>("weather",{},{},true)
      .subscribe({
        next(res:any){
          self.generateCharts(res);
          
        },
        error(err){console.log(err);
        },
        complete(){}
      })
        
    }

    generateCharts(res:any){
      const prLabel:string[] = [];
      const prValue:number[] = [];


      const tLabel:string[] = [];
      const tMinValue:number[] = [];
      const tMaxValue:number[] = [];

      res.pr.forEach((item:any) => {
        prLabel.push(item[0]);
        prValue.push(Math.round((item[1] + Number.EPSILON) * 100) / 100);
      });


      res.tMax.forEach((item:any) => {
        tLabel.push(item[0]);
        tMaxValue.push(Math.round((item[1] + Number.EPSILON) * 100) / 100);
      });

      res.tMin.forEach((item:any) => {
        tMinValue.push(Math.round((item[1] + Number.EPSILON) * 100) / 100);
      });
  
      this.options = {
        legend: {
          data: ['بارندگی'],
          align: 'left',

        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
          top:'0%',
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

            formatter: "<span class='Primary_80_text bu_2_text'>{b}:</span> &nbsp;&nbsp;{c} میلی متر",
            textStyle:{
                fontFamily:'Vazir',
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          // <span class='Primary_80_text bu_2_text'>{b}:</span> &nbsp;&nbsp;{c} میلی متر
          formatter: "<strong>{b}</strong><br>{a1}: {c1}<br>{a0}: {c0}",
          textStyle:{
              fontFamily:'Vazir',
              align:'right',
              
          }
        },
        legend: {
          data: ['کمترین دما','بیشترین دما']
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
          top:'0%',
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
            name: 'کمترین دما',
            type: 'line',
            areaStyle: { opacity:0 },
            data: tMinValue
          },
          {
            name: 'بیشترین دما',
            type: 'line',
            stack: 'counts',
            areaStyle: { opacity:0 },
            data: tMaxValue
          }
        ]
      };
    }
}
