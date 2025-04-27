import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Bot,
  CommandContext,
  Context,
  MemorySessionStorage,
  session,
  SessionFlavor,
} from "grammy";
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

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Bot<MyContext>;
  private readonly prompt: string;
  private isBatching: boolean;
  constructor(
    private configService: ConfigService,
    private chatGpt: ChatGptService
  ) {
    this.bot = new Bot(this.configService.get<string>("BOT_TOKEN") || "");
    this.prompt = this.configService.get<string>("PROMPT") || "";
    this.registerStorage();
  }
  onModuleInit() {
    this.registerHandlers();
    this.startBot();
  }
  registerStorage() {
    const prompt = this.prompt;

    this.bot.use(
      session({
        initial(): SessionData {
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
        storage: new MemorySessionStorage(),
      })
    );
  }

  chunkText = (text: string): string[] => {
    const result: string[] = [];
    const processChunk = (chunk: string) => {
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

  batchResponse = async (text: string, ctx: CommandContext<MyContext>) => {
    const chunkedText = this.chunkText(text);
    console.log("CHUNKEDTEXT", chunkedText);
    // const promises = chunkedText.map((text) => {
    //   return ctx.reply(text);
    // });
    this.isBatching = true;
    for (let index = 0; index < chunkedText.length; index++) {
      try {
        await ctx.reply(chunkedText[index]);
      } catch (error) {
        console.log("ERRRORBATCH====>", error);
      }
    }
    this.isBatching = false;
    // chunkedText.map(async (text) => {
    //   try {
    //     await ctx.reply(text);
    //   } catch (error) {}
    // });
    // return Promise.all(promises).then((res) => (this.isBatching = false));
  };

  private registerHandlers() {
    this.bot.command("start", (ctx) => ctx.reply("Добро пожаловать 🚀"));
    this.bot.on("message:text", async (ctx) => {
      if (this.isBatching) return;
      const { text } = ctx.message;
      const response = await this.chatGpt.sendMessage(text, ctx.session);
      console.log("RESPONSE", response);

      if (response.length > 4048) {
        this.batchResponse(response, ctx as any);
        return;
      }

      ctx.reply(response || "");
    });

    this.bot.catch((err) => {
      console.error(`Bot error: ${err}`);
    });
  }

  private async startBot() {
    if (this.configService.get("NODE_ENV") === "development") {
      await this.bot.start();
      console.log("Bot running in polling mode");
    } else {
    }
  }
}
