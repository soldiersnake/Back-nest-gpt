import * as path from 'path';
import * as fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';

@Injectable()
export class GptService {

    private openia = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    // El servicio solo va a llamar casos de uso
    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase(this.openia, {
            prompt: orthographyDto.prompt
        });
    }

    async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserUseCase(this.openia, { prompt });
    }

    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDicusserStreamUseCase(this.openia, { prompt });
    }

    async translateText({ prompt, lang }: TranslateDto) {
        return await translateUseCase(this.openia, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDto) {
        return await textToAudioUseCase(this.openia, { prompt, voice });
    }

    async TextToAudioGetter(fileId: string) {
        const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId}.mp3`);
        const wasFound = fs.existsSync(filePath);

        if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

        return filePath;
    }
}