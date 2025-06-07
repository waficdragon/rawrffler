export class RaffleUser {
    private static counter = 0
    id: string
    name: string
    image: string

    public static resetCounter() {
        RaffleUser.counter = 0
    }

    constructor(name?: string, image?: string) {
        this.id = `${Date.now().toString(36)}-${RaffleUser.counter++}`
        this.name = name || ''
        this.image = image || ''
    }
}