import {BlogTypeOutput} from "./blogs-types";

export type URIParamsPostModel = {
    /**
     * id of existing post
     */
    postId: string
}

// class  Человек {
//     рука: строка
//
//     печататьрукой(){}
// }
//
// class Левша extends  Человек {
//     печататьрукой() {
//         super.печататьрукой();
//         печатать.леовой рукой
//     }
// }
//
// class првша extends Человек{
//     печататьрукой() {
//         super.печататьрукой();
//         печатать правой рукой
//     }
// }


export type URIParamsBlogModel = {
    /**
     * id of existing blog
     */
    id: string
}

export type URIParamsIDBlogModel = {
    /**
     * for finding posts by blogs id
     */
    blogId: string
}

export type URIParamsGetPostByBlogIdModel = {
    /**
     * When you need get post by blog id
     */
    blogId: string
}

export type URIParamsCommentModel = {
    postId: string
}

export type CreatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type UpdatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type CreateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type UpdateBlogModel = {
    name: string,
    description: string,
    websiteUrl: string,
}

export type CreateCommentModel = {
    content: string
}

type QueryParamsType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: string,
    pageSize: string,
}

export type RequestBlogsQueryModel = {
    searchNameTerm: string,
} & QueryParamsType

export type RequestUsersQueryModel = {
    searchLoginTerm: string,
    searchEmailTerm: string,
} & QueryParamsType

export type RequestPostsQueryModel = QueryParamsType

export type RequestPostsByBlogsIdQueryModel = QueryParamsType

export type RequestCommentsByPostIdQueryModel = QueryParamsType


export type PaginationOutputModel<T> = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: T[]
}

// export type PaginationPostOutputModel = {
//     pagesCount: number,
//     page: number,
//     pageSize: number,
//     totalCount: number,
//     items: any
// }
//
// export type PaginationUserOutputModel = {
//     pagesCount: number,
//     page: number,
//     pageSize: number,
//     totalCount: number,
//     items: any
// }

