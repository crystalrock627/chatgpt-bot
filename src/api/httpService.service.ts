import { HttpService } from "@nestjs/axios";
import { Injectable, Inject } from "@nestjs/common";
import axios, { CreateAxiosDefaults } from "axios";
@Injectable()
export class HttpFactory {
  create(config: CreateAxiosDefaults) {
    return axios.create(config);
  }
}
