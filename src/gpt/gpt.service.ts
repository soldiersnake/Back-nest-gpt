import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';
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
}
