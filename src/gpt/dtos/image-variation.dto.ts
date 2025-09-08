import { IsString } from "class-validator";


export class ImageVariationDTO {
    @IsString()
    readonly baseImage: string;
}