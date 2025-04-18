import express from "express";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js"
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();


router.post("/", protectRoute, async(req, res)=>{
    try{
        const {title, caption, rating, image} = req.body;
        if(!image || !title||!caption||!rating){
            return res.status(400).json({message:"Please provide all fields"});
        }
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user:req.user._id,
        });

        await newBook.save();
        res.status(201).json(newBook);
    }catch(error){
        console.log("Error creating new book", error);
        res.status(500).json({message:error.message});
    }
})

// pagination => infinite loading
router.get("/", protectRoute, async(req, res) => {
    try{
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = page(page -1) * limit;

        const books = await Book.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");
        
            const totalBooks = await Book.countDocuments();
        res.send({
            books,
            currentPage:page,
            totalBooks,
            totalPages: Math.ceil(totalBooks/limit),
        });
    }catch(error){
        console.log("Error creating new book", error);
        res.status(500).json({message:error.message});
    }
})

router.get("/user", protectRoute, async (req, res)=>{
    try{
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        res.json(books);
    }catch(error){
        console.error("Get user books error", error.message);
        res.status(500).json({message:"Server error"});
    }
})

router.delete("/:id", protectRoute, async(req, res) => {
    try{
        const book = await Book.findById(req.param.id);
        if(!book) return res.status(404).json({message:"Book not found"});
        
        // check if user is the creator of the book
        if (book.user.toString()!== req.user._id.toString())
            return res.status(401).json({message:"Unauthorized"})
        // delete image from cloudinary as well
        if(book.image && book.image.includes("cloudinary")){
            try{
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }catch(error){
                console.log("Error while deleting image")
            }
        }
        await book.deleteOne()
        res.json({message:"Book deleted successfully"})
    }catch(error){
        console.log("Error while deleting book", error);
        res.status(500).json({message:"Internal server error"});
    }
});

export default router;