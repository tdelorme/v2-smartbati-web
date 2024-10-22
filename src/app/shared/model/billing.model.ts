import { Client } from "../../client/model/client.model";
import { DesignationLine } from "../../edit/designation.model";

export interface Billing {
    id?: string;
    number?: string;
    lineQuantities: DesignationLine[];
    clientId: string;
    client?: Client;
    totalExcludingTaxes?: number;
    totalIncludingTaxes?: number;
    userId?: string;
    date?: Date;
    dueDate?: Date;
    type: 'QUOTE'|'INVOICE';
    generatedFile?: string;
    discountPercent: number; 
}