import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingOrdersModule } from './shipping-orders/shipping-orders.module';
import { ApiTokenMiddleware } from './auth/middlewares/api-token.middleware';
import { envs } from './config/envs';
import { RoutesModule } from './routes/routes.module';
import { DriversModule } from './drivers/drivers.module';
import { TrucksModule } from './trucks/trucks.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbDatabase,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.register({
      store: redisStore,
      host: envs.redisHost,
      port: envs.redisPort,
      ttl: envs.redisTTL,
      isGlobal: true,
    }),
    AuthModule,
    ShippingOrdersModule,
    RoutesModule,
    DriversModule,
    TrucksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiTokenMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
