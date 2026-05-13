/**
 * Intercepteur pour standardiser les réponses API
 * Enveloppe automatiquement toutes les réponses dans un format cohérent
 */

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { ApiResponse } from '../types/api-response'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(
        _context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse> {
        return next.handle().pipe(
            map((data) => {
                // Si la réponse est déjà un objet avec un champ 'success', la retourner tel quel
                if (typeof data === 'object' && data !== null && 'success' in data) {
                    return data as ApiResponse
                }

                // Sinon, l'envelopper dans un format de réponse standard
                return {
                    success: true,
                    data,
                } as ApiResponse
            }),
        )
    }
}
