import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-analyze-weather',
  templateUrl: './analyze-weather.component.html',
  styleUrls: ['./analyze-weather.component.scss']
})
export class AnalyzeWeatherComponent implements OnInit {
    options: EChartsOption = {};
    options1: EChartsOption = {};
    constructor() { }
  
    ngOnInit(): void {
      const xAxisData = [];
      const data1 = [];
      const data2 = [];
      const data3 = [];
  
      for (let i = 0; i < 365; i++) {
        xAxisData.push('روز' + i);
        data1.push(Math.round((Math.random() + Number.EPSILON) * 100) / 100);
        data2.push(Math.round((Math.random() + Number.EPSILON) * 100) / 100);
        data3.push(Math.round((Math.random() + Number.EPSILON) * 100) / 100);
      }
  
      this.options = {
        legend: {
          data: ['بارندگی'],
          align: 'left',

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
          data: xAxisData,
          silent: false,
          splitLine: {
            show: true,
          },
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: data1,
            
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
          }
        },
        legend: {
          data: ['کمترین دما','بیشترین دما']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
            stack: 'counts',
            areaStyle: {  },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'بیشترین دما',
            type: 'line',
            stack: 'counts',
            areaStyle: {  },
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      };
    }
}
