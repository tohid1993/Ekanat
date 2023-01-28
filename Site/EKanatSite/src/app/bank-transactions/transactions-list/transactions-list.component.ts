import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/shared/services/general.service';
import {TranslateService} from "../../shared/services/traslate.service";
import {DateTimeService} from "../../shared/services/dateTime.service";

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {

  TransactionsList:any[] = [];

  constructor(
    private gService:GeneralService,
    public translateService:TranslateService,
    public dateTime:DateTimeService
  ){}

  ngOnInit(): void {
    this.gService.get("v1/BankTransactions/GetPagingList",{_page:1,_limit:100})
      .subscribe({
        next:(res:any)=>{
          if(res.isSuccess){
            this.TransactionsList = res.data.data
          }
        }
      })
  }


}
