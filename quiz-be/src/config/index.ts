import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getConfigDatabase = (
  config: ConfigService,
): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> => {
  return {
    type: 'mysql',
    host: config.get<string>('MYSQL_HOST') || 'localhost',
    port: parseInt(config.get<string>('MYSQL_PORT') || '3306', 10),
    username: config.get<string>('MYSQL_USER') || 'root',
    password: config.get<string>('MYSQL_PASSWORD') || 'password',
    database: config.get<string>('MYSQL_DATABASE') || 'quiz',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
  };
};
