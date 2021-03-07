export function getCampaignAbbreviation(campaignId: number): string | undefined {
    if (campaignId >= 0) return `${campaignId}`;

    switch (campaignId) {
        case -1:
            return `OC`
        case -2:
            return `AW1`
        case -3:
            return `AW2`
        case -4:
            return `AW3`
        case -5:
            return `AW4`
        case -7:
            return `OCP`
        case -10:
            return `DD1`
        case -11:
            return `DD2`
        case -12:
            return `DD3`
        case -13:
            return `DD4`
        case -16:
            return `S1`
        case -17:
            return `S2`
        case -18:
            return `S3`
        case -24:
            return `CT1`
        case -25:
            return `CT2`
        case -26:
            return `CT3`
        case -28:
            return `CT4`
        case -31:
            return `I`
    }

    return undefined;
}
