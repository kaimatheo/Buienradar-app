const buienRadar = "https://data.buienradar.nl/2.0/feed/json";
//comment: Deze code bevat een functie genaamd datainladen(). Deze functie haalt gegevens op van een website genaamd Buienradar. Het doel is om informatie over het weer te krijgen. De functie gebruikt een speciale techniek genaamd "promises" om met asynchrone taken om te gaan. Hierdoor kan de code wachten tot de gegevens zijn opgehaald voordat deze verdergaat. Zodra de gegevens zijn opgehaald, wordt er naar een specifieke stad gezocht in de gegevens. De functie zoekt naar de temperatuur en de hoeveelheid regenval in die stad. Uiteindelijk geeft de functie een object terug met enkele gegevens, zoals een link naar een radarafbeelding van Buienradar, de temperatuur en de hoeveelheid regen in de stad.
function datainladen() {
    return new Promise(async (resolve, reject) => {
        const data = await (await fetch(buienRadar)).json();
        const stad = vindstad(data);

        resolve({
            imgLink: data.actual.actualradarurl,
            Temperatuur: stad.temperature,
            regen: stad.rainFallLastHour
        })
    })
}
//comment:Deze code bevat een functie genaamd veranderstad(). Het doel van deze functie is om de stad te veranderen op basis van de waarde die is ingevoerd in een invoerveld op een webpagina. De code controleert eerst of de ingevoerde waarde in het invoerveld niet leeg is en geen spaties bevat. Als de waarde niet leeg is, wordt de code vervolgens uitgevoerd. De functie wijzigt de locatie (URL) van de webpagina naar "./index.html?stad=" gevolgd door de ingevoerde waarde van het invoerveld zonder extra spaties aan het begin of einde. Dit wordt gedaan door window.location.href te gebruiken, wat betekent dat de webpagina wordt omgeleid naar de nieuwe URL.
function veranderstad() {
    if (document.getElementById("city").value.trim().length > 0) {
        window.location.href = "./index.html?stad=" + document.getElementById("city").value.trim()
    }
}
//comment: Deze code bevat een functie genaamd vindstad(data). Het doel van deze functie is om de informatie over een specifieke stad te vinden in de gegevens die als argument (data) worden doorgegeven. De functie gebruikt een for-loop om door de metingen van verschillende stations te itereren. Het begint bij 0 en gaat door zolang de waarde van de variabele plek kleiner is dan of gelijk is aan de lengte van de stationmeasurements-array in de gegevens. Binnen elke iteratie wordt de huidige meting toegewezen aan de variabele meet. Deze meting bevat informatie over een specifiek station en de bijbehorende regio. De code controleert vervolgens of de regio van de huidige meting (in kleine letters) niet gelijk is aan de regio van de stad waar we informatie over zoeken (ook in kleine letters). Als dit het geval is, wordt de rest van de code binnen de huidige iteratie overgeslagen met continue. Als de regio van de huidige meting overeenkomt met de gezochte stad, wordt de meting geretourneerd met behulp van het return-statement. Dit betekent dat de functie wordt gestopt en de meting wordt teruggegeven als resultaat.
function vindstad(data) {
    for (let plek = 0; plek <= data.actual.stationmeasurements.length; plek++) {
        const meet = data.actual.stationmeasurements[plek];
        if (meet.regio.toLowerCase() !== informatie.destad.toLowerCase()) continue;
        return meet;
    }
}
//comment: Deze code bevat een functie genaamd laad(). Het doel van deze functie is om gegevens te laden en de inhoud van een webpagina aan te passen op basis van die gegevens. De functie begint met het controleren van de zoekparameters in de URL van de webpagina. Als er zoekparameters aanwezig zijn, wordt de stadswaarde opgehaald en toegewezen aan de variabele informatie.destad. Dit wordt gedaan met behulp van het URLSearchParams-object om de zoekparameters uit de URL te halen. Vervolgens worden enkele elementen van de webpagina geselecteerd met behulp van document.getElementById(). Deze elementen worden opgeslagen in variabelen voor latere manipulatie. De functie roept de functie datainladen() aan en wacht tot de gegevens zijn opgeladen. Zodra de gegevens beschikbaar zijn, wordt de then()-methode gebruikt om de resultaten te verwerken. Binnen de then()-functie worden enkele variabelen geüpdatet op basis van de geladen gegevens. Er wordt gecontroleerd of de waarde van regenAfgelopenUur gelijk is aan null, en zo ja, wordt deze gewijzigd in "Weten we niet". Vervolgens wordt gecontroleerd of de waarde van regenAfgelopenUur groter is dan 0, en zo ja, wordt deze gewijzigd in "Ja". Als de waarde kleiner of gelijk is aan 0, wordt deze gewijzigd in "Nee". Daarna worden de stadnaam, de vraag of het regent en de bron van de radarfoto bijgewerkt met de bijbehorende waarden uit de geladen gegevens.
function laad() {
    if (window.location.search.trim().length > 0) {
        const urlParams = new URLSearchParams(window.location.search.trim());
        informatie.destad = urlParams.get('stad')
    }

    const stadNaam = document.getElementById("stad");
    const gaatHetRegenen = document.getElementById("regen")
    const radarFoto = document.getElementById("radar")

    datainladen().then((result) => {
        var regenAfgelopenUur = result.regen
        if (regenAfgelopenUur == null) regenAfgelopenUur = "Weten we niet"
        if (regenAfgelopenUur > 0) regenAfgelopenUur = "Ja"
        if (regenAfgelopenUur <= 0) regenAfgelopenUur = "Nee"

        const radarFotoLink = result.imgLink

        stadNaam.textContent = informatie.destad
        gaatHetRegenen.textContent = regenAfgelopenUur
        radarFoto.attributes.getNamedItem("src").textContent = radarFotoLink
    })
}
//comment: Deze code bevat een functie genaamd kanikzwemmen(). Het doel van deze functie is om te bepalen of het zwemweer is op basis van de geladen temperatuur. De functie begint met het selecteren van enkele elementen van de webpagina met behulp van document.getElementById(). Deze elementen zijn de paragraaf waarin het resultaat wordt weergegeven (kanhet) en een afbeelding van een mannetje (mannetje). Vervolgens roept de functie datainladen() aan om gegevens te laden en wacht tot de gegevens zijn opgeladen. Zodra de gegevens beschikbaar zijn, wordt de then()-methode gebruikt om de resultaten te verwerken. Binnen de then()-functie wordt de temperatuurwaarde uit de geladen gegevens opgehaald en toegewezen aan de variabele Temperatuur. Daarna wordt gecontroleerd of de waarde van Temperatuur groter of gelijk is aan 23. Als dat het geval is, wordt de waarde van Temperatuur gewijzigd in "ja het kan" en de bron van de mannetje-afbeelding wordt gewijzigd naar een tevreden mannetje met een link naar een afbeelding. Als de waarde van Temperatuur lager is dan 23, wordt de waarde gewijzigd in "nee het kan niet want het is koud" en de bron van de mannetje-afbeelding wordt gewijzigd naar een boos mannetje met een link naar een andere afbeelding. Uiteindelijk wordt de tekst van het kanhet-element bijgewerkt met de waarde van Temperatuur, waardoor wordt weergegeven of het zwemweer is.
function kanikzwemmen() {
    const kanhet = document.getElementById("kanhet")
    const mannetje = document.getElementById("mannetje")
    datainladen().then((result) => {
        var Temperatuur = result.Temperatuur
        if (Temperatuur >= 23) {
            Temperatuur = "ja het kan"
            mannetje.attributes.getNamedItem("src").textContent = "https://media.istockphoto.com/photos/yeah-i-like-it-concept-pleased-and-satisfied-male-in-glasses-raising-picture-id1086581786"
        } else {
            Temperatuur = "nee het kan niet want het is koud"
            mannetje.attributes.getNamedItem("src").textContent = "https://previews.123rf.com/images/spaxia/spaxia1610/spaxia161000074/64516481-boos-kale-man-gebaar-duimen-naar-beneden-ge%C3%AFsoleerd-op-witte-achtergrond.jpg"
        }
        kanhet.textContent = Temperatuur
    })
}
//comment: eze code bevat een constant object genaamd informatie. Het object heeft een eigenschap genaamd destad met de waarde "Hoorn".
const informatie = {
    destad: "Hoorn"
}