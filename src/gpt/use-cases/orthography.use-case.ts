interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async (option: Options) => {

    const { prompt } = option;

    return {
        prompt: prompt,
        apiKey: process.env.OPENAI_API_KEY
    }
}