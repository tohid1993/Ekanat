import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-field-svg',
  templateUrl: './field-svg.component.svg',
  styleUrls: ['./field-svg.component.scss']
})
export class FieldSvgComponent implements OnInit {

  @Input("cordinates") cordinates:any[] = [];

  dAttr:any;
  viewBox:any;

  constructor() { }

  ngOnInit(): void {
    this.drawPoly(this.cordinates);
  }

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

    this.dAttr = props.path;
    this.viewBox = [props.x, props.y, props.width, props.height].join(' ');

    // var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    //     g = document.createElementNS("http://www.w3.org/2000/svg", 'g'),
    //     path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        
    // path.setAttribute('d', props.path);
    // g.appendChild(path);
    // svg.appendChild(g);
    // svg.setAttribute('viewBox', [props.x, props.y, props.width, props.height].join(' '));

    // var s = new XMLSerializer();
    // var str = s.serializeToString(svg);
    // console.log(str);
    
    // return str;
  }
}
