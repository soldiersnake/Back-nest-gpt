import { BadRequestException, Body, Controller, FileTypeValidator, FileValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { AudioToTextDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// ---------- Validador custom ----------
class AudioMimeValidator extends FileValidator<{ mime: RegExp }> {
  isValid(file?: Express.Multer.File): boolean {
    if (!file) return false;
    return this.validationOptions.mime.test(file.mimetype); // p.ej. audio/mp4, audio/mpeg, etc.
  }
  buildErrorMessage(): string {
    return 'Invalid file type. Only audio/* is allowed.';
  }
}

const uploadDir = path.resolve(__dirname, '../../generated/uploads');
const AUDIO_REGEX = /^audio\/.+$/i; // si querés restringir: /^audio\/(mpeg|mp3|wav|x-m4a|aac|mp4|m4a)$/i

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          fs.mkdirSync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname) || '.bin';
          cb(null, `${Date.now()}${ext}`);
        },
      }),
      // ---------- fileFilter en Multer ----------
      fileFilter: (_req, file, cb) => {
        const ok = AUDIO_REGEX.test(file.mimetype); // acepta audio/mp4 (m4a), mpeg, wav, etc.
        cb(ok ? null : new BadRequestException(`Invalid mimetype: ${file.mimetype}`), ok);
      },
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
            message: 'File is bigger than 5 mb',
          }),
          // ---------- Pipe con validador custom ----------
          new AudioMimeValidator({ mime: AUDIO_REGEX }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    try {

      return this.gptService.audioToText(file, audioToTextDto);
    } catch (error) {
      return {
        ok: false,
        message: error ?? 'Error interno',
      };
    }
  }

}
