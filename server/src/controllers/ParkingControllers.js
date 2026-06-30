import { prisma } from "../lib/prisma.js";

const parkings = async(req,res) =>{
    try {

        const { location } = req.query;
        const { cursor, limit = 10} = req.query;
        

        const parkings = await prisma.parking.findMany({
            where: {
                city: location
            },
            take: Number(limit),
            ...(cursor && {
                skip: 1,
                cursor:{
                    id: cursor
                }
            }),
            orderBy:{
                createdAt: "desc"
            },
            select:{
                id: true,
                parkingName: true,
                city: true,
                state: true,
                parkingImages:{
                    select:{
                        imageUrl: true
                    }
                },
                parkingTypes:{
                    select:{
                        id: true,
                        vehicleType: true,
                        pricePerHour: true,
                        slotsAvailable: true
                    }
                }
            }
        });

        const nextCursor = parkings.length  === Number(limit) ? parkings[parkings.length - 1 ].id : null;

        return res.status(200).json({
            message: "Parking Fetched successfully",
            parkings,
            nextCursor
        });
        
        
    } catch (error) {
        return res.status(500).json({ message: "Internal Server error", error: error.message});
        
    }
}


export {
    parkings
}