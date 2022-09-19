import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FieldDetailViewModel, FieldsListVM } from 'src/app/shared/models/model';
import { FieldService } from 'src/app/shared/services/field.service';

@Component({
  selector: 'app-package-invoice',
  templateUrl: './package-invoice.component.html',
  styleUrls: ['./package-invoice.component.scss']
})
export class PackageInvoiceComponent implements OnInit {
  
  @ViewChild('fieldsModal' , {static:true}) fieldsModal:ElementRef|undefined;
  SelectedField:FieldDetailViewModel|undefined;
  isChanged:boolean = false;
  FieldsList:FieldsListVM[] = [];

  
  constructor(
    config: NgbModalConfig, 
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private fieldService:FieldService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getFields();
  }

  openFieldsModal() {
    this.modalService.open(this.fieldsModal , { centered: true , size: 'xl'  });
  }

  choaseFieldModal(field:any){
    this.isChanged = true;
    this.spinner.show();
    this.fieldService.getFieldDetails(field.id)
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess){
            this.SelectedField = res.data;
            this.modalService.dismissAll();
            this.spinner.hide();
          }
        }
      })
    
  }


  getFields(){
    this.spinner.show();
    this.fieldService.getFieldsList()
      .subscribe({
        next:(res:any)=>{
          this.FieldsList = res.data;
          this.openFieldsModal();  
          this.spinner.hide();
        }
      })
  }

  goToAddNewField(){
    this.modalService.dismissAll();
    this.router.navigate(['/fields/add'])
  }

}
