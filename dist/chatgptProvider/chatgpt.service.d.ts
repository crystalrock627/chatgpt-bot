import { ConfigService } from "@nestjs/config";
import { SessionData } from "src/telegram/telegram.service";
export declare class ChatGptService {
    private configService;
    private readonly model;
    private readonly modelType;
    constructor(configService: ConfigService);
    sendMessage(message: string, ctx: SessionData): Promise<string>;
}
