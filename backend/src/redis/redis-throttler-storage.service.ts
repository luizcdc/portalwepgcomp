import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';

// Definindo manualmente o tipo ThrottlerStorageRecord
interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottlerStorageService implements ThrottlerStorage {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST, // Substitua pelo host gerado no Redis Cloud
      port: parseInt(process.env.REDIS_PORT, 10), // Porta padrão do Redis
      password: process.env.REDIS_PASSWORD, // Substitua pela senha gerada no Redis Cloud
      tls: {}, // Ative TLS se necessário
    });
  }

  async getRecord(key: string): Promise<number[]> {
    const record = await this.redisClient.lrange(key, 0, -1);
    return record.map((timestamp) => parseInt(timestamp, 10));
  }

  async addRecord(key: string, ttl: number): Promise<void> {
    const now = Date.now();
    await this.redisClient.rpush(key, now.toString());
    await this.redisClient.expire(key, ttl);
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const now = Date.now();
    const keyBlock = `${key}:block`;

    // Verifica se o usuário está bloqueado
    const isBlocked = await this.redisClient.get(keyBlock);
    if (isBlocked) {
      const timeToBlockExpire = await this.redisClient.ttl(keyBlock);
      return {
        totalHits: limit,
        timeToExpire: 0,
        isBlocked: true,
        timeToBlockExpire: timeToBlockExpire || blockDuration,
      };
    }

    // Adiciona um novo hit
    await this.redisClient.rpush(key, now.toString());

    // Define o TTL para os registros
    await this.redisClient.expire(key, ttl);

    // Recupera os registros atualizados
    const hits = await this.getRecord(key);

    // Limpa registros fora da janela de tempo
    const validHits = hits.filter((timestamp) => now - timestamp <= ttl * 1000);

    // Bloqueia se o limite for excedido
    if (validHits.length > limit) {
      await this.redisClient.set(keyBlock, '1', 'EX', blockDuration);
      return {
        totalHits: validHits.length,
        timeToExpire: 0,
        isBlocked: true,
        timeToBlockExpire: blockDuration,
      };
    }

    // Retorna os dados atualizados
    return {
      totalHits: validHits.length,
      timeToExpire: ttl - Math.floor((now - validHits[0]) / 1000),
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }
}
