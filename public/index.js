
let audio = document.getElementById("paper-collect-1");
audio.click();

function App() {

    ///////////////////////////////////////////////////////////////////////////
    // States
    //

    const [cards, set_cards] = React.useState([]);
    const [filtering_cards, set_filtering_cards] = React.useState([]);
    const [create_deck_mode, set_create_deck_mode] = React.useState(false);
    const [editing_mode, set_editing_mode] = React.useState(false);
    const [current_deck, set_current_deck] = React.useState([]);
    const [new_deck, set_new_deck] = React.useState({ name: "Nouveau Deck", cards: [] });
    const [deck_list, set_deck_list] = React.useState([]);
    const [avg_cmc, set_avg_cmc] = React.useState(0);
    const [is_update_mode, set_is_update_mode] = React.useState(false);
    const [pagination, set_pagination] = React.useState(1);
    const [roll_options_toggle, set_roll_options_toggle] = React.useState(false);
    const [deck_name, set_deck_name] = React.useState("");
    const [search_val, set_search_val] = React.useState("");
    const [cards_number_deck, set_cards_number_deck] = React.useState(0);

    if (global_init === false) {
        global_init = true;

        fetch("https://api.magicthegathering.io/v1/cards").
            then(response => response.json()).
            then(function (data) {
                let d = data.cards;
                let c = 0;
                let df = d.filter(function (card) {
                    ++c;
                    if (card.imageUrl !== undefined) {
                        return card;
                    }
                });

                let clone_data = df.map(obj => ({ ...obj }));
                global_cards = clone_data;

                let clone_global_cards = df.map(obj => ({ ...obj }));
                set_cards(clone_global_cards);
            });

        fetch("http://195.15.206.94:9696/api/deck_list").
            then(response => response.json()).
            then(function (data) {
                let clone_data = data.map(obj => ({ ...obj }));
                let clone_deck_list = data.map(obj => ({ ...obj }));
                set_deck_list(clone_deck_list);
            });
    }

    function card_hover(id) {
        let card = document.getElementById(id);
        let sound = document.getElementById("paper-collect-1");
        sound.currentTime = 0;
        sound.muted = false;
        sound.play();
        card.style.transform = "scale(1.2)";
        card.style.zIndex = "99999";
    }

    function card_exit_hover(id) {
        let card = document.getElementById(id);
        card.style.transform = "scale(1)";
        card.style.zIndex = "";
    }

    function create_new_deck() {
        set_editing_mode(true);
        set_create_deck_mode(true);
        set_is_update_mode(false);

        set_new_deck({ name: "Nouveau Deck", cards: [] });
    }

    function search_on_click() {
        fetch("https://api.magicthegathering.io/v1/cards?name=" + search_val).
            then(response => response.json()).
            then(function (data) {
                let d = data.cards;
                let df = d.filter(function (card) {
                    if (card.imageUrl !== undefined) {
                        return card;
                    }
                });

                let filter = are_cards_selected(df, new_deck.cards);
                set_cards(filter);
            });
    }

    ////////////////////////////////////////////////////////////////////////////
    // Components
    //

    function NewDeckButton() {
        return (
            <div>
                <a onClick={() => create_new_deck()} className="new_deck" href="#">
                    <div className="iWBLwG">
                        <div className="daTZGN"></div>
                    </div>
                    <p className="crfApt">NOUVEAU DECK</p>
                </a>
            </div>
        );
    }

    function DeckStats() {

        calculate_mana_avg();
        count_cards_deck();

        return (
            <div className="flex justify-evenly	w-full h-[5rem] relative pb-[0.5rem]">
                <div title="You need at least 25 cards in a deck." className="flex items-center justify-center">
                    <div
                        className="h-[2.1875rem] w-[1.875rem] relative bg-[url('./assets/scraps-icon.png')] bg-center bg-[length:auto_100%] bg-no-repeat before:content-[''] before:absolute before:bottom-[-1px] before:right-[-1px] before:w-[1.25rem] before:h-[1.375rem] before:bg-[length:100%_100%] before:bg-no-repeat before:bg-[url('./assets/validation-false.png')]"></div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-white font-HalisGR text-[18px]">CARTES</div>
                        <div className="font-gwent text-[32px] leading-none">{cards_number_deck}</div>
                    </div>
                </div>
                <div title="You need at least 25 cards in a deck." className="flex items-center justify-center">
                    <div
                        className="h-[2.1875rem] w-[1.875rem] relative bg-[url('./assets/scraps-icon.png')] bg-center bg-[length:auto_100%] bg-no-repeat before:content-[''] before:absolute before:bottom-[-1px] before:right-[-1px] before:w-[1.25rem] before:h-[1.375rem] before:bg-[length:100%_100%] before:bg-no-repeat before:bg-[url('./assets/validation-false.png')]"></div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-white font-HalisGR text-[18px]">MAN AVG</div>
                        <div className="font-gwent text-[32px] leading-none">{avg_cmc}</div>
                    </div>
                </div>
            </div>
        );
    }

    function BtnHeaderBack() {
        return (
            <button onClick={() => discard_changes()} className="flex-[1_1_0px] flex items-center justify-start">
                <div
                    className="flex bg-[url('./assets/back-icon.png')] bg-center bg-[length:100%_100%] bg-no-repeat w-[16px] h-[16px] mr-[8px]"></div>
                <span className="font-gwent text-white text-[34px]">Back</span>
            </button>
        );
    }

    function discard_changes() {
        let clone_global_cards = global_cards.map(obj => ({ ...obj }));
        set_editing_mode(false);
        set_create_deck_mode(false);
        set_is_update_mode(false);
        set_cards(clone_global_cards);
        set_roll_options_toggle(false);
        set_new_deck({ name: "Nouveau Deck", cards: [] });

        fetch("http://195.15.206.94:9696/api/deck_list").
            then(response => response.json()).
            then(function (data) {
                console.log("------------------------------------------------------------------------------------------------");
                let clone_data = data.map(obj => ({ ...obj }));
                let clone_deck_list = data.map(obj => ({ ...obj }));
                set_deck_list(clone_deck_list);
            });

        /*
        * TOOD(): Clean stuff.
        * */
    }

    function SaveBtn() {
        return (
            <a className="flex justify-center items-center min-w-[154px] px-[10px] border-y-[12px] border-x-[24px] border-solid opacity-100	text-center"
                style={{
                    borderImageSource: "url('./assets/gold-button.png')",
                    borderImageSlice: "12 24 fill",
                    borderImageOutset: "0",
                    borderImageRepeat: "stretch",
                    filter: "drop-shadow(rgb(0, 0, 0) 0px 2px 4px)"
                }} href="#">
                <p className="text-black font-gwent text-[20px]" onClick={() => save_deck()}>Enregistrer le deck</p>
            </a>
        );
    }

    function Header() {
        return (
            <div className="relative">
                <div className="pt-[40px] pb-[32px] flex items-center justify-between h-[144px] max-w-[1280px] mx-auto">

                    {(editing_mode || create_deck_mode) ? <BtnHeaderBack /> :
                        <button className="flex-[1_1_0px] flex items-center justify-start"></button>}

                    <div className="flex-[1_1_0px] font-gwent text-[44px] no-headline text-center">{create_deck_mode ? new_deck.name : "LIBRAIRIE"}</div>

                    <div className="flex justify-end items-center flex-[1_1_0px]">

                        {(editing_mode || create_deck_mode) ? <SaveBtn /> :
                            <button className="flex-[1_1_0px] flex items-center justify-start"></button>}

                        <button className="cDtptw"></button>
                    </div>
                </div>
            </div>
        );
    }

    function toggle_options() {
        console.log("hello");
        if (roll_options_toggle) {
            set_roll_options_toggle(false);
        } else {
            set_roll_options_toggle(true);
        }
    }

    function Deck_Button() {
        return (
            <li className="deckBtn" onClick={() => toggle_options()}>
                <div className="deckBtn_slot">
                    <div className="deckBtn_name">{new_deck.name}</div>
                </div>
            </li>
        );
    }

    function Deck_Button2(props) {
        console.log("DEEDDEED", props.props.deck);
        return (
            <li className="deckBtn" onClick={() => update_mode(props.props.deck)}>
                <div className="deckBtn_slot">
                    <div className="deckBtn_name">{props.props.deckName}</div>
                </div>
            </li>
        );
    }

    function Selected(props) {
        return (
            <div className={cards[props.props.idx].is_selected ? "cardSelected" : ""}></div>
        );
    }

    function Roll_Options() {

        let deck_name = ""

        return (
            <div className="rollOptions">
                <button className="rollOptions_btn">Changer le nom</button>
                <div className="eTHfbE">
                    <input onChange={(e) => deck_name = e.target.value} className="nNDKL" />
                </div>
                <a onClick={() => save_deck_name(deck_name)} className="flex justify-center items-center min-w-[154px] px-[10px] border-y-[12px] border-x-[24px] border-solid opacity-100	text-center" style={{ borderImageSource: "url('./assets/gold-button.png')", borderImageSlice: "12 24 fill", borderImageOutset: "0", borderImageRepeat: "stretch", filter: "drop-shadow(rgb(0, 0, 0) 0px 2px 4px)" }} href="#">
                    <p className="text-black font-gwent text-[20px]" >Ok</p>
                </a>
            </div>
        );
    }

    function Card_Container(name) {
        console.log(name);
        return (
            <li className="cardContainer">
                <div className="cardContainer_slot" tabIndex="0">
                    <div className="cardContainer_name">{name.name}</div>
                </div>
            </li>
        );
    }

    function Deck_Editing_Bar() {
        return (
            <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", margin: "0px" }}>
                <div style={{
                    position: "absolute",
                    inset: "0px", overflow: "hidden scroll", marginRight: "-17px", marginBottom: "1rem"
                }}>
                    <div className="" style={{ overflow: "hidden", marginRight: "" }}>
                        <ul className="deckCardsListing">
                            <Deck_Button />
                            {roll_options_toggle ? <Roll_Options /> : <div></div>}
                            {
                                new_deck.cards.map(card => (
                                    <Card_Container name={card.name} />
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <div style={{ position: "absolute", height: "6px", right: "2px", bottom: "2px", left: "2px", borderRadius: "3px" }}>
                    <div style={{ position: "relative", display: "block", height: "100%", cursor: "pointer", borderRadius: "inherit", backgroundColor: "rgba(0, 0, 0, 0.2)", width: "0px" }}></div>
                </div>
                {/*  Scrollable*/}
            </div>
        );
    }

    function Deck_List() {

        console.log(deck_list);


        return (
            <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", margin: "0px" }}>
                <div style={{ position: "absolute", inset: "0px", overflow: "hidden scroll", marginRight: "-17px", marginBottom: "1rem" }}>
                    <div className="" style={{ overflow: "hidden", marginRight: "" }}>
                        <ul className="deckCardsListing">
                            {
                                deck_list.map((deck, idx) => (
                                    <Deck_Button2 props={{ deckName: deck.Name, deck: deck }} />
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <div style={{ position: "absolute", height: "6px", right: "2px", bottom: "2px", left: "2px", borderRadius: "3px" }}>
                    <div style={{ position: "relative", display: "block", height: "100%", cursor: "pointer", borderRadius: "inherit", backgroundColor: "rgba(0, 0, 0, 0.2)", width: "0px" }}></div>
                </div>
            </div>
        );
    }

    function are_cards_selected(set, data) {
        console.log("set", set);
        console.log("data", data);
        for (let idx = 0; idx < data.length; idx++) {
            console.log("ososo");
            let id = data[idx].id;
            let index = set.findIndex(function (obj) {
                console.log(`${obj.id} === ${id}`, obj);
                return obj.id === id;
            });
            console.log("index", index);
            if (index != -1) {
                set[index].is_selected = true;
            }
        }
        return set;
    }

    function update_mode(deck) {
        set_create_deck_mode(false);
        set_is_update_mode(true);
        set_editing_mode(true);
        set_current_deck(deck);

        fetch("http://195.15.206.94:9696/api/edit_deck?id=" + deck.id).
            then(response => response.json()).
            then(function (data) {
                set_new_deck({ name: deck.Name, cards: data, id: deck.id });
                let clone_cards = cards.map(obj => ({ ...obj }));
                let cards_selected = are_cards_selected(clone_cards, data);
                set_cards(cards_selected);
            });
    }

    function Pagination() {
        return (
            <div className="">
                <div className="pagination">
                    <button onClick={() => before_page()} className="pagination_btn">
                        <p className="pagination_btn_text">-</p>
                    </button>
                    <button onClick={() => next_page()} className="pagination_btn">
                        <p className="pagination_btn_text">+</p>
                    </button>
                </div>
            </div>
        );
    }

    function Scrollable() {
        return (
            <div className="ScrollableContainer__TrackVertical-sc-123mqds-0 iNjlus">
                <div className="ScrollableContainer__ThumbVertical-sc-123mqds-1 kqeGLj" style="height: 623px; transform: translateY(0px);"></div>
            </div>
        );
    }

     ////////////////////////////////////////////////////////////////////////////
    // Features
    //

    function calculate_mana_avg() {
        let cards_without_land = new_deck.cards.filter(function (card) {
            console.log("CARD calc", card);
            if (!card.type.includes("Land")) {
                return card;
            }
        });

        console.log("cards_without_land", cards_without_land);

        let total_cmc = 0;
        for (let idx = 0; idx < cards_without_land.length; idx++) {
            total_cmc += cards_without_land[idx].cmc;
        }

        console.log("total_cmc", total_cmc);

        let avg_cmc = cards_without_land.length > 0 ? total_cmc / cards_without_land.length : 0;

        avg_cmc = Math.round(avg_cmc * 100) / 100;

        set_avg_cmc(avg_cmc);
    }

    function add_card_to_deck(cards, card, idx_card) {
        console.log("----------------dddddddddddd-------------", card);
        let clone_cards = cards.map(obj => ({ ...obj }));


        if ((editing_mode) === true) {
            if (((create_deck_mode || is_update_mode) === true)) {
                let can_add = true;
                new_deck.cards.map(((c, idx) => {
                    if (c.id === card.id) {
                        can_add = false;
                        let clone_new_deck = { ...new_deck };
                        clone_new_deck.cards.splice(idx, 1);
                        set_new_deck(clone_new_deck);

                        clone_cards[idx_card].is_selected = false;
                        set_cards(clone_cards);

                    }
                }));
                if (can_add === true && (cards_number_deck < 30)) {
                    let clone_new_deck = { ...new_deck };
                    clone_new_deck.cards.push(card);
                    set_new_deck(clone_new_deck);

                    clone_cards[idx_card].is_selected = true;
                    set_cards(clone_cards);


                } else {

                }
            }

            if (is_update_mode === true) {

            }
        }
    }

    let local_deck_name = "";

    function save_deck_name(deck_name) {
        console.log(local_deck_name)
        let clone_new_deck = { ...new_deck };
        clone_new_deck.name = deck_name;
        set_new_deck(clone_new_deck);
        // set_roll_options_toggle(false);
    }
   
    function save_deck() {
        console.log(new_deck);
        if (create_deck_mode) {

            post_save_deck("http://195.15.206.94:9696/api/create", new_deck);
        }
        if (is_update_mode) {
            post_save_deck("http://195.15.206.94:9696/api/update_deck", new_deck);
        }

        discard_changes();
    }

    async function post_save_deck(url = "", data = {}) {


        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            fetch("http://195.15.206.94:9696/api/deck_list").
                then(response => response.json()).
                then(function (data) {
                    console.log("------------------------------------------------------------------------------------------------");
                    let clone_data = data.map(obj => ({ ...obj }));
                    let clone_deck_list = data.map(obj => ({ ...obj }));
                    set_deck_list(clone_deck_list);
                });
        }
        // return response.json(); // parses JSON response into native JavaScript objects
    }
    
    let page = 1;
    function next_page() {
        set_pagination(pagination + 1);
        page = page + 1;
        fetch("https://api.magicthegathering.io/v1/cards?page=" + (pagination + 1)).
            then(response => response.json()).
            then(function (data) {
                let d = data.cards;
                let df = d.filter(function (card) {
                    if (card.imageUrl !== undefined) {
                        return card;
                    }
                });
                let filter = are_cards_selected(df, new_deck.cards);
                set_cards(filter);
            });
    }

    function before_page() {
        set_pagination((pagination < 1 ? 1 : pagination - 1));
        fetch("https://api.magicthegathering.io/v1/cards?page=" + (pagination - 1)).
            then(response => response.json()).
            then(function (data) {
                let d = data.cards;
                let df = d.filter(function (card) {
                    if (card.imageUrl !== undefined) {
                        return card;
                    }
                });

                let filter = are_cards_selected(df, new_deck.cards);
                set_cards(filter);
            });
    }

    function count_cards_deck() {
        let cards_number = new_deck.cards.length;
        set_cards_number_deck(cards_number);
    }

    return (
        <div>
            <Header />
            <div className="flex justify-center relative overflow-hidden h-[980px] w-full">
                <div
                    className="left-board w-[304px] bg-orange-300 relative  h-full flex-[0_0_360px] p-[1rem_1.5rem_1.5rem] bg-[url('./assets/left-column-bg.jpg')] bg-no-repeat bg-[length:100%_100%]">
                    {(editing_mode) ? <DeckStats /> : <NewDeckButton />}
                    {editing_mode ? <Deck_Editing_Bar /> : < Deck_List />}
                </div>
                <div
                    className=" relative h-full flex-[1_0_auto] bg-[url('./assets/faction-select-bg-init.jpg')] bg-no-repeat bg-[length:100%_100%]">
                    <div className="dDCAKo">
                        <div className="crdnLx">
                            <div className="eTHfbE">
                                <input onChange={(e) => set_search_val(e.target.value)} name="search_card" className="nNDKL" />
                                <div className="juInEb" onClick={(e) => search_on_click()}></div>
                            </div>
                            <div title="Reset filters"
                                className="LibraryCardSearchInput__ResetButton-sc-1wdxocb-4 hzgKeb"></div>
                        </div>
                    </div>

                    <div className="eghlJM">
                        <div className="dRPWMU"></div>
                        <div className="relative overflow-hidden w-full h-full m-0">
                            <div
                                className="absolute overflow-x-hidden overflow-y-scroll mr-[-17px] mb-[150px] inset-[0px]">
                                <div className="leckge overflow-hidden">
                                    <div className="infinite-scroll-component__outerdiv">
                                        <div className="infinite-scroll-component h-auto overflow-hidden">
                                            <div className="eyfScn">

                                                {
                                                    cards.map((card, idx) => (
                                                        <div onMouseOver={() => card_hover(card.id)}
                                                            onMouseLeave={() => card_exit_hover(card.id)}
                                                            onClick={() => add_card_to_deck(cards, card, idx)}
                                                            className={"card kysPoZ before:bg-[url('" + card.imageUrl + "')]"}
                                                            id={card.id}>

                                                            <div className="hQMrnY">
                                                            </div>
                                                            <Selected props={{ idx: idx }} />
                                                        </div>
                                                    ))}

                                                <div className="jDzMSB"></div>
                                                <div className="jDzMSB"></div>
                                                <div className="jDzMSB"></div>
                                                <div className="jDzMSB"></div>
                                                <div className="jDzMSB"></div>
                                                <div className="jDzMSB"></div>
                                                <div className="jDzMSB"></div>
                                                <div className="jDzMSB"></div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <Pagination />
        </div>
    );
}


const root = ReactDOM.createRoot(document.getElementById("root"));

let global_cards = [];
let global_init = false;

root.render(
    <App />
);
