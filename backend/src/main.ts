// Habilita o suporte a metadados para decorators (necessario para NestJS e TypeORM).
import "reflect-metadata";
// Fabrica principal do NestJS para subir a aplicacao HTTP.
import { NestFactory } from "@nestjs/core";
// Modulo raiz da aplicacao, onde os demais modulos sao registrados.
import { AppModule } from "./app.module";

async function bootstrap() {
  // Cria a aplicacao a partir do modulo principal.
  const app = await NestFactory.create(AppModule);
  // Prefixo global para todas as rotas da API.
  app.setGlobalPrefix("api");
  // Libera CORS para facilitar consumo pelo frontend.
  app.enableCors();

  // Porta configuravel via variavel de ambiente (fallback para 8080).
  const port = process.env.PORT ? Number(process.env.PORT) : 8080;
  // Inicia o servidor HTTP.
  await app.listen(port);
}

// Dispara o bootstrap da aplicacao.
bootstrap();
