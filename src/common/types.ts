export interface User {
    id: string;
    name?: string | null;
    username?: string | null;
    createdAt: Date;
    updatedAt: Date;
    photos?: Photo[];
    comments?: Comment[];
  }

export interface Photo {
    id: string;
    url: string;
    description?: string | null;
    createdAt: Date;
    userId: string;
    user?: User;
    comments?: Comment[];
  }
  
  // Comment Type
  export interface Comment {
    id: string;
    text: string;
    createdAt: Date;
    userId: string;
    photoId: string;
    user?: User;
    photo?: Photo;
  }