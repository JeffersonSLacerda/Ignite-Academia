import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCheckInsRepository implements CheckInsRepository{
  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId
      }, 
      take: 20,
      skip: (page - 1) * 20 
    })

    return checkIns
  }
  async countByUserId(userId: string){
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    })

    return count
  }
  async findByUserIdOnDate(userId: string, date: Date){
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          equals: new Date(
            date.getFullYear(),
            date.getMonth() - 1,
            date.getDay(),
          ),
        },
      },
    })
    return checkIn
  }
  async save(checkIn: CheckIn){
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id
      }, data: checkIn
    })

    return updatedCheckIn
  }
  async create(data: Prisma.CheckInUncheckedCreateInput){
    const checkIn = await prisma.checkIn.create({
      data
    })

    return checkIn
  }

  async findById(checkInId: string){
    const checkIn = await prisma.checkIn.findUnique({
      where: {id: checkInId}
    })

    return checkIn
  }


}