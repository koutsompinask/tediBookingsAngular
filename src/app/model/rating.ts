import { User } from "./user";

export class Rating{
    id: number;
    stars: number;
    comment : string;
    guest: User;
}