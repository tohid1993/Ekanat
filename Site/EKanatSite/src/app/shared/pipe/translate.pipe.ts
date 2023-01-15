import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from "../services/traslate.service";

@Pipe({
    name: 'translate',
    pure:false
})
export class TranslatePipe implements PipeTransform {
    constructor(private translate: TranslateService) {}
    transform(key: string): string {
        let text:string = ''
        console.log('key: ',key)
        this.translate.data.subscribe({
            next: (data) => { text = data[key] || key},
            error: ()=> { text = key },
        })
        console.log('value: ',text)

        return text
    }

}