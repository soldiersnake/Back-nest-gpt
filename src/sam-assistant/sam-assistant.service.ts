import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createMessageUseCase, createRunUseCase, createthreadUseCase } from './use-cases';
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
        // si dto.threadId puede no venir, crea uno
        const tId = threadId ?? (await this.createThread()).id;

        const message = await createMessageUseCase(this.openia, { threadId, question });

        const run = await createRunUseCase(this.openia, { threadId });

        await checkCompleteStatusUseCase(this.openia, { threadId: tId, runId: run.id })
    }

}
