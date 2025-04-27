import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ChatGptService } from "./chatgpt.service";

// import { OpenAIService } from './openai.service';

@Module({
  imports: [ConfigModule],
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
