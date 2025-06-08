import { RaffleUser } from "@/types/RaffleUser"
import { getActor, getThreadUsers, getFollowers, getRepostedBy } from "@/fetch/bsky"

export async function useGetBskyParticipants(
    postUrl: string, 
    opts: { 
        removeHost: boolean, 
        mustBeAFollower: boolean,
        mustHaveRespoted: boolean,
        addReplies: boolean, 
        addReposts: boolean
    }): Promise<RaffleUser[]> {

    if (!postUrl.startsWith('https://')) {
        postUrl = 'https://' + postUrl
    }

    const [domain, s2, hostHandle, s4, postId] = postUrl.replace('https://', '').split('/')

    const actor = await getActor(hostHandle)
    const did = actor.did

    let usersIterator: Map<string, any>
    const users = new Map<string, RaffleUser>()
    let [replies, followers, reposts] = [null, null, null]

    if (opts.addReplies) {
        replies = await getThreadUsers(did, postId)
        usersIterator = replies
    }
    
    if (opts.addReposts || opts.mustHaveRespoted) {
        reposts = await getRepostedBy(did, postId)
        usersIterator = new Map([...usersIterator, ...reposts]) ?? reposts
    }

    if (opts.mustBeAFollower) {
        followers = await getFollowers(did)
        usersIterator = usersIterator ?? followers
    }

    for (const user of [...usersIterator.values()]) {
        if (opts.mustBeAFollower && !followers.has(user.handle)) {
            continue
        }

        if (opts.mustHaveRespoted && !reposts.has(user.handle)) {
            continue
        }

        const handle = user.handle
        const name = user.displayName || handle
        const image = user.avatar
        users.set(handle, new RaffleUser(name, image))
    }

    if (opts.removeHost) {
        users.delete(hostHandle)
    }

    return [...users.values()]
}