const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

function generateString(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const fetchData = () =>
    new Promise<string[]>(resolve => {
        setTimeout(() => {
            resolve(new Array(100).fill("a").map(() => generateString(random(10, 150))));
        }, random(30, 5000));
    });
