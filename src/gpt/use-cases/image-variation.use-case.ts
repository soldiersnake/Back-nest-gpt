import OpenAI from 'openai';


interface Options {
    baseImage: string;
}

export const imageVariationUseCase = async (openia: OpenAI, options: Options) => {

    const { baseImage } = options;
    console.log({ baseImage });


    return baseImage;

}