const BAZNIURL_JSON = "assets/data/";
const BAZNIURL_PROIZVODI = "assets/img/proizvodi/"
// Nav
const NIZGlavniMeniText = ["Početna", "Proizvodi", "Kontakt", "Autor", "Obavesti me"];
const NIZGlavniMeniHref = ["index.html", "proizvodi.html", "kontakt.html", "autor.html", "obavesti.html"];
// Footer
const NIZFooterKontaktText = ["Byzart digital print", "Račkog 6, 11000 Beograd", "tel/fax: +381 11 2766 081", "e-mail: print@bzyart.net"];
const NIZFooterRadnoVremeText = ["Ponedeljak-Petak: 09h-20h", "Subota: 10h-15h", "Nedelja: Ne radimo"]
const NIZFooterMaterijaliText = ["Main.js", "Sitemap", "Dokumentacija", "Github"];
const NIZFooterMaterijalHref = ["js/main.js", "#", "#", "https://github.com/BogdanV44"];

var proizvodi = [];
let proizvodiFiltrirani = [];
let nizProizvodaJSON = [];

window.onload = function() {
    let location = window.location.pathname;
    ispisivanjeNavigacije();
    if (location === "/byzart/index.html" || location === "/byzart/") {
        ucitajPocetnu();
    }
    else if(location === "/byzart/proizvodi.html") {
        ajaxZahtev("tipStampe.json", function(rezultat){
            napraviCHBL(rezultat, "#tip-stampe", "tipStampe");
        })
        ajaxZahtev("kategorija.json", function(rezultat){
            napraviCHBL(rezultat, "#kategorije", "kategorija");
        })
        ajaxZahtev("boje.json", function(rezultat){
            napraviFilterBoja(rezultat, "#boje")
        })
        ajaxZahtev("proizvodi.json", function(rezultat) {
            ispisiProizvode(rezultat);
            proizvodi = rezultat;
        })
        $(document).on("change", "#filtriranje", function(){
            filtriranjeOnChange();
            let value = document.querySelector("#sort-list-proizvodi").value;
            if(value != 0) {
                if(proizvodiFiltrirani.length == 0) {
                    sortiraj(proizvodi);
                } 
                else {
                    sortiraj(proizvodiFiltrirani);
                }
            }
        })
        $(document).on("click", ".dugme-nije-na-stanju", function(){
            dugme = $(this);

            //dugme.val('Processing…');

            
        });
        
        ucitajProdavnicu();
        $(document).on("change", "#sort-list-proizvodi", function(){
            if(proizvodiFiltrirani.length == 0) {
                sortiraj(proizvodi);
            } 
            else {
                sortiraj(proizvodiFiltrirani);
            }
        })

    }
    else if (location === "/byzart/obavesti.html") {
        let proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");
        //ispisiProizvode(proizvodiLS, "#proizvodi-obavesti-me");
        if(proizvodiLS.length != 0) {
            ubaciProizvodeIzLS();
        }
        else {
            ispisiProizvodeObavesti(proizvodiLS);
        }

        document.querySelector("#btn-ukloni-sve").addEventListener("click", function() {
            for (let i = 0; i < proizvodiLS.length; i++) {
                ukloniLS(proizvodiLS[i].id);
            }

        })

        // provera da li su obrisani svi proizvodi
    }

    else if (location === "/byzart/kontakt.html") {
        document.querySelector("#btnKontakt").addEventListener("click", function(e){
            let ime, email, poruka, rb, vrednostRb = "";
            ime = $("#tbIme");
            email = $("#iEmail");
            poruka = $("#taPoruka");
            rb = document.getElementsByName("rbList");

            resetPorukaForm();

            rxValidacija(ime.val(), $("#tbIme"), rxIme);
            rxValidacija(email.val(), $("#iEmail"), rxEmail);

            if(poruka.val().length == 0) {
                ispisGreskeFormValidacija("Poruka ne može biti prazna.", $("#taPoruka"));
            }

            vrednostRb = proveraRB(rb);

            if (!vrednostRb) {
                ispisGreskeFormValidacija("Obavezno polje", $("#rbDiv"))
            }
            
            if (greskaValidacije) {
                e.preventDefault();
            }

            else {
                document.querySelector("#forma-kontakt").innerHTML += `<p class="uspeh">Uspešno ste poslali poruku.</p>`
            }
        })

        // Poruka
        document.querySelector("#taPoruka").addEventListener("keyup", function () {
            var poruka = document.querySelector("#taPoruka");
            var vrednostPoruka = poruka.value;
            var brojKaraktera = vrednostPoruka.length;
        
            if (brojKaraktera <= 200) {
                poruka.classList.remove('greska-poruka');
                var ostatakKaraktera = 200 - brojKaraktera;
                document.querySelector("#brojKaraktera").innerHTML = ostatakKaraktera;
                document.querySelector("#error-poruka").classList.add('d-none');
                greskaValidacije = false;
            }
            else {
                poruka.value = vrednostPoruka.substring(0, 201);
                poruka.classList.add('greska-poruka');
                document.querySelector("#error-poruka").classList.remove('d-none');
                greskaValidacije = true;
            }
        })
    }
    ispisivanjeFootera();
}
function ucitajPocetnu() {   
    // Pocetna
    // Galerija
    var button = document.querySelector("#vidi-jos");

    for (let i = 1; i < 4; i++) {
        var div_slike = document.createElement("div");
        div_slike.classList.add("div-slike");

        var img = document.createElement("img");
        img.setAttribute("src", `assets/img/galerija/img${i}.jpg`);
        img.setAttribute("alt", `img_${i}`);
        img.setAttribute("width", "100%");
        
        div_slike.appendChild(img);
        document.querySelector("#galerija-slike").appendChild(div_slike);
    }

    button.addEventListener("click", ucitajGaleriju);

    var nizUslugeDigitalna = ["Štampa na papirima do formata 32 x 48.7 cm (korisno 31x47.7) u rezoluciji do 2400 dpi", "Idealna za male tiraže uz vrhunski kvalitet", "Vizit i ID karte, katalozi, CD i DVD nalepnice i omoti..."];
    var nizUslugeVelikiFormati = ["Štampa na rolnama širine do 1050 mm, u rezoluciji do 2880 dpi", "Štampa vrhunskog kvaliteta namenjena isklju?ivo unutrašnjoj (indoor) primeni", "Plakati, backlite, canvas"];
    var nizUslugeDorada = ["Se?enje", "Topla i hladna plastifikacija", "Klamovanje, bigovanje", "Perforacija", "Spiralno kori?enje", "Ugliranje", "Kaširanje na penu"];
    var nizUslugeOstale = ["Priprema za štampu", "Grafički dizajn", "Štampa na tekstilu", "Štampa na kancelarijskom materijalu", "Štampa na šoljama, kao i različitom asortmanu proizvoda."];

    napraviMeniIliListu(nizUslugeDigitalna, "", "#digitalna-lista");
    napraviMeniIliListu(nizUslugeVelikiFormati, "", "#veliki-formati-lista");
    napraviMeniIliListu(nizUslugeDorada, "", "#dorada-lista");
    napraviMeniIliListu(nizUslugeOstale, "", "#ostale-lista");

    var vecProsiren = 0;
    var vecUcitaneSlike = 0;
    function ucitajGaleriju() {
        if (vecProsiren != 1 && vecUcitaneSlike != 1) {
            for (let i = 4; i < 13; i++) {
                let div_slike = document.createElement("div");
                div_slike.classList.add("div-slike");

                var img = document.createElement("img");
                img.setAttribute("src", `assets/img/galerija/img${i}.jpg`);
                img.setAttribute("alt", `img_${i}`);
                img.setAttribute("width", "100%");
                
                div_slike.appendChild(img);
                setTimeout(function() {
                    document.querySelector("#galerija-slike").appendChild(div_slike);
                }, 500);
                vecProsiren = 1;
                vecUcitaneSlike = 1;
                button.textContent = "Umanji";
            }
        }
        else if (vecUcitaneSlike == 1 && vecProsiren == 0) {
            var nizUcitanihSlika = document.querySelectorAll(".div-slike");
            nizUcitanihSlika.forEach(function (slika) {
                slika.classList.remove("display-none");
            })
            vecProsiren = 1;
            button.textContent = "Umanji";
        }
        else {
            var nizUcitanihSlika = document.querySelectorAll(".div-slike");
            for (let i = 3; i < nizUcitanihSlika.length; i++ ) {
                nizUcitanihSlika[i].classList.add("display-none");
            }
            vecProsiren = 0;
            button.textContent = "Učitaj Još";
        }
    }
    // Iskustva
    var recenzijeNizImena = ["Slobodan Ljubisic", "Đina Moković", "Aleksa Stojanovic", "Marija Peric", "Uros Fisic", "Milos Petrovic", "Uroš Maksimović", "Davor Ranic", "Tanja Todorovic"];
    var recenzijeNizTekst = ["Profesionalci, stručni, poštuju rokove.", "Ljudi jednostavno znaju posao.", 
        "Najljubaznije osoblje ikada! Toliko razumevanja i strpljenja za svakog klijenta pojedinačno nisam još video. Izasli su mi u susret iako sam prvi put radio bilo šta kod njih. Odgovaranje na mejlove u roku od 5 min svaki put me je odmah kupilo.",
        "Jako stručno i ljubazno osoblje, odličan kvalitet štampe.", "Za svaku pohvalu, kvalitet štampe, ljubaznost, profesionalnost.",
        "Svaka čast, brzi, kvalitet odličan, sve pohvale!", "Štampaju 50x70cm za 10 minuta tako da 5 zvezdica.",
        "Odlicna saradnja, kvalitetna i brza usluga", "Brza i kvalitetna usluga. Dobar izbor papira i uslužno osoblje."];
    for (let i=0; i<9; i++) {

        var recenzijeDiv = document.createElement("div");
        recenzijeDiv.classList.add("item");

        var recenzijeIme = document.createElement("h3");
        var recenzijeZvezdice = document.createElement("img");
        var recenzijeTekst = document.createElement("p");

        recenzijeIme.textContent = recenzijeNizImena[i];
        recenzijeZvezdice.src = "assets/img/zvezdice.png";
        recenzijeTekst.textContent = recenzijeNizTekst[i];

        recenzijeDiv.appendChild(recenzijeZvezdice);
        recenzijeDiv.appendChild(recenzijeIme);
        recenzijeDiv.appendChild(recenzijeTekst);

        document.querySelector("#iskustva").appendChild(recenzijeDiv);
    }
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        autoplay: true,
        autoplayTimeout: 2200,
        autoplayHoverPause: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:4
            }
        }
    })
    // Kontakt
    // FORMA



    // Dinamicka ispisivanje padajuce liste forme
    // var nizLice = ["Pravno lice", "Fizičko lice"];
    // var nizLiceVrednost = ["PL", "FL"];

    // var tagSelect = document.createElement("select");
    // tagSelect.setAttribute("id", "ddLista");
    // tagSelect.setAttribute("class", "form-control");

    // var tagIzborPrvi = document.createElement("option");
    // tagIzborPrvi.setAttribute("value", "0");
    // var contentIzborPrvi = document.createTextNode("Izaberite");

    // tagIzborPrvi.appendChild(contentIzborPrvi);
    // tagSelect.appendChild(tagIzborPrvi);

    // for(let i = 0; i < nizLice.length; i++){
    //     var tagIzbor = document.createElement("option");
    //     tagIzbor.setAttribute("value", nizLiceVrednost[i]);

    //     var contentIzbor = document.createTextNode(nizLice[i]);

    //     tagIzbor.appendChild(contentIzbor);
    //     tagSelect.appendChild(tagIzbor);
    // }

    // document.querySelector("#forma").appendChild(tagSelect);

    // document.querySelector("#dugmePosalji_id").addEventListener("click", function(){
    //     var objSlobodnoVreme = document.querySelector("#listaSlobodanSam");
    // });

    // // Broj karaktera - poljeKomentar
    // document.querySelector("#poljeKomentar").addEventListener("keyup", function () {
    //     var komentar = document.querySelector("#poljeKomentar");
    //     var vrednostKomentar = komentar.value;
    //     var brojKaraktera = vrednostKomentar.length;

    //     if (brojKaraktera <= 200) {
    //         komentar.classList.remove('border-danger', 'border', 'border-3');
    //         var ostatakKaraktera = 200 - brojKaraktera;
    //         document.querySelector("#brojKaraktera").innerHTML = ostatakKaraktera;
    //     }
    //     else {
    //         komentar.value = vrednostKomentar.substring(0, 201);
    //         komentar.classList.add('border-danger', 'border', 'border-3');
    //     }
    // })

    // // Validacija forme
    // window.onload = function(){
    //     document.querySelector("#dugmePosalji_id").addEventListener("click", proveriPolje);

    // }
    // function proveriPolje(){
    //     var poljeImePrezime = document.querySelector("#tbImePrezime");

    //     var reImePrezime = /^[A-ZČĆŽŠĐ][a-zčćžšđ]{2,13}(\s[A-ZČĆŽŠĐ][a-zčćžšđ]{2,13})+$/

    //     if(!reImePrezime.test(poljeImePrezime.value)){
    //         poljeImePrezime.nextElementSibling.classList.add("alert", "alert-danger", "mt-1");
    //         poljeImePrezime.nextElementSibling.innerHTML = "Početno slovo imena i prezimena mora biti veliko, maksimalan broj karaktera za ime, i za prezime, je 14.";
    //     }
    //     else {
    //         poljeImePrezime.nextElementSibling.classList.remove("alert", "alert-danger", "mt-1");
    //         poljeImePrezime.nextElementSibling.innerHTML = "";
    //     }

    //     var poljeEmail = document.querySelector("#tbEmail");
    //     var reEmail = /^[a-z][\w\.]*\@[a-z0-9]{3,20}(\.[a-z]{3,6})?(\.[a-z]{2,3})$/

    //     if(!reEmail.test(poljeEmail.value)){
    //         poljeEmail.nextElementSibling.classList.add("alert", "alert-danger", "mt-1");
    //         poljeEmail.nextElementSibling.innerHTML = "Adresa mora sadržati @ karakter, završiti se sa ispravnim domenom. (Npr. primer@gmail.com)";
    //     }
    //     else {
    //         poljeEmail.nextElementSibling.classList.remove("alert", "alert-danger", "mt-1");
    //         poljeEmail.nextElementSibling.innerHTML = "";
    //     }

    //     var objSlobodnoVreme;
    //     objSlobodnoVreme = document.querySelector("#listaSlobodanSam");

    //     var brojacGresaka = 0;

    //     //provera padajuce liste
    //     if (objSlobodnoVreme.options[objSlobodnoVreme.options.selectedIndex].value == "0") {
    //         objSlobodnoVreme.parentElement.parentElement.lastElementChild.classList.add("prikazGreske");
    //         brojacGresaka++;
    //     }
    //     else {
    //         objSlobodnoVreme.parentElement.parentElement.lastElementChild.classList.remove("prikazGreske");
    //     }

    //     // provera radio button-a
    //     var objNewsletter = document.getElementsByName("rbNewsletter");
    //     let poslednjiP_element = document.querySelector("#poslednjiP");

    //     var vrednostNewsletter = "";
    //     for(let i = 0; i < objNewsletter.length; i++){
    //         if(objNewsletter[i].checked){
    //             vrednostNewsletter = objNewsletter[i].value;
    //             break;
    //         }
    //     }
    //     if(vrednostNewsletter == ""){
    //         poslednjiP_element.classList.add("prikazGreske");
    //         brojacGresaka++;
    //     }
    //     else {
    //         poslednjiP_element.classList.remove("prikazGreske");
    //     }

    //     if (brojacGresaka == 0) {
    //         document.querySelector("#ispisProvere").innerHTML = "Hvala Vam što ste Dobro Srce. Naš tim će Vas uskoro kontaktirati!"
    //     }
    //     else {
    //         document.querySelector("#ispisProvere").innerHTML = "";
    //     }
    // }

    // function insertKaoPrviChild (tekst, identifikatorDiv, elementUKojiPravimo) {
    //     var div = document.querySelector(`${identifikatorDiv}`);
    //     var prviChild = div.firstElementChild;
    //     var element = document.createElement(`${elementUKojiPravimo}`);
    //     element.textContent
    //     console.log(element);
    //     var p = "pera";
    // }
    // insertKaoPrviChild("", "#sekcija-usluge", "h2");
}
function ucitajProdavnicu() {
    let nizSortNaziv = ["Naziv rastući", "Naziv opadajući", "Cena rastuća", "Cena opadajuća", "Najnoviji"];
    let nizSortValue = ["nazivAZ", "nazivZA", "cenaRast", "cenaOp", "najnovije"];

    napraviDDL(nizSortNaziv, nizSortValue, "#sort-ddl", "sort-list-proizvodi");
}
function filtriranjeOnChange() {
    let divFilter = document.querySelector("#filtriranje");
    let nizKategorijeValue = [];
    let nizTipStampeValue = [];

    let nizCheckedKategorije = divFilter.querySelectorAll('input[type="checkbox"][name="kategorija"]:checked');
    let nizCheckedTipStampe = divFilter.querySelectorAll('input[type="checkbox"][name="tipStampe"]:checked');

    nizCheckedKategorije.forEach (input => {
        nizKategorijeValue.push(Number(input.value));
    })
    nizCheckedTipStampe.forEach (input => {
        nizTipStampeValue.push(Number(input.value));
    })

    if(nizCheckedKategorije.length == 0 && nizCheckedTipStampe.length==0) {
        ispisiProizvode(proizvodi)
        proizvodiFiltrirani = [];
    }
    else if(nizKategorijeValue.length != 0) {

        proizvodiFiltrirani = proizvodi.filter(proizvod => nizKategorijeValue.includes(proizvod.kategorija))

        ispisiProizvode(proizvodiFiltrirani);
        if (nizTipStampeValue.length > 0) {
            ispisiProizvodeTipStampe(nizTipStampeValue, proizvodiFiltrirani);  
        }
    }
    else {
        ispisiProizvodeTipStampe(nizTipStampeValue, proizvodi);
    }
}

// -FUNKCIJE-
// AJAX Call Back funkcija
function ajaxZahtev (url, rezultat, metod="get") {
    $.ajax({
        url: BAZNIURL_JSON + url,
        method: metod,
        dataType: "json",
        success: rezultat,
        error: function(xhr, izuzetak) {
            var odg = '';
            if (xhr.status === 0) {
                odg = 'Niste konektovani.\n Proverite Mrežu.';
            } else if (xhr.status == 404) {
                odg = 'Stranica nije pronađena. [404]';
            } else if (xhr.status == 500) {
                odg = 'Internal Server Error [500].';
            } else if (izuzetak === 'parsererror') {
                odg = 'Traženi JSON parse neuspešan.';
            } else if (izuzetak === 'timeout') {
                odg = 'Time out error.';
            } else if (izuzetak === 'abort') {
                odg = 'Ajax request zaustavljen.';
            } else {
                odg = 'Nepoznata greška.\n' + xhr.responseText;
            }
            console.log(odg);
        } 
    })
}

// LOCAL STORAGE
function dodajUObavestiMe() {
    let id = $(this).data('id');
    let dugme = $(this);

    var proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");

    if(proizvodiLS) {
        if(!proveraDaLiPostojiLS(proizvodiLS, id)) {
            dodajProizvodLS(id);
            obavestiKorisnika(dugme);
        }  
    }
    else {
        dodajPrviProizvodLS(id);
        obavestiKorisnika(dugme);
    }
}
function upisiProizvodeLS (ime, data) {
    localStorage.setItem(ime, JSON.stringify(data));
}
function dohvatiPodatakLS(key) {
    return JSON.parse(localStorage.getItem(key));
}
function dodajPrviProizvodLS(id) {
    let proizvodi = [];
    proizvodi[0] = {
        id: id
    };
    upisiProizvodeLS("proizvodiObavestiMe", proizvodi);
}
function proveraDaLiPostojiLS(niz, id) {
    return niz.filter(e => e.id == id).length;
}
function obavestiKorisnika(dugme, poruka = "Ukloni") {
    dugme.val(poruka);
}
function dodajProizvodLS(id) {
    var proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");
    proizvodiLS.push({
        id: id
    });
    upisiProizvodeLS("proizvodiObavestiMe", proizvodiLS);
}

// <VALIDACIJA - REGEX>

let rxIme = /^[A-ZŠĐŽĆČ][a-zšđžćč]{2,15}(\s[A-ZŠĐŽĆČ][azšđžćč]{2,14})?$/;
let rxPrezime = rxIme;
let rxEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
let rxLozinka = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

var greskaValidacije = false;
function rxValidacija(string, element, rx, pass = false) {
	if (string == "") {
		return ispisGreskeFormValidacija("Obavezno polje.", element);
	} 
    else if (!rx.test(string)) {
        if (pass) {
            return ispisGreskeFormValidacija("Lozinka mora da sadrži malo slovo, broj i da bude minimum 8 karaktera.", element);
            }
        return ispisGreskeFormValidacija("Neispravno unet podatak.", element);
    }
}
function resetPorukaForm() {
    greskaValidacije = false;
    $(".greska-forme").remove();
    $(".uspeh-forme").remove();
}

function ispisGreskeFormValidacija(poruka, element) {
    greskaValidacije = true;
    $(`<p class="greska-forme">${poruka}</p>`).insertAfter($(element));
}

function proveraRB (rb) {
    for(let i = 0; i < rb.length; i++){
        var vrednost;
        if(rb[i].checked){
            vrednost = rb[i].value;
            break;
        }
    }
    return vrednost;
}
// </VALIDACIJA>

// funkcija za ispisivanje navigacije
function ispisivanjeNavigacije() {
    var navElementi = document.querySelectorAll(".glavni-meni");

    navElementi.forEach( navTag => {
        napraviMeniIliListu(NIZGlavniMeniText, NIZGlavniMeniHref, ".glavni-meni");
    })
}

// funckija za ispisivanje footera
function ispisivanjeFootera() { 
    napraviMeniIliListu(NIZFooterKontaktText, "", "#kontakt");

    napraviMeniIliListu(NIZFooterRadnoVremeText, "", "#radno-vreme");

    napraviMeniIliListu(NIZFooterMaterijaliText, NIZFooterMaterijalHref, "#materijali");
}
function napraviMeniIliListu(nizText, nizHref="", navTag) {
    var ul = document.createElement("ul");
    for(let i = 0; i < nizText.length; i++) {
        var li = document.createElement("li");

        if(nizHref != "") {
            var a = document.createElement("a");

            a.textContent = nizText[i];
            a.setAttribute("href", nizHref[i]);

            li.appendChild(a);
        } else {
            li.textContent = nizText[i];
        }

        ul.appendChild(li);
    }
    document.querySelector(`${navTag}`).appendChild(ul);
}
// napravi checkbox listu
function napraviCHBL(niz, idDiva, name) {
    for(let i=0; i < niz.length; i++) {
        let div = document.createElement("div");
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", name)
        input.setAttribute("value", niz[i].id);

        let label = document.createElement("label");
        label.setAttribute("for", input.name)
        label.textContent = niz[i].naziv;

        div.appendChild(input);
        div.appendChild(label);
        document.querySelector(idDiva).appendChild(div);
    }
}
// napravi izgled filtera po bojama
function napraviFilterBoja (niz, idDiva) {
    for(let i=0; i<niz.length;i++) {
        let a = document.createElement("a");
        a.style.backgroundColor = niz[i].naziv.nazivZaFilter;
        document.querySelector(idDiva).appendChild(a);
    }
}

function ispisiProizvode(nizProizvoda, htmlDiv = "#proizvodi") {
    let div = "";
    for (let i=0; i<nizProizvoda.length; i++) {
        let proizvod = `<div class="proizvod">
            <p class="cena">${nizProizvoda[i].cena.bezStampe}€</p>
            <div class="proizvod-content">
                <img src="${BAZNIURL_PROIZVODI+nizProizvoda[i].slika}" alt=${nizProizvoda[i].naziv}/>
                <p class="naziv-proizvoda">${nizProizvoda[i].naziv}</p>
            </div>`;
        proizvod += proveraDaLiNaStanju(nizProizvoda[i]);
        proizvod += "</div>";
        div += proizvod;
    }
    document.querySelector(htmlDiv).innerHTML = div;
    $('.dugme-nije-na-stanju').click(dodajUObavestiMe);
}

function proveraDaLiNaStanju(proizvod) {
    let html = "";
    if(proizvod.naStanju == false) {
        html += `<div class="div-nije-na-stanju"><p class="p-nije-na-stanju">Nije na stanju</p>
        <input type="button" data-id="${proizvod.id}" value="Obavesti me" class="dugme-nije-na-stanju" /></div>`
    }
    return html;
}

function ispisiProizvodeTipStampe (niz, nizProizvoda) {
    let drugiStepenPrzFilt = [];
    for(let proizvod of nizProizvoda) {
        // da se nebi pravili duplikati kada je čekirano više tipa štampe u koje proizvod spada
        let vecPrikazan = false;
        for(let i=0;i<proizvod.tipStampe.length;i++){

            let idTipaStampe = proizvod.tipStampe[i];

            if(niz.includes(idTipaStampe) && vecPrikazan == false){
                drugiStepenPrzFilt.push(proizvod);
                vecPrikazan = true;
            }
        }
    }
    ispisiProizvode(drugiStepenPrzFilt);   
}

function napraviDDL(nizNaziv, nizValue, idtDiva, idSelect) {
    let select = document.createElement("select");
    select.setAttribute("id", idSelect);

    let optionIzb = document.createElement("option");
    optionIzb.setAttribute("value", 0);
    optionIzb.textContent = "Izaberite...";
    select.appendChild(optionIzb);
    for(let i = 0; i<nizNaziv.length; i++) {
        let option = document.createElement("option");
        
        option.setAttribute("value", nizValue[i]);
        option.textContent = nizNaziv[i];
        select.appendChild(option);
    }
    document.querySelector(idtDiva).appendChild(select);
}

function sortiraj(niz) {
    let value = document.querySelector("#sort-list-proizvodi").value;
    if(value == "nazivAZ") {
        niz = niz.sort((a,b) => a.naziv>b.naziv? 1 : -1);
    }
    else if (value == "nazivZA") {
        niz = niz.sort((a,b) => a.naziv<b.naziv? 1 : -1);
    }
    else if(value == "cenaRast") {
        niz = niz.sort((a,b) => a.cena.bezStampe>b.cena.bezStampe? 1 : -1);
    }
    else if(value == "cenaOp") {
        niz = niz.sort((a,b) => a.cena.bezStampe<b.cena.bezStampe? 1 : -1);
    }
    else if(value == "najnovije") {
        niz = niz.sort((a,b) => a.id<b.id? 1 : -1);
    }
    ispisiProizvode(niz);
}
// funkcija koja u slucaju da nema proizvoda daje poruku korisnicima
function obavestenje(htmlDiv, poruka) {
    document.querySelector(htmlDiv).innerHTML = `<h2 class="obavestenje">${poruka}</h2>`;
}
function ubaciProizvodeIzLS() {
    let proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");
    ajaxZahtev("proizvodi.json", function(niz) {
        niz = niz.filter(e => {
            for(let proizvod of proizvodiLS) {
                if(e.id == proizvod.id) {
                    return true;
                }
            }
            return false;
        });
        
        ispisiProizvodeObavesti(niz);
    })
}
// funkcija koja ispisuje niz dohvacenih proizvoda za Obavesti me
function ispisiProizvodeObavesti(nizProizvoda) {
    if(nizProizvoda.length != 0) {
        let div = `<table id='tabela'>
        <tr>
            <th>Rb.</th>
            <th>Slika</th>
            <th>Naziv proizvoda</th>
            <th></th>
        </tr>`;
        let rednibroj = 1;
        for(let proizvod of nizProizvoda) {
            div += `<tr>
                        <td>${rednibroj}</td>
                        <td><img src='../assets/img/proizvodi/${proizvod.slika}' alt='${proizvod.naziv}'/></td>
                        <td>${proizvod.naziv}</td>
                        <td>
                            <div class="ukloni">
                                <button onclick='ukloniLS(${proizvod.id})'>Ukloni</button>
                            </div>
                        </td>`;
            rednibroj++;
        }
        div += "</table>";
        document.querySelector("#proizvodi-obavesti-me").innerHTML = div;
    }
    else {
        obavestenje("#proizvodi-obavesti-me", "Nije dodat nijedan proizvod");
    }
    
}

//funkcija za uklanjanje proizvoda iz Local Storage-a
function ukloniLS(id) {
    let proizvodiLS = dohvatiPodatakLS("proizvodiObavestiMe");

    proizvodiLS = proizvodiLS.filter(e => e.id != id);

    upisiProizvodeLS("proizvodiObavestiMe", proizvodiLS);
    
    ubaciProizvodeIzLS();
}
