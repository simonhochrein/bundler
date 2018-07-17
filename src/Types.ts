export enum IOptionType {
    String,
    Number,
    Boolean,
    Array
}
export interface IOption {
    Type: IOptionType;
    ID: string;
    Name: string;
    Default: any;
    Options?: string[];
}