import { RaffleUser } from "@/types/RaffleUser"
import { getFAMarkup } from "@/fetch/furaffinity"

export async function useGetFAParticipants(postURL: string, opts: { removeHost: boolean }): Promise<RaffleUser[]> {

    if (!postURL.startsWith('https://')) {
        postURL = 'https://' + postURL
    }

    const html = await getFAMarkup(postURL)

    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    if (doc.querySelector('body').id === 'pageid-redirect') {
        throw new Error("Host's profile must be public!")
    }

    if (doc.querySelector('body').id === 'pageid-matureimage-error') {
        throw new Error("Post must be a journal or General rated!")
    }

    const comments = doc.querySelectorAll("comment-container")

    const users = new Map<string, RaffleUser>()
    const hostDisplayName = doc.querySelector('.submission-id-container .c-usernameBlockSimple__displayName')?.getAttribute('title').trim() ||
                            doc.querySelector('.c-usernameBlock.username-in-nav-bar .c-usernameBlock__userName').textContent.trim().substring(1)

    for (const comment of Array.from(comments)) {
        const image = (comment.querySelector('.avatar img') as HTMLImageElement).src
        const userName = comment.querySelector("comment-username .js-userName-block").textContent.trim().substring(1)
        const name = comment.querySelector("comment-username .js-displayName").textContent
        users.set(userName, new RaffleUser(name, image))
    }

    if (opts.removeHost) {
        users.delete(hostDisplayName)
    }

    return [...users.values()]
}