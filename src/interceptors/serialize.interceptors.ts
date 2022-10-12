import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from 'class-transformer'

interface ClassConstructor{
    new (...args: any[]):{}
}

export function Serialize(dto:ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}


export class SerializeInterceptor implements NestInterceptor{

    constructor(private dto: any){}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {


        /* console.log("I am running before handler")*/

        return next.handle().pipe(
            map((data:any)=>{

                /* console.log('Im running before response is sent out') */
                return plainToInstance(this.dto,data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }

}