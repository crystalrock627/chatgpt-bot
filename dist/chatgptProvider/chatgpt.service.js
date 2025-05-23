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
exports.ChatGptService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
let ChatGptService = class ChatGptService {
    constructor(configService) {
        this.configService = configService;
        this.model = new groq_sdk_1.default({
            apiKey: this.configService.get("GPT_API_KEY"),
        });
        this.modelType =
            this.configService.get("GPT_MODEL") || "gpt-4-turbo-preview";
    }
    async sendMessage(message, ctx) {
        try {
            ctx.messages.push({
                content: message,
                role: "user",
            });
            console.log("CONTEXTMESSAGES====>", ctx.messages);
            const response = await this.model.chat.completions.create({
                messages: ctx.messages,
                model: this.modelType,
            });
            return response.choices[0].message.content;
        }
        catch (error) {
            ctx.messages.pop();
            console.log("ERRRROR====>", error);
        }
    }
};
exports.ChatGptService = ChatGptService;
exports.ChatGptService = ChatGptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ChatGptService);
//# sourceMappingURL=chatgpt.service.js.map