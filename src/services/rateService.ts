export interface ProviderRate {
    provider: string;
    rate: number;
}

const getProviderARate = async (): Promise<number> => {
    return 89.50;
};

const getProviderBRate = async (): Promise<number> => {
    return 89.65;
};

export const getBestQuote = async (amountUsd: number) => {
    const [rateA, rateB] = await Promise.all([getProviderARate(), getProviderBRate()]);

    let selectedProvider = 'ProviderA';
    let selectedRate = rateA;

    if (rateB > rateA) {
        selectedProvider = 'ProviderB';
        selectedRate = rateB;
    }

    const amountInr = amountUsd * selectedRate;

    return {
        amountUsd,
        amountInr,
        rateUsed: selectedRate,
        provider: selectedProvider
    };
};
