
import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgbDatepicker, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TasksComponent {


  @ViewChild(NgbDatepicker, {static: true}) datepicker!: NgbDatepicker;

  constructor(public i18n: NgbDatepickerI18n) {}

  navigate(number: number) {
    const {state, calendar} = this.datepicker;
    this.datepicker.navigateTo(calendar.getNext(state.firstDate, 'm', number));
  }

  today() {
    const {calendar} = this.datepicker;
    this.datepicker.navigateTo(calendar.getToday());
  }
}