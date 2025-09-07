import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { ImageGenerationDto } from './dtos/Image-generation.dto';
import { audioToTextUseCase, imageGenerationUseCase, orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase, textToAudioUseCase, translateUseCase } from './use-cases';

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

    async audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
        const { prompt } = audioToTextDto;
        return await audioToTextUseCase(this.openia, { audioFile, prompt })
    }

    async imageGeneration(imageGenerationDto: ImageGenerationDto) {
        return imageGenerationUseCase(this.openia, { ...imageGenerationDto })
    }

    getGeneratedImage(fileName: string) {
        console.log(fileName);

        const filePath = path.resolve('./', './generated/images/', fileName);
        const exist = fs.existsSync(filePath);

        if (!exist) {
            throw new NotFoundException('File not found');
        }
        console.log({ filePath });

        return filePath;
    }
}