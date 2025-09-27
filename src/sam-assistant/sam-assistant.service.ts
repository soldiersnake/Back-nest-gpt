import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createMessageUseCase, createRunUseCase, createthreadUseCase } from './use-cases';
import { QuestionDto } from './dtos/questions.dto';

@Injectable()
export class SamAssistantService {

    private openia = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })

    async createThread() {
        return createthreadUseCase(this.openia)
    }

    async userQuestion(questionDto: QuestionDto) {
        const { threadId, question } = questionDto;

        const message = await createMessageUseCase(this.openia, { threadId, question });

        const run = await createRunUseCase(this.openia, { threadId })

    }

}
