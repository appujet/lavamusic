import type { APISticker, APIStickerPack } from '../../payloads/v8/index';
import type { AddUndefinedToPossiblyUndefinedPropertiesOfInterface } from '../../utils/internals';
export declare type RESTGetAPIStickerResult = APISticker;
export interface RESTGetNitroStickerPacksResult {
    sticker_packs: APIStickerPack[];
}
export declare type RESTGetAPIGuildStickersResult = APISticker[];
export declare type RESTGetAPIGuildStickerResult = APISticker;
export interface RESTPostAPIGuildStickerFormDataBody {
    /**
     * Name of the sticker (2-30 characters)
     */
    name: string;
    /**
     * Description of the sticker (empty or 2-100 characters)
     */
    description: string;
    /**
     * The Discord name of a unicode emoji representing the sticker's expression (2-200 characters)
     */
    tags: string;
    /**
     * The sticker file to upload, must be a PNG, APNG, or Lottie JSON file, max 500 KB
     */
    file: unknown;
}
export declare type RESTPostAPIGuildStickerResult = APISticker;
export declare type RESTPatchAPIGuildStickerJSONBody = AddUndefinedToPossiblyUndefinedPropertiesOfInterface<{
    /**
     * Name of the sticker (2-30 characters)
     */
    name?: string;
    /**
     * Description of the sticker (2-100 characters)
     */
    description?: string | null;
    /**
     * The Discord name of a unicode emoji representing the sticker's expression (2-200 characters)
     */
    tags?: string;
}>;
export declare type RESTPatchAPIGuildStickerResult = APISticker;
export declare type RESTDeleteAPIGuildStickerResult = never;
//# sourceMappingURL=sticker.d.ts.map