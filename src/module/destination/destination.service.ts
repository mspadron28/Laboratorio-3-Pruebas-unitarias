import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationService {
  constructor(private prisma: PrismaService) {}

  async create(createDestinationDto: CreateDestinationDto) {
    return this.prisma.destination.create({
      data: createDestinationDto,
    });
  }

  async findAll() {
    return this.prisma.destination.findMany({
      include: { trips: true }, // Opcional: para incluir los viajes asociados
    });
  }

  async findOne(id: number) {
    const destination = await this.prisma.destination.findUnique({
      where: { destination_id: id },
      include: { trips: true }, // Opcional: para incluir viajes
    });
    if (!destination) throw new NotFoundException(`Destination with ID ${id} not found`);
    return destination;
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto) {
    return this.prisma.destination.update({
      where: { destination_id: id },
      data: updateDestinationDto,
    });
  }

  async remove(id: number) {
    return this.prisma.destination.delete({ where: { destination_id: id } });
  }
}
