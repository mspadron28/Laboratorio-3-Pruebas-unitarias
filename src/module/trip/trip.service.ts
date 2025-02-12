import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/module/prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  async create(createTripDto: CreateTripDto) {
    return this.prisma.trip.create({
      data: createTripDto,
    });
  }

  async findAll() {
    return this.prisma.trip.findMany({
      include: { destination: true, reservations: true },
    });
  }

  async findOne(id: number) {
    const trip = await this.prisma.trip.findUnique({
      where: { trip_id: id },
      include: { destination: true, reservations: true },
    });
    if (!trip) throw new NotFoundException(`Trip with ID ${id} not found`);
    return trip;
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    return this.prisma.trip.update({
      where: { trip_id: id },
      data: updateTripDto,
    });
  }

  async remove(id: number) {
    return this.prisma.trip.delete({ where: { trip_id: id } });
  }
}
