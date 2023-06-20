const cards_id = document.getElementById("cards");
const cards = document.querySelectorAll("#cards > div");
const bgOverlay = document.getElementById("background-overlay");
let zoomed = false;
let focus = null; // current zoomed card

let darken = false; // keeps track of when to darken card for rolling
const dim_overlay = document.getElementById("dim");

const descriptionBox = document.getElementById("description-box");
const description = document.getElementById("description");
const character = document.getElementById("name");

let flag = true; // for music playing

// bg music
let audio = document.querySelectorAll("audio");

let song_index = 0; 
const nextSong = () => {
    audio[song_index].pause();
    audio[song_index].currentTime = 0;
    ++song_index;
    if (song_index > audio.length - 1) { song_index = 0; }
    audio[song_index].volume = 0.2;
    audio[song_index].play();
    audio[song_index].loop = true;
}

const muteButton = document.getElementById("muteButton");
const toggleMute = () => {
    if (audio[song_index].muted) {
        audio[song_index].muted = false;
        muteButton.textContent = "Mute";
    } else {
        audio[song_index].muted = true;
        muteButton.textContent = "Unmute";
    }
}

// reset styles on hover to display deck
let played_sfx = false;
window.onmousemove = () => {
    cards_id.style.pointerEvents = "auto";
}

cards_id.onmouseover = () => {
    if (flag) {
        audio[0].volume = 0.2;
        audio[0].play();
        audio[0].loop = true;
        flag = false;
    }
    // important line to prevent weird behavior
    if (zoomed) { return; }
    if (!played_sfx) {
        const sfx = new Audio("media/spread.mp3");
        sfx.volume = 0.8;
        sfx.play();
        played_sfx = true;
    }
    for (const card of cards) { card.removeAttribute("style"); }
}

cards_id.onmouseleave = () => { 
    cards_id.style.pointerEvents = "none";
    played_sfx = false;
}

cards_id.onmouseout = () => {
    if (zoomed) { return; }
    const sfx = new Audio("media/card_hover.mp3");
        sfx.volume = 0.1;
        sfx.play();
}

// card click animation

const zoom = (curr_card) => {
    if (zoomed == false) {
        zoomed = true;
        focus = curr_card;
        const sfx = new Audio("media/buttong.mp3");
        sfx.play();
        // reset other cards
        for (const card of cards) {
            if (card != curr_card) {
                card.style.transform = "none";
            }
        }
        // bring enlarged card to front
        curr_card.style.zIndex = 3;
        curr_card.style.transform = "translate(-60%, 0%) scale(2.3)";
        
        // testing gacha effects
        // setTimeout(() => {
        //     character.style.display = "block"; 
        //     description.style.display = "block"; 
        //     focus.style.filter = "brightness(1)";
        //     rolling = false;
        //     dim_overlay.style.opacity = 0;
        //     let sfx = null; 
        //     if (focus.dataset.index == "1") {
        //         let tsun = new Audio("media/tsundere.mp3");
        //         tsun.currentTime = 0.6;
        //         tsun.play();
        //         sfx = new Audio("media/gacha.mp3");
        //         explodeConfetti("SS");
        //     }
        //     else if (focus.dataset.index == "2") {
        //         let oneesan = new Audio("media/hachi.mp3");
        //         oneesan.volume = 0.7;
        //         oneesan.play();
        //         sfx = new Audio("media/gacha.mp3");
        //         explodeConfetti("S");
        //     }
        //     else if (focus.dataset.index == "3") {
        //         let catgirl = new Audio("media/meow.mp3");
        //         catgirl.currentTime = 0.25;
        //         catgirl.volume = 0.7;
        //         catgirl.play();
        //         sfx = new Audio("media/gacha.mp3");
        //         explodeConfetti("Cat");
        //     }
        //     else if (focus.dataset.index == "4") {
        //         // filter curr card?
        //         focus.classList.add("filter_trans");
        //         simulateInjury(12);
        //         let kisu = new Audio("media/kisu.mp3");
        //         audio[song_index].volume = 0;
        //         kisu.currentTime = 0.9;
        //         kisu.play();
        //         sfx = new Audio("media/gacha_sss.mp3");
        //         explodeConfetti("SSS");
        //     }
        //     else if (focus.dataset.index == "7") {
        //         let pisspiss = new Audio("media/peace.mp3");
        //         pisspiss.volume = 0.7;
        //         pisspiss.currentTime = 0.6;
        //         pisspiss.play();
        //         sfx = new Audio("media/gacha.mp3");
        //         explodeConfetti("A");
        //     }
        //     else if (focus.dataset.index == "9") {
        //         audio[song_index].volume = 0;
        //         let lesbon = new Audio("media/lesbian.mp3");
        //         lesbon.volume = 0.8;
        //         lesbon.play();
        //         sfx = new Audio("media/gacha.mp3");
        //         explodeConfetti("A");
        //     }
        //     else if (focus.dataset.index == "10") {
        //         let onlyyou = new Audio("media/oho.mp3");
        //         onlyyou.volume = 0.6;
        //         onlyyou.play();
        //         sfx = new Audio("media/ougi.mp3");
        //         explodeConfetti("???");
        //     }
        //     else {
        //         sfx = new Audio("media/gacha.mp3");
        //         explodeConfetti("A");
        //     }
        //     sfx.play();

        //     // revert volume for audio change
        //     if (audio[song_index].volume == 0) {
        //         let d = 0;
        //         if (focus.dataset.index == "4") { d = 10500;}
        //         else if (focus.dataset.index == "9") { d = 4000; }
        //         setTimeout(() => {
        //             audio[song_index].volume = 0.2;
        //             vignette.style.opacity = 0;
        //             beat = 0;
        //             focus.classList.remove("filter_trans");
        //         }, d);
        //     }
        // }, 0);

        // show card info
        changeDescription(curr_card);
        curr_card.style.opacity = 1; 
        bgOverlay.style.opacity = 0;
        descriptionBox.style.opacity = 0.9;
        description.style.opacity = 1;
        character.style.opacity = 1;

        // for rolling
        if (darken) { 
            // console.log("blacked");
            character.style.display = "none"; 
            description.style.display = "none";
            descriptionBox.style.opacity = 0;
            setTimeout(() => { descriptionBox.style.display = "none"; }, 500);
            curr_card.style.filter = "brightness(0)"; 
            darken = false;
        }
    }
    else {
        // reset styles when unzoom
        zoomed = false;
        for (const card of cards) {
            card.removeAttribute("style");
        }
        bgOverlay.style.opacity = 0.9;
        descriptionBox.style.opacity = 0;
        description.style.opacity = 0;
        character.style.opacity = 0;
    }
}

// card shuffling

const shuffle = () => {
    if (zoomed) { return; }
    // console.log("shuffled");
    const sfx = new Audio("media/spread.mp3");
    sfx.volume = 0.8;
    sfx.play();
    let tmp = cards_id;
    let cardArray = Array.prototype.slice.call(tmp.getElementsByClassName("card"));
    cardArray.forEach((card) => {
        tmp.removeChild(card);
    });
    shuffleArray(cardArray);
    cardArray.forEach((card) => {
        tmp.appendChild(card);
    });

    for (const card of cardArray) {
        // randomize starting position
        card.style.transform = `translate(${getRand(-10, 10)}%, ${getRand(-5,5)}%) rotate(${getRand(-5,5)}deg)`;
    }
}
  
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const getRand = (min, max) => {
    // Generate a random number between 0 and 1
    const random = Math.random();
    // Scale the random number to the desired range
    const randomNumber = random * (max - min + 1) + min;
    // Round the number to the nearest integer if needed
    const roundedNumber = Math.round(randomNumber);
    return roundedNumber;
}


// arrow scrolling 

window.onkeydown = e => {
    if (!zoomed) { return; }
    if (!rolling && (e.key == " " || e.key == "Escape")) { zoom(focus); return; }
    // unzoom current card
    zoom(focus);
    if (e.key == "ArrowRight") {
        // reached right end, go back to start
        if (focus.nextElementSibling == null) { 
            for (let i = 0; i < 9; ++i) {
                focus = focus.previousElementSibling;
            }
        }
        else { focus = focus.nextElementSibling;}
    }
    else if (e.key == "ArrowLeft") {
        // reached left end, go forward to end
        if (focus.previousElementSibling == null) { 
            for (let i = 0; i < 9; ++i) {
                focus = focus.nextElementSibling;
            }
        }
        else { focus = focus.previousElementSibling;}
    }
    zoom(focus);
}



// wheel scrolling

let tickCount = 0;
const tickThreshold = 6; // Control sensitivity 
window.onwheel = e => {
    let measurement = 0;
    if (!zoomed) { return; }
    ++tickCount;

    if (tickCount >= tickThreshold) {
        tickCount = 0;
        zoom(focus); 
        const scrollDelta = -Math.sign(e.deltaY);
        
        // Define the minimum and maximum indexes
        const minValue = -10;
        const maxValue = 10;

        measurement += scrollDelta;
        measurement = Math.max(minValue, Math.min(maxValue, measurement));

        // Log the updated measurement
        // console.log('Measurement:', measurement);

        // scrolling up = increasing index, move to right/next element
        if (scrollDelta > 0) {
            if (focus.nextElementSibling == null) { 
                for (let i = 0; i < 9; ++i) {
                    focus = focus.previousElementSibling;
                }
            }
            else { focus = focus.nextElementSibling; }
        }
        // scrolling down = lowering index, move to left/prev element
        if (scrollDelta < 0) {
            if (focus.previousElementSibling == null) { 
                for (let i = 0; i < 9; ++i) {
                    focus = focus.nextElementSibling;
                }
            }
            else { focus = focus.previousElementSibling;}
        }
        zoom(focus);
    } 
}

let rolling = false; 
const roll = () => {
    if (!zoomed || rolling) { return; }
    rolling = true;
    // too hard to disable user actions when rolling because simulating it...
    description.style.display = "none";
    descriptionBox.style.height = "7%";
    dim_overlay.style.opacity = 1;
    // 0 to 100
    let randomNumber = Math.floor(Math.random() * 101);
    // console.log(randomNumber);
    simulateKeyPresses("ArrowRight", randomNumber);
}

const simulateKeyPresses = (key, times) => {
    let count = 0; 
    let delay = 10;
    let max_delay = 300;
    const pressKey = () => {
        if (count == times - 1) { 
            // console.log("Darked");
            darken = true; 
        }
        if (count < times) {
            const event = new KeyboardEvent('keydown', { key });
            window.dispatchEvent(event);
            ++count;
            setTimeout(pressKey, Math.min(max_delay, delay += max_delay / times));
        }
        else { 
            setTimeout(() => {
                // character.style.transform = "translateY(0%)";
                character.style.display = "block"; 
                description.style.display = "block"; 
                descriptionBox.style.height = "80%";
                descriptionBox.style.display = "block"; 
                descriptionBox.style.opacity = 0.9;
                focus.style.filter = "brightness(1)";
                rolling = false;
                dim_overlay.style.opacity = 0;
                let sfx = null; 
                if (focus.dataset.index == "1") {
                    let tsun = new Audio("media/tsundere.mp3");
                    tsun.currentTime = 0.6;
                    tsun.play();
                    sfx = new Audio("media/gacha.mp3");
                    explodeConfetti("SS");
                }
                else if (focus.dataset.index == "2") {
                    let oneesan = new Audio("media/hachi.mp3");
                    oneesan.volume = 0.7;
                    oneesan.play();
                    sfx = new Audio("media/gacha.mp3");
                    explodeConfetti("S");
                }
                else if (focus.dataset.index == "3") {
                    let catgirl = new Audio("media/meow.mp3");
                    catgirl.currentTime = 0.25;
                    catgirl.volume = 0.7;
                    catgirl.play();
                    sfx = new Audio("media/gacha.mp3");
                    explodeConfetti("Cat");
                }
                else if (focus.dataset.index == "4") {
                    // filter curr card?
                    simulateInjury(12);
                    let kisu = new Audio("media/kisu.mp3");
                    audio[song_index].volume = 0;
                    kisu.currentTime = 0.9;
                    kisu.play();
                    sfx = new Audio("media/gacha_sss.mp3");
                    focus.classList.add("filter_trans");
                    explodeConfetti("SSS");
                }
                else if (focus.dataset.index == "7") {
                    let pisspiss = new Audio("media/peace.mp3");
                    pisspiss.volume = 0.7;
                    pisspiss.currentTime = 0.6;
                    pisspiss.play();
                    sfx = new Audio("media/gacha.mp3");
                    explodeConfetti("A");
                }
                else if (focus.dataset.index == "9") {
                    // audio[song_index].volume = 0;
                    let lesbon = new Audio("media/lesbian.mp3");
                    lesbon.volume = 0.8;
                    lesbon.play();
                    sfx = new Audio("media/gacha.mp3");
                    explodeConfetti("A");
                }
                else if (focus.dataset.index == "10") {
                    let onlyyou = new Audio("media/oho.mp3");
                    onlyyou.volume = 0.6;
                    onlyyou.play();
                    sfx = new Audio("media/ougi.mp3");
                    explodeConfetti("???");
                }
                else {
                    sfx = new Audio("media/gacha.mp3");
                    explodeConfetti("A");
                }
                sfx.play();

                // revert volume for audio change
                if (audio[song_index].volume == 0) {
                    let d = 0;
                    if (focus.dataset.index == "4") { d = 10500;}
                    else if (focus.dataset.index == "9") { d = 4000; }
                    setTimeout(() => {
                        focus.classList.remove("filter_trans");
                        audio[song_index].volume = 0.2;
                        vignette.style.opacity = 0;
                        beat = 0;
                    }, d);
                }
            }, 1500);
            return;
        }
    }
    pressKey();
}

async function explodeConfetti(rarity) {
    // old confetti.js
    const canvas = document.getElementById("confetti-canvas");
    canvas.confetti = canvas.confetti || (await confetti.create(canvas, { resize: true }));
    // let confettiSettings = { 
    //     target: confettiCanvas,
    //     max: 350,
    //     // size: 1.8,
    //     animate: true,
    //     respawn: false,
    //     clock: 35,
    //     // props: ['circle', 'square'],
    //     start_from_edge: false,
    //     // width: [numeric],
    //     // height: [numeric],
    //     rotate: true
    // };
    // // snow effect for ougi
    if (rarity == "???") {
        dim_overlay.style.opacity = 0.7;
        const duration = 5 * 1000,
        animationEnd = Date.now() + duration;

        let skew = 1;

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        (function frame() {
            const timeLeft = animationEnd - Date.now(),
                ticks = Math.max(200, 500 * (timeLeft / duration));

            skew = Math.max(0.8, skew - 0.001);
            canvas.confetti({
                particleCount: 1,
                startVelocity: 0,
                ticks: ticks,
                origin: {
                    x: Math.random(),
                    // since particles fall down, skew start toward the top
                    y: Math.random() * skew - 0.2,
                },
                colors: ["#ffffff"],
                shapes: ["circle"],
                gravity: randomInRange(0.4, 0.6),
                scalar: randomInRange(0.4, 1),
                drift: randomInRange(-0.4, 0.4),
            });

            if (timeLeft > 0) {
                requestAnimationFrame(frame);
            }
        })();
        setTimeout(() => { dim_overlay.style.opacity = 0 }, 5000);
    }
    else if (rarity == "Cat") {
        canvas.confetti({
            spread: 360,
            ticks: 200,
            gravity: 1,
            decay: 0.94,
            startVelocity: 30,
            particleCount: 100,
            scalar: 3,
            shapes: ["image"],
            shapeOptions: {
              image: [{
                  src: "media/paw.png",
                  width: 32,
                  height: 32,
                }
              ],
            },
          });
    }
    else if (rarity == "SSS") {
        const end = Date.now() + 10000;
        const colors = ["#bb0000"];

        (function frame() {
        canvas.confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });

        canvas.confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
        })();
    }
    else if (rarity == "SS") {
        const defaults = {
            spread: 360,
            ticks: 100,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            shapes: ["heart"],
            colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
          };
          
          canvas.confetti({
            ...defaults,
            particleCount: 125,
            scalar: 2,
          });
          
          canvas.confetti({
            ...defaults,
            particleCount: 100,
            scalar: 3,
          });
          
          canvas.confetti({
            ...defaults,
            particleCount: 75,
            scalar: 4,
          });
    }
    else if (rarity == "S") {
        const defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0.5,
            decay: 0.94,
            startVelocity: 30,
            shapes: ["star"],
            colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
          };
          
          function shoot() {
            canvas.confetti({
              ...defaults,
              particleCount: 40,
              scalar: 1.2,
              shapes: ["star"],
            });
          
            canvas.confetti({
              ...defaults,
              particleCount: 10,
              scalar: 0.75,
              shapes: ["circle"],
            });
          }
          
          setTimeout(shoot, 0);
          setTimeout(shoot, 100);
          setTimeout(shoot, 200);
    }
    else if (rarity == "A") {
        canvas.confetti({
            particleCount: 300,
            spread: 1000,
            origin: { y: 0.25 },
        });
        // confettiSettings.colors = [[255, 0, 217], [255, 0, 98], [94, 0, 36], [166, 0, 255], [56, 59, 255]];
    }

    // const confetti = new ConfettiGenerator(confettiSettings);
    // confetti.render();
}

// // control input when rolling
// const disable_overlay = document.getElementById("disable-overlay");
// const disableUserInput = () => {
//     disable_overlay.style.display = "block";
// }
// const enableUserInput = () => {
//     disable_overlay.style.display = "none";
// }

// heartbeat effect
const vignette = document.getElementById("vignette");
let beat = 0; 
const simulateInjury = (times) => {
    // no timeout on first beat
    if (beat == 0) { pulse(); }
    if (beat < times) {
        setTimeout(() => {
            pulse();
            simulateInjury(times);
        }, 790);
    
    }
    else return; 
    ++beat;
}

const pulse = () => {
    focus.style.filter = "brightness(1.2)";
    vignette.style.opacity = 0.5; 
    setTimeout(function() {
        focus.style.filter = "brightness(1)";
        vignette.style.opacity = 0.9;
    }, 510); // Adjust the delay (in milliseconds) to control the pulsing effect
}



const names = ["Hitagi Senjougahara (戦場ヶ原ひたぎ)",  "Mayoi Hachikuji (八九寺真宵)", "Tsubasa Hanekawa (羽川翼)", "Shinobu Oshino (忍野忍)", "Karen Araragi (阿良々木火憐)", "Tsukihi Araragi (阿良々木月火)", "Yotsugi Ononoki (斧乃木余接)", "Nadeko Sengoku (千石撫子)", "Suruga Kanbaru (神原駿河)", "Ougi Oshino (忍野扇)"];
const changeDescription = (curr_card) => {
    switch (curr_card.dataset.index) {
        case "1":
            description.innerHTML = `
                Hitagi Senjougahara is a third-year student 
                at Naoetsu Private High School who is aloof
                and reserved due to an encounter with a crab
                that stole away her weight, rendering her
                vulnerable to even the faintest of touches.
                Due to her caution and avoidance of human 
                interaction, she has instead turned to academic 
                excellence and became known as one of the top 
                students in the school, almost on-par with the 
                famous class president among class presidents, 
                Tsubasa Hanekawa. 

                Despite her chilly attitude, she quite clearly
                recognizes the tsundere archetype and conforms 
                to it in a half-joking manner. She genuinely cares 
                about the people in her life that she loves, 
                albeit her sadistic personality may eventually
                alienate those around her. She is open about
                sexual intimacy, but is also extra wary due to
                the fact that she was sexually assaulted by 
                a religious cult leader in her childhood, whom
                she had hit with a shoe in self-defense which
                led to her mother's economic downfall. To get 
                into Hitagi Senjougahara's pants, one must first 
                fully capture her heart in such a way that both 
                partners trust each other completely, a bond that 
                is seemingly magical and above comprehension. 
                It is a bond of pure emotion and passion rather 
                than one of logic and reasoning;
                it is pure love that defines the human condition. 
            `;
            break;
        case "2":
            description.innerHTML = "B";
            break;
        case "3":
            description.innerHTML = `
                An erudite intellectual whose wit and intuition
                knows no bounds, Tsubasa Hanekawa is a class 
                president among class presidents. She diligently 
                studies every day to further her knowledge, and
                she is very humble and down-to-earth about her 
                abilites, always replying to the statement 
                "you really know everything" with "I only know
                what I know". She rarely takes interest in other
                people, but she is entirely willing to die for
                those she whom considers a friend. Her mind truly 
                works in mysterious ways, whether it be playful 
                and teasing in an attempt to start a conversation, 
                or fully emphathetic towards another person's
                plight without any words even being exchanged. 
                It is not an inaccurate description to call her 
                a God of sorts, one that is equally as 
                unpredicatable as she is breedable.

                Additionally, she can also transfrom into a 
                lust-filled catgirl that will eagerly tend to
                all of your needs! However, you would probably 
                die as she sucks out your life essence 
                due to the immense stress that constantly 
                plagues her mind. Underneath the facade of 
                an insurmountable spirit lies a vulnerable 
                high school girl, one that is severely 
                burdened by her aspiration and ambition. 
                Which is not to say that she can't handle her 
                responsibilities; most of the time Hanekawa 
                resolves all her problems by herself, in 
                solitude. After all, she's not one to call 
                out for help.
            `;
            // suck your cock and swallow your seed (lol)
            break;
        case "4":
            description.innerHTML = `
                Also known as Kiss-Shot Acerola-Orion Heart-
                Under-Blade, the Iron-Blooded, Hot-Blooded, 
                Cold-Blooded Vampire and Aberration Slayer,
                Shinobu Oshino is the epitome of a beautiful
                femme fatale. She has been roaming the Earth
                for 598 years, and from her charming foreign
                dresses to her long, lustrous blonde hair, it
                is clear she is not native to Japan. She wields
                a Japanese katana known as Youtou Kokorowatari
                (妖刀心渡, lit., Demon Sword Heart Span), a 
                replica of her first thrall's sword. However,
                her speed and precision in wielding the weapon
                allows her to make cuts so fine that anything 
                sliced will mend itself almost immediately, and 
                thus it is only capable of slaying oddities, 
                hence the moniker "aberration slayer".
                
                Yet on that fateful night, Kiss-shot found 
                herself face-to-face with Death himself, a
                relentless pursuer that ensures nobody will 
                escape. Upon Araragi's discovery of her 
                severely wounded corpse, she was forced to 
                create another thrall for the first time in 
                four centuries. Kiss-shot is looking for a 
                way to pass the time, as she has been rarely
                stimulated throughout her life and is beginning
                to feel quite bored with the idea of immortality.
                It would be the greatest privilege for a puny
                human to satisfy her carnal desires bahahaha
            `;
            // for a mere human to satisfy her carnal desires.
            break;
        case "5":
            /* He especially adores 
            her beautiful, soft, well-shaped breasts, 
            although not in an erotic sense, 
            just in a purely protective manner. 
            Tsukihi is an innocent soul that should be 
            absolutely defiled and fucked until her mind 
            breaks, but */
            description.innerHTML = "E";
            // description.innerHTML = `
            //     Tsukihi Araragi, one of the infamous "Fire 
            //     Sisters" of Tsuganoki Second Junior High 
            //     School, also happens to be a phoenix. She 
            //     is frequently assaulted by her perverse and 
            //     uncontrollably lustful older brother, but 
            //     to describe their relationship as "incestuous" 
            //     would be as blasphemous as it would be to 
            //     sexualize children (something that Araragi 
            //     loves very, very much).

            //     Be careful as she has quite the venomous bite. 
            //     Her character ranges from "cute sister" to 
            //     "pyschotic yandere", canonically threatening 
            //     impalation and torture on multiple occasions 
            //     throughout the series.
            // `;
            break;
        case "6":
            // description.innerHTML = `
            //     Karen is much more straightforward in 
            //     comparison to her counterpart, and although
            //     she might be slightly short-tempered, she makes 
            //     up for it with her extremely kinky attitude 
            //     in the bedroom. She wants every single one of 
            //     her holes to be explored by your toothbrush, she 
            //     wants you to lightly caress her most private 
            //     areas delicately with those thin little hairs, 
            //     she wants to be filled up with semen and then 
            //     be baptized and spiritually cleansed afterwards 
            //     just to repeat the sex ritual again the 
            //     following day.
            // `;
            description.innerHTML = "F";
            break;
        case "7":
            description.innerHTML = `
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
                CORPSE PUSSY!!! CORPSE PUSSY!!! CORPSE PUSSY!!!
            `;
            break;
        case "8":
            description.innerHTML = `H
        
            `;
            break;
        case "9":
            description.innerHTML = "I";
            break;
        case "10":
            description.innerHTML = `
                A sadistic fool, Ougi is. Yet she is also so, so, so
                gosh-darn breedable. Her hips were made for giving 
                birth :skull:
            `;
    }
    
    
    character.innerHTML = names[parseInt(`${curr_card.dataset.index}`) - 1];
}
