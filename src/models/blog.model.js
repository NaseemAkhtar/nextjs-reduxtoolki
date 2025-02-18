import mongoose,{Schema} from "mongoose";
        
const BlogSchema = Schema({
    title: {
        type: String,
        required: true,
        min: 4
    },
    description: {
        type: String,
        required: true,
        min: 10
    },
    excerpt: {
        type: String,
        required: true,
        min:6
    },
    quote: {
        type: String,
        required: true,
        min:6
    },
    image: {
        id:{
            type: String,
        },
        url: {
            type: String
        }
    },
    category: {
        type: String,
        required: true, 
        enum: ["Songbirds", "Waterfowl", "Parrots", "Seabirds", "Gamebirds"]
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {timestamps: true})

export const Blog = mongoose?.models.Blog || mongoose.model("Blog", BlogSchema)