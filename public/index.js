function App() {
  const [cards, set_cards] = React.useState([]);
  const [filtering_cards, set_filtering_cards] = React.useState([]);
  const [create_deck_mode, set_create_deck_mode] = React.useState(false);
  const [editing_mode, set_editing_mode] = React.useState(false);
  const [current_deck, set_current_deck] = React.useState([]);
  const [new_deck, set_new_deck] = React.useState({name: "Nouveau Deck", cards: []});
  const [deck_list, set_deck_list] = React.useState([]);

  if (global_init === false) {
    global_init = true;

    fetch("http://127.0.0.1:9696").
    then(response => response.json()).
    then(function (data) {
        let clone_data = data.map(obj => ({ ...obj }));
      global_cards = clone_data;

      let clone_global_cards = data.map(obj => ({ ...obj }));
      set_cards(clone_global_cards);
    });

      fetch("http://127.0.0.1:9696/api/deck_list").
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

    set_new_deck({name:"Nouveau Deck", cards: []});
  }


  function search_onchange(v) {
      let clone_cards = cards.map(obj => ({ ...obj }));
    if (v === "") {
      set_cards(clone_cards);
    }

    if (global_cards.length > 0) {
      set_cards(global_cards.filter(function(card) {
        return card.name.toLowerCase().includes(v.toLowerCase());
      }));
    }
  }

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
    return (
        <div className="flex justify-evenly	w-full h-[5rem] relative pb-[0.5rem]">
          <div title="You need at least 25 cards in a deck." className="flex items-center justify-center">
            <div
                className="h-[2.1875rem] w-[1.875rem] relative bg-[url('./assets/scraps-icon.png')] bg-center bg-[length:auto_100%] bg-no-repeat before:content-[''] before:absolute before:bottom-[-1px] before:right-[-1px] before:w-[1.25rem] before:h-[1.375rem] before:bg-[length:100%_100%] before:bg-no-repeat before:bg-[url('./assets/validation-false.png')]"></div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-white font-HalisGR text-[18px]">MIN</div>
              <div className="font-gwent text-[32px] leading-none">25</div>
            </div>
          </div>
          <div title="You need at least 25 cards in a deck." className="flex items-center justify-center">
            <div
                className="h-[2.1875rem] w-[1.875rem] relative bg-[url('./assets/scraps-icon.png')] bg-center bg-[length:auto_100%] bg-no-repeat before:content-[''] before:absolute before:bottom-[-1px] before:right-[-1px] before:w-[1.25rem] before:h-[1.375rem] before:bg-[length:100%_100%] before:bg-no-repeat before:bg-[url('./assets/validation-false.png')]"></div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-white font-HalisGR text-[18px]">MAN AVG</div>
              <div className="font-gwent text-[32px] leading-none">0</div>
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
    set_new_deck({name: "Nouveau Deck", cards: []});

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

            {(editing_mode || create_deck_mode) ? <BtnHeaderBack/> :
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
    let deck_name;

    return (
        <li className="deckBtn" onClick={() => toggle_options()}>
          <div className="deckBtn_slot">
            <div className="deckBtn_name">{new_deck.name}</div>
          </div>
        </li>
    );
  }

  const [is_update_mode, set_is_update_mode] = React.useState(false);
  function update_mode(deck) {
      set_create_deck_mode(false);
      set_is_update_mode(true);
      set_editing_mode(true);
      set_current_deck(deck);

      fetch("http://127.0.0.1:9696/api/edit_deck?id=" + deck.id).
      then(response => response.json()).
      then(function (data) {
          let clone_data = data.map(obj => ({ ...obj }));
          set_new_deck({name:deck.Name, cards:data});

          console.log("data", data[0].id_crypt);
          let clone_cards = cards.map(obj => ({ ...obj }));
          for (let idx = 0; idx < data.length; idx++) {
              let id_crypt = data[idx].id_crypt;
              let index = cards.findIndex(function(obj) {
                  console.log(`${obj.id_crypt} === ${id_crypt}`, obj);
                  return obj.id_crypt === id_crypt;
              });
              console.log("index", index);
              clone_cards[index].is_selected = true;
          }
          set_cards(clone_cards);

      });
  }

    function Deck_Button2(props) {
        return (
            <li className="deckBtn" onClick={() => update_mode(props.props.deck)}>
                <div className="deckBtn_slot">
                    <div className="deckBtn_name">{props.props.deckName}</div>
                </div>
            </li>
        );
    }

  function add_card_to_deck(cards, card, idx_card) {
      let clone_cards = cards.map(obj => ({ ...obj }));


      if ((editing_mode) === true) {
          if (create_deck_mode === true) {
              let can_add = true;
              new_deck.cards.map(((c, idx) => {
                  if (c.id === card.id) {
                      can_add = false;
                      let clone_new_deck = {...new_deck};
                      clone_new_deck.cards.splice(idx, 1);
                      set_new_deck(clone_new_deck);

                      clone_cards[idx_card].is_selected = false;
                      console.log("global_cards", global_cards);
                      set_cards(clone_cards);
                  }
              }));
              if (can_add === true) {
                  let clone_new_deck = {...new_deck};
                  clone_new_deck.cards.push(card);
                  set_new_deck(clone_new_deck);

                  clone_cards[idx_card].is_selected = true;
                  console.log("global_cards", global_cards);
                  set_cards(clone_cards);
              } else {

              }
          }

          if (is_update_mode === true) {

          }
      }
  }

  function Selected(props) {
      return (
          <div className={cards[props.props.idx].is_selected ? "cardSelected" : ""}></div>
      );
  }

    function Scrollable() {
        return (
            <div className="ScrollableContainer__TrackVertical-sc-123mqds-0 iNjlus">
              <div className="ScrollableContainer__ThumbVertical-sc-123mqds-1 kqeGLj" style="height: 623px; transform: translateY(0px);"></div>
          </div>
      );
  }


  const [roll_options_toggle, set_roll_options_toggle] = React.useState(false);
  function Roll_Options() {
    return (
        <div className="rollOptions">
          <button className="rollOptions_btn" >Changer le nom</button>
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
        <div style={{position: "relative", overflow: "hidden", width: "100%", height: "100%", margin: "0px"}}>
          <div style={{position: "absolute", inset: "0px", overflow: "hidden scroll", marginRight: "-17px", marginBottom: "1rem"}}>
            <div className="" style={{overflow: "hidden", marginRight: ""}}>
              <ul className="deckCardsListing">
                <Deck_Button />
                  {roll_options_toggle ? <Roll_Options/> : <div></div>}
                  {
                      new_deck.cards.map(card => (
                          <Card_Container name={card.name} />
                      ))
                  }
              </ul>
            </div>
          </div>

          <div style={{position: "absolute", height: "6px", right: "2px", bottom: "2px", left: "2px", borderRadius: "3px"}}>
            <div style={{position: "relative", display: "block", height: "100%", cursor: "pointer", borderRadius: "inherit", backgroundColor: "rgba(0, 0, 0, 0.2)", width: "0px"}}></div>
          </div>
        {/*  Scrollable*/}
        </div>
    );
  }

  function save_deck() {
    post_save_deck("http://127.0.0.1:9696/api/create", new_deck);
  }

  async function post_save_deck(url = "", data = {}) {
      const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(data) , // body data type must match "Content-Type" header
          headers: {
              "Content-Type": "application/json",
          },
      });
      // return response.json(); // parses JSON response into native JavaScript objects
  }

  function Deck_List() {

      console.log(deck_list);


      return (
          <div style={{position: "relative", overflow: "hidden", width: "100%", height: "100%", margin: "0px"}}>
              <div style={{position: "absolute", inset: "0px", overflow: "hidden scroll", marginRight: "-17px", marginBottom: "1rem"}}>
                  <div className="" style={{overflow: "hidden", marginRight: ""}}>
                      <ul className="deckCardsListing">
                          {
                              deck_list.map((deck, idx) => (
                                  <Deck_Button2 props={{deckName: deck.Name, deck: deck}}/>
                              ))
                          }
                      </ul>
                  </div>
              </div>

              <div style={{position: "absolute", height: "6px", right: "2px", bottom: "2px", left: "2px", borderRadius: "3px"}}>
                  <div style={{position: "relative", display: "block", height: "100%", cursor: "pointer", borderRadius: "inherit", backgroundColor: "rgba(0, 0, 0, 0.2)", width: "0px"}}></div>
              </div>
          </div>
      );
  }

  function Change_Deck_Name() {
      return (
          <div>
              <div className="react-confirm-alert-overlay undefined">
                  <div className="react-confirm-alert">
                      <div style="display: flex; align-items: center;">
                          <div className="ConfirmationStyles__ModalContent-sc-6g8z68-0 jJToJe"><p
                              className="Gradient__GoldGradient-sc-11cfh66-0 ConfirmationStyles__ModalTitle-sc-6g8z68-3 kTEwCF">Modifier
                              le nom</p>
                              <div className="ConfirmationStyles__ModalTextBox-sc-6g8z68-1 jFShho">
                                  <div className="ConfirmationStyles__ModalText-sc-6g8z68-4 bAhNKV"></div>
                                  <div mobile="false"
                                       style="position: relative; overflow: hidden; width: 100%; height: auto; min-height: 0px; max-height: 295px; max-width: 550px;">
                                      <div
                                          style="position: relative; overflow: scroll; margin-right: -17px; margin-bottom: -17px; min-height: 17px; max-height: 312px;">
                                          <div className="DeckOptionsModal__RenameDeckContainer-sc-hid779-1 qAprr"><p
                                              className="DeckOptionsModal__RenameDeckTitle-sc-hid779-3 dSNBmL">Nom du
                                              jeu</p><input placeholder="Entrer un nom de jeu&nbsp;:"
                                                            className="DeckOptionsModal__RenameDeckInput-sc-hid779-4 lezPGR"
                                                            value=""/></div>
                                      </div>
                                      <div
                                          style="position: absolute; height: 6px; right: 2px; bottom: 2px; left: 2px; border-radius: 3px; visibility: hidden;">
                                          <div
                                              style="position: relative; display: block; height: 100%; cursor: pointer; border-radius: inherit; background-color: rgba(0, 0, 0, 0.2); width: 0px;"></div>
                                      </div>
                                      <div className="ConfirmationStyles__TrackVertical-sc-6g8z68-12 hNBrsD"
                                           style="position: absolute; width: 6px; visibility: hidden;">
                                          <div className="ConfirmationStyles__ThumbVertical-sc-6g8z68-13 cDaIDz"
                                               style="position: relative; display: block; width: 100%; height: 0px;"></div>
                                      </div>
                                  </div>
                                  <div className="ConfirmationStyles__ScrollShadow-sc-6g8z68-14 beXcfu"></div>
                              </div>
                              <div className="ConfirmationStyles__Buttons-sc-6g8z68-8 koQjAG">
                                  <button className="ConfirmationStyles__ButtonBase-sc-6g8z68-7 bZbUMA"><p
                                      className="Gradient__GoldGradient-sc-11cfh66-0 ConfirmationStyles__ButtonTextGold-sc-6g8z68-10 eBoxnK">Annuler</p>
                                  </button>
                                  <button disabled="" className="ConfirmationStyles__ButtonBase-sc-6g8z68-7 MSqcr"><p
                                      className="ConfirmationStyles__ButtonText-sc-6g8z68-9 gZgjlD">Sauvegarder</p>
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

    return (
        <div>
            <Header/>
            <div className="flex justify-center relative overflow-hidden h-[980px] w-full">
                <div
                    className="left-board w-[304px] bg-orange-300 relative  h-full flex-[0_0_360px] p-[1rem_1.5rem_1.5rem] bg-[url('./assets/left-column-bg.jpg')] bg-no-repeat bg-[length:100%_100%]">
                    {(editing_mode) ? <DeckStats/> : <NewDeckButton/>}
                    {editing_mode ? <Deck_Editing_Bar/> : < Deck_List/>}
                </div>
                <div
                    className=" relative h-full flex-[1_0_auto] bg-[url('./assets/faction-select-bg-init.jpg')] bg-no-repeat bg-[length:100%_100%]">
                    <div className="dDCAKo">
                        <div className="crdnLx">
                            <div className="eTHfbE">
                                <input onChange={(e) => search_onchange(e.target.value)} name="search_card"
                                       className="nNDKL"/>
                                <div className="juInEb"></div>
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
                                    <Selected props={{idx:idx}}/>
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
      </div>
  );
}


const root = ReactDOM.createRoot(document.getElementById("root"));

let global_cards = [];
let global_init = false;
let global_editing_mode = false;
let global_new_deck_mode = false;

root.render(
    <App/>
);


/*
* Fonction qui récupère l'ensemble du jeu de carte.
* 
* @return Array
*/

