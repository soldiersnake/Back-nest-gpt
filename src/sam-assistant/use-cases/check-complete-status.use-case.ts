import OpenAI from "openai";

interface Options {
    threadId: string;
    runId: any;
}

export const checkCompleteStatusUseCase = async (openia: OpenAI, options: Options) => {
    const { threadId, runId } = options;

    if (!threadId || !runId) {
        throw new Error('threadId and runId are required');
    }

    const runStatus = await openia.beta.threads.runs.retrieve(runId, { thread_id: threadId });

    console.log({ status: runStatus.status });

    if (runStatus.status === 'completed') {
        return runStatus;
    }

    // esperar un segundo antes de volver a consultar
    await new Promise(resolve => setTimeout(resolve, 1000))

    return await checkCompleteStatusUseCase(openia, options);
}