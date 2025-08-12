import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async (openia: OpenAI, option: Options) => {

    const { prompt } = option;

    try {
        const completion = await openia.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `
                    Te serán proveído textos con posibles errores orográficos y gramaticales,
                    las palabras deben de exitir en el diccionario de la Real Academia Española, debes de responder en formato JSON válido, sin texto antes o después, sin bloques de código \`\`\`.
                    tu tarea es corregirlos y retornar información soluciones, también debes de dar porcentaje de acierto por el usuario,
    
                    Si no hay errores, debes de retornar un mensaje de felicitaciones.

                    Ejemplo de salida:
                    {
                        "userScore": number,
                        "errors": string[],  // ["error  -> solucion"],
                        "message": string // Usa emojis y textos para felicitar al usuario
                    }
                    `,
                },
                {
                    role: 'user',
                    content: prompt
                },
            ],
            model: "gpt-4o",
            temperature: 0.3, // entre mas cercano a 0 es mas preciso y menos randon las respuesta
            max_tokens: 150 // es el costo que tendra la respuesta
        });
        console.log(completion);

        // si no existe contenido enviamos un Obj vacio para que no llegue un NULL
        const content = completion.choices[0].message.content ?? "{}";
        // Elimina bloques de código markdown si existen
        const cleaned = content.replace(/```json\s*|\s*```/g, "").trim();
        const jsonResp = JSON.parse(cleaned);
        return jsonResp;
    } catch (error) {
        console.log('ERROR MENSAJE', error);
        return error.error.message;
    }
}