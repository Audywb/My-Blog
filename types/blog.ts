export type Comment = {
    id: number;
    authorName: string;
    content: string;
    status: string;
    createdAt: Date;
    blogId: number;
};

export type Blog = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    published: boolean;
    viewCount: number;
    createdAt: Date;
    updatedAt?: Date;

    images?: {
        id: number;
        imageUrl: string;
    }[];

    comments?: Comment[];
};