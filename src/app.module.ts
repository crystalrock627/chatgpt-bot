import { Module } from "@nestjs/common";
import { TelegramModule } from "./telegram/telegram.module";
import { AppConfigModule } from "./config/config.module";

@Module({
  imports: [AppConfigModule, TelegramModule],
})
export class AppModule {}
