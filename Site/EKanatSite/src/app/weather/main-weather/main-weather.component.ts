import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FieldService } from 'src/app/shared/services/field.service';

@Component({
  selector: 'app-main-weather',
  templateUrl: './main-weather.component.html',
  styleUrls: ['./main-weather.component.scss']
})
export class MainWeatherComponent implements OnInit {

  @ViewChild('fieldsModal' , {static:true}) fieldsModal:ElementRef|undefined;

  SelectedField:any|undefined;
  FieldLatLng:number[]|undefined;

  isChanged:boolean = false;

  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private fieldService:FieldService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  FieldsList= [
    {
      title:"باغ لوبیای سفلی محله",
      product:"لوبیا",
      area: 3,
      cordinates:[
        [46.14843202917636, 38.19944149951229],
          [46.14715529768527, 38.198446588170334],
          [46.14851785986484, 38.19713126078444],
          [46.14904357283176, 38.19756970588637],
          [46.14950491278232, 38.19727459889669],
          [46.14872170774997, 38.196642222748594],
          [46.1490328439957, 38.19653261032447],
          [46.149365437913545, 38.19665065446668],
          [46.14991260855258, 38.19658320069457],
          [46.15032030432285, 38.19676869841756],
          [46.15045977919162, 38.196979490710994],
          [46.15065289824069, 38.19720714570255],
          [46.151371730256685, 38.1974010734673],
          [46.151586306977876, 38.19811775855135],
          [46.15026666014255, 38.198455019679535],
          [46.1494298109299, 38.19874169041023]
      ]
    },
    {
      title:"مزرعه کلزا ینگنجه",
      product:"کلزا",
      area: 10,
      cordinates:[
        [46.111152104515746, 38.173733033224856],
        [46.11088388361426, 38.173235403661735],
        [46.11151688494177, 38.17302454265244],
        [46.111924580712035, 38.173243838089434],
        [46.112278632302, 38.173463132866544],
        [46.112192801613524, 38.17365712385011],
        [46.11208551325293, 38.173733033224856],
        [46.112278632302, 38.173960760874714],
        [46.112396649498656, 38.1739438921843],
        [46.11261122621985, 38.174180053494595],
        [46.11262195505591, 38.17444995119785],
        [46.11287944712134, 38.17467767660748],
        [46.11258976854773, 38.17479575616937],
        [46.11308329500647, 38.17499817783032],
        [46.11271851458044, 38.175428321993024],
        [46.11235373415442, 38.1752090331293],
        [46.11202114023657, 38.17519216472781],
        [46.111710003990844, 38.17509095423703],
        [46.11122720636816, 38.17529337507806],
        [46.11107700266333, 38.1752090331293],
        [46.11051910318823, 38.17515842791318],
        [46.11030452646704, 38.17504034893893],
        [46.110454730171874, 38.174930704005824],
        [46.11025088228674, 38.174542728302484],
        [46.11037962831946, 38.17439091116067],
        [46.110894612450316, 38.17407040726713],
        [46.11130230822058, 38.1739944982438],
        [46.11138813890906, 38.173808942520544],
        [46.111431054253295, 38.17371616448175]
      ]
    }
  ];

  FieldsShape:any[] = [];

  ngOnInit(): void {
    this.FieldsList.forEach((field,index) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(this.fieldService.drawPoly(field.cordinates),"image/svg+xml");
      this.FieldsShape[index] = doc;
    });

    this.openFieldsModal();
  }


  openFieldsModal() {
    this.modalService.open(this.fieldsModal , { centered: true , size: 'xl'  });
  }

  choaseFieldModal(field:any){
    this.isChanged = false;

    setTimeout(() => {
      this.SelectedField = field;
      this.FieldLatLng = this.fieldService.centerOfField(this.SelectedField.cordinates);
      this.isChanged = true;
      this.modalService.dismissAll();

    }, 10);

  }
}
