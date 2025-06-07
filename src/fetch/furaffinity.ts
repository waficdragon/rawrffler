// you need a server here for scraping the site
export const getFAMarkup = async (postURL: string): Promise<string> => {
    const req = await fetch(`${import.meta.env.VITE_SERVER}/getfamarkup?url=${postURL}`)
    if (!req.ok) throw await req.json()
    return await req.text()
}