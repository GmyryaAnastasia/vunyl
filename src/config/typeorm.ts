import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as process from 'process';

const config = {
  type: 'mysql',
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.DB_LOGIN,
  password: process.env.DB_PSS,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
