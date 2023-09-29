
import {  PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';
export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ]
    transform(value: any) {
        // console.log("value", value)
        value = value.toUpperCase();
        // return value;

        if(!this.isStatusValid(value)){
            throw new BadRequestException(`"${value}" is an invalid status`)

       
        }
        return value;
        
    }

   

    private isStatusValid(status: any){
       const idx = this.allowedStatuses.indexOf(status) !== -1;
         return idx;
    }
    // console.log("value", value)")    

}