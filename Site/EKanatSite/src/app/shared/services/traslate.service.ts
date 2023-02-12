import {Injectable} from '@angular/core';
import {mainLocale} from "../locale/mainLocale";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class TranslateService {
    locate:string = ''
    calendarType:string = 'Shamsi'  // 1 Shamsi   2 Georgian
    calendarDir:string = 'rtl'
    siteDir:string = 'rtl'
    data:BehaviorSubject<any> = new BehaviorSubject<any>({});

    init(lang: string) {
        localStorage.setItem('siteLang',lang)
        this.locate = lang

        document.body.classList.remove('latin')

        let localeData = {}
        switch (lang) {
            case 'faIR':
                this.calendarType = 'Shamsi'
                this.calendarDir = 'rtl'
                this.siteDir = 'rtl'
                localeData = mainLocale.faIR
                break;

            case 'enUS':
                this.calendarType = 'Georgian'
                this.calendarDir = 'ltr'
                this.siteDir = 'ltr'
                localeData = mainLocale.enUS
                document.body.classList.add('latin')
                break;
        
            default:
                localeData = mainLocale.faIR
                this.calendarType = 'Shamsi'
                this.siteDir = 'rtl'
                this.calendarDir = 'rtl'
                break;
        }

        this.data.next(localeData)
    }

    translate(key: string): string {
        let text:string = ''
        text = this.data.getValue()[key] || key
        return text
    }
}