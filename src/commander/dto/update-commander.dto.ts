import { PartialType } from '@nestjs/swagger';
import { CreateCommanderDto } from './create-commander.dto';

export class UpdateCommanderDto extends PartialType(CreateCommanderDto) {}
