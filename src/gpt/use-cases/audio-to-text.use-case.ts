import OpenAI from "openai";
import * as fs from 'fs';

interface Options {
    prompt?: string;
    audioFile: Express.Multer.File;
}


export const audioToTextUseCase = async (openia: OpenAI, options: Options) => {
    const { prompt, audioFile } = options;

    const response = await openia.audio.transcriptions.create({
        model: 'gpt-4o-transcribe',
        file: fs.createReadStream(audioFile.path),
        prompt: prompt, //mismo idioma del audio
        language: 'es',
        response_format: 'json',
    });

    return response;
}