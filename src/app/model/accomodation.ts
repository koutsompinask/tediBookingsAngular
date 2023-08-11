import { User } from "./user";

export class Accomodation{
    id:number;
    name:string;
    location:string;
    lat:number;
    lng:number;
    transportation: string;
    floor:number;
    price:number;
    extraCost: number;
    size:number;
    beds:number;
    rooms:number;
    bathrooms: number;
    maxPerson:number;
    type:string;
    description : string;
    houseRules : string;
    availableFrom: Date;
    availableTo: Date;
    sittingRoom: boolean;
    wifi:boolean;
	heat:boolean;
	kitchen:boolean;
	tv:boolean;
	parking:boolean;
	elevator:boolean;
    photos:any[];
    owner:User;
}