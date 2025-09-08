import * as path from "path";
import { InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";
import * as sharp from 'sharp';



export const downloadImageAsPng = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new InternalServerErrorException('Donwload image was not possible');
    }

    const folderPath = path.resolve('./', './generated/images/');

    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${new Date().getTime()}.png`;
    const buffer = Buffer.from(await response.arrayBuffer());

    // fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);

    const completedPath = path.join(folderPath, imageNamePng);
    await sharp(buffer)
        .png()
        .ensureAlpha()
        .toFile(completedPath);

    return imageNamePng;
}

export const downloadBase64ImageAsPng = async (base64Image: string) => {

    // Remover encabezado
    base64Image = base64Image.split(';base64,').pop() ?? '';
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const folderPath = path.resolve('./', './generated/images/');
    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${new Date().getTime()}-64.png`;

    const completedPath = path.join(folderPath, imageNamePng);
    // Transformar a RGBA, png // Así lo espera OpenAI
    await sharp(imageBuffer)
        .png()
        .ensureAlpha()
        .toFile(completedPath);

    return imageNamePng;
}