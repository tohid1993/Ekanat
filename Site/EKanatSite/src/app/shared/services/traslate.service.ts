import {Injectable} from '@angular/core';
import {mainLocale} from "../locale/mainLocale";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class TranslateService {
    data:BehaviorSubject<any> = new BehaviorSubject<any>({});

    init(lang: string) {
        localStorage.setItem('siteLang',lang)

        let localeData = {}
        switch (lang) {
            case 'faIR':
                localeData = mainLocale.faIR
                break;

            case 'enUS':
                localeData = mainLocale.enUS
                break;
        
            default:
                localeData = mainLocale.faIR
                break;
        }

        this.data.next(localeData)
    }
}