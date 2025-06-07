import { RaffleUser } from "@/types/RaffleUser"
import { getActor, getThread } from "@/fetch/bsky"

export async function useGetBskyParticipants(postUrl: string, opts: { removeHost: boolean }): Promise<RaffleUser[]> {

    if (!postUrl.startsWith('https://')) {
        postUrl = 'https://' + postUrl
    }

    const [domain, s2, hostHandle, s4, postId] = postUrl.replace('https://', '').split('/')

    const actor = await getActor(hostHandle)
    const did = actor.did

    const users = new Map<string, RaffleUser>()
    const { thread } = await getThread(did, postId)

    for (const { post } of thread.replies) {
        const handle = post.author.handle
        const name = post.author.displayName || handle
        const image = post.author.avatar
        users.set(handle, new RaffleUser(name, image))
    }

    if (opts.removeHost) {
        users.delete(hostHandle)
    }

    return [...users.values()]
}