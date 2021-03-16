export default class StcSquadStandardAttribution {
    id: number;
    attribute_type: string;
    name: string;
    standard_attribute: number;
    cpu_standard_attribute: number;
    basic_rate: number;
    cpu_rate: number;
    role_id: number;

    constructor(id: number, attribute_type: string, name: string, standard_attribute: number, cpu_standard_attribute: number, basic_rate: number, cpu_rate: number, role_id: number) {
        this.id = id;
        this.attribute_type = attribute_type;
        this.name = name;
        this.standard_attribute = standard_attribute;
        this.cpu_standard_attribute = cpu_standard_attribute;
        this.basic_rate = basic_rate;
        this.cpu_rate = cpu_rate;
        this.role_id = role_id;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquadStandardAttribution {
        return new StcSquadStandardAttribution(array[0] as number,
                                               array[1] as string,
                                               array[2] as string,
                                               array[3] as number,
                                               array[4] as number,
                                               array[5] as number,
                                               array[6] as number,
                                               array[7] as number)
    }

}
