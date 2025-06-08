import { BskyUser } from "@/types/BskyUser"

export const getActor = async (hostHandle: string) => {
    const getActor = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${hostHandle}`)
    return await getActor.json()
}

export const getPosts = async (did: string, postId: string) => {
    const getPosts = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts?uri=at://${did}/app.bsky.feed.post/${postId}&depth=1&parentHeight=0`)
    return await getPosts.json()
}

export const getThreadUsers = async (did: string, postId: string): Promise<Map<string, BskyUser>> => {
    const getThread = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${did}/app.bsky.feed.post/${postId}&depth=1&parentHeight=0`)
    const { thread } = await getThread.json()

    const threadUsers = new Map<string, BskyUser>()
    for (const { post } of thread.replies) {
        threadUsers.set(post.author.handle, {
            did: post.author.did,
            handle: post.author.handle,
            displayName: post.author.displayName,
            avatar: post.author.avatar
        })
    }

    return threadUsers
}

export const getFollowers = async (did: string) => {
    const _followers = new Map<string, BskyUser>()
    let _cursor = true

    while (_cursor) {
        const getFollowers = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.graph.getFollowers?actor=${did}&limit=100&cursor=${_cursor}`)
        const { followers, cursor } = await getFollowers.json()
        followers.map(user => _followers.set(user.handle, { did: user.did, handle: user.handle, displayName: user.displayName, avatar: user.avatar }))
        _cursor = cursor
    }

    return _followers
}

export const getRepostedBy = async (did: string, postId: string) => {
    const reposts = new Map<string, BskyUser>()
    let _cursor = true

    while (_cursor) {
        const getRepostedBy = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getRepostedBy?uri=at://${did}/app.bsky.feed.post/${postId}&limit=100&cursor=${_cursor}`)
        const { repostedBy, cursor } = await getRepostedBy.json()
        repostedBy.forEach(user => reposts.set(user.handle, { did: user.did, handle: user.handle, displayName: user.displayName, avatar: user.avatar }))
        _cursor = cursor
    }

    return reposts
}