export interface Designation {

    id?: string;
    name?: string;
    price?: number;
    typeDesignation?: string;

}

export interface DesignationLine {
    quantity: number;
    designation: Designation;
}
