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
    hasPackage!:boolean
}

export enum IndicatorsTypes{
    ndvi = 1,
    reci = 2,
    msavi = 3,

    ndwi = 4,
    ndmi = 5,

    ndre = 6,
    
    sipi = 7
    // ndvi = 1 ,
    // ndre = 2,  
    // reci = 3 , 
    // sipi = 4,  
    // vari = 5, 
    // evi = 6, 
    // arvi = 7,

    // ndwi = 8,
    // msi = 9,

    // ndsi = 10,
    // savi = 11
}

export enum ChartsTypes{
    ndvi = 1,
}

export class FieldDetailViewModel
{
    id!:number;
    name!:string;
    productName!:string;
    previousProductName!:string;
    area!:number;
    cultivationDate!:string;
    harvestDate!:string;
    irrigationPeriod!:number;
    irrigationType!:number;
    polygon!:any[];
    hasPackage!:boolean;
    packageStartDate?:string;
    packageEndDate?:string;
}


export enum IrrigationType
{
    /// <summary>
    /// غرقابی
    /// </summary>
    Flooded = 1,
    /// <summary>
    /// فارو
    /// </summary>
    Furrow = 2,
    /// <summary>
    /// نواری
    /// </summary>
    Tip = 3,
    /// <summary>
    /// بارانی
    /// </summary>
    Rainy = 4,
    /// <summary>
    /// قطره ای
    /// </summary>
    Drip = 5,
    /// <summary>
    /// زیرزمینی
    /// </summary>
    Underground = 6,
    /// <summary>
    /// دیم
    /// </summary>
    Rainfed = 7
}


export class AnalysViewModel
{
    id!:number;
    title!:string;
    description!:string;
    subAnalysis!:SubAnalysViewModel[];
    files!:AnalysFile[];
}

export class SubAnalysViewModel
{
    id!:number;
    remoteSensingType!:IndicatorsTypes;
    remoteSensingTypeTitle!:string;
    title!:string;
    description!:string;
    image!:string;
    imageDateTime!:string;
}

export class AnalysFile
{
    id!:number;
    title!:string;
    file!:FileViewModel;
}

export class PhenologiesVM{
    id!: number;
    fieldProductId!: number;
    provinceId!: number;
    startDate!: string;
    endDate!: string;
}
