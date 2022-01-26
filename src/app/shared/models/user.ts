export default interface IUser {
    email: string;
    name: string;
    age: number;
    phoneNumber: string;
    createdAt: Date;
    password?: string;
}