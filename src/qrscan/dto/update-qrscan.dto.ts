import { PartialType } from '@nestjs/mapped-types';
import { CreateQrscanDto } from './create-qrscan.dto';

export class UpdateQrscanDto extends PartialType(CreateQrscanDto) {}
