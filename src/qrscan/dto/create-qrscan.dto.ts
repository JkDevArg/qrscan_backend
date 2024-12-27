import { IsString, IsUrl } from "class-validator";

export class CreateQrscanDto {
    @IsString()
    @IsUrl()
    url: string;
}
