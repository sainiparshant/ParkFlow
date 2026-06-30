import imagekit from '../config/imagekit.js';
import {prisma} from '../lib/prisma.js';

const vendorProfile = async (req, res) => {
    let documentId = null;

    try{
        const vendorId = req.user.id;
        if(!vendorId){
            return res.status(400).json({ error: 'Vendor ID is required' });
        }

        const {phoneNumber, idType, idNumber} = req.body;
        if(!phoneNumber || !idType || !idNumber){
            return res.status(400).json({ error: 'All fields are required' });
        }

        if(!req.file){
            return res.status(400).json({ error: 'Document is required' });
        }

        const profileExists = await prisma.VendorProfile.findUnique({
            where: { userId: vendorId }
        });
        if(profileExists){
            return res.status(400).json({ error: 'Vendor profile already exists' });
        }


        const response = await imagekit.upload({
            file: req.file.buffer,
            fileName: `${Date.now()}.jpg`
        });
        

        const documentUrl = response.url;
        documentId = response.fileId;

        const createProfile = await prisma.VendorProfile.create({
            data:{
                phoneNumber: phoneNumber,
                userId: vendorId,
                idType: idType,
                idNumber: idNumber,
                documentUrl: documentUrl,
                documentId: documentId
            }
        });

        return res.status(201).json({ message: 'Vendor profile created successfully', profile: createProfile });


    }
    catch (error) {        

        console.error('Error creating vendor profile:', error);

        if(documentId){
            try{
                await imagekit.deleteFile(documentId);
            }
            catch (error) {
                console.error('Error deleting document:', error);
            }
        }

        return res.status(500).json({ error: 'Internal server error' });

    }
}

const addParking = async (req, res) => {
    const imageIds = [];
    
    try {
        const vendorId = req.user.id;
        if(!vendorId){
            return res.status(400).json({ error: 'Vendor ID is required' });
        }

        const {parkingName, ownerName, pincode, state, city, address} = req.body;
        if(!parkingName || !ownerName || !pincode || !state || !city || !address){
            return res.status(400).json({ error: 'All fields are required' });
        }

        const { vehicleType} = req.body;
        const totalSlots = parseInt(req.body.totalSlots, 10)
        const pricePerHour = parseFloat(req.body.pricePerHour, 10)
        const pricePerDay = parseFloat(req.body.pricePerDay, 10)
        const slotsAvailable = parseInt(req.body.slotsAvailable, 10)

        if(!vehicleType || totalSlots == null || pricePerHour == null || slotsAvailable == null || pricePerDay == null){
            return res.status(400).json({ error: 'All fields are required' });
        }

        if(!req.files || req.files.length === 0){
            return res.status(400).json({ error: 'At least one image is required' });
        }

        const imageUrls = [];
        const timestamp = Date.now();
        
        for(let i = 0; i < req.files.length; i++){
            const file = req.files[i];
            const response = await imagekit.upload({
                file: file.buffer,
                fileName: `${timestamp}_${i}_${file.originalname}`
            });
            imageUrls.push(response.url);
            imageIds.push(response.fileId);
        }

        const createParking = await prisma.Parking.create({
            data: {
                parkingName,
                ownerName,
                pincode,
                state,
                city,
                address,
                vendorId
            }
        });

        const parkingType = await prisma.ParkingType.create({
            data: {
                vehicleType,
                totalSlots,
                pricePerHour,
                pricePerDay,
                slotsAvailable,
                parkingId: createParking.id
            }
        });

        const imageData = imageUrls.map((url, idx) => ({
            imageUrl: url,
            imageId: imageIds[idx],
            parkingId: createParking.id
        }));

        const parkingImages = await prisma.parkingImages.createMany({
            data: imageData
        });

        const slotArray = [];
        for(let i=0; i< totalSlots; i++){
            slotArray.push({
                parkingId: createParking.id,
                parkingTypeId: parkingType.id
            });
        }  
        
        const parkingSlots = await prisma.parkingSlots.createMany({
            data: slotArray
        });

        return res.status(201).json({ 
            message: 'Parking added successfully',
            parking: createParking,
            parkingType,
            parkingImages
        });
    }
    catch(err) {
       
        if(imageIds.length > 0){
            for(const imageId of imageIds){
                try {
                    await imagekit.deleteFile(imageId);
                } catch(deleteErr) {
                    console.error('Error deleting image:', deleteErr);
                }
            }
        }

        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
}




export {
    vendorProfile,
    addParking
}