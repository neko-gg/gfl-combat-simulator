export default class StcEnemyInTeam {
    id: number;
    enemy_team_id: number;
    enemy_character_type_id: number;
    coordinator_x: number;
    coordinator_y: number;
    level: number;
    number: number;
    is_advance: number;
    def_percent: number;

    constructor(id: number, enemy_team_id: number, enemy_character_type_id: number, coordinator_x: number, coordinator_y: number, level: number, number: number, is_advance: number, def_percent: number) {
        this.id = id;
        this.enemy_team_id = enemy_team_id;
        this.enemy_character_type_id = enemy_character_type_id;
        this.coordinator_x = coordinator_x;
        this.coordinator_y = coordinator_y;
        this.level = level;
        this.number = number;
        this.is_advance = is_advance;
        this.def_percent = def_percent;
    }

    static fromArray(array: (number | bigint | string)[]): StcEnemyInTeam {
        return new StcEnemyInTeam(array[0] as number,
                                  array[1] as number,
                                  array[2] as number,
                                  array[3] as number,
                                  array[4] as number,
                                  array[5] as number,
                                  array[6] as number,
                                  array[7] as number,
                                  array[8] as number)
    }

}
