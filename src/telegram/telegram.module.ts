import { Module } from "@nestjs/common";
import { TelegramService } from "./telegram.service";
import { AppConfigModule } from "../config/config.module";
import { ChatGptModule } from "src/chatgptProvider/chatgpt.module";

@Module({
  imports: [AppConfigModule, ChatGptModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
