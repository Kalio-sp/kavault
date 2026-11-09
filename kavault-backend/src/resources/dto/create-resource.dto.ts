import { ResourceType, LearningStatus } from '@prisma/client';

export class CreateResourceDto {
  title: string;
  url: string;
  description?: string;
  type?: ResourceType;
  status?: LearningStatus;
  tags?: string[];
  note?: string;
}
