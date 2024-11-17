export interface Designation {

    id?: string;
    name?: string;
    price?: number;
    description?: string;
    typeDesignation?: string;

}

export interface DesignationLine {
    quantity: number;
    designation: Designation;
}
