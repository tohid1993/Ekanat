import Dexie, { Table } from 'dexie';



export interface FieldsList {
    id?: number;
    fieldId:number,
    name: string;
}
export interface ImagesList {
    id?: number;
    fieldDBId: number;
    indicator:number;
    imageDate: string;
    imageBase64: string;
    imageUrl:string;
    legendRange:Array<Number>
}

export class AppDB extends Dexie {
    imagesList!: Table<ImagesList, number>;
    fieldsList!: Table<FieldsList, number>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(3).stores({
            fieldsList: '++id',
            imagesList: '++id, fieldDBId',
        });
    }



    // async resetDatabase() {
    //     await db.transaction('rw', 'todoItems', 'todoLists', () => {
    //         this.imagesList.clear();
    //         this.fieldsList.clear();
    //         // this.populate();
    //     });
    // }
}

export const db = new AppDB();
