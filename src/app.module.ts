import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';
import configuration from 'config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb_uri'),
        dbName: 'bvirtual',
      }),
      inject: [ConfigService],
    }),
    BooksModule,
    UsersModule,
    RolesModule,
    SeedModule,
    FilesModule,
    AuthorsModule,
  ],
  controllers: [],
})
export class AppModule {}
