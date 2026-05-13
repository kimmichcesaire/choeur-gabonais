/**
 * Filtre d'exception global pour standardiser les réponses d'erreur
 */

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common'
import { Response } from 'express'
import type { ApiResponseError } from '../types/api-response'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        let status = HttpStatus.INTERNAL_SERVER_ERROR
        let message = 'Une erreur interne est survenue'

        if (exception instanceof HttpException) {
            status = exception.getStatus()
            const exceptionResponse = exception.getResponse()

            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const errorObj = exceptionResponse as Record<string, unknown>
                message = (errorObj.message as string) || message

                // NestJS retourne un array de messages pour la validation
                if (Array.isArray(message)) {
                    message = message[0] as string
                }
            } else {
                message = String(exceptionResponse)
            }
        } else if (exception instanceof Error) {
            // On logue le détail complet côté serveur mais on ne l'expose JAMAIS au client
            this.logger.error(`Erreur non gérée: ${exception.message}`, exception.stack)
        } else {
            this.logger.error(`Erreur inconnue: ${exception}`)
        }

        const errorResponse: ApiResponseError = {
            success: false,
            error: message,
        }

        response.status(status).json(errorResponse)
    }
}
