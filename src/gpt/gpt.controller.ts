import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { type Response } from 'express';

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

  @Post('translate')
  translateText(
    @Body() translateDto: TranslateDto,
  ) {
    return this.gptService.translateText(translateDto);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    try {
      const filePath = await this.gptService.textToAudio(textToAudioDto);

      res.setHeader('Content-Type', 'audio/mp3');
      res.status(HttpStatus.OK);
      res.sendFile(filePath);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        message: error ?? 'Error interno',
      });
    }
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    try {
      const filePath = await this.gptService.TextToAudioGetter(fileId);
      res.setHeader('Content-Type', 'audio/mp3');
      res.status(HttpStatus.OK);
      res.sendFile(filePath);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        ok: false,
        message: error ?? 'Error interno',
      });
    }
  }

}
