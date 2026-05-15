import { PartialType } from "@nestjs/mapped-types";
import { CreateExamDTO } from "./create-exam.dto";

export class UpdateExamDTO extends PartialType(CreateExamDTO) {

}