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
    size_Byte:number |undefined;
    fileTypeName:string |undefined;
    base64File:string |undefined;
    sizeUnitTypeId:number |undefined;
}

export class UserHomeInfoVM{
    fullName: string|undefined;
    image: string|undefined;
    profileCompeleted: boolean|undefined;
}

export class UserProfileVM{
    userId!: number;
    userName!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    image!: string;
}

export class FieldsListVM{
    id!: number;
    name!: string;
    productName!: string;
    area!: number;
    polygon!: any[];
    geoJson!: string;
}