import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {NestFactory} from "@nestjs/core";
import * as process from "process";

async function start() {
    const PORT = 3000 ;
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Vinyl store')
        .setDescription('Vinyl store API description')
        .setVersion('1.0')
        .addCookieAuth('token')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.use(cookieParser());
    await app.listen(PORT, () => {
        console.log(`Service started on port = ${PORT}`);
    });
}

start();
