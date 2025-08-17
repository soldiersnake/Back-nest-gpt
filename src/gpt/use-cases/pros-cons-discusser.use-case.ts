import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDicusserUseCase = async (openai: OpenAI, { prompt }: Options) => {
    if (!prompt?.trim()) {
        return "⚠️ Debes enviar una pregunta en el campo `prompt`.";
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'system',
                content: `Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                    la respuesta debe de ser en formato markdown,
                    los pros y contras deben de estar en una lista`
            },
            {
                role: 'user',
                content: prompt
            }
            ],
            temperature: 0.8,
            max_tokens: 500
        })
        console.log(response);

        return response.choices[0].message ?? "Sin contenido en la respuesta.";
    } catch (error) {

        console.log('ERROR MENSAJE', error);
        return error?.error?.message ?? error?.message ?? "Error inesperado llamando a OpenAI.";
    }
}