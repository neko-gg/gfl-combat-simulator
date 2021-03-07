export class FairyTalent {
    static readonly DAMAGE_I = new FairyTalent('Damage I', 910101);
    static readonly DAMAGE_II = new FairyTalent('Damage II', 910102);
    static readonly ACCURACY_I = new FairyTalent('Accuracy I', 910103);
    static readonly ACCURACY_II = new FairyTalent('Accuracy II', 910104);
    static readonly EVASION_I = new FairyTalent('Evasion I', 910105);
    static readonly EVASION_II = new FairyTalent('Evasion II', 910106);
    static readonly ARMOR_I = new FairyTalent('Armor I', 910107);
    static readonly ARMOR_II = new FairyTalent('Armor II', 910108);
    static readonly CRITICAL_I = new FairyTalent('Critical I', 910109);
    static readonly CRITICAL_II = new FairyTalent('Critical II', 910110);
    static readonly CHARGE = new FairyTalent('Charge', 910111);
    static readonly ASSAULT = new FairyTalent('Assault', 910112);
    static readonly AIM = new FairyTalent('Aim', 910113);
    static readonly STURDY = new FairyTalent('Sturdy', 910114);
    static readonly SUPPRESSION = new FairyTalent('Suppression', 910115);
    static readonly KEEN = new FairyTalent('Keen', 910116);
    static readonly FERVOR = new FairyTalent('Fervor', 910117);
    static readonly GOLDEN = new FairyTalent('Golden', 910118);
    static readonly CHEF = new FairyTalent('Chef', 910119);
    static readonly SPLENDOR = new FairyTalent('Splendor', 910120);
    static readonly NEW_YEAR = new FairyTalent('New Year', 910121);
    static readonly COOL = new FairyTalent('Cool', 910122);
    static readonly AUSPICIOUS_TYPE = new FairyTalent('Auspicious Type', 910124);

    private constructor(readonly name: string, readonly id: number) {
    }

}
