export class EquipStat {
    min: number;
    max: number;
    upgrade: number;
}

export default class EquipStats {
    damage: EquipStat | undefined;
    rof: EquipStat | undefined;
    accuracy: EquipStat | undefined;
    evasion: EquipStat | undefined;
    armor: EquipStat | undefined;
    movementSpeed: EquipStat | undefined;
    armorPenetration: EquipStat | undefined;
    criticalRate: EquipStat | undefined;
    criticalDamage: EquipStat | undefined;
    rounds: EquipStat | undefined;
    nightVision: EquipStat | undefined;
    skillEffectModifier: number | undefined;
}

export class CurrentEquipStats {
    damage = 0;
    rof = 0;
    accuracy = 0;
    evasion = 0;
    armor = 0;
    movementSpeed = 0;
    armorPenetration = 0;
    criticalRate = 0;
    criticalDamage = 0;
    rounds = 0;
    nightVision = 0;
    skillEffectModifier = 0;

    sum(other: CurrentEquipStats): CurrentEquipStats {
        const sum = new CurrentEquipStats();

        Object.keys(this)
              .forEach((key: keyof CurrentEquipStats) => (sum[key] as number) = (this[key] as number || 0) + (other[key] as number || 0));

        return sum;
    }
}

export function getFormattedStatName(stat: keyof CurrentEquipStats): string {
    if ('rof' === stat) return 'RoF';

    const unCamelCase = stat.split(/(?=[A-Z])/)
                            .join(' ');

    return unCamelCase.charAt(0).toUpperCase() + unCamelCase.slice(1);
}

export function getFormattedStatValue(stat: keyof CurrentEquipStats, value: number): string {
    const positivePrefix = `${value > 0 ? '+' : ''}`;
    if (['criticalRate', 'criticalDamage', 'nightVision'].includes(stat)) return `${positivePrefix}${value}﹪`;
    return `${positivePrefix}${value}`;
}
