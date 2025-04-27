"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const grammy_1 = require("grammy");
const chatgpt_service_1 = require("../chatgptProvider/chatgpt.service");
let TelegramService = class TelegramService {
    constructor(configService, chatGpt) {
        this.configService = configService;
        this.chatGpt = chatGpt;
        this.chunkText = (text) => {
            const result = [];
            const processChunk = (chunk) => {
                if (chunk.length <= 4048) {
                    result.push(chunk);
                    return;
                }
                const spaceIndex = chunk.slice(0, 4048).lastIndexOf(" ");
                const splitIndex = spaceIndex === -1 ? 4048 : spaceIndex;
                result.push(chunk.slice(0, splitIndex));
                processChunk(chunk.slice(splitIndex));
            };
            processChunk(text);
            return result;
        };
        this.batchResponse = async (text, ctx) => {
            const chunkedText = this.chunkText(text);
            console.log("CHUNKEDTEXT", chunkedText);
            this.isBatching = true;
            for (let index = 0; index < chunkedText.length; index++) {
                try {
                    await ctx.reply(chunkedText[index]);
                }
                catch (error) {
                    console.log("ERRRORBATCH====>", error);
                }
            }
            this.isBatching = false;
        };
        this.bot = new grammy_1.Bot(this.configService.get("BOT_TOKEN") || "");
        this.prompt = this.configService.get("PROMPT") || "";
        this.registerStorage();
    }
    onModuleInit() {
        this.registerHandlers();
        this.startBot();
    }
    registerStorage() {
        const prompt = this.prompt;
        this.bot.use((0, grammy_1.session)({
            initial() {
                return {
                    messages: [
                        {
                            content: "ответ минимум 6000 символов",
                            role: "system",
                        },
                    ],
                };
            },
            getSessionKey(ctx) {
                return ctx.chatId.toString();
            },
            storage: new grammy_1.MemorySessionStorage(),
        }));
    }
    registerHandlers() {
        this.bot.command("start", (ctx) => ctx.reply("Добро пожаловать 🚀"));
        this.bot.on("message:text", async (ctx) => {
            if (this.isBatching)
                return;
            const { text } = ctx.message;
            const response = await this.chatGpt.sendMessage(text, ctx.session);
            console.log("RESPONSE", response);
            if (response.length > 4048) {
                this.batchResponse(response, ctx);
                return;
            }
            ctx.reply(response || "");
        });
        this.bot.catch((err) => {
            console.error(`Bot error: ${err}`);
        });
    }
    async startBot() {
        if (this.configService.get("NODE_ENV") === "development") {
            await this.bot.start();
            console.log("Bot running in polling mode");
        }
        else {
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        chatgpt_service_1.ChatGptService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map