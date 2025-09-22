import OpenAI from "openai";


export const createthreadUseCase = async (openai: OpenAI) => {
    const { id } = await openai.beta.threads.create()

    return { id };
}