import OpenAI from "openai";

interface Options {
    threadId: string;
    assitantId?: string;
}

export const createRunUseCase = async (openia: OpenAI, options: Options) => {

    const assitanceKey = 'asst_3lCphLWpELZDaNeriHTL9E9C';

    const { threadId, assitantId = assitanceKey } = options;

    const run = await openia.beta.threads.runs.create(threadId, {
        assistant_id: assitantId,
        // instructions; // OJO! sobre escribe el asistente
    })

    console.log({ run });
    return run;
}