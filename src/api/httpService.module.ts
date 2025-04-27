import { HttpFactory } from "./httpService.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [HttpFactory],
  exports: [HttpFactory],
})
export class HttpService {}
