

let players = [];
let spy_players = []
let word = "";
let num_of_spies = 1;
let random_spies = false;
let zestawy =[];
let selected_zestaw = 0;

start();
Zestawy();
drawZestawy();
drawPlayers();
drawSpies();
getPlayerButton();
changeNumSpies();
closePlayers();
changeZestaw();
closeZestaw();
deleteZestaw();
customZestawy();
addCustomZestaw();
closeSpy();
startGame();
NextGameButton();



function start(){
    const game_menu = document.getElementById("before_game_menu");
    const cards_menu = document.getElementById("cards_menu");
    const game_screen = document.getElementById("game_screen");
    game_menu.classList.remove("hidden");
    cards_menu.classList.add("hidden");
    game_screen.classList.add("hidden");
}

function getPlayers(){
    const overlay = document.getElementById("modal_overlay");
    const modalInput = document.getElementById("modal_input");

    overlay.classList.remove("hidden");

    modalInput.value = "";

    modalInput.focus();
}

function getPlayerButton(){
    const add_player_button = document.getElementById("add_player_button");
    add_player_button.addEventListener("click", () => {
        const overlay = document.getElementById("player_modal_overlay");
        const modal_input = document.getElementById("player_modal_input");

        const username = modal_input.value.trim();
        if (username === "") return;

        players.push(username);
        drawPlayers();

        overlay.classList.add("hidden");
    });
}


function drawPlayers() {
    const container = document.getElementById("player_div");
    container.innerHTML = "";

    players.forEach(player => {
        const box = document.createElement("div");
        box.classList.add("player_box");
        box.textContent = player;

        container.appendChild(box);
    });
    
    const addBox = document.createElement("div");
    addBox.className = "player_box";
    addBox.textContent = "+";

    addBox.addEventListener("click", () => {

        const overlay = document.getElementById("player_modal_overlay");
        const modal_input = document.getElementById("player_modal_input");

        overlay.classList.remove("hidden");

        modal_input.value = "";

        modal_input.focus();
    });
    container.appendChild(addBox);
}

function closePlayers(){
    const player_overlay = document.getElementById("player_modal_overlay");
    const player_box = document.getElementById("player_modal_box");

    player_overlay.addEventListener("click", () => {
        player_overlay.classList.add("hidden");
    });

    player_box.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}
function warningPlayer(){
    const warning = document.getElementById("player_warning");
    warning.classList.remove("hidden")
    const warning_button = document.getElementById("player_warning_button");
    warning_button.addEventListener("click", () => {
        warning.classList.add("hidden");
    });
}



function drawSpies(){
    const spy_div = document.getElementById("spy_div");
    if(random_spies === false){
        spy_div.textContent = num_of_spies;
    } else {
        spy_div.textContent = "🎲";
    }
}
function changeNumSpies(){
    const spy_div = document.getElementById("spy_div");
    spy_div.addEventListener("click", () => {
        const overlay = document.getElementById("spy_modal_overlay");

        overlay.classList.remove("hidden");
        
        createSpySelector();
    });
    //spy_div.textContent = num_of_spies;
}

function createSpySelector() {
    const selector = document.getElementById("spy_selector");
    selector.innerHTML = "";
    for (let i = 1; i <= 9; i++) {
        const num = document.createElement("div");
        num.className = "spy_number";
        if (i === num_of_spies && random_spies === false) {
            num.classList.add("selected_spy");
        }
        num.textContent = i;
        num.addEventListener("click", () => {
            random_spies = false;
            num_of_spies = i;
            drawSpies();
            createSpySelector();
        });
        selector.appendChild(num);
    }
    const rand_num = document.createElement("div");
    rand_num.className = "spy_number";
    if(random_spies === true){
        rand_num.classList.add("selected_spy");
    }
    rand_num.textContent = "🎲";
    rand_num.addEventListener("click", () => {
        const max = Math.floor(players.length / 2);
        num_of_spies = Math.floor(Math.random() * max) + 1; 
        random_spies = true;
        drawSpies();
        createSpySelector();
    });
    selector.appendChild(rand_num);
}

function closeSpy(){
    const ok_button = document.getElementById("ok_spy_button");
    const spy_overlay = document.getElementById("spy_modal_overlay");
    const spy_box = document.getElementById("spy_modal_box");
    spy_overlay.addEventListener("click", () => {
        spy_overlay.classList.add("hidden");
    });
    spy_box.addEventListener("click", (e) => {
        e.stopPropagation();
    });
    ok_button.addEventListener("click", () => {
        spy_overlay.classList.add("hidden");
    })
}



function startGame(){
    const play_button = document.getElementById("play_button");
    const game_menu = document.getElementById("before_game_menu");
    const card_menu = document.getElementById("cards_menu");
    const game_screen = document.getElementById("game_screen");
    play_button.addEventListener("click", () => {
        if(players.length >= 3){
            game_menu.classList.add("hidden");
            card_menu.classList.remove("hidden");
            game_screen.classList.add("hidden");
            handlePlayers();
        } else {
            warningPlayer();
        }
    });
}

function handlePlayers() {
    spy_players = [];
    const player_count = players.length;
    const max_spies = Math.min(num_of_spies, player_count);
    for (let i = 0; i < player_count; i++) {
        spy_players[i] = false;
    }
    let placed = 0;
    while (placed < max_spies) {
        const randIndex = Math.floor(Math.random() * player_count);
        if (spy_players[randIndex] === false) {
            spy_players[randIndex] = true;
            placed++;
        }
    }
    current_card = 0;
    showCard();
}

function showCard() {
    const player_card = document.getElementById("player_card");
    player_card.innerHTML = "";
    const player_name = document.createElement("h2");
    player_name.textContent = players[current_card];

    const cards = document.getElementById("cards");
    cards.innerHTML = "";
    const card = document.createElement("div");
 

    card.id = "card";
    card.textContent = "click to reveal";
    card.addEventListener("click", () => {
        if (spy_players[current_card] === false) {
            card.textContent = word;
        } else {
            card.textContent = "spy";
        }
    });

    player_card.appendChild(player_name)
    cards.appendChild(card);
    dragCards();
    //addded
    requestAnimationFrame(() => {
        const card = document.getElementById("card");
        card.style.transform = "scale(1)";
        card.style.opacity = "1";
    });
    card.addEventListener("click", () => {
        card.style.transform = "scale(0.98)";

        setTimeout(() => {
            if (spy_players[current_card] === false) {
                card.textContent = word;
            } else {
                card.textContent = "spy";
            }

            card.style.transform = "scale(1)";
        }, 120);
    });
}

let isDragging = false;
let start_x = 0;
let start_y = 0;
let next_card = false;
function dragCards() {
    const card = document.getElementById("card");
    card.addEventListener("pointerdown", (e) => {
        isDragging = true;
        start_x = e.clientX;
    }); //added
    document.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const dx = e.clientX - start_x;

        const card = document.getElementById("card");
        card.style.transform = `translateX(${dx}px)`;

        if (dx <= -10) {
            isDragging = false;
            card.style.opacity = "0";
            card.style.transform = "translateX(-200px)";

            setTimeout(() => {
                nextCard();
            }, 200);
        }
    });
`    document.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - start_x;
        if (dx <= -7) { 
            isDragging = false;
            nextCard();
        }
    });`
    document.addEventListener("pointerup", () => {
        isDragging = false;
    });
}

function nextCard() {
    current_card++;
    if (current_card >= players.length) {
       DrawGameMenu();
        return;
    }
    showCard();
}

function DrawGameMenu(){
    const game_menu = document.getElementById("before_game_menu");
    const cards_menu = document.getElementById("cards_menu");
    const game_screen = document.getElementById("game_screen");
    game_menu.classList.add("hidden");
    cards_menu.classList.add("hidden");
    game_screen.classList.remove("hidden");
    DrawGameScreenPlayers();
}

function DrawGameScreenPlayers() {
    const players_size = players.length;
    const player_container = document.getElementById("game_screen_players");
    player_container.innerHTML = "";

    for(let i = 0; i < players_size; i++){
        const game_screen_player = document.createElement("div");
        game_screen_player.classList.add("game_screen_player");
        game_screen_player.textContent = players[i];
        player_container.appendChild(game_screen_player);
    }
}

function NextGameButton() {
    const next_game_button  = document.getElementById("new_game");
    next_game_button.addEventListener("click", () => {
        reloadZestawy();
        start();
    });
}



//ZESTAWY

function changeZestaw(){
    const change_sets_div = document.getElementById("change_sets_div");
    const sets_modal_overlay = document.getElementById("sets_modal_overlay");
    change_sets_div.addEventListener("click", () =>{
        sets_modal_overlay.classList.remove("hidden");
    });
}
function closeZestaw(){
    const sets_modal_overlay = document.getElementById("sets_modal_overlay");
    const sets_box = document.getElementById("zestawy_box_div");

    sets_modal_overlay.addEventListener("click", () => {
        sets_modal_overlay.classList.add("hidden");
    });
    sets_box.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}
function drawZestawy(){
    const sets_box = document.getElementById("sets_modal_box");
    sets_box.innerHTML = "";

    for(let i = 0; i < zestawy.length; i++){
        const set = document.createElement("div");
        set.classList.add("set_item");
        if (selected_zestaw === i){
            set.classList.add("set_item_selected");
        }
        set.textContent = zestawy[i][0];
        set.onclick = () => {
            selected_zestaw = i;
            drawZestawy();   
            reloadZestawy();
        };
        sets_box.appendChild(set);
    }
}


function Zestawy() {
    let zestaw_standardowy_ang = [
        "zestaw standardowy ang",
        ["Casino", "Terrorist Hideout", "Bank", "Hospital", "Military Unit", "Film Studio", "Corporate party", "Vegetable store",
         "Ocean Liner", "Orbital Station", "The hotel", "Passanger train", "Pirate Ship", "Beach", "Submarine", "Police Station",
         "Embassy", "Restaurant", "Airplane", "Spa", "Service station", "Supermarket", "Theatre", "University", "Church", "School", "Stable (stajnia)",
            "Convention center"]
        ];
    let zestaw_trudny = [
        "zestaw trudny (under construction)", 
        ["Airport lounge", "Hotel lobby", "Data Center", "Airport claim baggage", "Underground shopping mall", "Convention center"]
    ];

    let zestaw_limbus = [
        "limbus companyy :3",
        ["Warp train", "Backstreets", "Mephistopheles", "The Outskirts", "Sanata's Gift Factory", "The Nest", "Daguanyuan", "The great lake", "the belly of the pallid whale"]
    ]



    const saved_zestawy = JSON.parse(localStorage.getItem("zestawy"));
    if (saved_zestawy === null){
        zestawy  = [zestaw_standardowy_ang, zestaw_trudny, zestaw_limbus];
        localStorage.setItem("zestawy", JSON.stringify(zestawy));
    } else {
        zestawy = saved_zestawy;
    }
    const max = zestawy[selected_zestaw][1].length;
    
    word = zestawy[selected_zestaw][1][Math.floor(Math.random() * max)];
}

function reloadZestawy(){
    const max = zestawy[selected_zestaw][1].length;
    word = zestawy[selected_zestaw][1][Math.floor(Math.random() * max)];
}

function customZestawy(){
    const add_zestaw_button = document.getElementById("add_zestaw_button");
    const add_zestaw_overlay = document.getElementById("add_zestaw_overlay");
    const add_zestaw_screen = document.getElementById("add_zestaw_screen");

    add_zestaw_button.addEventListener("click", () => {
        add_zestaw_overlay.classList.remove("hidden");
    });
}

function addCustomZestaw(){
    const add_zestaw_overlay = document.getElementById("add_zestaw_overlay");
    const add_zestaw_screen = document.getElementById("add_zestaw_screen");
    const custom_zestaw_confirm = document.getElementById("custom_zestaw_confirm");
    const custom_zestaw_words = document.getElementById("custom_zestaw_words");
    const custom_zestaw_name = document.getElementById("custom_zestaw_name");
    add_zestaw_overlay.addEventListener("click", () =>{
        add_zestaw_overlay.classList.add("hidden");
    });
    add_zestaw_screen.addEventListener("click", (e) =>{
        e.stopPropagation();
    });

    custom_zestaw_confirm.addEventListener("click", () => {
        let words_raw = custom_zestaw_words.value.trim();
        let name = custom_zestaw_name.value.trim();

        if (!name || !words_raw) return;
        let words = words_raw.split(",").map(w => w.trim()).filter(w => w.length > 0);
        zestawy = JSON.parse(localStorage.getItem("zestawy")) || [];
        if(zestawy.some(z=>z[0] === name)){ 
            alert("Zestaw z tą nazwą już istnieje");
            return;
        }
        zestawy.push([name, words]);
        localStorage.setItem("zestawy", JSON.stringify(zestawy));
        add_zestaw_overlay.classList.add("hidden");
        drawZestawy();
    });
}

function deleteZestaw() { 
    const del_button = document.getElementById("delete_zestaw_button");
    const sets_box = document.getElementById("sets_modal_box");
    del_button.onclick = () => {
        if (selected_zestaw >= 0 && selected_zestaw < zestawy.length) {
            zestawy.splice(selected_zestaw, 1);

            if (selected_zestaw >= zestawy.length) {
                selected_zestaw = zestawy.length - 1;
            }
            drawZestawy();
            reloadZestawy();
            localStorage.setItem("zestawy", JSON.stringify(zestawy));
        } else {
            console.log("Invalid index:", selected_zestaw);
        }
    };
}
//TODO: dodać końcowy ekran, copy the look of the official app
