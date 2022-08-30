export class Random {
    constructor(seed) {
        this.seed = seed
        this.state = Uint32Array.from([0, 0, 0, 0].map((_, i) => parseInt(seed.substr(i * 8 + 2, 8), 16)))
    }

    // random_dec() - random decimal (0-1)
    random_dec() {
        let s, t = this.state[3]
        this.state[3] = this.state[2]
        this.state[2] = this.state[1]
        this.state[1] = s = this.state[0]
        t ^= t << 11
        t ^= t >>> 8
        this.state[0] = t ^ s ^ (s >>> 19)

        return this.state[0] / 0x100000000
    };

    // random_num(0, 10) - random decimal (0-10)
    random_num(a, b) {
        return a + (b - a) * this.random_dec()
    }

    // random_int(0, 10) - random integer (0-10)
    random_int(a, b) {
        return Math.floor(this.random_num(a, b + 1))
    }

    //random_bool(0.5) - random boolean with probability 0.5
    random_bool(p) {
        return this.random_dec() < p
    }

    // random_choice([1, 2, 3]) - Random choice from a given list. Nice for random from a discreet set like a color palette
    random_choice(list) {
        return list[Math.floor(this.random_num(0, list.length * 0.99))]
    }

    // shuffle array (from canvas-sketch-utils)
    shuffle(arr) {
        let rand
        let tmp
        let len = arr.length
        let ret = arr.slice()

        while (len) {
            rand = Math.floor(this.random_dec() * len--)
            tmp = ret[len]
            ret[len] = ret[rand]
            ret[rand] = tmp
        }

        return ret
    }
}

export function random_hash() {
    let x = '0123456789abcdef', hash = '0x'

    for (let i = 64; i > 0; --i) {
        hash += x[Math.floor(Math.random() * x.length)]
    }

    return hash
}  