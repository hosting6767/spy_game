

let players = [];
let spy_players = [];
let word = "";
let num_of_spies = 1;
let max_num_of_spies = 1;
let random_spies = false;
let zestawy = [];
let selected_zestawy = [0]
let crazy_mode = false;
let crazy_min = 1;
let crazy_max = 1;
let crazy_same_word = true;
let player_words = [];
let spy_count = 0;
current_card = 0;

loadSettings();
start();
startGame();


function start(){
    const game_menu = document.getElementById("before_game_menu");
    const cards_menu = document.getElementById("cards_menu");
    const game_screen = document.getElementById("game_screen");
    game_menu.classList.remove("hidden");
    cards_menu.classList.add("hidden");
    game_screen.classList.add("hidden");

    if (players == false){
        players = JSON.parse(localStorage.getItem("players")) || [];
        console.log(players);
    }
    getCrazyMode();
    drawPlayers();
    handleSpies();
    getZestawy();
    changeZestaw();
    customZestawy();
}

//zapisywanie ustawień w localStorage (tak jak players)
function saveSettings(){
    localStorage.setItem("settings", JSON.stringify([num_of_spies, max_num_of_spies, random_spies, crazy_mode, crazy_min, crazy_max, crazy_same_word]));
}

function loadSettings(){
    const saved_settings = JSON.parse(localStorage.getItem("settings"));
    if (saved_settings === null) return;
    num_of_spies = saved_settings[0];
    max_num_of_spies = saved_settings[1];
    random_spies = saved_settings[2];
    crazy_mode = saved_settings[3];
    crazy_min = saved_settings[4];
    crazy_max = saved_settings[5];
    crazy_same_word = saved_settings[6];
}

function getCrazyMode(){
    const crazy_mode_button = document.getElementById("crazy_mode_button");
    const crazy_options_div = document.getElementById("crazy_options_div");
    const crazy_count_button = document.getElementById("crazy_count_button");
    const crazy_word_button = document.getElementById("crazy_word_button");
    if (crazy_mode === false){
        crazy_mode_button.innerHTML = "False";
        crazy_options_div.classList.add("hidden");
        crazy_mode_button.onclick = (e) =>{
            crazy_mode = true;
            saveSettings();
            getCrazyMode();
        }
    } else {
        crazy_mode_button.innerHTML = "True";
        crazy_options_div.classList.remove("hidden");
        crazy_mode_button.onclick = (e) =>{
            crazy_mode = false;
            saveSettings();
            getCrazyMode();
        }
    }

    //ile osób ma inne hasło
    if (crazy_min === crazy_max){
        crazy_count_button.innerHTML = crazy_min;
    } else {
        crazy_count_button.innerHTML = crazy_min + "-" + crazy_max;
    }
    crazy_count_button.onclick = () => openCrazyMenu();

    //czy inne hasło jest takie samo dla wszystkich, czy losowe
    if (crazy_same_word === true){
        crazy_word_button.innerHTML = "Same word";
    } else {
        crazy_word_button.innerHTML = "Random words";
    }
    crazy_word_button.onclick = () => {
        crazy_same_word = !crazy_same_word;
        saveSettings();
        getCrazyMode();
    }
}

function renderCrazySelector(){
    const crazy_selector = document.getElementById("crazy_selector");
    const crazy_selector_max = document.getElementById("crazy_selector_max");
    crazy_selector.innerHTML = "";
    crazy_selector_max.innerHTML = "";

    for(let i = 1; i < 11; i++){
        const num = document.createElement("div");
        num.className = "spy_number";

        if (i === crazy_min){
            num.classList.add("selected_spy");
        }

        num.textContent = i;

        num.onclick = () => {
            crazy_min = i;
            if (crazy_max < crazy_min){
                crazy_max = crazy_min;
            }

            saveSettings();
            getCrazyMode();
            renderCrazySelector();
        };

        crazy_selector.appendChild(num);

        const num_max = document.createElement("div");
        num_max.className = "spy_number";

        if (i === crazy_max){
            num_max.classList.add("selected_spy");
        }

        num_max.textContent = i;

        num_max.onclick = () => {
            crazy_max = i;
            if (crazy_min > crazy_max){
                crazy_min = crazy_max;
            }

            saveSettings();
            getCrazyMode();
            renderCrazySelector();
        };

        crazy_selector_max.appendChild(num_max);
    }
}

function openCrazyMenu(){
    const overlay = document.getElementById("black_overlay");
    const crazy_box = document.getElementById("crazy_box");
    const ok_button = document.getElementById("ok_crazy_button");

    overlay.classList.remove("hidden");
    crazy_box.classList.remove("hidden");

    renderCrazySelector();

    overlay.onclick = () => {
        crazy_box.classList.add("hidden");
        overlay.classList.add("hidden");
    };
    ok_button.onclick = () => {
        overlay.classList.add("hidden");
        crazy_box.classList.add("hidden");
    }

    crazy_box.onclick = (e) => e.stopPropagation();
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
                localStorage.setItem("players", JSON.stringify(players));
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
            localStorage.setItem("players", JSON.stringify(players));
            console.log(JSON.parse(localStorage.getItem("players")))
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

function warningPlayer(message){
    const warning = document.getElementById("player_warning");
    const warning_button = document.getElementById("player_warning_button");
    const text = document.getElementById("player_warning_text");
    warning.classList.remove("hidden");
    text.innerHTML = message || "YOU NEED ATLEAST 3 PLAYERS TO PLAY";
    warning_button.onclick = () => {
        warning.classList.add("hidden");
    };
}

function drawSpies(){
    const spy_div = document.getElementById("spy_div");
    if ( random_spies === false ) {
        spy_div.textContent = num_of_spies;
    } else {
        spy_div.textContent = num_of_spies + "-" + max_num_of_spies;
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

    //drugi rząd ("do") jest tylko przy losowej liczbie szpiegów, pierwszy rząd to wtedy "od"
    const spy_selector_max = document.getElementById("spy_selector_max");
    const spy_from_text = document.getElementById("spy_from_text");
    const spy_to_text = document.getElementById("spy_to_text");
    spy_selector_max.innerHTML = "";
    if (random_spies){
        spy_from_text.classList.remove("hidden");
        spy_to_text.classList.remove("hidden");
        spy_selector_max.classList.remove("hidden");
    } else {
        spy_from_text.classList.add("hidden");
        spy_to_text.classList.add("hidden");
        spy_selector_max.classList.add("hidden");
    }

    for(let i = 1; i < 11; i++){
        const num = document.createElement("div");
        num.className = "spy_number";

        if (i === num_of_spies){
            num.classList.add("selected_spy");
        }

        num.textContent = i;

        num.onclick = () => {
            num_of_spies = i;
            if (max_num_of_spies < num_of_spies){
                max_num_of_spies = num_of_spies;
            }

            saveSettings();
            drawSpies();
            renderSpySelector();
        };

        spy_selector.appendChild(num);

        const num_max = document.createElement("div");
        num_max.className = "spy_number";

        if (i === max_num_of_spies){
            num_max.classList.add("selected_spy");
        }

        num_max.textContent = i;

        num_max.onclick = () => {
            max_num_of_spies = i;
            if (num_of_spies > max_num_of_spies){
                num_of_spies = max_num_of_spies;
            }

            saveSettings();
            drawSpies();
            renderSpySelector();
        };

        spy_selector_max.appendChild(num_max);
    }

    const rand_num = document.createElement("div");
    rand_num.className = "spy_number";

    if (random_spies){
        rand_num.classList.add("selected_spy");
    }

    rand_num.textContent = "🎲";

    rand_num.onclick = () => {
        random_spies = !random_spies;
        saveSettings();
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
        max_spies = num_of_spies + Math.floor(Math.random() * (max_num_of_spies - num_of_spies + 1));
        max_spies = Math.min(max_spies, player_size);
    } else {
        max_spies = Math.min(num_of_spies, player_size);
    }
    spy_count = max_spies;
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

//CRAZY - każdy gracz dostaje swoje hasło, tylko nie-szpiedzy mogą dostać inne
function losujCrazy(){
    const player_size = players.length;
    player_words = [];
    for(let i = 0; i < player_size; i++){
        player_words[i] = word;
    }
    if (crazy_mode === false) return;

    //wszystkie hasła z wybranych zestawów oprócz głównego
    let other_words = [];
    for(let i = 0; i < selected_zestawy.length; i++){
        for(let j = 0; j < zestawy[selected_zestawy[i]][1].length; j++){
            const w = zestawy[selected_zestawy[i]][1][j];
            if (w !== word && !other_words.includes(w)){
                other_words.push(w);
            }
        }
    }
    if (other_words.length === 0) return;

    //gracze bez szpiegów
    let not_spies = [];
    for(let i = 0; i < player_size; i++){
        if (spy_players[i] === false){
            not_spies.push(i);
        }
    }

    //ile osób dostaje inne hasło (ktoś musi zostać z głównym hasłem)
    let different_players = crazy_min + Math.floor(Math.random() * (crazy_max - crazy_min + 1));
    if (different_players > not_spies.length - 1){
        different_players = not_spies.length - 1;
    }

    const same_word = other_words[Math.floor(Math.random() * other_words.length)];
    for(let k = 0; k < different_players; k++){
        const rand_index = Math.floor(Math.random() * not_spies.length);
        const player = not_spies[rand_index];
        not_spies.splice(rand_index, 1);

        if (crazy_same_word === true){
            player_words[player] = same_word;
        } else {
            const word_index = Math.floor(Math.random() * other_words.length);
            player_words[player] = other_words[word_index];
            if (other_words.length > 1){
                other_words.splice(word_index, 1);
            }
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
            if (selected_zestawy.length === 0){
                warningPlayer("SELECT AT LEAST ONE SET");
                return;
            }
            game_menu.classList.add("hidden");
            card_menu.classList.remove("hidden");
            game_screen.classList.add("hidden");
            losujSpies();
            losujCrazy();
            current_card = 0;
            drawCard();
        } else {
            warningPlayer();
        }
    }
}

function drawCard(){ 
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
                card.textContent = player_words[current_card];
            } else {
                card.textContent = "spy";
            }

            card.style.transform = "scale(1)";
        }, 120);
    }

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
    DrawGameScreenInfo();
    DrawGameScreenPlayers();
    DrawGameScreenAnswers();
    NextGameButton();
}

function DrawGameScreenInfo(){ //z iloma szpiegami wystartowała gra
    const game_screen_info = document.getElementById("game_screen_info");
    game_screen_info.textContent = "Spies: " + spy_count;
}

function DrawGameScreenAnswers(){
    const game_screen_answers = document.getElementById("game_screen_answers");
    game_screen_answers.disabled = true;
    let possible_words = "";
    for(let i = 0; i < selected_zestawy.length; i++){
        possible_words += (zestawy[selected_zestawy[i]][1]);
        possible_words += ","
    }
    game_screen_answers.innerHTML = possible_words;
    console.log(selected_zestawy);
    console.log(players)
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
        if (selected_zestawy.includes(i)){
            set.classList.add("set_item_selected");
            set.onclick = () => {
                selected_zestawy.splice(selected_zestawy.indexOf(i), 1);
                drawZestawy();
                reloadZestawy();
            }
        } else {
            set.onclick = () => {
                selected_zestawy.push(i);
                drawZestawy();   
                reloadZestawy();
            };
        }
        set.textContent = zestawy[i][0];
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
    
    let all_words = [];
    for(let i = 0; i < selected_zestawy.length; i++){
        for(let j = 0; j < zestawy[selected_zestawy[i]][1].length; j++){
            all_words.push(zestawy[selected_zestawy[i]][1][j]);
        }
    }
    word = all_words[Math.floor(Math.random() * all_words.length)];
}

function reloadZestawy(){
    let all_words = [];
    for(let i = 0; i < selected_zestawy.length; i++){
        for(let j = 0; j < zestawy[selected_zestawy[i]][1].length; j++){
            all_words.push(zestawy[selected_zestawy[i]][1][j]);
        }
    }
    word = all_words[Math.floor(Math.random() * all_words.length)];
    console.log(selected_zestawy)
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
        selected_zestawy.sort((a, b) => b - a);  //od końca, żeby splice nie przesuwał kolejnych indeksów
        for(let i = 0; i < selected_zestawy.length; i++){
            zestawy.splice(selected_zestawy[i], 1);
        }
        selected_zestawy = [];
        drawZestawy();
        reloadZestawy();
        localStorage.setItem("zestawy", JSON.stringify(zestawy));

    };

    edit_zestaw_button.onclick = () => {
        if(selected_zestawy.length == 1){
            const zestaw_screen = document.getElementById("edit_zestaw_screen");
            add_zestawy_box.classList.add("hidden");
            zestaw_screen.classList.remove("hidden");
            editZestaw(selected_zestawy[0]);
        }
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
    text.innerHTML = "Are you sure ??? <br><br> This action will delete all of your custom sets and settings";
    warning_button.onclick = () => {
        warning.classList.add("hidden");
        localStorage.clear();
        selected_zestawy = [0];
        num_of_spies = 1;
        max_num_of_spies = 1;
        random_spies = false;
        crazy_mode = false;
        crazy_min = 1;
        crazy_max = 1;
        crazy_same_word = true;
        getZestawy();
        drawZestawy();
        drawSpies();
        getCrazyMode();
        warning.onclick = null;
    };
}

/*
cele for the day:
    -dodać na końcu hasła :D
    -chaos mode (3% na "spy", 75% 1 os inne haslo, inne języki, dynamic spy number)
    -łączenie wybranych setów :D
    -preset osób z localstorage :D
    -lepszy swipe
*/

