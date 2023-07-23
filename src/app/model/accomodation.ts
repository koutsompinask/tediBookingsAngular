export class Accomodation{
    id:number;
    name:string;
    location:string;
    lat:number;
    lng:number;
    floor:number;
    price:number;
    size:number;
    maxPerson:number;
    accType:string;
    description : string;
    availableFrom: Date;
    availabeTo: Date;
    wifi:boolean;
	heat:boolean;
	kitchen:boolean;
	tv:boolean;
	parking:boolean;
	elevator:boolean;
    photos;
}