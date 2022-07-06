export class DateModel{
    year:number;
    month:number;
    day:number;
    
    constructor(){
        this.year = 0;
        this.month = 0;
        this.day = 0;
    }

}


export class FileViewModel{
    fileName:string |undefined;
    size:number |undefined;
    fileTypeName:string |undefined;
    base64File:string |undefined;
    sizeUnitTypeId:number |undefined;
}