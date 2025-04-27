import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Groq from "groq-sdk";
import { SessionData } from "src/telegram/telegram.service";
@Injectable()
export class ChatGptService {
  private readonly model: Groq;
  private readonly modelType: string;

  // private history: Map<number, { role: string; content: string }[]> = new Map();

  constructor(private configService: ConfigService) {
    // this.openai = new OpenAI({
    //   apiKey: this.configService.get<string>("GPT_API_KEY"),
    // });
    this.model = new Groq({
      apiKey: this.configService.get<string>("GPT_API_KEY"),
    });
    this.modelType =
      this.configService.get<string>("GPT_MODEL") || "gpt-4-turbo-preview";
    // this.prompt = this.configService.get<string>("PROMPT") || "";
  }
  public async sendMessage(message: string, ctx: SessionData) {
    try {
      ctx.messages.push({
        content: message,
        role: "user",
      });
      console.log("CONTEXTMESSAGES====>", ctx.messages);
      const response = await this.model.chat.completions.create({
        messages:
          ctx.messages as Groq.Chat.Completions.ChatCompletionMessageParam[],
        model: this.modelType,
      });
      return response.choices[0].message.content;
    } catch (error) {
      ctx.messages.pop();
      console.log("ERRRROR====>", error);
    }
  }

  // private getHistoryFromMapById(chatId: number) {
  //   return this.history.get(chatId);
  // }

  // private updateHistory(chatId: number, message: string) {
  //   const history = this.getHistoryFromMapById(chatId);
  //   history.push({
  //     role: "user",
  //     content: message,
  //   });
  //   this.history.set(chatId, history);
  //   return history;
  // }
}
