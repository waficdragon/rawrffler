export const getActor = async (hostHandle: string) => {
    const getActor = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${hostHandle}`)
    return await getActor.json()
}

export const getThread = async (did: string, postId: string) => {
    const getThread = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=at://${did}/app.bsky.feed.post/${postId}&depth=1&parentHeight=0`)
    return await getThread.json()
}