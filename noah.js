document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const creditsDisplay = document.getElementById('credits');
    const rspDisplay = document.getElementById('rsp');
    const relationshipLevelDisplay = document.getElementById('relationship-level');
    let credits = 20000;
    let rsp = 0; // Starting RSP is 0
    let playedVideos = {};

    const relationshipLevels = [
        { name: "Enemy", threshold: -2 },
        { name: "Hater", threshold: -1 },
        { name: "Stranger", threshold: 0 },
        { name: "Casual", threshold: 10 },
        { name: "Friend", threshold: 15 },
        { name: "Homie", threshold: 50 },
        { name: "BF/GF", threshold: 100 },
        { name: "Soulmate", threshold: 250 },
    ];

    const eventVideos = {
        hi: {url: 'https://streamable.com/e/o2etrc?autoplay=1&loop=0', cost: 5, rsp: 3},
        name: {url: 'https://streamable.com/e/jk9yo2?autoplay=1&loop=0', cost: 5, rsp: 3},
        wanna: {url: 'https://streamable.com/e/w69a6y?autoplay=1&loop=0', cost: 5, rsp: 3},
        fantasy: {url: 'https://streamable.com/e/a9s20c?autoplay=1&loop=0', cost: 5, rsp: 3},
        age: {url: 'https://streamable.com/e/8p2f3n?autoplay=1&loop=0', cost: 5, rsp: 3},
        secret: {url: 'https://streamable.com/e/vtwzeh?autoplay=1&loop=0', cost: 5, rsp: 3},
        cute: {url: 'https://streamable.com/e/xmoaov?autoplay=1&loop=0', cost: 5, rsp: 3},
    };

    const homiesVideos = {
        concert: {url: 'https://streamable.com/e/txz0iz?autoplay=1&loop=0', cost: 150, rsp: 15},
        abandoned: {url: 'https://streamable.com/e/rj2lck?autoplay=1&loop=0', cost: 150, rsp: 15},
        walk: {url: 'https://streamable.com/e/8pw5vz?autoplay=1&loop=0', cost: 150, rsp: 15},
    };

    const additionalVideos = {
        pants: {url: 'https://streamable.com/e/pqjnm7?autoplay=1&loop=0', cost: 5000, rsp: 30},
        shirt: {url: 'https://streamable.com/e/n3zdlw?autoplay=1&loop=0', cost: 5000, rsp: 30},
        shower: {url: 'https://streamable.com/e/cdhysd?autoplay=1&loop=0', cost: 5000, rsp: 30},
        feet: {url: 'https://streamable.com/e/ero5p2?autoplay=1&loop=0', cost: 5000, rsp: 30},
        waist: {url: 'https://streamable.com/e/cmjn19?autoplay=1&loop=0', cost: 5000, rsp: 30},
    };

    const randomVideos = [
        'https://streamable.com/e/wj5lp4?autoplay=1&loop=0',
        'https://streamable.com/e/87wkv9?autoplay=1&loop=0',
    ];

    const mismatchVideos = [
        'https://streamable.com/e/mlg8kh?autoplay=1&loop=0',
        'https://streamable.com/e/z0gpqa?autoplay=1&loop=0',
        'https://streamable.com/e/lieqjs?autoplay=1&loop=0',
    ];

    function updateVideo(url) {
        const videoPlaceholder = document.getElementById('video-placeholder');
        videoPlaceholder.innerHTML = `<iframe allow="fullscreen; autoplay" allowfullscreen height="100%" src="${url}" width="100%" style="border: none; width: 100%; height: 100%; position: absolute; left: 0; top: 0; overflow: hidden;"></iframe>`;
    }

    function updateScores(rspChange, videoCost) {
        if (credits <= 0) {
            rsp += rspChange; // Deduct 1 RSP for trying an action without credits
        } else if (credits - videoCost < 0) {
            returnToIdle();
            return;
        } else {
            credits -= videoCost;
            rsp += rspChange;
        }

        rspDisplay.textContent = `RSP: ${rsp}`;
        creditsDisplay.textContent = `Credits: ${credits}`;
        updateRelationshipLevel();
    }

    function updateRelationshipLevel() {
        let levelName = "Stranger"; // Default to "Stranger"

        for (let i = 0; i < relationshipLevels.length; i++) {
            if (rsp >= relationshipLevels[i].threshold) {
                levelName = relationshipLevels[i].name;
            } else {
                break; // Found the correct level
            }
        }

        relationshipLevelDisplay.textContent = `Relationship Level: ${levelName}`;
    }

    function selectRandomVideo(videos) {
        const randomIndex = Math.floor(Math.random() * videos.length);
        return videos[randomIndex];
    }

    function returnToIdle() {
        const randomVideoUrl = selectRandomVideo(randomVideos);
        updateVideo(randomVideoUrl);
    }

    function playVideo(videoKey, videoObj) {
        if (credits < videoObj.cost) {
            updateScores(-1, 0); // Deduct 1 RSP for trying to play without enough credits
            returnToIdle();
            return;
        }

        if (playedVideos[videoKey]) {
            // Video has been played before; do not increase RSP
            updateVideo(videoObj.url);
        } else {
            // Mark as played and apply RSP changes
            playedVideos[videoKey] = true;
            updateVideo(videoObj.url);
            updateScores(videoObj.rsp, videoObj.cost);
        }
    }

    function handleInput(input) {
        if (credits <= 0) {
            updateScores(-1, 0); // Apply negative RSP when credits are 0
            returnToIdle();
            return;
        }

        let matched = false;
        const videoCollections = [eventVideos, homiesVideos, additionalVideos];
        for (const collection of videoCollections) {
            if (collection.hasOwnProperty(input)) {
                playVideo(input, collection[input]);
                matched = true;
                return; // Found and played a match
            }
        }

        if (!matched) {
            const mismatchVideoUrl = selectRandomVideo(mismatchVideos);
            updateVideo(mismatchVideoUrl);
            updateScores(-1, 1); // Deduct RSP and credit for mismatch
        }
    }

    submitBtn.addEventListener('click', () => {
        const input = userInput.value.toLowerCase();
        userInput.value = ''; // Clear the input field
        handleInput(input);
    });

    // Initialize the relationship level display based on the current RSP
    updateRelationshipLevel();
});
