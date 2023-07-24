import { photo } from "../model/photo";

export class EnlistDto{
    name:string;
    location:string;
    lat: number;
    lng: number;
    transportation: string;
    availableFrom: Date;
    availableTo: Date;
    floor:number;
    price:number;
    extraCost: number;
    size:number;
    beds:number;
    rooms:number;
    bathrooms:number;
    maxPerson:number;
    type:string;
    description : string;
    houseRules: string;
    sittingRoom: boolean;
    wifi:boolean;
	heat:boolean;
	kitchen:boolean;
	tv:boolean;
	parking:boolean;
	elevator:boolean;
    photos: photo[];
}