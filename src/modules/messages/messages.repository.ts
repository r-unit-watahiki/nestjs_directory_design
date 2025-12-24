import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesRepository {
  private messages: Message[] = [];

  create(createMessageDto: CreateMessageDto): Message {
    const message: Message = {
      id: Date.now().toString(),
      ...createMessageDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  findAll(): Message[] {
    return this.messages;
  }

  findOne(id: string): Message | undefined {
    return this.messages.find((message) => message.id === id);
  }

  update(id: string, updateMessageDto: UpdateMessageDto): Message | undefined {
    const index = this.messages.findIndex((message) => message.id === id);
    if (index === -1) return undefined;

    this.messages[index] = {
      ...this.messages[index],
      ...updateMessageDto,
      updatedAt: new Date(),
    };
    return this.messages[index];
  }

  remove(id: string): boolean {
    const index = this.messages.findIndex((message) => message.id === id);
    if (index === -1) return false;

    this.messages.splice(index, 1);
    return true;
  }
}
