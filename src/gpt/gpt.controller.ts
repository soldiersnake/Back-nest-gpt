import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) { }

  @Post('orthography-check')
  orthographyCheck(
    @Body() orthographyDto: OrthographyDto,
  ) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() ProsConsDiscusserDto: ProsConsDiscusserDto,
  ) {
    return this.gptService.prosConsDicusser(ProsConsDiscusserDto);
  }


  // este caso se utiliza un stream con el metodo @Res es para mostrar la respuesta a medida que se genera, por eso no se retorna en una variable y debe de cambiarse la forma de interaccion
  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() ProsConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDicusserStream(ProsConsDiscusserDto);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      console.log(piece);
      res.write(piece)
    }

    res.end();
  }

}
