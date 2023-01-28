import { Observable } from 'rxjs';

export abstract class BaseService {

    constructor() { }

    protected handleError(error: any) {
        const er = JSON.parse(error.text());
        return Observable.throw(er.message || 'خطایی رخ داده است.');

    }
}
