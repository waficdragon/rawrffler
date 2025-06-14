import { RaffleUser } from "@/types/RaffleUser"
import { getActor, getThreadUsers, getFollowers, getRepostedBy } from "@/fetch/bsky"

export async function useGetBskyParticipants(
    postUrl: string, 
    opts: { 
        removeHost: boolean, 
        mustBeAFollower: boolean,
        mustHaveReposted: boolean,
        addReplies: boolean, 
        addReposts: boolean
    }): Promise<RaffleUser[]> {

    if (!postUrl.startsWith('https://')) {
        postUrl = 'https://' + postUrl
    }

    const [domain, s2, hostHandle, s4, postId] = postUrl.replace('https://', '').split('/')

    const actor = await getActor(hostHandle)
    const did = actor.did

    const users = new Map<string, RaffleUser>()
    let [usersIterator, replies, followers, reposts] = [null, null, null, null]

    if (opts.addReplies) {
        replies = await getThreadUsers(did, postId)
        usersIterator = replies
    }
    
    if (opts.addReposts || opts.mustHaveReposted) {
        reposts = await getRepostedBy(did, postId)
        usersIterator = usersIterator ? new Map([...usersIterator, ...reposts]) : reposts
    }

    if (opts.mustBeAFollower) {
        followers = await getFollowers(did)
    }

    for (const user of [...usersIterator.values()]) {
        if (opts.mustBeAFollower && !followers.has(user.handle)) {
            continue
        }

        if (opts.mustHaveReposted && !reposts.has(user.handle)) {
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