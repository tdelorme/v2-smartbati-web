export interface Designation {

    id?: string;
    name?: string;
    price?: number;
    typeDesignation?: String;

}

export interface DesignationLine {
    quantity: number;
    designation: Designation;
}
