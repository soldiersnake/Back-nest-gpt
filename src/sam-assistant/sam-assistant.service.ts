import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createthreadUseCase } from './use-cases';

@Injectable()
export class SamAssistantService {

    private openia = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    async createThread() {
        return createthreadUseCase(this.openia)
    }

}
