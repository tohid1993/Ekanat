import { Injectable } from '@angular/core';
import { FieldsListVM } from '../models/model';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(
    private gService:GeneralService
  ) { }

  latLng2point(latlng:number[]) {
    return {
        x:(latlng[0]+180)*(256/360),
        y:(256/2)-(256*Math.log(Math.tan((Math.PI/4)
                +((latlng[1]*Math.PI/180)/2)))/(2*Math.PI))
    };
  }

  poly_gm2svg(cords:any[]) {

    var point,
        svgPath = [],
        svgPaths = [],
            minX = 256,
            minY = 256,
            maxX = 0,
            maxY = 0;

        for (var p = 0; p < cords.length; ++p) {
            point = this.latLng2point(cords[p]);
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
            svgPath.push([point.x, point.y].join(','));
        }

        svgPaths.push(svgPath.join(' '))

    return {
        path: 'M' + svgPaths.join('z M') + 'z',
        x: minX,
        y: minY,
        mx: maxX,
        my: maxY,
        width: maxX - minX,
        height: maxY - minY
    };

  }

  drawPoly(cords:any[]) {
    var props = this.poly_gm2svg(cords);

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        g = document.createElementNS("http://www.w3.org/2000/svg", 'g'),
        path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        
    path.setAttribute('d', props.path);
    g.appendChild(path);
    svg.appendChild(g);
    svg.setAttribute('viewBox', [props.x, props.y, props.width, props.height].join(' '));

    var s = new XMLSerializer();
    var str = s.serializeToString(svg);    
    return str;
  }

  centerOfField(cords:any[]){
    var x = cords.map (function (a){ return a[0] });
    var y = cords.map (function (a){ return a[1] });
    var minX = Math.min.apply (null, x);
    var maxX = Math.max.apply (null, x);
    var minY = Math.min.apply (null, y);
    var maxY = Math.max.apply (null, y);
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  }

  saveField(data:any){
    return this.gService.post("v1/Fields/Add",data,{})
  }

  getFieldsList(){
    return this.gService.get("v1/Fields/GetList",{});
  }

  getFieldDetails(fieldId:number){
    return this.gService.get("v1/Fields/GetDetail",{id:fieldId});
  }

  getFieldWeather(lat:number,lng:number,fieldId:number){
    return this.gService.get("v1/Fields/GetWeather",{latitude:lat,longitude:lng,fieldId:fieldId})
  }


  getFieldProductionslist(){
    return this.gService.get("v1/FieldProducts/GetFieldProdutDropdown",{})
  }

  getFieldPhenologiesList(fieldId:number){
    return this.gService.get("v1/Phenologies/GetList",{fieldId})
  }

  deleteField(fieldId:number){
    return this.gService.delete({fieldId:fieldId},"v1/Fields/Delete")
  }

  getConsultationSubjects(){
      return this.gService.get("v1/Consultation/GetSubjectDropdown",{});
  }

    setConsultation(data:any){
        return this.gService.post("v1/Consultation/Add",data,{});
    }
}

