import * as path from "path";
import { InternalServerErrorException } from "@nestjs/common";
import * as fs from "fs";



export const downloadImageAsPng = async (url: string) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new InternalServerErrorException('Donwload image was not possible');
    }

    const folderPath = path.resolve('./', './generated/images/');

    fs.mkdirSync(folderPath, { recursive: true });

    const imageNamePng = `${new Date().getTime()}.png`;
    const buffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(`${folderPath}/${imageNamePng}`, buffer);
}