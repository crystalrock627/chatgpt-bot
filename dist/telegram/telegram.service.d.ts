import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandContext, Context, SessionFlavor } from "grammy";
import { ChatGptService } from "../chatgptProvider/chatgpt.service";
export interface SessionData {
    messages: [
        {
            role: "system" | "user";
            content: string;
        }
    ];
}
type MyContext = Context & SessionFlavor<SessionData>;
export declare class TelegramService implements OnModuleInit {
    private configService;
    private chatGpt;
    private bot;
    private readonly prompt;
    private isBatching;
    constructor(configService: ConfigService, chatGpt: ChatGptService);
    onModuleInit(): void;
    registerStorage(): void;
    chunkText: (text: string) => string[];
    batchResponse: (text: string, ctx: CommandContext<MyContext>) => Promise<void>;
    private registerHandlers;
    private startBot;
}
export {};
