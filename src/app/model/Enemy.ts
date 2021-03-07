import enemyStandardAttribute from "@static/stc/EnemyStandardAttribute.json";
import EnemyStats from "@app/model/EnemyStats";
import {enemyCharacterTypes, EnemyInTeam} from "@app/model/EnemyTeam";
import enemyInTeam from "@static/stc/EnemyInTeam.json";
import EnemyCharacterType from "@app/model/EnemyCharacterType";
import {ceil, round} from "@app/utils/math";
import gameConfigInfo from "@static/stc/catchdata/game_config_info.json";

export default class Enemy {
    private readonly enemyInTeam: EnemyInTeam;
    private readonly enemyCharacterType: EnemyCharacterType;

    constructor(enemyInTeam: EnemyInTeam) {
        this.enemyInTeam = enemyInTeam;
        this.enemyCharacterType = enemyCharacterTypes[enemyInTeam.enemy_character_type_id];
    }

    name(): string {
        return this.enemyCharacterType.name;
    }

    level(): number {
        return this.enemyInTeam.level;
    }

    links(): number {
        return this.enemyInTeam.number;
    }

    stats(): EnemyStats {
        const attributesAtCharacterTypeLevel = enemyStandardAttributes[this.enemyCharacterType.level];
        const attributesAtEnemyInTeamLevel = enemyStandardAttributes[this.enemyInTeam.level];

        const calcStat = (baseStat: number, atCharacterTypeLevel: number, atEnemyInTeamLevel: number) => round(baseStat * atEnemyInTeamLevel / atCharacterTypeLevel);

        return {
            hp: round(this.enemyCharacterType.maxlife * attributesAtEnemyInTeamLevel.maxlife / attributesAtCharacterTypeLevel.maxlife * this.enemyInTeam.number),
            damage: calcStat(this.enemyCharacterType.pow, attributesAtCharacterTypeLevel.pow, attributesAtEnemyInTeamLevel.pow),
            rof: this.enemyCharacterType.rate,
            accuracy: calcStat(this.enemyCharacterType.hit, attributesAtCharacterTypeLevel.hit, attributesAtEnemyInTeamLevel.hit),
            evasion: calcStat(this.enemyCharacterType.dodge, attributesAtCharacterTypeLevel.dodge, attributesAtEnemyInTeamLevel.dodge),
            range: this.enemyCharacterType.range,
            armor: calcStat(this.enemyCharacterType.armor, attributesAtCharacterTypeLevel.armor, attributesAtEnemyInTeamLevel.armor),
            movementSpeed: this.enemyCharacterType.speed,
            armorPenetration: calcStat(this.enemyCharacterType.armor_piercing, attributesAtCharacterTypeLevel.armor_piercing, attributesAtEnemyInTeamLevel.armor_piercing),
            shieldBreak: calcStat(this.enemyCharacterType.def_break, attributesAtCharacterTypeLevel.def_break, attributesAtEnemyInTeamLevel.def_break),
            maxShield: calcStat(this.enemyCharacterType.def, attributesAtCharacterTypeLevel.def, attributesAtEnemyInTeamLevel.def),
            shieldPercent: this.enemyInTeam.def_percent,
        }
    }

    combatEffectiveness(): number | undefined {
        if (!this.enemyCharacterType) return undefined;
        return ceil((this.attackCombatEffectiveness() + this.defenseCombatEffectiveness()) * this.enemyCharacterType.effect_ratio);
    }

    attackCombatEffectiveness(): number {
        const stats = this.stats();
        const attackEffect = gameConfigInfo.find(gameConfig => 'enemy_effect_attack' === gameConfig.parameter_name).parameter_value.split(',')
                                           .map(x => Number.parseFloat(x));

        return ceil(attackEffect[0] * this.enemyInTeam.number * ((stats.damage + attackEffect[4] * stats.shieldBreak) * stats.rof / attackEffect[1] * stats.accuracy / (stats.accuracy + attackEffect[2]) + attackEffect[3]));
    }

    defenseCombatEffectiveness(): number {
        const stats = this.stats();
        const defenseEffect = gameConfigInfo.find(gameConfig => 'enemy_effect_defence' === gameConfig.parameter_name).parameter_value.split(',')
                                            .map(x => Number.parseFloat(x));

        return ceil(defenseEffect[0] * (stats.hp * (defenseEffect[1] + stats.evasion) / defenseEffect[1] * defenseEffect[2] / (defenseEffect[2] - stats.armor) + defenseEffect[3]) * (2 * stats.maxShield - (stats.maxShield * stats.shieldPercent / 100) + 2 * defenseEffect[4]) / (stats.maxShield - (stats.maxShield * stats.shieldPercent / 100) + defenseEffect[4]) / 2);
    }
}

const enemyStandardAttributes = enemyStandardAttribute.reduce((accumulator, enemyStandardAttribute) => {
    accumulator[enemyStandardAttribute.level] = enemyStandardAttribute;
    return accumulator;
}, []);

export const enemies = (enemyInTeam as EnemyInTeam[]).reduce((accumulator, enemyInTeam) => {
    accumulator[enemyInTeam.id] = new Enemy(enemyInTeam);
    return accumulator;
}, []);
