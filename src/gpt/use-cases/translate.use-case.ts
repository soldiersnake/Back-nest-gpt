import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async (openai: OpenAI, { prompt, lang }: Options) => {

    if (!prompt?.trim()) {
        return "⚠️ Debes enviar una pregunta en el campo `prompt`.";
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'system',
                content: `Traduce el siguiente texto al idioma ${lang}:${prompt}`
            },
            ],
            temperature: 0.2
        })
        console.log(response);

        return { message: response.choices[0].message.content ?? "No se pudo realizar la traduccion.", lang };
    } catch (error) {

        console.log('ERROR MENSAJE', error);
        return error?.error?.message ?? error?.message ?? "Error inesperado llamando a OpenAI.";
    }
}