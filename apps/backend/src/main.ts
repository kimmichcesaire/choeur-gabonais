import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const isProdHelmet = process.env.NODE_ENV === 'production'
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:     ["'self'"],
        scriptSrc:      ["'self'"],
        styleSrc:       ["'self'", "'unsafe-inline'"],
        imgSrc:         ["'self'", 'data:', 'https:'],
        frameSrc:       ['https://www.youtube.com', 'https://www.youtube-nocookie.com'],
        connectSrc:     ["'self'"],
        fontSrc:        ["'self'"],
        objectSrc:      ["'none'"],
        upgradeInsecureRequests: isProdHelmet ? [] : null,
      },
    },
    hsts: isProdHelmet
      ? { maxAge: 31_536_000, includeSubDomains: true, preload: true }
      : false,
    xPoweredBy: false,
  }))

  const isProd = process.env.NODE_ENV === 'production'
  app.enableCors({
    origin: isProd
      ? process.env.FRONTEND_URL
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
  app.setGlobalPrefix('api')

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`Backend running on http://localhost:${port}/api`)
}
bootstrap()
