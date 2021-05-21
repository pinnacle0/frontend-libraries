export function generateDummyStrings(length: number): string[] {
    const results = [];

    for (let i = 0; i < length; i++) {
        results.push(Math.random().toString(36).substring(2));
    }

    return results;
}

/**
 * Long string will have length above 30 chars.
 */
export function generateDummyLongStrings(length: number): string[] {
    return [
        "Lets all be unique together until we realise we are all the same.",
        "Nobody loves a pig wearing lipstick.",
        "Last Friday I saw a spotted striped blue worm shake hands with a legless lizard.",
        "Eating eggs on Thursday for choir practice was recommended.",
        "There's a reason that roses have thorns.",
        "He enjoys practicing his ballet in the bathroom.",
        "Greetings from the galaxy MACS0647-JD, or what we call home.",
        "She tilted her head back and let whip cream stream into her mouth while taking a bath.",
        "She was the type of girl who wanted to live in a pink house.",
        "His son quipped that power bars were nothing more than adult candy bars.",
        "She could hear him in the shower singing with a joy she hoped he'd retain after she delivered the news.",
        "He is no James Bond; his name is Roger Moore.",
        "The thunderous roar of the jet overhead confirmed her worst fears.",
        "You're unsure whether or not to trust him, but very thankful that you wore a turtle neck.",
        "If I don’t like something, I’ll stay away from it.",
        "The blinking lights of the antenna tower came into focus just as I heard a loud snap.",
        "The green tea and avocado smoothie turned out exactly as would be expected.",
        "Truth in advertising and dinosaurs with skateboards have much in common.",
        "Sometimes I stare at a door or a wall and I wonder what is this reality, why am I alive, and what is this all about?",
        "It was the best sandcastle he had ever seen.",
        "He hated that he loved what she hated about hate.",
    ].slice(0, length);
}

export function generateDummyURLs(length: number): string[] {
    return [
        "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
        "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png",
        "https://homepages.cae.wisc.edu/~ece533/images/baboon.png",
        "https://homepages.cae.wisc.edu/~ece533/images/barbara.png",
        "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
        "https://homepages.cae.wisc.edu/~ece533/images/cat.png",
        "https://homepages.cae.wisc.edu/~ece533/images/fruits.png",
        "https://homepages.cae.wisc.edu/~ece533/images/frymire.png",
        "https://homepages.cae.wisc.edu/~ece533/images/girl.png",
        "https://homepages.cae.wisc.edu/~ece533/images/goldhill.png",
        "https://homepages.cae.wisc.edu/~ece533/images/lena.png",
        "https://homepages.cae.wisc.edu/~ece533/images/monarch.png",
        "https://homepages.cae.wisc.edu/~ece533/images/mountain.png",
        "https://homepages.cae.wisc.edu/~ece533/images/peppers.png",
        "https://homepages.cae.wisc.edu/~ece533/images/pool.png",
        "https://homepages.cae.wisc.edu/~ece533/images/sails.png",
        "https://homepages.cae.wisc.edu/~ece533/images/serrano.png",
        "https://homepages.cae.wisc.edu/~ece533/images/tulips.png",
        "https://homepages.cae.wisc.edu/~ece533/images/watch.png",
        "https://homepages.cae.wisc.edu/~ece533/images/zelda.png",
    ].slice(0, length);
}
