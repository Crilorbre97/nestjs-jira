import { CallHandler, ExecutionContext, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

export class RequestsInterceptor implements NestInterceptor {

    private readonly logger = new Logger(RequestsInterceptor.name)

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const startTime = Date.now()

        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()

        const { method, url } = request

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const endTime = Date.now()
                    const duration = endTime - startTime
                    const { statusCode } = response;

                    this.logger.verbose(
                    `${method} ${url} - ${statusCode} - ${duration}ms`,
                    );
                },
                error : (error) => {
                    const endTime = Date.now()
                    const duration = endTime - startTime
                    const { status } = error;

                    this.logger.error(
                    `${method} ${url} - ${status} - ${duration}ms - Error: ${error?.message}`
                    );
                }
            })
        )
    }
    
}