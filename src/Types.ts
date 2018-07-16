export enum IOptionType {
    String,
    Number,
    Boolean
}
export interface IOption {
    Type: IOptionType;
    ID: string;
    Name: string;
    Default: any;
}