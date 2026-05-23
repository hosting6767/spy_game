

let players = [];
let spy_players = [];
let word = "";
let num_of_spies = 1;
let random_spies = false;
let zestawy = [];
let selected_zestaw = 0;
current_card = 0;

start();
startGame();


function start(){
    const game_menu = document.getElementById("before_game_menu");
    const cards_menu = document.getElementById("cards_menu");
    const game_screen = document.getElementById("game_screen");
    game_menu.classList.remove("hidden");
    cards_menu.classList.add("hidden");
    game_screen.classList.add("hidden");

    drawPlayers();
    handleSpies();
    getZestawy();
    changeZestaw();
    customZestawy();
}


function drawPlayers(){ //draws players and their overlay
    const overlay = document.getElementById("black_overlay");
    const player_input = document.getElementById("player_input");
    const player_container = document.getElementById("player_div");
    const player_box = document.getElementById("player_box")
    player_container.innerHTML = "";

    //rysowanie graczy
    const player_size = players.length;
    let currentOutsideClick = null;
    for (let i = 0; i < player_size; i++){
        let box = document.createElement("div");
        box.classList.add("player_box");
        box.textContent = players[i];

        box.onclick = (e) => {
            e.stopPropagation();
            const old_del = document.getElementById("delete_player_button");
            if ( old_del ) { 
                old_del.remove();
                if (currentOutsideClick) {
                    document.removeEventListener("click", currentOutsideClick);
                }
            }

            const delete_player_div = document.createElement("div");
            const rect = box.getBoundingClientRect();
            delete_player_div.id = "delete_player_button";
            delete_player_div.style.left = rect.left + "px";
            delete_player_div.style.top = rect.bottom + "px";
            delete_player_div.style.width = rect.width + "px";
            delete_player_div.style.height = rect.height +"px";
            delete_player_div.textContent = "delete";
            document.body.appendChild(delete_player_div);
            delete_player_div.onclick = () => {
                players.splice(i, 1);
                box.remove();
                delete_player_div.remove();
                document.removeEventListener("click", outsideClick);
            }

            const outsideClick = (event) => {
                if (!delete_player_div.contains(event.target)) {
                    delete_player_div.remove();
                    document.removeEventListener("click", outsideClick);
                }
            };
            currentOutsideClick = outsideClick;
            setTimeout(() => {
                document.addEventListener("click", outsideClick);
            }, 0);
        }
        player_container.appendChild(box);
    }

    //przycisk "+" główne menu
    const add_box = document.createElement("div");
    add_box.className = "player_box";
    add_box.textContent = "+";
    add_box.onclick = () =>{

        overlay.classList.remove("hidden");
        player_box.classList.remove("hidden");
        player_input.value = "";
        player_input.focus();

        //mechanika add button w overlay gracze
        const add_player_button = document.getElementById("add_player_button"); 
        add_player_button.onclick = () =>{
            const username = player_input.value.trim();
            if (username === "") return;
            players.push(username);
            drawPlayers();
            overlay.classList.add("hidden");
            player_box.classList.add("hidden");
        }

        //klikanie poza boxa wyłącza overlay
        overlay.onclick = () => {
            overlay.classList.add("hidden");
            player_box.classList.add("hidden");
        }
        player_box.onclick = (e) =>{
            e.stopPropagation();
        }
    }
    player_container.appendChild(add_box);
}

function warningPlayer(){
    const warning = document.getElementById("player_warning");
    const warning_button = document.getElementById("player_warning_button");
    const text = document.getElementById("player_warning_text");
    warning.classList.remove("hidden");
    text.innerHTML = "YOU NEED ATLEAST 3 PLAYERS TO PLAY";
    warning_button.onclick = () => {
        warning.classList.add("hidden");
    };
}

function drawSpies(){
    const spy_div = document.getElementById("spy_div");
    if ( random_spies === false ) {
        spy_div.textContent = num_of_spies;
    } else {
        spy_div.textContent = "🎲";
    }
}

function handleSpies(){
    const spy_div = document.getElementById("spy_div");

    spy_div.onclick = () => openSpyMenu();

    drawSpies();
}

function renderSpySelector(){
    const spy_selector = document.getElementById("spy_selector");
    spy_selector.innerHTML = "";

    for(let i = 1; i < 11; i++){
        const num = document.createElement("div");
        num.className = "spy_number";

        if (i === num_of_spies && !random_spies){
            num.classList.add("selected_spy");
        }

        num.textContent = i;

        num.onclick = () => {
            random_spies = false;
            num_of_spies = i;

            drawSpies();
            renderSpySelector();
        };

        spy_selector.appendChild(num);
    }

    const rand_num = document.createElement("div");
    rand_num.className = "spy_number";

    if (random_spies){
        rand_num.classList.add("selected_spy");
    }

    rand_num.textContent = "🎲";

    rand_num.onclick = () => {
        random_spies = true;
        drawSpies();
        renderSpySelector();
    };

    spy_selector.appendChild(rand_num);
}

function openSpyMenu(){
    const overlay = document.getElementById("black_overlay");
    const spy_box = document.getElementById("spy_box");
    const ok_button = document.getElementById("ok_spy_button");

    overlay.classList.remove("hidden");
    spy_box.classList.remove("hidden");

    renderSpySelector();

    overlay.onclick = () => {
        spy_box.classList.add("hidden");
        overlay.classList.add("hidden");
    };
    ok_button.onclick = () => {
        overlay.classList.add("hidden");
        spy_box.classList.add("hidden");
    }

    spy_box.onclick = (e) => e.stopPropagation();
}

function losujSpies(){
    spy_players = [];
    const player_size = players.length;
    let max_spies = 0;
    if (random_spies){
        max_spies = Math.min(num_of_spies, player_size / 2);
    } else {
        max_spies = Math.min(num_of_spies, player_size);
    }
    for(let i = 0; i < player_size; i++){
        spy_players[i] = false;
    }
    let placed = 0;
    while(placed < max_spies){
        const rand_index = Math.floor(Math.random() * player_size);
        if(spy_players[rand_index] === false) {
            spy_players[rand_index] = true;
            placed++;
        }
    }
}

//KARTY

function startGame(){ //zaczyna karty
    const play_button = document.getElementById("play_button");
    const game_menu = document.getElementById("before_game_menu");
    const card_menu = document.getElementById("cards_menu");
    const game_screen = document.getElementById("game_screen");
    play_button.onclick = () => {
        if( players.length >= 3){
            game_menu.classList.add("hidden");
            card_menu.classList.remove("hidden");
            game_screen.classList.add("hidden");
            losujSpies();
            current_card = 0;
            drawCard();
        } else {
            warningPlayer();
        }
    }
}

function drawCard(){ //draws and handles a card
    //drawing cards
    const player_card = document.getElementById("player_card");
    const player_name = document.createElement("h2");
    player_card.innerHTML = "";
    player_name.textContent = players[current_card];

    const cards = document.getElementById("cards");
    cards.innerHTML = "";
    const card = document.createElement("div");

    card.id = "card";
    card.textContent = "click to reveal";
    card.onclick = () => {
        card.style.transform = "scale(0.98)";
        setTimeout(() => {
            if (spy_players[current_card] === false) {
                card.textContent = word;
            } else {
                card.textContent = "spy";
            }

            card.style.transform = "scale(1)";
        }, 120);
    }
    //adding listeners
    let isDragging = false;
    let start_x = 0;

    card.addEventListener("pointerdown", (e) => {
        isDragging = true;
        start_x = e.clientX;
    });

    document.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const dx = e.clientX - start_x;
        card.style.transform = `translateX(${dx}px)`;

        if (Math.abs(dx) >= 10) {
            isDragging = false;

            card.style.opacity = "0";
            card.style.transform = `translateX(${dx > 0 ? 200 : -200}px)`;

            setTimeout(() => nextCard(), 200);
        }
    });

    document.addEventListener("pointerup", () => {
        isDragging = false;
        card.style.transform = "scale(1)";
    });
    player_card.appendChild(player_name);
    cards.appendChild(card);
    requestAnimationFrame(() => {
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
    });
}

function nextCard(){
    current_card++;
    if (current_card >= players.length){
        DrawGameMenu();
        return;
    }
    drawCard();
}

//GAME MENU

function DrawGameMenu(){
    const game_menu = document.getElementById("before_game_menu");
    const cards_menu = document.getElementById("cards_menu");
    const game_screen = document.getElementById("game_screen");
    game_menu.classList.add("hidden");
    cards_menu.classList.add("hidden");
    game_screen.classList.remove("hidden");
    DrawGameScreenPlayers();
    NextGameButton();
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
    next_game_button.onclick = () => {
        reloadZestawy();
        start();
    };
}

//ZESTAWY

function changeZestaw(){
    //dodaje efekty kliknięcia w zestawy otwórz / zamknij
    const change_sets_div = document.getElementById("change_sets_div");
    const overlay = document.getElementById("black_overlay");
    const zestawy_box_div = document.getElementById("zestawy_box_div");
    change_sets_div.onclick = () => {
        overlay.classList.remove("hidden");
        zestawy_box_div.classList.remove("hidden");
        overlay.onclick = () => {
            overlay.classList.add("hidden");
            zestawy_box_div.classList.add("hidden");
        }
        zestawy_box_div.onclick = (e) => {
            e.stopPropagation();
        }
    }

    drawZestawy();
}
function drawZestawy(){
    const sets_box = document.getElementById("sets_box");
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

function getZestawy() {
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
    const overlay = document.getElementById("black_overlay");
    const add_zestaw_screen = document.getElementById("add_zestaw_screen");
    const custom_zestaw_confirm = document.getElementById("custom_zestaw_confirm");
    const del_button = document.getElementById("delete_zestaw_button");
    const custom_zestaw_words = document.getElementById("custom_zestaw_words");
    const custom_zestaw_name = document.getElementById("custom_zestaw_name");
    const edit_zestaw_button = document.getElementById("edit_zestaw_button");

    const add_zestawy_box = document.getElementById("zestawy_box_div")
    add_zestaw_button.onclick = () => {
        add_zestawy_box.classList.add("hidden");
        overlay.classList.remove("hidden");
        add_zestaw_screen.classList.remove("hidden");
        overlay.onclick = () =>{
            add_zestawy_box.classList.remove("hidden");
            add_zestaw_screen.classList.add("hidden");
            drawZestawy();  //wracamy do menu zestawów a nie do normal screena
            overlay.onclick = () => {
                overlay.classList.add("hidden");
                zestawy_box_div.classList.add("hidden");
            }
        };
        add_zestaw_screen.onclick = (e) =>{
            e.stopPropagation();
        }
    };

    //dodaje custom zestaw
    custom_zestaw_confirm.onclick = () => {
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

        add_zestawy_box.classList.remove("hidden");
        add_zestaw_screen.classList.add("hidden");
        drawZestawy();  //wracamy do menu zestawów a nie do normal screena
        overlay.onclick = () => {
            overlay.classList.add("hidden");
            zestawy_box_div.classList.add("hidden");
        }
        custom_zestaw_name.value = "";
        custom_zestaw_words.value = "";
    }

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

    edit_zestaw_button.onclick = () => {
        const zestaw_screen = document.getElementById("edit_zestaw_screen");
        add_zestawy_box.classList.add("hidden");
        zestaw_screen.classList.remove("hidden");
        editZestaw(selected_zestaw);
    }
}


function editZestaw(edited_zestaw){
    const overlay = document.getElementById("black_overlay");
    const zestawy_box_div = document.getElementById("zestawy_box_div"); //z tego menu lecimy
    const zestaw_screen = document.getElementById("edit_zestaw_screen");
    const name = document.getElementById("edit_zestaw_name");
    const content = document.getElementById("edit_zestaw_textarea");
    const confirm = document.getElementById("edit_zestaw_confirm");

    content.value = zestawy[edited_zestaw][1]; //0 _> set name a 1 -> content
    name.innerHTML = zestawy[edited_zestaw][0];

    confirm.onclick = () => {
        let words_raw = content.value.trim();

        if (!words_raw) return;
        let words = words_raw.split(",").map(w => w.trim()).filter(w => w.length > 0);
        zestawy = JSON.parse(localStorage.getItem("zestawy")) || [];
        zestawy[edited_zestaw][1] = words;
        localStorage.setItem("zestawy", JSON.stringify(zestawy));

        zestawy_box_div.classList.remove("hidden");
        zestaw_screen.classList.add("hidden");
        getZestawy();
        drawZestawy();  //wracamy do menu zestawów a nie do normal screena
        overlay.onclick = () => {
            overlay.classList.add("hidden");
            zestawy_box_div.classList.add("hidden");
        }
    }
    zestaw_screen.onclick = (e) =>{
        e.stopPropagation();
    }
    overlay.onclick = () => {
        zestawy_box_div.classList.remove("hidden");
        zestaw_screen.classList.add("hidden");
        overlay.onclick = () => {
            overlay.classList.add("hidden");
            zestawy_box_div.classList.add("hidden");
        }
    }
}


function flushLocalStorage(){
    //ask if sure
    const warning = document.getElementById("player_warning");
    const warning_button = document.getElementById("player_warning_button");
    const text = document.getElementById("player_warning_text");
    warning.classList.remove("hidden");
    warning.onclick = () => {
        warning.classList.add("hidden");
    }
    text.innerHTML = "Are you sure ??? <br><br> This action will delete all of your custom sets";
    warning_button.onclick = () => {
        warning.classList.add("hidden");
        localStorage.clear();
        selected_zestaw = 0;
        getZestawy();
        drawZestawy();
        warning.onclick = null;
    };
}